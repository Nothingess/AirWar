import { BossEnemy } from "./BossEnemy";
import { BossBullet } from "./BossBullet";

const { ccclass } = cc._decorator;

/**boss 树精怪
 * #老一
*/
@ccclass
export class BsGhost extends BossEnemy {

    /**扇形攻击范围【向下】的开始角度（从右到左） */
    private mStartAng: number = 70;
    private mSpaceAng: number = 15;
    private mCount: number = 5;                 //每次发射子弹数量

    public init(): void {
        this.mBossId = 1;
        super.init();
        this.mMaxHp = this.mHp = 6000;
        this.mAttInterval = this.mStepInterval = 3;
    }

    protected ready(): void {
        super.ready();
        this.mAttPos = this.node.position;
    }

    protected attack(): void {
        let timer: number = .5;
        let ran: number = this.randAng();
        timer = (ran == 1) ? .65 : timer;
        this.playAttack(ran);
        this.scheduleOnce(() => {
            for (let i = 0; i < this.mCount; i++) {
                this.createBt(this.getDir(this.mStartAng));
                this.mStartAng += this.mSpaceAng;
            }
        }, timer);
    }

    /**随机开始角度 */
    private randAng(): number {
        let ran: number = Math.random() * 3;
        if (ran < 1) { this.mStartAng = 50; ran = 0 }
        else if (ran < 2) { this.mStartAng = 60; ran = 1 }
        else { this.mStartAng = 70; ran = 2 }
        return ran;
    }
    /**创建子弹 */
    private createBt(dir: cc.Vec2): void {
        let bullet: cc.Node = GlobalVar.PoolMgr.get(BossBullet.type);
        if (bullet) {
            bullet.setPosition(this.mAttPos);
            let eyBullet: BossBullet = bullet.getComponent(BossBullet);
            if (eyBullet) {
                eyBullet.init(this.mBossId - 1, dir);
            }
        }
    }
    /**获取角度对应的单位向量 */
    private getDir(ang: number): cc.Vec2 {
        ang = ang * Math.PI / 180;//转化为弧度值
        let dir: cc.Vec2 = GlobalVar.DegressToVectors(ang);
        dir.y = -dir.y;
        return dir;
    }
    public recycle(): void {
        this.unscheduleAllCallbacks();
        super.recycle();
    }


    ///spine 动画---------------------------------------------------
    protected isStandBeforeAc(animationName: string): boolean {
        if (animationName === 'attack' || animationName === 'attack2' || animationName === 'attack3') return true;
        return false;
    }


    protected playAttack(val: number = 1): void {
        if (!this.mSpine) return;

        if (val === 0) { this.playAttackLeft() }
        else if (val === 1) { this.playAttackCenter() }
        else { this.playAttackRight() }
    }

    /**向左攻击 */
    private playAttackLeft(): void {
        this.mSpine.setAnimation(0, 'attack', false);
    }
    /**向右攻击 */
    private playAttackRight(): void {
        this.mSpine.setAnimation(0, 'attack2', false);
    }
    private playAttackCenter(): void {
        this.mSpine.setAnimation(0, 'attack3', false);
    }
}
