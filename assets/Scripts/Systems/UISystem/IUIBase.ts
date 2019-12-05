import { IOpenStrategy, strateB, strateC } from "./IOpenStrategy";
import { PanelMgr } from "./PanelMgr";

const { ccclass } = cc._decorator;

@ccclass
export class IUIBase extends cc.Component {

    protected mSkinPath: string = "";                       //皮肤路径（名称）
    protected mSkin: cc.Node = null;                        //皮肤节点（面板）
    protected mLayer: string = "";                          //层级
    protected mArgs: any[] = [];                            //面板参数
    protected mOpenStrategy: IOpenStrategy = null;          //动画策略
    protected mPanelMgr: PanelMgr = null;                   //面板管理器

    protected isClose: boolean = false;                     //是否已经关闭面板

    /**获取绑定的面板节点 */
    public setSkin(node: cc.Node): void { this.mSkin = node; }
    /**设置绑定的面板节点 */
    public getSkin(): cc.Node { return this.mSkin; }
    /**获取面板所在层级 */
    public getLayer(): string { return this.mLayer; }

    /**初始化动画策略 */
    public initStrategy(): void {
        this.mOpenStrategy = new IOpenStrategy(this.mSkin);
    }
    /**获取皮肤路径 */
    public getSkinPath(): string {
        return `${GlobalVar.CONST.UI_PATH.PANEL_PATH}${this.mSkinPath}`;
    }
    /**获取皮肤名称 */
    public getSkinName(): string {
        return this.mSkinPath;
    }

    //#region 面板生命周期


    public init(mgr: PanelMgr, params?: any[]): void {
        this.mPanelMgr = mgr;
        if (!!params) {
            this.mArgs = params;
        }
    }
    /**
     * 初始化组件、节点
     * #可以根据需要来选择在什么地方初始化：showing showed
     */
    protected initComponent(): void {

    }
    /**对外开放接口 */
    public open(): void {
        this.onShowing();
        this.playPanelAudio();
    }
    protected onShowing(): void {
        this.mOpenStrategy.open(this.onShowed.bind(this));
    }
    protected onShowed(): void {

    }
    public panelUpdate(): void { }
    /**对外开放接口 */
    public close(cb: Function): void {
        this.onClosing(cb);
        this.playCloseAudio();
    }
    protected onClosing(cb: Function): void {
        this.mOpenStrategy.close(() => { cb(); this.onClosed(); });
    }
    protected onClosed(): void {

    }

    //#endregion

    protected playPanelAudio(): void {

    }
    protected playCloseAudio(): void {

    }

    //#region 事件
    protected onEvent(): void { }
    protected offEvent(): void { }
    //#endregion

    protected onClose(): void {
        if (this.isClose) return;
        if (this.mPanelMgr == null) return;
        this.isClose = true;
        this.mPanelMgr.closePanel(this.getSkinName());
    }

    onDestroy(): void {
        this.offEvent();
    }
}

export class LoadPanel extends IUIBase {

    private bar: cc.Sprite = null;

    public init(mgr: PanelMgr, params?: any[]): void {
        super.init(mgr, params);
        this.mSkinPath = "LoadPanel";
        this.mLayer = GlobalVar.CONST.ENUM.PANEL_LAYER.funcLayer;
    }

    protected onShowing(): void {
        //配置屏幕适应
        this.mSkin.setContentSize(GlobalVar.SysInfo.view);
        this.mSkin.setPosition(GlobalVar.SysInfo.view.width * .5, GlobalVar.SysInfo.view.height * .5);
        super.onShowing();
    }

    protected onShowed(): void {
        super.onShowed();
        this.initComponent();
    }

    protected initComponent(): void {
        this.bar = cc.find("pro_frame/bar", this.mSkin).getComponent(cc.Sprite);
        this.onEvent();
    }

    private onProgress(args: {
        completeCount: number,
        totalCount: number
    }): void {
        this.bar.fillRange = args.completeCount / args.totalCount;
    }

    protected onEvent(): void {
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.loadProgress, this.onProgress.bind(this), "LoadPanel");
    }
    protected offEvent(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.loadProgress, "LoadPanel");
    }

}

export class CloseAnAccountPanel extends IUIBase {
    private mLight: cc.Sprite = null;
    private mPanel: cc.Sprite = null;
    private mSelfScore: cc.Label = null;
    private mOppScore: cc.Label = null;

    public init(mgr: PanelMgr, params?: any[]): void {
        super.init(mgr, params);
        this.mSkinPath = "CloseAnAccountPanel";
        this.mLayer = GlobalVar.CONST.ENUM.PANEL_LAYER.funcLayer;
    }
    /**初始化动画策略 */
    public initStrategy(): void {
        this.mOpenStrategy = new strateC(this.mSkin);
    }

    protected onShowing(): void {
        //配置屏幕适应
        this.mSkin.setPosition(GlobalVar.SysInfo.view.width * .5, GlobalVar.SysInfo.view.height * .5);
        super.onShowing();

        this.initComponent();
    }
    protected initComponent(): void {
        this.mLight = cc.find('light', this.mSkin).getComponent(cc.Sprite);
        this.mPanel = cc.find('panel', this.mSkin).getComponent(cc.Sprite);

        this.mSelfScore = cc.find('self_score', this.mSkin).getComponent(cc.Label);
        this.mOppScore = cc.find('opponent_score', this.mSkin).getComponent(cc.Label);

        this.lightRot();
        this.updateSkin();

        GlobalVar.AudioMgr.stopBgm();
        let audioPath: number = (this.mArgs[0] === 2) ? GlobalVar.CONST.ENUM.AUDIO_TYPE.lose : GlobalVar.CONST.ENUM.AUDIO_TYPE.win;
        GlobalVar.AudioMgr.playSound(audioPath);
    }
    private lightRot(): void {
        this.mLight.node.runAction(cc.repeatForever(cc.rotateBy(5, 360)))
    }
    private updateSkin(): void {
        //根据参数args[0]来判断
        //1 赢了
        //2 输了
        //3 平局

        let hanLight = GlobalVar.GetHandler((sf: cc.SpriteFrame) => {
            this.mLight.spriteFrame = sf;
        }, this)
        let hanPanel = GlobalVar.GetHandler((sf: cc.SpriteFrame) => {
            this.mPanel.spriteFrame = sf;
        }, this)

        GlobalVar.Loader.loadRes(`imgs/light_${this.mArgs[0]}`, hanLight, cc.SpriteFrame);
        GlobalVar.Loader.loadRes(`imgs/panel_${this.mArgs[0]}`, hanPanel, cc.SpriteFrame);

        this.mSelfScore.string = this.mArgs[1];
        this.mOppScore.string = this.mArgs[2];
    }
}
