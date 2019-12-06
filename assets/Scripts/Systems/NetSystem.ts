import { ISystem } from "./ISystem";
import { ISceneFacade, MainFacade } from "../Scenes/ISceneFacade";
import { CloseAnAccountPanel } from "./UISystem/IUIBase";

export class NetSystem extends ISystem {

    private mPlatform: IPlatform = null;

    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);

        if (typeof LCHago !== 'undefined') {
            this.mPlatform = new HagoLC(this);
        } else {
            this.mPlatform = new IPlatform(this);
        }

        this.onEvents();
    }

    private onEvents(): void {
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.ready,
            this.ready.bind(this), 'NetSystem');
    }
    private offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.ready,
            'NetSystem');
    }


    ///自身接口---------------------------------------
    /**准备结束,在onCreate里面调用 */
    public ready(): void {
        this.mPlatform.ready();
    }
    /**
     * 给对方使用道具
     * @param id 道具id
     */
    public useTool(id: number): void {
        this.mPlatform.useTool(id);
    }
    /**ai使用道具 */
    public aiUseTool(id: number): void {
        this.mPlatform.aiUseTool(id);
    }
    /**上报分数 */
    public uploadScore(val: number): void {
        this.mPlatform.uploadScore(val);
    }
    /**上报ai分数 */
    public uploadOppScore(val: number): void {
        this.mPlatform.upLoadAIScore(val);
    }
    /**请求结算
     * #当收到服务端发送过来的倒计时为0时发起请求
     */
    public reqGameOver(): void {
        this.mPlatform.finish();
    }
    public endSys(): void {
        super.endSys();
        this.offEvents();
    }


    ///外部接口---------------------------------------
    /**更新倒计时 */
    public updateCountDown(val: number): void {
        (this.mFacade as MainFacade).getPKSystem().updateCountDown(val);
    }
    /**更新对手分数 */
    public updateOppScore(val: number): void {
        (this.mFacade as MainFacade).getUISystem().updateScoreUI(1, val);
    }
    /**对手对我使用道具 */
    public oppUseTool(id: number): void {
        console.log(`对方给我使用道具：${id}`);
        //id = 1;
        switch (id) {
            case 0://召唤精英怪
                (this.mFacade as MainFacade).getEnemySys().createEeEnemy();
                (this.mFacade as MainFacade).getUISystem().playUseToolTip(id);
                break;
            case 1://加速
                (this.mFacade as MainFacade).getEnemySys().setAddSpeedState();
                break;
            default:
                break;
        }
    }
    public result(data: any): void {
        (this.mFacade as MainFacade).getUISystem().openPanel(CloseAnAccountPanel, 'CloseAnAccountPanel',
            [data.result, data.yourScore, data.opponentScore]);

        (this.mFacade as MainFacade).getPKSystem().gameOver();
        GlobalVar.NetConfig.isGameOver = true;
    }
    public reconnectBegin(): void {
        GlobalVar.NetConfig.isOffLine = true;
        (this.mFacade as MainFacade).getUISystem().netShow(0);
    }
    public reconnectFinish(): void {
        GlobalVar.NetConfig.isOffLine = false;
        (this.mFacade as MainFacade).getUISystem().netHide();
    }
    public close(): void {
        (this.mFacade as MainFacade).getUISystem().netShow(1);
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.netClose);
        GlobalVar.NetConfig.isGameOver = true;
    }
}

class IPlatform {

    protected mNetSys: NetSystem = null;

    constructor(netSys: NetSystem) {
        this.mNetSys = netSys;

        this.onEvents();
        this.connect();
    }
    protected onEvents(): void { }
    ///api-------------------------------------
    /**
     * 发起连接请求
     * @param val 是否是测试服，测试 val = 1
     */
    public connect(val?: number): void {
        this.onCreate();
    }
    /**准备结束,在onCreate里面调用 */
    public ready(): void {
        GlobalVar.NetConfig.isReady = true;
        this.onStart();
    }
    /**
     * 给对方使用道具
     * @param id 道具id
     */
    public useTool(id: number): void { }
    /**ai使用道具 */
    public aiUseTool(id: number): void { }
    /**上报分数 */
    public uploadScore(val: number): void { }
    public upLoadAIScore(val: number): void { }
    /**请求结算
     * #当收到服务端发送过来的倒计时为0时发起请求
     */
    public finish(): void { }


