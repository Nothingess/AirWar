import { SceneRes } from "./SceneRes";

export class BgCtrl {

    private mBgCtrl: cc.Node = null;                    //背景节点
    private mBgSpList: Array<cc.SpriteFrame> = null;    //背景图片列表
    private mIndex: number = 2;                         //当前id
    private mUpBg: cc.Sprite = null;                    //上边背景
    private mBelowBg: cc.Sprite = null;                 //下边背景
    private mCurSpeed: number = 300;                    //速度
    private mDefault: number = 300;                     //默认速度
    private mAddSepdd: number = 1200;                   //加速速度

    constructor(bgCtrl: cc.Node) {
        this.mBgCtrl = bgCtrl;
        this.init();
    }

    init(): void {
        this.mBgCtrl.setContentSize(GlobalVar.SysInfo.view);
        this.mBgCtrl.setPosition(GlobalVar.SysInfo.view.width * .5, GlobalVar.SysInfo.view.height * .5);
        let childs: Array<cc.Node> = this.mBgCtrl.children;
        let rect: cc.Size = this.mBgCtrl.getContentSize();
        let count: number = 0;
        childs.forEach(e => {
            e.setContentSize(rect);
            e.setPosition(cc.v2(0, count * this.mBgCtrl.height));
            count++;
        })

        this.mBelowBg = childs[0].getComponent(cc.Sprite);
        this.mUpBg = childs[1].getComponent(cc.Sprite);

        this.mBgSpList = new Array<cc.SpriteFrame>();
        this.mBgSpList.push(this.mBelowBg.spriteFrame);
        this.mBgSpList.push(this.mUpBg.spriteFrame);
        this.mBgSpList.push(cc.find('Canvas').getComponent(SceneRes).getBg());

        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.changeFlyState, this.changeFlyState.bind(this), "BgRun");
    }

    /**改变飞行状态 */
    private changeFlyState(isAddSpeed: boolean): void {
        this.mCurSpeed = isAddSpeed ? this.mAddSepdd : this.mDefault;
    }
    /**交换背景图，达到循环效果 */
    private changeSP(): void {
        let stepPos: cc.Vec2 = this.mBelowBg.node.position;
        this.mBelowBg.node.position = this.mUpBg.node.position;
        this.mUpBg.node.position = stepPos;
        this.mBelowBg.spriteFrame = this.mBgSpList[this.mIndex];
        this.mIndex = (this.mIndex + 1) % 3;
        let stepNode: cc.Sprite = this.mBelowBg;
        this.mBelowBg = this.mUpBg;
        this.mUpBg = stepNode;
    }
    /**获取当前速度 */
    public getCurSpeed(): number {
        if (GlobalVar.CurGameSpeed.isLongAddSpeed) return this.mAddSepdd;
        if (GlobalVar.CurGameSpeed.isShortAddSpeed) return this.mDefault * 2;
        return this.mDefault;
    }
    public rendererUpdate(dt) {
        this.mBgCtrl.y -= dt * this.getCurSpeed();
        if (this.mBgCtrl.y <= (-this.mBgCtrl.height * .5)) {
            this.mBgCtrl.y += this.mBgCtrl.height;
            this.changeSP();
        }
    }

    public logicUpdate(dt): void {

    }

    public end(): void {

    }

}
