import { BossEnemy } from "./BossEnemy";
import { BossBullet } from "./BossBullet";

const { ccclass } = cc._decorator;

/**boss 破坏者 技能：散弹
 * #boss 老四
*/
@ccclass
export class BsUndoer extends BossEnemy {

    private mAtkType: IAtkType = null;
    private mAtkCount: number = -1;//根据这个参数判断使用那种攻击方式（攻击交替）
    public mAtkTypeBDir: number = -1;//攻击方式B的方向
    public getAtkCount(): number { return this.mAtkCount; }
    public setAtkType(atkType: IAtkType): void {
        this.mAtkType = atkType;
        this.mAtkType.setAtkPos(this.mAttPos);
        if (!(atkType instanceof AtkTypeWait)) {
            this.mAtkCount++;
        }
    }

    public init(): void {
        this.mBossId = 4;
        super.init();
        this.setAtkType(new AtkTypeA(this));
    }

    protected ready(): void {
        super.ready();
        this.mAttPos = this.node.position;
        if (this.mAtkType) { this.mAtkType.setAtkPos(this.mAttPos) }
    }

    update(dt): void {
        if (!this.mIsReady) return;
        if (this.mIsDie) return;
        if (this.mAtkType) {
            this.mAtkType.update(dt);
        }
    }

    protected isAttack(dt): boolean {
        return false;
    }

    public recycle(): void {
/*         this.node.destroy();
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.eatScore, 2000);
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.nextLevel, false); */
        super.recycle();
        if (this.mAtkType) {
            this.mAtkType.end();
        }
    }


    ///spine 动画-------------------------------------------------

    protected isStandBeforeAc(animationName: string): boolean {
        if (animationName === 'atk1' || animationName === 'atk2') return true;
        return false;
    }

    public playAttack(val: number = 1): void {
        if (!this.mSpine) return;
        if (val === 0) { this.playAttackLeft() }
        else { this.playAttackRight() }
    }
    /**向左攻击 */
    private playAttackLeft(): void {
        this.mSpine.setAnimation(0, 'atk1', false);
    }
    /**向右攻击 */
    private playAttackRight(): void {
        this.mSpine.setAnimation(0, 'atk2', false);
    }
}

/**攻击策略 */
class IAtkType {
    protected mDuration: number = 3;                //状态持续时间
    protected mRadUnit: number = Math.PI / 180;     //一度对应的弧度值

    protected mBsUndoer: BsUndoer = null;
    protected mAtkInterval: number = 3;
    protected mStepInterval: number = 3;
    protected mAtkPos: cc.Vec2 = cc.v2();
    public setAtkPos(pos: cc.Vec2): void {
        this.mAtkPos = pos;
    }

    constructor(bsUndoer: BsUndoer) {
        this.mBsUndoer = bsUndoer;
    }

    public update(dt): void {
        this.mAtkInterval -= dt;
        if (this.mAtkInterval < 0) {
            this.mAtkInterval = this.mStepInterval;
            this.attack();
        }

        this.mDuration -= dt;
        if (this.mDuration < 0) {
            this.changeType();
        }
    }
    protected changeType(): void { }

    protected attack(): void {

    }
    protected createBullet(ang: number, speed?: number): void {
        let node: cc.Node = GlobalVar.PoolMgr.get(BossBullet.type);
        if (node) {
            node.setPosition(this.mAtkPos);
            let eyBullet: BossBullet = node.getComponent(BossBullet);
            if (eyBullet) {
                eyBullet.init(1, this.getDir(ang), speed)
            }
        }
    }
    /**获取移动向量 */
    protected getDir(ang: number): cc.Vec2 {
        let radian: number = ang * this.mRadUnit;
        return cc.v2(Math.sin(radian), Math.cos(radian))
    }
    public end(): void {

    }

}
/**等待 */
class AtkTypeWait extends IAtkType {

    constructor(bsUndoer: BsUndoer) {
        super(bsUndoer);
        this.mDuration = 1.5;
    }

    protected changeType(): void {
        if (this.mBsUndoer) {
            let num: number = this.mBsUndoer.getAtkCount() % 2;
            if (num == 0) {
                this.mBsUndoer.setAtkType(new AtkTypeB(this.mBsUndoer));
            } else {
                this.mBsUndoer.setAtkType(new AtkTypeA(this.mBsUndoer));
            }
        }
    }
}

/**散弹枪 */
class AtkTypeA extends IAtkType {

    private mAngSpace: number = 12;               //角度间隔
    private mStartAng: number = 0;                //开始角度
    private mAddUp: number = 0;

    constructor(bsUndoer: BsUndoer) {
        super(bsUndoer);
        this.mAtkInterval = 0;
        this.mStepInterval = 2;
        this.mDuration = 1.8;
    }

    protected attack(): void {//重写攻击函数
        super.attack();
        this.mBsUndoer.playAttack(0);
        let count: number = 0;
        let timer = setInterval(() => {
            this.randAtt();
            for (let i = 0; i < 30; i++) {
                this.createBullet(this.mStartAng);
                this.mStartAng += this.mAngSpace;
            }
            this.mStartAng = 0;
            count++;
            if (count > 2) {
                clearInterval(timer);
            }
        }, 500)

    }

    /**随机方向攻击 */
    private randAtt(): void {
        this.mAddUp += 5;
        this.mStartAng = this.mAddUp;
    }

    protected changeType(): void {
        this.mBsUndoer.setAtkType(new AtkTypeWait(this.mBsUndoer));
    }
}
/**机关枪 */
class AtkTypeB extends IAtkType {

    private mAngSpeed: number = 10;         //角速度
    private mAtkAngs: Array<number> = null; //角度列表
    private mAddUp: number = 0;             //累加角度（增加的旋转值）
    private mDir: number = 1;               //方向
    private mIsPlayAc: boolean = false;     //是否播放过攻击动画

    constructor(bsUndoer: BsUndoer) {
        super(bsUndoer);
        this.mDuration = 1.8;
        this.mAtkInterval = 0;
        this.mStepInterval = .12;
        this.mAngSpeed = 200;
        this.mAtkAngs = [0, 60, 120, 180, 240, 300]

        this.mBsUndoer.mAtkTypeBDir++;
        this.mDir = ((this.mBsUndoer.mAtkTypeBDir % 2) == 0) ? 1 : -1;
        this.mIsPlayAc = false;
    }

    update(dt): void {
        super.update(dt);
        this.updateAng(dt);
    }

    private updateAng(dt): void {
        this.mAddUp += this.mAngSpeed * this.mDir * dt;
    }
    protected attack(): void {
        super.attack();
        if (!this.mIsPlayAc) { this.mBsUndoer.playAttack(1); this.mIsPlayAc = true }
        this.mAtkAngs.forEach(e => {
            this.createBullet(e + this.mAddUp, 300);
        })
    }
    /**获取移动向量 */
    protected getDir(ang: number): cc.Vec2 {
        let radian: number = ang * this.mRadUnit;
        return cc.v2(Math.cos(radian), Math.sin(radian));
    }

    protected changeType(): void {
        this.mBsUndoer.setAtkType(new AtkTypeWait(this.mBsUndoer));
    }
}
