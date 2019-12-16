(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LCHago = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hagoDelegate_1 = require("./runtime/hagoDelegate");
var Client = (function () {
    function Client() {
        this.onConnect = function (mode) {
            console.log("未监听 onConnect", mode);
        };
        this.onFinish = function () {
            console.log("未监听 onFinish");
        };
        this.onReady = function () {
            console.log("未监听 onReady");
        };
        this.onCreate = function (data) {
            console.log("未监听 onCreate", data);
        };
        this.onCountDown = function (v) {
            console.log("未监听 onCountDown", v);
        };
        this.onStart = function () {
            console.log("未监听 onStart");
        };
        this.onScore = function (v, isAI) {
            console.log("未监听 onScore", v);
        };
        this.onTool = function (v, isAI) {
            console.log("未监听 onTool", v);
        };
        this.onOpponentScore = function (v) {
            console.log("未监听 onOpponentScore", v);
        };
        this.onOpponentTool = function (v) {
            console.log("未监听 onOpponentTool", v);
        };
        this.onResult = function (v) {
            console.log("未监听 onResult", v);
        };
        this.onReconnectBegin = function () {
            console.log("未监听 onReconnectBegin");
        };
        this.onReconnectFinish = function () {
            console.log("未监听 onReconnectFinish");
        };
        this.onClose = function () {
            console.log("未监听 onClose");
        };
    }
    Client.prototype.connect = function (mode) {
        hagoDelegate_1.hagoDelegate.onPKFinishLoading();
        this.onConnect(mode);
    };
    Client.prototype.create = function (data) {
        this.onCreate(data);
    };
    Client.prototype.ready = function () {
        this.onReady();
    };
    Client.prototype.start = function () {
        this.onStart();
    };
    Client.prototype.score = function (v, isAI) {
        this.onScore(v, isAI);
    };
    Client.prototype.tool = function (v, isAI) {
        this.onTool(v, isAI);
    };
    Client.prototype.countDown = function (v) {
        this.onCountDown(v);
    };
    Client.prototype.finish = function () {
        this.onFinish();
    };
    Client.prototype.result = function (data) {
        console.log("result", JSON.stringify(data));
        //this.onResult(data.result);
        this.onResult(data);
        var result = {
            timestamp: parseInt(data.timestamp),
            nonstr: data.nonstr,
            sign: data.sign,
            gametype: "1v1_pk",
            result: JSON.parse(data.resultrawdata)
        };
        setTimeout(function () {
            console.log("hagoDelegate.onPKFinish");
            hagoDelegate_1.hagoDelegate.onPKFinish(result);
        }, 3000);
    };
    return Client;
}());
exports.Client = Client;

},{"./runtime/hagoDelegate":8}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schedulerManager_1 = require("./runtime/schedulerManager");
var actionPingBytes;
var actionPongBytes;
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["CLOSED"] = 0] = "CLOSED";
    ConnectionStatus[ConnectionStatus["RECONNECTING"] = 1] = "RECONNECTING";
    ConnectionStatus[ConnectionStatus["OPEN"] = 2] = "OPEN";
    ConnectionStatus[ConnectionStatus["CONNECTING"] = 3] = "CONNECTING";
    ConnectionStatus[ConnectionStatus["CLOSING"] = 4] = "CLOSING";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
