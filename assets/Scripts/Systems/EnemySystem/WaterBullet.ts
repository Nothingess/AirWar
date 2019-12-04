import { EnemyBullet } from "../../Others/IBullet";

const { ccclass } = cc._decorator;
/**水属性小怪的子弹 */
@ccclass
export class WaterBullet extends EnemyBullet {
    public static type: string = "WaterBullet";


    private mIsRecycle: boolean = true;                 //是否回收状态
    private mStartVec: cc.Vec2 = cc.v2();               //开始速度方向
    private mGravity: number = -1000;                   //重力加速度
    private mMaxDownSpeed: number = -1000;              //最大下落速度

    start(): void {
        this.onEvents();
    }
    private onEvents(): void {
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.nextLevel,
            this.onNextLevel.bind(this),
            this.node.name
        )
    }
    private offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.nextLevel,
            this.node.name
        )
    }
    private onNextLevel(): void {
        if (this.mIsRecycle) return;
        this.recycle();
    }

    public init(): void {
        this.mIsRecycle = false;
        let x: number = (Math.random() - .5) * 600;
        let y: number = Math.random() * 600 + 100;

        this.mStartVec = cc.v2(x, y);
    }
    /**计算当前速度 */
    lateUpdate(dt): void {
        if (this.mStartVec.y <= this.mMaxDownSpeed) return;
        this.mStartVec.y += this.mGravity * dt;
    }

    protected move(dt): void {
        this.node.x += this.mStartVec.x * dt;
        this.node.y += this.mStartVec.y * dt;
    }
    protected isRecycle(): boolean {
        if (this.node.y < -50) return true;
        if (this.node.x < -50) return true;
        if (this.node.x > 800) return true;
        return false;
    }

    public recycle(): void {
        this.mIsRecycle = true;
        GlobalVar.PoolMgr.put(WaterBullet.type, this.node);
    }

    onDestroy(): void {
        this.offEvents();
    }
}
