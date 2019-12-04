import { PlayerBullet } from "../../Others/IBullet";
import { SmokeEff } from "../../Others/SmokeEff";

const { ccclass } = cc._decorator;

/**机器人 技能：导弹 */
@ccclass
export class PyGuideMiss extends PlayerBullet {
    public static type: string = 'PyGuideMiss';

    private mAcc: number = 2000;                //加速度
    private mMaxSpeed: number = 3000;           //最大速度
    private mPeakVal: number = 35;             //正弦波峰值
    private mTimer: number = 0;
    private mLastPos: cc.Vec2 = null;           //上次的位置（用来计算导弹的转向）
    private mBaseVec: cc.Vec2 = null;           //目标方向
    private mDirPlus: cc.Vec2 = null;           //正弦波的方向
    private mBasePos: cc.Vec2 = null;           //当前所在的水平方向

    private mSmokeEff: SmokeEff = null;          //导弹尾气
    private mSmokePos: cc.Vec2 = cc.v2(0, -35);

    init(ran: number = 0): void {
        this.mSpeed = 1000;
        this.mATK = 30;
        //this.mTimer = (Math.random() - .5) > 0 ? 0 : Math.PI;
        this.mTimer = (ran > 90 * Math.PI / 180) ? 0 : Math.PI;

        this.mLastPos = this.mBasePos = this.node.position;
        let randRad: number = ran;
        this.mBaseVec = cc.v2(Math.cos(randRad), Math.sin(randRad));
        randRad = randRad + 90 * Math.PI / 180
        this.mDirPlus = cc.v2(Math.cos(randRad), Math.sin(randRad));

        this.node.angle = -GlobalVar.VectorsToDegress(cc.v2(0, 1));

        this.initSmokeEff();
    }

    private initSmokeEff(): void {
        let smoke: cc.Node = GlobalVar.PoolMgr.get(SmokeEff.type);
        if (smoke) {
            this.mSmokeEff = smoke.getComponent(SmokeEff);
            if (this.mSmokeEff) {
                this.mSmokeEff.init();
            }
        }
    }

    update(dt): void {
        this.mTimer += dt * 8;
        super.update(dt);
    }

    lateUpdate(dt): void {
        this.updateSpeed(dt);
        this.rotate();
        this.updateSmoke();
    }
    private rotate(): void {
        let dir: cc.Vec2 = this.node.position.sub(this.mLastPos);
        this.node.angle = -GlobalVar.VectorsToDegress(cc.v2(dir.x, dir.y));
        this.mLastPos = this.node.position;
    }
    private updateSpeed(dt): void {
        if (this.mSpeed > this.mMaxSpeed) return;
        this.mSpeed += this.mAcc * dt;
    }
    private updateSmoke(): void {
        if (this.mSmokeEff) {
            this.mSmokeEff.node.position = this.node.position.add(this.mSmokePos);
            this.mSmokeEff.setAngle(this.node.angle);
        }
    }

    protected move(dt): void {

        this.mBasePos.x += this.mBaseVec.x * this.mSpeed * dt;
        this.mBasePos.y += this.mBaseVec.y * this.mSpeed * dt;

        let addDis: number = Math.sin(this.mTimer) * this.mPeakVal;
        let addVec: cc.Vec2 = this.mDirPlus.mul(addDis);

        this.node.position = this.mBasePos.add(addVec);

    }
    public isHaveEff(): boolean {
        return false;
    }
    public recycle(): void {
        if (this.mSmokeEff) {
            //GlobalVar.PoolMgr.put(SmokeEff.type, this.mSmokeEff.node);
            this.mSmokeEff.recycle();
            this.mSmokeEff = null;
        }
        GlobalVar.PoolMgr.put(PyGuideMiss.type, this.node);
    }

}
