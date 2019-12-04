import { IBuff } from "./IBuff";

const { ccclass, property } = cc._decorator;
/**道具类 */
@ccclass
export class Prop extends IBuff {

    @property({ type: cc.Sprite, tooltip: "皮肤" })
    sp: cc.Sprite = null;

    public static type: string = 'prop';

    init(pos: cc.Vec2, isDouble: boolean = false, id?: number): void {
        super.init(pos, isDouble);
        this.mGravity = -1000;
        if (this.mBuffID == id) return;
        this.mBuffID = id;
        this.initSkin();
    }

    private initSkin(): void {
        let han = GlobalVar.GetHandler((res) => {
            if (this.sp) {
                this.sp.spriteFrame = res;
            }
        }, this)

        GlobalVar.Loader.loadRes(`${GlobalVar.CONST.BUFF_SKINPATH_IMG}${this.mBuffID}`, han, cc.SpriteFrame);
    }

    public recycle(): void {
        GlobalVar.PoolMgr.put(Prop.type, this.node);
    }
}
