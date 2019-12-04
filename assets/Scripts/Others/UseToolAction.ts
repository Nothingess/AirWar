
const { ccclass, property } = cc._decorator;

@ccclass
export class UseToolAction extends cc.Component {
    public static type: string = 'UseToolAction';

    @property({ type: cc.Sprite, tooltip: "皮肤" })
    sp: cc.Sprite = null;
    private mTargetPos: cc.Vec2 = cc.v2();
    private mToolId: number = 0;
    onLoad(): void {
        this.mTargetPos = cc.v2(GlobalVar.SysInfo.view.width * .9,
            GlobalVar.SysInfo.view.height * .95);
    }

    public init(toolId: number): void {
        let curPos: cc.Vec2 = this.node.position;
        let centerPos: cc.Vec2 = cc.v2();

        if (curPos.x > GlobalVar.SysInfo.view.width * .5) {
            centerPos.x = 0;
        } else {
            centerPos.x = GlobalVar.SysInfo.view.width;
        }
        centerPos.y = curPos.y;
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.bezierTo(1, [curPos, centerPos, this.mTargetPos]),
            cc.callFunc(() => {
                this.recycle();
            })
        ))

        if (this.mToolId === toolId) return;
        this.mToolId = toolId;
        this.initSkin();
    }
    private initSkin(): void {
        let id: number = (this.mToolId === 0) ? 1 : 6;
        let han = GlobalVar.GetHandler((res) => {
            if (this.sp) {
                this.sp.spriteFrame = res;
            }
        }, this)

        GlobalVar.Loader.loadRes(`${GlobalVar.CONST.BUFF_SKINPATH_IMG}${id}`, han, cc.SpriteFrame);
    }

    public recycle(): void {
        GlobalVar.PoolMgr.put(UseToolAction.type, this.node);
    }

}
