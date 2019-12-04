import { EnemyBullet } from "../../Others/IBullet";

const { ccclass } = cc._decorator;

/**追踪型子弹 */
@ccclass
export class TraceBullet extends EnemyBullet {

    public static type: string = 'TraceBullet';
    private mCurAng: number = 0;                    //当前角度(弧度)
    private mTargetAng: number = 0;                 //目标角度（弧度）
    private mTargetNode: cc.Node = null;            //目标敌人

    public init(curAng?: number, targetNode?: cc.Node): void {
        this.mSpeed = 300;

        this.mCurAng = curAng;
        this.mTargetNode = targetNode;
        this.setTargetAng();
    }
    public setTargetAng(): void {
        let targetPos: cc.Vec2 = this.mTargetNode.position;
        targetPos.subSelf(this.node.getPosition());
        targetPos = cc.v2(targetPos.x, targetPos.y);
        this.mTargetAng = targetPos.signAngle(cc.v2(1, 0));

        if (this.mTargetAng < 0.6) { this.mTargetAng = 0.5 }
        if (this.mTargetAng > 2.5) { this.mTargetAng = 2.6 }
    }
    protected move(dt): void {
        this.node.x += Math.cos(this.mCurAng) * this.mSpeed * dt;
        this.node.y += -Math.abs(Math.sin(this.mCurAng) * this.mSpeed * dt);
        this.setTargetAng();
        if (this.mCurAng == this.mTargetAng) return;

        let dir: number = (this.mCurAng > this.mTargetAng) ? -1 : 1;
        this.mCurAng += dir * dt * .5;
        let lastDir: number = (this.mCurAng > this.mTargetAng) ? -1 : 1;
        if (dir != lastDir) {
            this.mCurAng = this.mTargetAng;
        }
    }
    protected isRecycle(): boolean {
        if (this.node.y < -50) return true;
        if (this.node.x < -50) return true;
        if (this.node.x > 800) return true;
        return false;
    }
    public recycle(): void {
        GlobalVar.PoolMgr.put(TraceBullet.type, this.node);
    }
}
