import { BossEnemy } from "./BossEnemy";

const { ccclass } = cc._decorator;

/**进化体 技能：分裂
 * #老二
 * #需要把该boss的所有分裂体消灭才结束
 * #每次分裂都会生成两个完全独立的小boss
 * #分裂之后生成的两个孩子的: mHeart = parent.mHeart - 1
 * #属性mHeart为0的boss不具有分裂能力
 * #每个boss都会记录自己的父节点，没有分裂能力的boss死亡后会通知父节点
 * #父节点收到两个子孩子死亡的消息则自身死亡并通知自己的父节点
 * #父节点为null的为根节点，即本体
 * #本体收到自身两个孩子的死亡消息则本体死亡，则消灭boss通过
*/
@ccclass
export class BsLarva extends BossEnemy {

    private mHeart: number = 3;
    private mParent: BsLarva = null;
    private mState: number = 0;                 //boss状态
    private mChildCount: number = 2;            //剩余孩子个数
    private mMoveSpeed: number = 50;            //待机移动速度

    //#region 重写基类
    public init(): void {
        this.mBossId = 2;
        super.init();
        this.mMaxHp = this.mHp = 5000;
        this.resetAttTimer();
    }
    protected initBoss(): void {
        this.mBossId = 2;
        super.initBoss();
        this.mMaxHp = this.mHp = (5000 - (3 - this.mHeart) * 1500) * .5;
        this.resetAttTimer();
    }
    protected ready(): void {
        super.ready();
        this.mState = 1;
    }
    update(dt): void {
        if (!this.mIsReady) return;
        switch (this.mState) {
            case 0://裂开动作，向旁边炸开
                this.updateBreak(dt);
                break;
            case 1://待机，慢慢向下移动
                this.updateIdle(dt);
                break;
            case 2://攻击，向下冲刺并反弹回到顶部
                this.updateAttack(dt);
                break;
            default:
                break;
        }
    }

    protected isAttack(dt): boolean {
        if (this.node.y <= 200) {
            this.resetAttTimer();
            return true;
        }
        this.mAttInterval -= dt;
        if (this.mAttInterval <= 0) {
            this.resetAttTimer();
            return true;
        }
        return false;
    }
    /**重置攻击计时 */
    private resetAttTimer(): void {
        this.mStepInterval = Math.random() * 4 + 4;
        this.mAttInterval = this.mStepInterval;
    }

