import { IBuff } from "./IBuff";

const { ccclass } = cc._decorator;

@ccclass
export class GoldEffect extends IBuff {

    public static type: string = 'gold';            //用于对象池的key

    public init(pos: cc.Vec2, isDouble: boolean = false): void {
        super.init(pos, isDouble);
        this.mGravity = -1000;
        this.mBuffID = GlobalVar.CONST.ENUM.BUFF_ID.gold;
    }

    /**回收特效资源 */
    public recycle(): void {
        GlobalVar.PoolMgr.put(GoldEffect.type, this.node);
    }
}
