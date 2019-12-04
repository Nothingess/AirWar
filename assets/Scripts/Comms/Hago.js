// LC事件
function LCEvent() {
    const ths = this;

    LCHago.onCreate = (data) => {
        if (data.opponent.isAI === true) {
            this.isAi = true;
        }
        console.log('onCreate you', data.you.avatar)
        console.log('onCreate opponent', data.opponent.avatar)
        console.log('onCreate', JSON.stringify(data))
        ths.randomSeed = data.seed;
        ths.loadHeadPic(ths.playerPic, data.you.avatar);
        ths.loadHeadPic(ths.aiPic, data.opponent.avatar);
        LCHago.ready();
    };
    LCHago.onStart = (data) => {
        console.log('onStart', data);
        Laya.timer.once(1000, ths, () => {
            ths.hideTips();
            ths.startGame();
        })
        //游戏正式开始
    };
    LCHago.onCountDown = (data) => {
        console.log("onCountDonw", data);

        if (data > Config.GAME_TIME) return;

        ths.changeGameTime(data);
        ths.gateTime--;

        if (ths.gameTime <= 0) {
            ths.onMouseUp();
            ths._scene2D.off(Laya.Event.MOUSE_DOWN, ths, ths.onMouseDown);
            ths._scene2D.off(Laya.Event.MOUSE_UP, ths, ths.onMouseUp);
            LCHago.score(ths.point)//发送自己的分数
            LCHago.finish()//本地倒计时为0时发送，请求服务器结算游戏
            Laya.timer.clearAll();
            Laya.timer.clear(ths, ths.gameUpdata);
            return;
        }
        //游戏倒计时
    }

    LCHago.onOpponentScore = (data) => {
        console.log("onOpponentScore", data)
        //对手分数变化
        if (ths.isAi !== true) {
            ths.aiPoint = data;
            ths.textScore2.text = data + '';
        }
    }
    LCHago.onOpponentTool = (data) => {
        console.log("onOpponentTool", data)
        //对手对你使用道具
        ths.addScreem();
    }
    LCHago.onResult = (data) => {
        console.log("onResult", data)
        // v:1赢了,2输了,3平局
        Laya.updateTimer.resume() //恢复onUpdate
        ths.gameOver(data);
    }
    LCHago.onReconnectBegin = () => {
        ths.pauseGame();
        console.log("onReconnectBegin 开始重连")
    }
    LCHago.onReconnectFinish = () => {
        ths.resumeGame();
        console.log("onReconnectFinish 重连成功");
    }
    LCHago.onClose = () => {
        console.log("onClose 网络断开");
        Laya.updateTimer.resume() //恢复onUpdate
        ths.showTips('error', -1);
        Laya.timer.once(1500, ths, () => {
            ths.gameOver(2);
        })
    }
    if (ths.isTest === true) {
        LCHago.connect(1)
    } else {
        LCHago.connect()
    }
}