var Connection = (function () {
    function Connection() {
        var _this = this;
        this.status = ConnectionStatus.CLOSED;
        this.sendIndex = 0;
        this.sendActions = [];
        this.recvIndex = 0;
        this.pingInterval = 3;
        this.timeoutInterval = 6;
        this.closeInterval = 10;
        this.isReconnect = false;
        var scheduler = (this.scheduler_createWebsocket = schedulerManager_1.schedulerManager.newScheduler());
        scheduler.addTaskCall(function () {
            _this.createWebsocket();
        }, 1000);
        this.scheduler_ping = schedulerManager_1.schedulerManager.newScheduler();
        this.scheduler_ping.addTaskCall(function () {
            _this.send(actionPingBytes);
        }, this.pingInterval * 1000);
        this.scheduler_ping.loop = true;
        this.scheduler_timeout = schedulerManager_1.schedulerManager.newScheduler();
        this.scheduler_timeout.addTaskCall(function () {
            console.log("scheduler_timeout");
            _this.reconnectBegin();
        }, this.timeoutInterval * 1000);
        this.scheduler_timeout.loop = true;
        this.scheduler_close = schedulerManager_1.schedulerManager.newScheduler();
        this.scheduler_close.addTaskCall(function () {
            console.log("scheduler_close");
            _this.close();
        }, this.closeInterval * 1000);
        this.scheduler_close.loop = true;
    }
    Connection.prototype.connect = function (url) {
        {
            var action = new LCProto.Action();
            action.ID = LCProto.ActionID.ActionIDPong;
            actionPongBytes = LCProto.Action.encode(action).finish();
        }
        {
            var action = new LCProto.Action();
            action.ID = LCProto.ActionID.ActionIDPing;
            actionPingBytes = LCProto.Action.encode(action).finish();
        }
        if (this.status != ConnectionStatus.CLOSED) {
            return;
        }
        this.url = url + "&current=" + Date.now();
        this.status = ConnectionStatus.CONNECTING;
        this.createWebsocket();
        this.scheduler_ping.play();
        this.scheduler_close.play();
        this.scheduler_timeout.play();
    };
    Connection.prototype.reconnect = function () {
        if (this.ws != null) {
            return;
        }
        if (this.status == ConnectionStatus.CLOSED) {
            return;
        }
        this.status = ConnectionStatus.RECONNECTING;
        this.scheduler_createWebsocket.play();
        this.reconnectBegin();
    };
    Connection.prototype.reconnectBegin = function () {
        if (this.isReconnect == false) {
            this.isReconnect = true;
            if (this.onReconnectBegin) {
                this.onReconnectBegin();
            }
        }
    };
    Connection.prototype.reconnectFinish = function () {
        if (this.isReconnect == true) {
            this.isReconnect = false;
            this.check();
            if (this.onReconnectFinish) {
                this.onReconnectFinish();
            }
        }
    };
    Connection.prototype.createWebsocket = function () {
        var _this = this;
        var url = this.url;
        if (this.isReconnect) {
            url += "&reconnect=1";
            console.log("createWebsocket", "isReconnect");
        }
        else {
            console.log("createWebsocket");
        }
        var ws = new WebSocket(url);
        this.ws = ws;
        ws.onopen = function () {
            if (_this.status == ConnectionStatus.CLOSED) {
                ws.close();
                return;
            }
            ws.binaryType = "arraybuffer";
            _this.status = ConnectionStatus.OPEN;
            _this.resetSchedulers();
            _this.reconnectFinish();
        };
        ws.onmessage = function (evt) {
            _this.reconnectFinish();
            _this.resetSchedulers();
            var uint8array = new Uint8Array(evt.data);
            var action = LCProto.Action.decode(uint8array);
            if (action.index == 0) {
                switch (action.ID) {
                    case LCProto.ActionID.ActionIDPing:
                        _this.send(actionPongBytes);
                        break;
                    case LCProto.ActionID.ActionIDCheck:
                        {
                            var data = LCProto.DataCheck.decode(action.data);
                            if (data.sendIndex < _this.sendIndex) {
                                for (var i = data.sendIndex, len = _this.sendIndex; i <= len; ++i) {
                                    _this.send(_this.sendActions[i]);
                                }
                            }
                            else if (data.sendIndex > _this.sendIndex) {
                                _this.close();
                            }
                        }
                        break;
                    case LCProto.ActionID.ActionIDError:
                        _this.close();
                        break;
                    case LCProto.ActionID.ActionIDCountDown:
                        _this.onAction(action);
                        break;
                }
            }
            else {
                if (_this.recvAction(action)) {
                    _this.onAction(action);
                }
            }
        };
        ws.onclose = function () {
            ws.onopen = null;
            ws.onmessage = null;
            ws.onclose = null;
            _this.ws = null;
            _this.reconnect();
        };
    };
    Connection.prototype.resetSchedulers = function () {
        this.scheduler_ping.reset();
        this.scheduler_close.reset();
        this.scheduler_timeout.reset();
    };
    Connection.prototype.saveSend = function (bytes) {
        this.sendIndex += 1;
        this.sendActions.push(bytes);
    };
    Connection.prototype.send = function (msg) {
        if (this.status == ConnectionStatus.OPEN) {
            this.ws.send(msg);
            return true;
        }
        return false;
    };
    Connection.prototype.sendAction = function (action) {
        action.index = this.sendIndex + 1;
        this.sendIndex = action.index;
        this.send(LCProto.Action.encode(action).finish());
    };
    Connection.prototype.check = function () {
        var data = new LCProto.DataCheck();
        data.recvIndex = this.recvIndex;
        data.sendIndex = this.sendIndex;
        var action = new LCProto.Action();
        action.ID = LCProto.ActionID.ActionIDCheck;
        action.data = LCProto.DataCheck.encode(data).finish();
        this.send(LCProto.Action.encode(action).finish());
    };
    Connection.prototype.recvAction = function (action) {
        if (this.recvIndex + 1 == action.index) {
            this.recvIndex = action.index;
            return true;
        }
        else if (this.recvIndex < action.index) {
            this.check();
        }
        else {
        }
        return false;
    };
    Connection.prototype.close = function () {
        if (this.status != ConnectionStatus.CLOSED) {
            this.status = ConnectionStatus.CLOSED;
            this.scheduler_ping.stop();
            this.scheduler_close.stop();
            this.scheduler_timeout.stop();
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }
            if (this.onClose) {
                this.onClose();
            }
        }
    };
    return Connection;
}());
exports.Connection = Connection;

},{"./runtime/schedulerManager":9}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isHago = false;
try {
    if (hg != null) {
        isHago = true;
    }
}
catch (error) { }
console.log("isHago", isHago);
var HagoDelegate = (function () {
    function HagoDelegate() {
    }
    HagoDelegate.prototype.onPKFinishLoading = function () {
        if (isHago) {
            hg.gameLoadResult();
        }
    };
    HagoDelegate.prototype.onPKStart = function () {
        if (isHago) {
            hg.pkStart();
        }
    };
    HagoDelegate.prototype.onPKFinish = function (result) {
        if (isHago) {
            console.log("hago.onPKFinish", result);
            hg.pkFinish(result);
        }
    };
    HagoDelegate.prototype.onPKExceptionFinish = function () {
        if (isHago) {
            console.log("hago.onPKExceptionFinish");
            hg.pkFinishError();
        }
    };
    HagoDelegate.prototype.exit = function (cb) {
        if (isHago) {
            hg.listenPkExit(cb);
        }
    };
    HagoDelegate.prototype.getDeviceInfo = function (params) {
        if (isHago) {
            hg.getDeviceInfo(params);
        }
    };
    return HagoDelegate;
}());
exports.HagoDelegate = HagoDelegate;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getConnectionUrl(mode) {
    if (mode === void 0) { mode = 0; }
    if (mode == 0) {
        return hg.getMatchupUrl();
    }
    var query = window.location.href;
    if (mode == 1) {
        query =
            "/yingxiongkongzhan/2d935255-6d46-438c-a542-ec1900330ff8?post_data=%7B%22channelid%22%3A%22aifeidongman%22%2C%22gameid%22%3A%22yingxiongkongzhan%5Fyn%22%2C%22roomid%22%3A%222d935255-6d46-438c-a542-ec1900330ff8%22%2C%22player%22%3A%7B%22uid%22%3A%22101307415%22%2C%22name%22%3A%22%E5%93%A6%E5%93%A6%22%2C%22avatarurl%22%3A%22https%3A%2F%2Fo-id.ihago.net%2Fuser%5Favatar%2F101307415%5F1536377561510.jpeg%22%2C%22opt%22%3A%22%7B%5C%22ai%5C%22%3A1%2C%5C%22level%5C%22%3A4%2C%5C%22ai%5Finfo%5C%22%3A%7B%5C%22uid%5C%22%3A%5C%22900000069%5C%22%2C%5C%22nick%5C%22%3A%5C%22wahyurika11%5C%22%2C%5C%22sex%5C%22%3A1%7D%7D%22%2C%22teamid%22%3A%22%22%2C%22sex%22%3A0%2C%22kv%5Fsign%22%3A%22ztPRe9j3kTPZ5hE5HNJCJFJjRAjwVoT2%22%7D%7D&timestamp=1562899305&nonstr=2rpxrt8b-nvui-9o4b-kolo-aujesjgjbdd3&sign=cc4b7cc67066426e2271c20f6c722c7a126bac8d&transport=websocket" +
                "&kv_url=i-test-863.ihago.net&wsscheme=ws&websocketdomain=www.duligame.cn&port=10006";
    }
    else if (mode == 2) {
        query =
            "/yingxiongkongzhan/e63bbc5c-c683-49c9-bfc2-0e3154a89b8e?nonstr=lkg97o1n-l8w1-cu0u-bcew-xklz20u5j8w0&sign=b74f8bf04bd75b816e695f86e4f9b373d7182802&timestamp=1567393392&post_data=%7B%22channelid%22%3A%22yy%22%2C%22gameid%22%3A%22yingxiongkongzhan%22%2C%22roomid%22%3A%22e63bbc5c-c683-49c9-bfc2-0e3154a89b8e%22%2C%22player%22%3A%7B%22uid%22%3A%2211119999%22%2C%22name%22%3A%22hagotest%22%2C%22avatarurl%22%3A%22%22%2C%22opt%22%3A%22%22%2C%22teamid%22%3A%22%22%2C%22sex%22%3A1%2C%22kv_sign%22%3A%22%22%7D%7D&transport=websocket" +
                "&kv_url=i-test-863.ihago.net&wsscheme=ws&websocketdomain=www.duligame.cn&port=10006";
    }
    console.log(query);
    var form = {};
    var forms = query.split("?")[1].split("&");
    forms.forEach(function (formStr) {
        var a = formStr.split("=");
        form[a[0]] = decodeURIComponent(a[1]);
    });
    var wsscheme = form["wsscheme"];
    var websocketdomain = form["websocketdomain"];
    var port = form["port"];
    var postData = form["post_data"];
    var timestamp = form["timestamp"];
    var nonstr = form["nonstr"];
    var sign = form["sign"];
    var kv_url = form["kv_url"];
    var pd = JSON.parse(postData);
    var gameid = pd.gameid;
    var roomid = pd.roomid;
    var url = wsscheme +
        "://" +
        websocketdomain +
        ":" +
        port +
        "/" +
        gameid +
        "/" +
        roomid +
        "?post_data=" +
        encodeURIComponent(postData) +
        "&timestamp=" +
        timestamp +
        "&nonstr=" +
        nonstr +
        "&sign=" +
        sign +
        "&kv_url=" +
        kv_url;
    return url;
}
exports.getConnectionUrl = getConnectionUrl;

},{}],5:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./runtime/client"));

},{"./runtime/client":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client_1 = require("../Client");
var connection_1 = require("./connection");
var getConnectionUrl_1 = require("../getConnectionUrl");
exports.client = new Client_1.Client();
window["LCHago"] = exports.client;
exports.client.onConnect = function (mode) {
    if (mode === void 0) { mode = 0; }
    connection_1.connection.connect(getConnectionUrl_1.getConnectionUrl(mode));
};
exports.client.onStart = function () {
    console.log("onStart");
};
exports.client.onFinish = function () {
    var action = new LCProto.Action();
    action.ID = LCProto.ActionID.ActionIDFinish;
    connection_1.connection.sendAction(action);
};
exports.client.onReady = function () {
    console.log("ready");
    var action = new LCProto.Action();
    action.ID = LCProto.ActionID.ActionIDReady;
    connection_1.connection.sendAction(action);
};
exports.client.onScore = function (v, isAI) {
    //console.log("onScore");
    var data = new LCProto.DataScore();
    data.value = v;
    data.isAI = isAI;
    var action = new LCProto.Action();
    action.ID = LCProto.ActionID.ActionIDScore;
    action.data = LCProto.DataScore.encode(data).finish();
    connection_1.connection.sendAction(action);
};
exports.client.onTool = function (v, isAI) {
    console.log("onTool");
    var data = new LCProto.DataTool();
    data.value = v;
    data.isAI = isAI;
    var action = new LCProto.Action();
    action.ID = LCProto.ActionID.ActionIDTool;
    action.data = LCProto.DataTool.encode(data).finish();
    connection_1.connection.sendAction(action);
};
exports.client.onOpponentScore = function (v) {
    console.log("onOpponentScore", v);
};
exports.client.onOpponentTool = function (v) {
    console.log("onOpponentTool", v);
};
exports.client.onResult = function (v) {
    console.log("onResult", v);
};

},{"../Client":1,"../getConnectionUrl":4,"./connection":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Connection_1 = require("../Connection");
var client_1 = require("./client");
var hagoDelegate_1 = require("./hagoDelegate");
exports.connection = new Connection_1.Connection();
var hasResult = false;
var hasCreate = false;
exports.connection.onAction = function (action) {
    switch (action.ID) {
        case LCProto.ActionID.ActionIDCreate:
            hasCreate = true;
            client_1.client.create(LCProto.DataCreate.decode(action.data));
            break;
        case LCProto.ActionID.ActionIDStart:
            client_1.client.start();
            break;
        case LCProto.ActionID.ActionIDScore:
            client_1.client.onOpponentScore(LCProto.DataScore.decode(action.data).value);
            break;
        case LCProto.ActionID.ActionIDTool:
            client_1.client.onOpponentTool(LCProto.DataTool.decode(action.data).value);
            break;
        case LCProto.ActionID.ActionIDResult:
            hasResult = true;
            client_1.client.result(LCProto.DataResult.decode(action.data));
            exports.connection.close();
            break;
        case LCProto.ActionID.ActionIDCountDown:
            client_1.client.countDown(LCProto.DataCountDown.decode(action.data).value);
            break;
    }
};
exports.connection.onReconnectBegin = function () {
    client_1.client.onReconnectBegin();
};
exports.connection.onReconnectFinish = function () {
    client_1.client.onReconnectFinish();
};
exports.connection.onClose = function () {
    console.log("onClose", hasResult);
    if (hasResult == false) {
        client_1.client.onClose();
        hasResult = true;
        setTimeout(function () {
            console.log(" hagoDelegate.onPKExceptionFinish");
            hagoDelegate_1.hagoDelegate.onPKExceptionFinish();
        }, 3000);
    }
};
setTimeout(function () {
    console.log("timeout", hasCreate == false);
    if (hasCreate == false && hasResult == false) {
        hasResult = true;
        hagoDelegate_1.hagoDelegate.onPKExceptionFinish();
    }
}, 15000);

},{"../Connection":2,"./client":6,"./hagoDelegate":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HagoDelegate_1 = require("../HagoDelegate");
exports.hagoDelegate = new HagoDelegate_1.HagoDelegate();

},{"../HagoDelegate":3}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SchedulerManager_1 = require("../scheduler/SchedulerManager");
exports.schedulerManager = new SchedulerManager_1.SchedulerManager();
var lastT = 0;
var update = function (t) {
    if (lastT != 0) {
        exports.schedulerManager.update(t - lastT);
    }
    lastT = t;
    requestAnimationFrame(update);
};
requestAnimationFrame(update);

},{"../scheduler/SchedulerManager":11}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tween_1 = require("./Tween");
var TaskType;
(function (TaskType) {
    TaskType[TaskType["Step"] = 0] = "Step";
    TaskType[TaskType["To"] = 1] = "To";
    TaskType[TaskType["Call"] = 2] = "Call";
})(TaskType = exports.TaskType || (exports.TaskType = {}));
var Task = (function () {
    function Task(type, duration, progressFunc) {
        this.type = type;
        this.duration = duration;
        this.progressFunc = progressFunc;
        this.easeLinear();
    }
    Task.prototype.easeLinear = function () {
        this.tweenFunc = Tween_1.Tween.linear;
    };
    Task.prototype.easeSineIn = function () {
        this.tweenFunc = Tween_1.Tween.easeInSine;
    };
    Task.prototype.easeSineOut = function () {
        this.tweenFunc = Tween_1.Tween.easeOutSine;
    };
    Task.prototype.easeSineInOut = function () {
        this.tweenFunc = Tween_1.Tween.easeInOutSine;
    };
    Task.prototype.easeBackIn = function () {
        this.tweenFunc = Tween_1.Tween.easeInBack;
    };
    Task.prototype.easeBackOut = function () {
        this.tweenFunc = Tween_1.Tween.easeOutBack;
    };
    Task.prototype.easeBackInOut = function () {
        this.tweenFunc = Tween_1.Tween.easeInOutBack;
    };
    Task.prototype.easeQuadIn = function () {
        this.tweenFunc = Tween_1.Tween.easeInQuad;
    };
    Task.prototype.easeQuadOut = function () {
        this.tweenFunc = Tween_1.Tween.easeOutQuad;
    };
    Task.prototype.easeQuadInOut = function () {
        this.tweenFunc = Tween_1.Tween.easeInOutQuad;
    };
    Task.prototype.easeCubicIn = function () {
        this.tweenFunc = Tween_1.Tween.easeInCubic;
    };
    Task.prototype.easeCubicOut = function () {
        this.tweenFunc = Tween_1.Tween.easeOutCubic;
    };
    Task.prototype.easeCubicInOut = function () {
        this.tweenFunc = Tween_1.Tween.easeInOutCubic;
    };
    Task.prototype.easeQuartIn = function () {
        this.tweenFunc = Tween_1.Tween.easeInQuart;
    };
    Task.prototype.easeQuartOut = function () {
        this.tweenFunc = Tween_1.Tween.easeOutQuart;
    };
    Task.prototype.easeQuartInOut = function () {
        this.tweenFunc = Tween_1.Tween.easeInOutQuart;
    };
    return Task;
}());
exports.Task = Task;
var SchedulerStatus;
(function (SchedulerStatus) {
    SchedulerStatus[SchedulerStatus["Stop"] = 0] = "Stop";
    SchedulerStatus[SchedulerStatus["Play"] = 1] = "Play";
})(SchedulerStatus = exports.SchedulerStatus || (exports.SchedulerStatus = {}));
var Scheduler = (function () {
    function Scheduler(manager) {
        this._taskArray = [];
        this._currentTaskIndex = 0;
        this._currentTaskProcess = 0;
        this._status = SchedulerStatus.Stop;
        this.timeScale = 1;
        this.loop = false;
        this._manager = manager;
    }
    Scheduler.prototype.dispose = function () {
        this._manager = null;
        this._taskArray = null;
        this.removeAllTasks();
    };
    Object.defineProperty(Scheduler.prototype, "manager", {
        get: function () {
            return this._manager;
        },
        set: function (v) {
            this._manager = v;
        },
        enumerable: true,
        configurable: true
    });
    Scheduler.prototype.addTaskTo = function (callback, duration) {
        if (duration === void 0) { duration = 0; }
        var task = new Task(TaskType.To, duration, callback);
        this._taskArray.push(task);
        return task;
    };
    Scheduler.prototype.addTaskStep = function (callback) {
        var task = new Task(TaskType.Step, 0, callback);
        this._taskArray.push(task);
        return task;
    };
    Scheduler.prototype.addTaskCall = function (callback, duration) {
        if (duration === void 0) { duration = 0; }
        var task = new Task(TaskType.Call, duration, callback);
        this._taskArray.push(task);
        return task;
    };
    Scheduler.prototype.removeAllTasks = function () {
        this.stop();
        this._taskArray = [];
    };
    Scheduler.prototype.reset = function () {
        if (this.timeScale > 0) {
            this._currentTaskIndex = 0;
            this._currentTaskProcess = 0;
            this._currentTask = this._taskArray[this._currentTaskIndex];
        }
        else {
            this._currentTaskIndex = this._taskArray.length - 1;
            this._currentTask = this._taskArray[this._currentTaskIndex];
            this._currentTaskProcess = this._currentTask.duration;
        }
    };
    Scheduler.prototype.play = function () {
        if (this._status == SchedulerStatus.Stop &&
            this._taskArray.length > 0) {
            if (this._currentTask == null) {
                this.reset();
            }
            this._status = SchedulerStatus.Play;
            if (this._manager) {
                this._manager.addScheduler(this);
            }
        }
    };
    Scheduler.prototype.stop = function () {
        if (this._status == SchedulerStatus.Play) {
            this._status = SchedulerStatus.Stop;
            this._currentTask = null;
            if (this._manager) {
                this._manager.removeScheduler(this);
            }
        }
    };
    Scheduler.prototype.nextTask = function () {
        this._currentTaskIndex += 1;
        if (this._currentTaskIndex < this._taskArray.length) {
            this._currentTask = this._taskArray[this._currentTaskIndex];
        }
        else {
            if (this.loop) {
                this._currentTaskIndex = 0;
                this._currentTask = this._taskArray[0];
            }
            else {
                this.stop();
            }
        }
    };
    Scheduler.prototype.prevTask = function () {
        this._currentTaskIndex -= 1;
        if (this._currentTaskIndex >= 0) {
            this._currentTask = this._taskArray[this._currentTaskIndex];
        }
        else {
            if (this.loop) {
                this._currentTaskIndex = this._taskArray.length - 1;
                this._currentTask = this._taskArray[this._currentTaskIndex];
            }
            else {
                this.stop();
            }
        }
    };
    Scheduler.prototype.update = function (delta) {
        if (this._status != SchedulerStatus.Play) {
            return;
        }
        this._currentTaskProcess += delta * this.timeScale;
        var task;
        var updateFinish = false;
        while (updateFinish == false) {
            if (this._status == SchedulerStatus.Play) {
                task = this._currentTask;
                if (this._currentTaskProcess >= task.duration) {
                    this._currentTaskProcess -= task.duration;
                    this.nextTask();
                    switch (task.type) {
                        case TaskType.To:
                            task.progressFunc(task.tweenFunc(task.duration, 0, 1, task.duration));
                            break;
                        case TaskType.Step:
                            this._currentTaskProcess = 0;
                            task.progressFunc(delta);
                            updateFinish = true;
                            break;
                        case TaskType.Call:
                            if (task.progressFunc) {
                                task.progressFunc(1);
                            }
                            break;
                    }
                }
                else if (this._currentTaskProcess < 0) {
                    this.prevTask();
                    if (this._currentTask) {
                        this._currentTaskProcess += this._currentTask.duration;
                    }
                    switch (task.type) {
                        case TaskType.To:
                            task.progressFunc(task.tweenFunc(0, 0, 1, task.duration));
                            break;
                        case TaskType.Step:
                            this._currentTaskProcess = 0;
                            task.progressFunc(delta);
                            updateFinish = true;
                            break;
                        case TaskType.Call:
                            if (task.progressFunc) {
                                task.progressFunc(1);
                            }
                            break;
                    }
                }
                else {
                    updateFinish = true;
                    switch (task.type) {
                        case TaskType.To:
                            task.progressFunc(task.tweenFunc(this._currentTaskProcess, 0, 1, task.duration));
                            break;
                        case TaskType.Step:
                            this._currentTaskProcess = 0;
                            task.progressFunc(delta);
                            break;
                    }
                }
            }
            else {
                updateFinish = true;
            }
        }
    };
    Scheduler.prototype.isPlay = function () {
        if (this._status == SchedulerStatus.Play) {
            return true;
        }
        return false;
    };
    Scheduler.prototype.isStop = function () {
        if (this._status == SchedulerStatus.Stop) {
            return true;
        }
        return false;
    };
    return Scheduler;
}());
exports.Scheduler = Scheduler;

},{"./Tween":12}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scheduler_1 = require("./Scheduler");
var SchedulerManager = (function () {
    function SchedulerManager() {
        this.schedulerArray = new Array();
        this.timeScale = 1;
        this.currentTime = 0;
        this._temp = 0;
    }
    SchedulerManager.prototype.getCurrentTime = function () {
        return this.currentTime;
    };
    SchedulerManager.prototype.newScheduler = function () {
        var scheduler = new Scheduler_1.Scheduler(this);
        return scheduler;
    };
    SchedulerManager.prototype.addScheduler = function (scheduler) {
        var sIndex = this.schedulerArray.indexOf(scheduler);
        if (sIndex != -1) {
            return false;
        }
        this.schedulerArray.push(scheduler);
        return true;
    };
    SchedulerManager.prototype.removeScheduler = function (scheduler) {
        var sIndex = this.schedulerArray.indexOf(scheduler);
        if (sIndex != -1) {
            this.schedulerArray.splice(sIndex, 1);
            return true;
        }
        return false;
    };
    SchedulerManager.prototype.removeAllScheduler = function () {
        this.schedulerArray = [];
    };
    SchedulerManager.prototype.updateStep = function () {
        this.currentTime += 17;
        this._update(17 * this.timeScale);
    };
    SchedulerManager.prototype.update = function (delta) {
        this._temp += delta;
        while (this._temp > 0) {
            this._temp -= 16.67;
            this.updateStep();
        }
    };
    SchedulerManager.prototype._update = function (delta) {
        var schedulerArray = this.schedulerArray.slice(0);
        schedulerArray.forEach(function (scheduler) {
            scheduler.update(delta);
        });
    };
    return SchedulerManager;
}());
exports.SchedulerManager = SchedulerManager;

},{"./Scheduler":10}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tween = {
    linear: function (t, b, _c, d) {
        var c = _c - b;
        return (c * t) / d + b;
    },
    easeInQuad: function (t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function (t, b, _c, d) {
        var c = _c - b;
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function (t, b, _c, d) {
        var c = _c - b;
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t + b;
        }
        else {
            return (-c / 2) * (--t * (t - 2) - 1) + b;
        }
    },
    easeInCubic: function (t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function (t, b, _c, d) {
        var c = _c - b;
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function (t, b, _c, d) {
        var c = _c - b;
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t * t + b;
        }
        else {
            return (c / 2) * ((t -= 2) * t * t + 2) + b;
        }
    },
    easeInQuart: function (t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function (t, b, _c, d) {
        var c = _c - b;
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function (t, b, _c, d) {
        var c = _c - b;
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t * t * t + b;
        }
        else {
            return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
        }
    },
    easeInQuint: function (t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function (t, b, _c, d) {
        var c = _c - b;
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function (t, b, _c, d) {
        var c = _c - b;
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t * t * t * t + b;
        }
        else {
            return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    easeInSine: function (t, b, _c, d) {
        var c = _c - b;
        return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function (t, b, _c, d) {
        var c = _c - b;
        return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    },
    easeInOutSine: function (t, b, _c, d) {
        var c = _c - b;
        return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
    },
    easeInExpo: function (t, b, _c, d) {
        var c = _c - b;
        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function (t, b, _c, d) {
        var c = _c - b;
        return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
    },
    easeInOutExpo: function (t, b, _c, d) {
        var c = _c - b;
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        if ((t /= d / 2) < 1) {
            return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
        }
        else {
            return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    easeInCirc: function (t, b, _c, d) {
        var c = _c - b;
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function (t, b, _c, d) {
        var c = _c - b;
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function (t, b, _c, d) {
        var c = _c - b;
        if ((t /= d / 2) < 1) {
            return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
        }
        else {
            return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    easeInElastic: function (t, b, _c, d) {
        var c = _c - b;
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            return b;
        }
        else if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (-(a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b);
    },
    easeOutElastic: function (t, b, _c, d) {
        var c = _c - b;
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            return b;
        }
        else if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (a *
            Math.pow(2, -10 * t) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
            c +
            b);
    },
    easeInOutElastic: function (t, b, _c, d) {
        var c = _c - b;
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            return b;
        }
        else if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        if (t < 1) {
            return (-0.5 *
                (a *
                    Math.pow(2, 10 * (t -= 1)) *
                    Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                b);
        }
        else {
            return (a *
                Math.pow(2, -10 * (t -= 1)) *
                Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
                0.5 +
                c +
                b);
        }
    },
    easeInBack: function (t, b, _c, d, s) {
        var c = _c - b;
        if (s === void 0) {
            s = 1.05;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function (t, b, _c, d, s) {
        var c = _c - b;
        if (s === void 0) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function (t, b, _c, d, s) {
        var c = _c - b;
        if (s === void 0) {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        else {
            return ((c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b);
        }
    },
    easeInBounce: function (t, b, _c, d) {
        var c = _c - b;
        var v;
        v = exports.Tween.easeOutBounce(d - t, 0, c, d);
        return c - v + b;
    },
    easeOutBounce: function (t, b, _c, d) {
        var c = _c - b;
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        }
        else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }
        else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    },
    easeInOutBounce: function (t, b, _c, d) {
        var c = _c - b;
        var v;
        if (t < d / 2) {
            v = exports.Tween.easeInBounce(t * 2, 0, c, d);
            return v * 0.5 + b;
        }
        else {
            v = exports.Tween.easeOutBounce(t * 2 - d, 0, c, d);
            return v * 0.5 + c * 0.5 + b;
        }
    }
};

},{}]},{},[5])(5)
});
