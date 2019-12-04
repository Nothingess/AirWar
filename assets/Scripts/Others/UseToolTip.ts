import { UseToolTipMgr } from "../Systems/UISystem/IUISystem";

const { ccclass, property } = cc._decorator;

@ccclass
export class UseToolTip extends cc.Component {
    public static type: string = 'UseToolTip';

    @property(cc.Node)
    arrow: cc.Node = null;

    @property(cc.Sprite)
    bufSp: cc.Sprite = null;
    private mToolId: number = 0;

    private mUseToolTipMgr: UseToolTipMgr = null;

    /**
     * 
     * @param toolId 道具id（0：召唤精英怪，1：加速）
     */
    public init(toolId: number, tipMgr: UseToolTipMgr): void {
        this.mUseToolTipMgr = tipMgr;
        this.arrow.opacity = 0;
        this.bufSp.node.opacity = 255;

        this.arrow.position = this.bufSp.node.position = cc.v2(150, 0);
        this.arrow.runAction(cc.sequence(
            cc.spawn(
                cc.moveBy(.3, cc.v2(-150, 0)),
                cc.fadeIn(.3)
            ),
            cc.callFunc(() => {
                this.bufSp.node.runAction(cc.sequence(
                    cc.moveBy(1, cc.v2(-300, 0)),
                    cc.fadeOut(1),
                    cc.callFunc(() => { this.recycle() })
                ))
            })
        ))

        if (this.mToolId === toolId) return;
        this.mToolId = toolId;
        this.initSkin();
    }
    private initSkin(): void {
        let id: number = (this.mToolId === 0) ? 1 : 6;
        let han = GlobalVar.GetHandler((res) => {
            if (this.bufSp) {
                this.bufSp.spriteFrame = res;
            }
        }, this)

        GlobalVar.Loader.loadRes(`${GlobalVar.CONST.BUFF_SKINPATH_IMG}${id}`, han, cc.SpriteFrame);
    }

    public recycle(): void {
        if (this.mUseToolTipMgr) { this.mUseToolTipMgr.removeTip(this) }
        GlobalVar.PoolMgr.put(UseToolTip.type, this.node);
    }
}
