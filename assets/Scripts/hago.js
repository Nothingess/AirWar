(function(){

    var HAGO_SDK_VERSION = '1.0.3';

    var PKLoadingCode = 1;
    var PKLoadingProgressCode = 2;
    var PKFinishLoadingCode = 3;
    var PKLoadFailCode = 4;
    var PKLoadingTipsCode = 5;
    var PKStartCode = 6;
    var PKFinishCode = 7;
    var PKExceptionFinishCode = 8;
    var micStatusQuery = 13;
    var MetricsCode = 28;
    var ManualSwitchMicCode = 32;     //程序调用开关mic
    var ExitGameCode = 34;
    var micStatusQueryCallBack = 1011;

    function HagoSDK() {
        this.APP_EVENT_SPEAKING_STATE = 2001;
        this.APP_EVENT_MIC_STATUS_CHANGE = 2002;
        this.APP_EVENT_NETWORK_STRENGTH_CHANGE = 2003;

        this._gameID = '';
        this._roomID = '';
        this._kvHost = '';
        this._kvSign = '';
        this._seqID = 0;
        this._getImageDataSourcesMap = {};
        this._getUserInfoMap = {};
        this._getDeviceInfoMap = {};
        this._httpRequestMap = {};
        this._appSendToGameMap = {};
        this._enterBackgroundCallback = null;
        this._enterForegroundCallback = null;
        this._gameReadyCallback = null;
        this._gameExitCallback = null;
        this._appEventCallback = null;
    }

    HagoSDK.prototype = {

        /**
         * 获取 Hago SDK 版本号
         * @return {string} 版本号字符串，例如：'1.0.2'
         */
        getVersion: function() {
            return HAGO_SDK_VERSION;
        },

        /**
         * 初始化 Hago SDK
         * @param {string} roomID 房间 ID，需要从 window.location.href 中解析获得
         * @param {string} gameID 游戏 ID，需要从 window.location.href 中解析获得
         * @param {string=} kvHost 需要从 window.location.href 中解析获得，若不需要使用 kv 功能，可传入 null
         * @param {string=} kvSign 需要从 window.location.href 中解析获得，若不需要使用 kv 功能，可传入 null
         */
        init: function(roomID, gameID, kvHost, kvSign) {
            this._roomID = roomID;
            this._gameID = gameID;
            this._kvHost = kvHost;
            this._kvSign = kvSign;
        },

        /**
         * 获取游戏 ID
         * @return {string} 游戏 ID
         */
        getGameID: function() {
            return this._gameID;
        },

        /**
         * 获取房间 ID
         * @return {string} 房间 ID
         */
        getRoomID: function() {
            return this._roomID;
        },

        /**
         * 游戏开始加载通知，在游戏开始加载前调用
         */
        onPKLoading: function() {
            if (!window.yyrt)
                return;

            yyrt.sendMessageToApp('onGameComeTo', {
                context: this._roomID,
                seqId: ++this._seqID,
                stage: PKLoadingCode,
                args: ['onPKLoading']
            }, 0);
        },

        /**
         * 游戏加载完成通知，在 onPKLoadingProgress(100) 之后调用
         */
        onPKFinishLoading: function() {
            if (!window.yyrt)
                return;

            yyrt.sendMessageToApp('onGameComeTo', {
                context: this._roomID,
                seqId: ++this._seqID,
                stage: PKFinishLoadingCode,
                args: ['onPKFinishLoading']
            }, 0);
        },

        /**
         * 游戏加载失败通知，游戏开始前调用
         */
        onPKLoadFail: function() {
            if (!window.yyrt)
                return;

            yyrt.sendMessageToApp('onGameComeTo', {
                context: this._roomID,
                seqId: ++this._seqID,
                stage: PKLoadFailCode,
                args: ['onPKLoadFail']
            }, 0);
        },

        /**
         * 游戏加载过程中的提示语信息
         * @param {string} tips 提示语信息内容
         */
        onPKLoadingTips: function(tips) {
            if (!window.yyrt)
                return;

            yyrt.sendMessageToApp('onGameComeTo', {
                context: this._roomID,
                seqId: ++this._seqID,
                stage: PKLoadingTipsCode,
                args: ['onPKLoadingTips', tips]
            }, 0);
        },

        /**
         * 游戏开始，游戏参与各方都已加载完成，游戏正式开始时调用
         */
        onPKStart: function() {
            if (!window.yyrt)
                return;

            yyrt.sendMessageToApp('onGameComeTo', {
                context: this._roomID,
                seqId: ++this._seqID,
                stage: PKStartCode,
                args: ['onPKStart']
            }, 0);
        },

        /**
         * 游戏结束通知，游戏正常完成且结算动画播放完毕时调用，上报游戏结果数据result，立即退出游戏
         * @param {string} result JSON 字符串
         */
        onPKFinish: function(result) {
            if (!window.yyrt)
                return;

            yyrt.sendMessageToApp('onGameComeTo', {
                context: this._roomID,
                seqId: ++this._seqID,
                stage: PKFinishCode,
                args: [result]
            }, 0);
        },

        /**
         * 游戏开始后，游戏异常结束通知，立即退出游戏 PS:如网络异常导致资源加载失败
         */
        onPKExceptionFinish: function() {
            if (!window.yyrt)
                return;

            yyrt.sendMessageToApp('onGameComeTo', {
                context: this._roomID,
                seqId: ++this._seqID,
                stage: PKExceptionFinishCode,
                args: ['onPKExceptionFinish']
            }, 0);
        },

        /**
         * 通知 app 退出游戏，一般与 setGameExitCallback 配合使用，在 setGameExitCallback 的回调中调用 onGameExit
         */
        onGameExit:function() {
            if (!window.yyrt)
                return;

            yyrt.sendMessageToApp('sendGameEventToApp', {
                context: this._roomID,
                seqId: ++this._seqID,
                event: ExitGameCode,
                args: ['{}']
            }, 0);
        },

        /**
         * 获取用户信息成功的回调函数
         * @callback getUserInfoSuccessCallback
         * @param {Array.<Object>} 用户信息数组，Object 中包含 avatar, birthday, nick, city, sex, uid 等字段
         */

        /**
         * 获取用户信息失败的回调函数
         * @callback getUserInfoFailureCallback
         */

        /**
         * 获取个人资料(性别, 昵称, 头像等)
         * @param {Object} args
         * @param {(string | Array.<string>)} args.userIDs UID 字符串或者字符串数组
         * @param {getUserInfoSuccessCallback} args.success 成功回调函数
         * @param {getUserInfoFailureCallback} args.failure 失败回调函数
         * @note 需要在 setGameReadyCallback 回调被通知后调用
         * @return {boolean}
         */
        getUserInfo: function(args) {
            if (!window.yyrt)
                return false;

            if (typeof(args) !== 'object' || typeof(args.success) !== 'function' || typeof(args.failure) !== 'function') {
                console.error('Invalid argument passed to getUserInfo!');
                return false;
            }

            var userIDs = args.userIDs;

            var isStringArray = false;
            if (typeof(userIDs) === 'string') {
                userIDs = [userIDs];
                isStringArray = true;
            }
            else {
                isStringArray = (userIDs instanceof Array);
                if (isStringArray) {
                    for (var i = 0, len = userIDs.length; i < len; ++i) {
                        var userID = userIDs[i];
                        if (typeof(userID) !== 'string') {
                            isStringArray = false;
                            break;
                        }
                    }
                }
            }

            if (isStringArray) {
                var jsonUidArrayStr = JSON.stringify(userIDs);
                var seqId = ++this._seqID;

                this._getUserInfoMap[seqId] = args;

                yyrt.sendMessageToApp('getUserInfoFromApp', {
                    context: this._roomID,
                    seqId: seqId,
                    args: [jsonUidArrayStr]
                }, 0);

                return true;
            }
            else {
                console.error('Invalid argument passed to getUserInfo, only support string and string array');
            }

            return false;
        },

        _invokeGetUserDataCallbacks: function(context, seqId, jsonStr) {
            var source = this._getUserInfoMap[seqId];
            if (source) {
                var data;
                var isSucceed = false;
                if (jsonStr) {
                    try {
                        data = JSON.parse(jsonStr);
                    }
                    catch (e) {
                        console.error('_invokeGetUserDataCallbacks, parse jsonStr failed: ' + jsonStr);
                    }

                    if (data && (data instanceof Array) && data.length > 0) {
                        isSucceed = true;
                    }
                }

                if (isSucceed) {
                    source.success(data);
                }
                else {
                    source.failure();
                }

                delete this._getUserInfoMap[seqId];
            }
            else {
                console.error('_invokeGetUserDataCallbacks: could not find callback!');
            }
        },

        /**
         * 获取设备信息成功的回调函数
         * @callback getDeviceInfoSuccessCallback
         * @param {Object} 设备信息 Object, 包含 appVersion, deviceID, deviceName, systemVersion, lang, idc, screenSize, safeAreaInset 等字段
         */

        /**
         * 获取设备信息失败的回调函数
         * @callback getDeviceInfoFailureCallback
         */

        /**
         * 获取设备信息，返回内容为：
         * {
         *     appVersion: '2.8.0',
         *     deviceID: ''
         *     deviceName: '',
         *     systemVersion: '',
         *     lang: 'en_US',
         *     idc: 123,
         *     screenSize: {
         *         width: 1280,
         *         height: 1080
         *     },
         *     safeAreaInset: {
         *         top: 0,
         *         left: 0,
         *         bottom: 0,
         *         right: 0
         *     }
         * }
         * @param {Object} args
         * @param {getDeviceInfoSuccessCallback} args.success 成功回调函数
         * @param {getDeviceInfoFailureCallback} args.failure 失败回调函数
         * @note 需要在 setGameReadyCallback 回调被通知后调用
         * @return {boolean}
         */
        getDeviceInfo: function(args) {
            if (!window.yyrt)
                return false;

            if (typeof(args) !== 'object' || typeof(args.success) !== 'function' || typeof(args.failure) !== 'function') {
                console.error('Invalid argument passed to getDeviceInfo!');
                return false;
            }

            var seqId = ++this._seqID;

            this._getDeviceInfoMap[seqId] = args;

            yyrt.sendMessageToApp('getDeviceInfoFromApp', {
                context: this._roomID,
                seqId: seqId,
                args: []
            }, 0);

            return true;
        },

        _invokeGetDeviceInfoCallbacks: function(context, seqId, jsonStr) {
            var source = this._getDeviceInfoMap[seqId];
            if (source) {
                var data;
                var isSucceed = false;
                if (jsonStr) {
                    try {
                        data = JSON.parse(jsonStr);
                    }
                    catch (e) {
                        console.error('_invokeGetDeviceInfoCallbacks, parse jsonStr failed: ' + jsonStr);
                    }

                    if (data && (data instanceof Object)) {
                        isSucceed = true;
                    }
                }

                if (isSucceed) {
                    source.success(data);
                }
                else {
                    source.failure();
                }

                delete this._getDeviceInfoMap[seqId];
            }
            else {
                console.error('_invokeGetDeviceInfoCallbacks: could not find callback!');
            }
        },

        /**
         * 鹰眼上报
         * @param {Object} args 上报参数
         * @param {string} args.uri 
         * @param {number} args.timeCost
         * @param {number} args.code
         */
        metricsReport: function(args) {
            if (!window.yyrt)
                return false;

            if (typeof(args) !== 'object') {
                console.error('Invalid argument passed to metricsReport!');
                return false;
            }

            if (!args.uri) {
                console.error('uri is empty');
                return false;
            }

            yyrt.sendMessageToApp('reportMetricsReturnCodeWithUri', {
                context: this._roomID,
                seqId: ++this._seqID,
                uri: args.uri,
                time: args.timeCost,
                returnCode: args.code
            }, 0);
            return true;
        },

        /**
         * 获取图片数据成功回调
         * @callback getImageDataSuccessCallback
         * @param {string} url 图片 URL
         * @param {ArrayBuffer} data 图片二进制数据
         */

        /**
         * 获取图片数据失败回调
         * @callback getImageDataFailureCallback
         * @param {string} url 图片 URL
         */

        /**
         * 获取图片数据
         * @param {Object} args
         * @param {string} args.url 图片 URL
         * @param {number} args.scale 图片缩放系数，范围 1 ~ 100
         * @param {getImageDataSuccessCallback} args.success
         * @param {getImageDataFailureCallback} args.failure
         * @return {boolean}
         */
        getImageData: function(args) {
            if (!window.yyrt)
                return false;

            if (typeof(args) !== 'object') {
                console.error('Invalid argument passed to getImageData!');
                return false;
            }

            var scale = args.scale || 100;
            var url = args.url;
            if (!url) {
                console.error('url is empty in args of hago.getImageData()');
                return false;
            }

            if (!args.success || typeof(args.success) !== 'function') {
                console.error('Missing \'success\' property or it\'s not a function in args of hago.getImageData()');
                return false;
            }

            if (!args.failure || typeof(args.failure) !== 'function') {
                console.error('Missing \'failure\' property or it\'s not a function in args of hago.getImageData()');
                return false;
            }

            var sources = this._getImageDataSourcesMap[url];
            if (!sources) {
                sources = this._getImageDataSourcesMap[url] = [];
            }

            sources.push(args);

            if (sources.length === 1) {
                yyrt.sendMessageToApp('getImageData', {
                    context: this._roomID,
                    seqId: ++this._seqID,
                    fileUrl: url,
                    scaleWidth: scale,
                    scaleHeight: scale
                }, 0);
            }
            return true;
        },

        _invokeGetImageCallbacks: function(context, url, imageData) {
            var sources = this._getImageDataSourcesMap[url];
            var isSucceed = imageData && (imageData instanceof ArrayBuffer) && imageData.byteLength > 0;

            if (sources) {
                var len = sources.length;
                if (len > 0) {
                    for (var i = 0; i < len; ++i) {
                        var source = sources[i];
                        if (isSucceed) {
                            source.success(url, imageData);
                        }
                        else {
                            source.failure(url);
                        }
                    }
                }
                else {
                    console.error('_invokeGetImageCallbacks: callback array is empty!');
                }

                delete this._getImageDataSourcesMap[url];
            }
            else {
                console.error('_invokeGetImageCallbacks: could not find callback!');
            }
        },

        /**
         * HTTP 请求成功回调
         * @callback httpRequestSuccessCallback
         * @param {string} responseStr HTTP 请求返回的数据
         */

        /**
         * HTTP 请求失败回调
         * @callback httpRequestFailureCallback
         */

        /**
         * HTTP 请求
         * @param {Object} args
         * @param {string} args.url HTTP 请求 URL
         * @param {string=} args.method HTTP 请求方式，此参数可选，默认为 GET 请求
         * @param {httpRequestSuccessCallback} args.success 成功回调
         * @param {httpRequestFailureCallback} args.failure 失败回调
         * @return {boolean}
         */
        httpRequest: function(args) {
            if (!window.yyrt)
                return false;

            if (typeof(args) !== 'object') {
                console.error('Invalid argument passed to httpRequest!');
                return false;
            }

            if (!args.url) {
                console.error('httpRequest: Invalid args.url!');
                return false;
            }

            if (!args.success || typeof(args.success) !== 'function') {
                console.error('Missing \'success\' property or it\'s not a function in args of hago.httpRequest()');
                return false;
            }

            if (!args.failure || typeof(args.failure) !== 'function') {
                console.error('Missing \'failure\' property or it\'s not a function in args of hago.httpRequest()');
                return false;
            }

            var url = args.url;
            var method = args.method || 'GET';
            var jsonParams;

            if (typeof(args.params) === 'object') {
                try {
                    jsonParams = JSON.stringify(args.params);
                }
                catch (e) {
                    console.error('JSON.stringify: ' + args.params + ' failed: ' + e);
                    return false;
                }
            }

            var seqId = ++this._seqID;
            this._httpRequestMap[seqId] = args;

            yyrt.sendMessageToApp('getInfoFromApp', {
                context: this._roomID,
                seqId: seqId,
                args: ['HTTP', method, url, jsonParams]
            }, 0);

            return true;
        },

        _invokeHttpRequestCallbacks: function(context, seqId, responseStr) {
            var source = this._httpRequestMap[seqId];
            if (source) {
                if (responseStr) {
                    source.success(responseStr);
                }
                else {
                    source.failure();
                }

                delete this._httpRequestMap[seqId];
            }
            else {
                console.error('_invokeGetImageCallbacks: could not find callback!');
            }
        },

        _canUseKv: function() {
            return this._kvHost && this._kvSign && this._gameID;
        },

        /**
         * 设置 key-value 数据库数据
         * @param {Object} args
         * @param {string} args.key 要设置的键值
         * @param {string} args.value 要设置的值
         * @param {number=} args.ttl 属性的时长， -1是永久
         * @param {httpRequestSuccessCallback} args.success 成功回调
         * @param {httpRequestFailureCallback} args.failure 失败回调
         * @return {boolean}
         */
        kvSet: function(args) {
            if (!window.yyrt)
                return false;

            if (typeof(args) !== 'object') {
                console.error('Invalid argument passed to kvSet!');
                return false;
            }

            if (!args.key) {
                console.error('kvSet: Invalid args.key!');
                return false;
            }

            if (!args.value) {
                console.error('kvSet: Invalid args.value!');
                return false;
            }

            var ttl = args.ttl || -1;

            if (!args.success || typeof(args.success) !== 'function') {
                console.error('Missing \'success\' property or it\'s not a function in args of hago.kvSet()');
                return false;
            }

            if (!args.failure || typeof(args.failure) !== 'function') {
                console.error('Missing \'failure\' property or it\'s not a function in args of hago.kvSet()');
                return false;
            }

            if (!this._canUseKv()) {
                console.error('Invalid kv sign or gameID!');
                return false;
            }

            var params = {
                gameid: this._gameID,
                key: args.key,
                value: args.value,
                ttl: ttl
            };

            var dataToSend = {
                sign: this._kvSign,
                data: JSON.stringify(params)
            };

            this.httpRequest({
                url: this._kvHost + '/kv/set?',
                method: 'GET',
                params: dataToSend,
                success: args.success,
                failure: args.failure
            });

            return true;
        },

        /**
         * 获取 key-value 数据库数据
         * @param {Object} args
         * @param {Array.<string>} args.keys 要获取的键值数组
         * @param {string} args.uid 要获取的用户的uid
         * @param {httpRequestSuccessCallback} args.success 成功回调
         * @param {httpRequestFailureCallback} args.failure 失败回调
         * @return {boolean}
         */
        kvGet: function(args) {
            if (!window.yyrt)
                return false;

            if (typeof(args) !== 'object') {
                console.error('Invalid argument passed to kvGet!');
                return false;
            }

            if (!args.keys) {
                console.error('kvGet: Invalid args.keys!');
                return false;
            }

            if (!args.uid) {
                console.error('kvGet: Invalid args.uid!');
                return false;
            }

            if (!args.success || typeof(args.success) !== 'function') {
                console.error('Missing \'success\' property or it\'s not a function in args of hago.kvGet()');
                return false;
            }

            if (!args.failure || typeof(args.failure) !== 'function') {
                console.error('Missing \'failure\' property or it\'s not a function in args of hago.kvGet()');
                return false;
            }

            if (!this._canUseKv()) {
                console.error('Invalid kv sign or gameID!');
                return false;
            }

            var params = {
                gameid: this._gameID,
                uid: args.uid,
                key: args.keys
            };

            var dataToSend = {
                sign: this._kvSign,
                data: JSON.stringify(params)
            };

            this.httpRequest({
                url: this._kvHost + '/kv/get?',
                method: 'GET',
                params: dataToSend,
                success: args.success,
                failure: args.failure
            });

            return true;
        },

        /**
         * 删除 key-value 数据库数据
         * @param {Object} args
         * @param {string} args.key 要删除的键值
         * @param {httpRequestSuccessCallback} args.success 成功回调
         * @param {httpRequestFailureCallback} args.failure 失败回调
         * @return {boolean}
         */
        kvDel: function(args) {
            if (!window.yyrt)
                return;

            if (!args.key) {
                console.error('kvDel: Invalid args.key!');
                return false;
            }

            if (!args.success || typeof(args.success) !== 'function') {
                console.error('Missing \'success\' property or it\'s not a function in args of hago.kvDel()');
                return false;
            }

            if (!args.failure || typeof(args.failure) !== 'function') {
                console.error('Missing \'failure\' property or it\'s not a function in args of hago.kvDel()');
                return false;
            }

            if (!this._canUseKv()) {
                console.error('Invalid kv sign or gameID!');
                return false;
            }

            var params = {
                gameid: this._gameID,
                key: args.key
            };

            var dataToSend = {
                sign: this._kvSign,
                data: JSON.stringify(params)
            };

            this.httpRequest({
                url: this._kvHost + '/kv/del?',
                method: 'GET',
                params: dataToSend,
                success: args.success,
                failure: args.failure
            });

            return true;
        },

        /**
         * 游戏进入后台的回调函数
         * @callback enterBackgroundCallback
         */

        /**
         * 设置游戏进入后台的回调函数
         * @param {enterBackgroundCallback}
         */
        setEnterBackgroundCallback: function(cb) {
            this._enterBackgroundCallback = cb;
        },

        /**
         * 游戏进入前台的回调函数
         * @callback enterForegroundCallback
         */

        /**
         * 设置游戏进入前台的回调函数
         * @param {enterForegroundCallback}
         */
        setEnterForegroundCallback: function(cb) {
            this._enterForegroundCallback = cb;
        },

        /**
         * App 向游戏请求退出的回调函数
         * @callback gameExitCallback
         */

        /**
         * 设置 App 向游戏请求退出的回调函数，例如：游戏过程中点击返回按钮，退出游戏的时候，App 会回调此接口
         * @param {gameExitCallback}
         */
        setGameExitCallback: function(cb) {
            this._gameExitCallback = cb;
        },

        /**
         * App 初始化完成，游戏依赖的数据已经准备好后的回调函数
         * @callback gameReadyCallback
         */

        /**
         * 设置 App 初始化完成，游戏依赖的数据已经准备好后的回调函数
         * @param {gameReadyCallback}
         * @note 只有在这个回调后，才能通过 getUserInfo 去获取用户数据
         */
        setGameReadyCallback: function(cb) {
            this._gameReadyCallback = cb;
        },

        /**
         * App 发送给游戏的事件回调函数
         * @callback appEventCallback
         * @param {number} event 事件 ID, 目前支持：hago.APP_EVENT_SPEAKING_STATE，hago.APP_EVENT_MIC_STATUS_CHANGE，hago.APP_EVENT_NETWORK_STRENGTH_CHANGE
         * @param {Object} obj 数据
         */

        /**
         * 设置 App 发送给游戏的事件回调函数
         * @param {appEventCallback}
         */
        setAppEventCallback: function(cb) {
            this._appEventCallback = cb;
        },

        /**
         * 监听 App 事件
         * @param event 事件 ID, 目前支持：hago.APP_EVENT_SPEAKING_STATE，hago.APP_EVENT_MIC_STATUS_CHANGE，hago.APP_EVENT_NETWORK_STRENGTH_CHANGE
         * @note 只有监听的事件，才会回调到 setAppEventCallback 设置的回调函数
         */
        onAppEvent: function(event) {
            if (!window.yyrt)
                return;

            var seqId = ++this._seqID;
            yyrt.sendMessageToApp('didRegisterEvent', {
                context: this._roomID,
                seqId: seqId,
                event: event
            }, 0);
        },

        /**
         * 取消监听 App 事件
         * @param event 事件 ID, 目前支持：hago.APP_EVENT_SPEAKING_STATE，hago.APP_EVENT_MIC_STATUS_CHANGE，hago.APP_EVENT_NETWORK_STRENGTH_CHANGE
         * @note 取消监听后，setAppEventCallback 设置的回调函数将不再收到此类事件
         */
        offAppEvent: function(event) {
            if (!window.yyrt)
                return;

            var seqId = ++this._seqID;
            yyrt.sendMessageToApp('didUnRegisterEvent', {
                context: this._roomID,
                seqId: seqId,
                event: event
            }, 0);
        },

        _invokeEnterBackground: function() {
            if (this._enterBackgroundCallback) {
                this._enterBackgroundCallback();
            }
        },

        _invokeEnterForeground: function() {
            if (this._enterForegroundCallback) {
                this._enterForegroundCallback();
            }
        },

        _invokeGameExit: function() {
            if (this._gameExitCallback) {
                this._gameExitCallback();
            }
        },

        _invokeGameReady: function() {
            if (this._gameReadyCallback) {
                this._gameReadyCallback();
            }
        },

        _invokeAppEvent: function(context, seqId, event, jsonData) {
            if (this._appEventCallback) {
                var jsonObj = JSON.parse(jsonData);
                this._appEventCallback(event, jsonObj);
            }
        },

        /**
         * 查询用户麦克风状态成功回调
         * @callback queryMicStatusSuccessCallback
         * @param {Object} data 返回的数据
         * @param {string} data.uid 用户 ID
         * @param {boolean} data.state 用户麦克风状态，true 为打开状态，false 为关闭状态
         */

        /**
         * 查询用户麦克风状态失败回调
         * @callback queryMicStatusFailureCallback
         */

        /**
         * 查询用户麦克风状态
         * @param {Object} args
         * @param {string} args.uid 用户 ID
         * @param {queryMicStatusSuccessCallback} args.success 成功回调
         * @param {queryMicStatusFailureCallback} args.failure 失败回调
         * @return {boolean}
         */
        queryMicStatus: function(args) {
            if (!window.yyrt)
                return false;

            if (args.uid === undefined) {
                console.error('Missing \'uid\' property or it\'s not a function in args of hago.queryMicStatus()');
                return false;
            }

            if (!args.success || typeof(args.success) !== 'function') {
                console.error('Missing \'success\' property or it\'s not a function in args of hago.queryMicStatus()');
                return false;
            }

            if (!args.failure || typeof(args.failure) !== 'function') {
                console.error('Missing \'failure\' property or it\'s not a function in args of hago.queryMicStatus()');
                return false;
            }

            var seqId = ++this._seqID;
            this._appSendToGameMap[seqId] = args;

            yyrt.sendMessageToApp('sendGameEventToApp', {
                context: this._roomID,
                seqId: seqId,
                event: micStatusQuery,
                args: ['{ "uid": ' + args.uid + '}']
            }, 0);

            return true;
        },

        _invokeSentEventToGame: function(context, seqId, event, jsonData) {
            var source = this._appSendToGameMap[seqId];
            if (source) {
                if (jsonData && typeof(jsonData) === 'string') {
                    var jsonObj = JSON.parse(jsonData);
                    source.success(jsonObj);
                }
                else {
                    source.failure();
                }

                delete this._appSendToGameMap[seqId];
            }
            else {
                console.error('_invokeSentEventToGame: could not find callback!');
            }
        },
    };

    window.hago = new HagoSDK();

    if (window.yyrt) {

        window.addEventListener('onReceiveMessageFromApp', function(event){
            var appMsgObj = event.appMsgObj;
            var type = appMsgObj.type;
            var msgObj = appMsgObj.msgObj;
            var tag = appMsgObj.tag;

            if (type === 'appGetImageDataCallback') {
                window.hago._invokeGetImageCallbacks(msgObj.context, msgObj.imageUrl, msgObj.imageData);
            }
            else if (type === 'appGetUserInfoCallback') {
                window.hago._invokeGetUserDataCallbacks(msgObj.context, msgObj.seqId, msgObj.jsonData);
            }
            else if (type === 'appGetDeviceInfoCallback') {
                window.hago._invokeGetDeviceInfoCallbacks(msgObj.context, msgObj.seqId, msgObj.jsonData);
            }
            else if (type === 'appGetInfoFromAppCallback') {
                window.hago._invokeHttpRequestCallbacks(msgObj.context, msgObj.seqId, msgObj.jsonData);
            }
            else if (type === 'appEnterBackground') {
                window.hago._invokeEnterBackground();
            }
            else if (type === 'appEnterForeground') {
                window.hago._invokeEnterForeground();
            }
            else if (type === 'appGameReady') {
                window.hago._invokeGameReady();
            }
            else if (type === 'appGameExit') {
                window.hago._invokeGameExit();
            }
            else if (type === 'appRegisteredEventCallback') {
                window.hago._invokeAppEvent(msgObj.context, msgObj.seqId, msgObj.event, msgObj.jsonData);
            }
            else if (type === 'appSentEventToGame') {
                window.hago._invokeSentEventToGame(msgObj.context, (msgObj.reqId || msgObj.seqId), msgObj.event, msgObj.jsonData);
            }
        });
    }

})();