    ///回调接口---------------------------------
    /**
     * 接收连接成功的回调
     */
    protected onCreate(data?: {
        you: { avatar: any },
        opponent: { isAI: boolean, avatar: any },
        seed: number,
    }): void {
        GlobalVar.NetConfig.isAI = true;
        GlobalVar.NetConfig.isConnect = true;
        GlobalVar.SetSeed(Math.floor(Math.random() * 100) + 1);
        GlobalVar.NetConfig.isOffLine = false;
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.connectSuc);
    }
    /**监听游戏开始事件 */
    protected onStart(data?: any): void {
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.readyCountDown);
        setTimeout(() => {
            GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.start);
        }, 3000);
    }
    /**
     * 倒计时
     * @param data 剩余时间
     */
    protected onCountDown(data: number): void { }
    /**
     * 监听对方分数回调
     * @param data 对方分数
     */
    protected onOpponentScore(data: number): void { }
    /**
     * 对方向你使用道具
     * @param data 道具 id
     */
    protected onOpponentTool(data: number): void { }
    /**
     * 游戏结束
     * @param data v:1赢了,2输了,3平局
     */
    protected onResult(data: number): void { }
    /**开始重连 */
    protected onReconnectBegin(): void { }
    /**重连成功 */
    protected onReconnectFinish(): void { }
    /**重连失败，游戏结束 */
    protected onClose(): void { }
}

class HagoLC extends IPlatform {

    private config = {
        GAME_TIME: 90
    }

    constructor(netSys: NetSystem) {
        super(netSys);
    }

    public connect(): void {
        LCHago.connect(1);
    }
    public ready(): void {
        GlobalVar.NetConfig.isReady = true;
        LCHago.ready();
    }
    /**
     * 给对手使用道具
     * @param id （召唤精英怪：0， 加速：1）
     */
    public useTool(id: number): void {
        LCHago.tool(id);
    }
    public aiUseTool(id: number): void {
        LCHago.tool(id, true);
    }
    public uploadScore(val: number): void {
        LCHago.score(val);
    }
    /**上传ai的分数 */
    public upLoadAIScore(val: number): void {
        LCHago.score(val, true);
    }
    public finish(): void {
        console.log('finish----------------------------------')
        LCHago.finish();
    }

    protected onEvents(): void {
        LCHago.onCreate = this.onCreate.bind(this);
        LCHago.onStart = this.onStart.bind(this);
        LCHago.onCountDown = this.onCountDown.bind(this);
        LCHago.onOpponentScore = this.onOpponentScore.bind(this);
        LCHago.onOpponentTool = this.onOpponentTool.bind(this);
        LCHago.onResult = this.onResult.bind(this);
        LCHago.onReconnectBegin = this.onReconnectBegin.bind(this);
        LCHago.onReconnectFinish = this.onReconnectFinish.bind(this);
        LCHago.onClose = this.onClose.bind(this);
    }
    protected onCreate(data: {
        you: { avatar: any },
        opponent: { isAI: boolean, avatar: any },
        seed: number,
    }): void {
        console.error(`onCreate : ${JSON.stringify(data)}`);
        GlobalVar.NetConfig.isAI = data.opponent.isAI;
        if (!GlobalVar.NetConfig.selfAvatar) {
            let loadPlayAvatar = GlobalVar.GetHandler((tex2d) => {
                GlobalVar.NetConfig.selfAvatar = tex2d;
            }, this)
            GlobalVar.Loader.loadExternalAsset(
                data.you.avatar,
                loadPlayAvatar
            )
            //GlobalVar.NetConfig.selfAvatar = data.you.avatar;
        }
        if (!GlobalVar.NetConfig.oppAvatar) {
            let loadOppAvatar = GlobalVar.GetHandler((tex2d) => {
                GlobalVar.NetConfig.oppAvatar = tex2d;
            }, this)
            GlobalVar.Loader.loadExternalAsset(
                data.opponent.avatar,
                loadOppAvatar
            )
            //GlobalVar.NetConfig.oppAvatar = data.opponent.avatar;
        }
        GlobalVar.NetConfig.isConnect = true;
        GlobalVar.SetSeed(data.seed);
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.connectSuc);
    }

    protected onStart(data: any): void {
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.readyCountDown);
        setTimeout(() => {
            GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.start);
        }, 3000);
    }
    protected onCountDown(data: any): void {
        this.mNetSys.updateCountDown(data);
    }
    protected onOpponentScore(data: any): void {
        this.mNetSys.updateOppScore(data);
    }
    protected onOpponentTool(data: any): void {
        this.mNetSys.oppUseTool(data);
    }
    protected onResult(data: any): void {
        console.log('onResult------------------------')
        this.mNetSys.result(data);
    }
    protected onReconnectBegin(): void {
        console.log('net onReconnectBegin------------------------')
        this.mNetSys.reconnectBegin();
    }
    protected onReconnectFinish(): void {
        console.log('net onReconnectFinish------------------------')
        this.mNetSys.reconnectFinish();
    }
    protected onClose(): void {
        console.log('net onClose------------------------')
        this.mNetSys.close();
    }
}