    protected beAttack(val: number): void {
        if (!this.mIsReady) return;
        if (this.mIsDie) return;
        this.mHp -= val;
        if (this.mHp <= 0) {
            this.mHp = 0;
            this.break();
        }
        this.bar.fillRange = this.mHp / this.mMaxHp;
        this.powerGranule();

        if (this.mIsCanPlayAudio) {
            this.mIsCanPlayAudio = false;
            setTimeout(() => {
                this.mIsCanPlayAudio = true;
            }, this.mPlayAudioInterval);
            GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.boss);
        }
    }
    //#endregion

    //#region 多态
    public childDie(): void {
        this.mChildCount--;
        if (this.mChildCount == 0) {
            if (this.mParent) { this.mParent.childDie(); this.destroyThis(); }
            else { this.die() }
        }
    }

    public initChild(heart: number, parent: BsLarva, dir: number): void {
        this.mHeart = heart;
        this.mParent = parent;
        this.initBoss()
        this.mIsReady = true;
        this.breakAction(dir);
    }

    private updateBreak(dt): void { }
    private updateIdle(dt): void {
        this.node.y -= dt * this.mMoveSpeed;
        if (this.isAttack(dt)) {
            this.mState = 2;
        }
    }
    private updateAttack(dt): void {
        this.mState = -1;
        //console.log('updateAttack', this.node.name)
        let downDur: number = this.node.y / 500;
        this.node.runAction(cc.sequence(
            cc.callFunc(() => { this.playAttack() }),
            cc.moveBy(downDur, cc.v2(0, -this.node.y + 100)),
            cc.callFunc(() => { this.playAttack(1) }),
            cc.moveBy(2, cc.v2(0, GlobalVar.SysInfo.view.height - 300)),
            cc.callFunc(() => {
                this.mState = 1;
            })
        ))
    }

    /**分裂动画 */
    private breakAction(dir: number): void {
        this.mState = -1;
        let sc: number = this.node.scale;
        this.node.setScale(this.node.scaleX * .9, this.node.scaleY * 1.11)

        this.node.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveBy(1, cc.v2(0, 200)).easing(cc.easeCubicActionOut()),
                    cc.sequence(
                        cc.scaleBy(.3, 1.11, .9),
                        cc.scaleBy(.3, .9, 1.11),
                        cc.scaleTo(.3, sc)
                    )
                ),
                cc.callFunc(() => {
                    this.mState = 1;
                })
            )
        )
    }
    private break(): void {
        if (this.mHeart <= 0) {//不能分裂
            if (this.mParent) { this.mParent.childDie(); this.destroyThis(); }
            this.mIsDie = true;
            return;
        }
        this.mState = -1;
        this.resetAttTimer();
        this.createChild(() => {
            let left: cc.Node = cc.instantiate(this.node);
            let right: cc.Node = cc.instantiate(this.node);
            let scale: number = this.node.scale * 2 / 3;
            let distance: number = this.node.children[0].width * scale * .5;
            left.scale = right.scale = scale;
            left.parent = right.parent = this.node.parent;
            left.position = cc.v2(this.node.position.x - distance, this.node.position.y);
            right.position = cc.v2(this.node.position.x + distance, this.node.position.y);

            let bsLarva_l: BsLarva = left.getComponent(BsLarva);
            let bsLarva_r: BsLarva = right.getComponent(BsLarva);

            if (bsLarva_l) {
                bsLarva_l.initChild(this.mHeart - 1, this, -1)
                bsLarva_l.setEnemySys(this.mEnemySys);
            }
            if (bsLarva_r) {
                bsLarva_r.initChild(this.mHeart - 1, this, 1)
                bsLarva_r.setEnemySys(this.mEnemySys);
            }

            this.hide();
        })
    }

    private createChild(cb: any): void {
        this.node.runAction(
            cc.sequence(
                cc.scaleBy(.2, .8, 1.25),
                cc.scaleBy(.2, 1.25, .8),
                cc.callFunc(() => {
                    if (cb) { cb(); }
                })
            )
        )
    }

    /**分裂之后隐藏本节点 */
    private hide(): void {
        this.mState = -1;

        this.node.active = false;
        //this.node.getComponent(cc.CircleCollider).enabled = false;
        //this.node.children.forEach(child => { child.active = false })
    }
    private destroyThis(): void {
        this.node.destroy();
        if (this.mHeart <= 0) {//无法分裂的小boss
            this.mEnemySys.playSpExploed(GlobalVar.CONST.ENUM.SPINE_EFFECT.die, this.node.position);
        }
    }
    //#endregion


    ///spine 动画-------------------------------------------------------
    protected isStandBeforeAc(animationName: string): boolean {
        if (animationName === 'attack3') return true;
        return false;
    }
    /**播放攻击动画 */
    protected playAttack(val: number = 0): void {
        if (!this.mSpine) return;
        switch (val) {
            case 0:
                this.playAttackDown();
                break;
            case 1:
                this.playAttackUp();
                break;
            default:
                break;
        }
    }

    private playAttackUp(): void {
        this.mSpine.setAnimation(0, 'attack3', false);
    }
    private playAttackDown(): void {
        this.mSpine.setAnimation(0, 'attack2', false);
    }
    /**死亡 */
    protected playDie(): void {
        this.mEnemySys.playSpExploed(GlobalVar.CONST.ENUM.SPINE_EFFECT.zhs_die,
            cc.v2(GlobalVar.SysInfo.view.width * .5, GlobalVar.SysInfo.view.height * .7));
    }
}
