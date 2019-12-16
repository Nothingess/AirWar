import { IEnemy } from "./IEnemy";

const { ccclass, property } = cc._decorator;

@ccclass
export class EeEnemy extends IEnemy {
    public static type: string = 'EeEnemy';

    @property({ type: cc.Sprite, tooltip: "血条" })
    bar: cc.Sprite = null;
    @property({ type: sp.Skeleton, tooltip: '皮肤' })
    sp: sp.Skeleton = null;
    private mIsStand: boolean = false;//待机动作

    /**
     * 精英怪状态
     * # code -1 待机，左右游荡，没有y轴位移
     * # code 0 待机动作+上下的位移
     * # code 1 离开
     */
    private mState: number = -1;
    private mSpeedX: number = 100;              //水平方向移动速度
    private mSpeedY: number = 100;              //垂直方向移动速度
    private mMoveDirX: number = 1;              //水平移动方向
    private mMoveDirY: number = -1;             //垂直移动方向
    private mTimer: number = 10;                //改变状态的计时器
    private mTimerStep: number = 10;
    private mTotalTime: number = 40;            //精英怪存在的时间
    //private mIsDrop: boolean = true;            //是否可以掉奖励

    private mMaxWidth: number = 750;
    private mMaxHeight: number = 1334;

    public init(): void {
        super.init();
        this.bar.fillRange = 1;
        this.mHp = this.mMaxHp = 5000;
        this.mState = -1;

        this.mSpeedX = 70;
        this.mSpeedY = 70;
        this.mMoveDirX = 1;
        this.mMoveDirY = -1;
        this.mTimer = this.mTimerStep = 10;
        this.mTotalTime = 40;
        //this.mIsDrop = true;

        this.mMaxWidth = GlobalVar.SysInfo.view.width;
        this.mMaxHeight = GlobalVar.SysInfo.view.height;

        this.playStand();
    }

    protected move(dt): void {
        this.updateIimer(dt);
        switch (this.mState) {
            case -1:
                this.updateDownUp(dt);
                break;
            case 0:
                this.updateWait(dt);
                break;
            case 1:
                this.updateLeave(dt);
                break;
        }
    }

    private updateIimer(dt): void {
        this.mTotalTime -= dt;
        if (this.mTotalTime < 0) {
            this.mState = 1;
        }
        if (this.mState == 1) return;
        this.mTimer -= dt;
        if (this.mTimer < 0) {
            this.mTimer = this.mTimerStep;
            this.changeState();
        }
    }
    private changeState(): void {
        this.mState = (this.mState + 1) > 0 ? -1 : (this.mState + 1);
    }


    //#region 状态更新

    /**待机 */
    private updateWait(dt): void {
        this.node.x += this.mSpeedX * this.mMoveDirX * dt;
        if (this.node.x > this.mMaxWidth) {
            this.mMoveDirX = -1;
        } else if (this.node.x < 0) {
            this.mMoveDirX = 1;
        }
    }
    private updateDownUp(dt): void {
        this.updateWait(dt);
        this.node.y += this.mSpeedY * this.mMoveDirY * dt;
        if (this.node.y > this.mMaxHeight) {
            this.mMoveDirY = -1;
        } else if (this.node.y < this.mMaxHeight * .3) {
            this.mMoveDirY = 1;
        }
    }
    private updateLeave(dt): void {
        this.node.y -= this.mSpeedY * dt;
    }

    //#endregion

    protected beAttack(val: number): void {
        super.beAttack(val);
        this.bar.fillRange = this.mHp / this.mMaxHp;
        /*         if (!this.mIsDrop) return;
                this.mIsDrop = false;
                setTimeout(() => {
                    this.mIsDrop = true;
                }, 300);
                this.award(); */
        this.playHit();
    }
    public die(): void {
        if (this.mIsDie) return;
        this.mIsDie = true;

        this.dieAc();
        this.award();
        this.recycle();
        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.monsterDie);
    }
    /*     protected award(): void {
            this.dieAc();
            super.award();
        } */
    public noAwardDie(): void {
        if (this.mIsDie) return;
        this.mIsDie = true;
        this.dieAc();
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.eatScore, 100);
        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.monsterDie);
        this.recycle();
    }
    public recycle(): void {
        if (this.mEnemySys) { this.mEnemySys.endEeEnemy() }
        this.mIsStand = false;
        GlobalVar.PoolMgr.put(EeEnemy.type, this.node);
    }
    protected onEvents(): void {
        this.onAnimationEvents();
    }

    //spine 动画
    /**监听spine动画事件 */
    private onAnimationEvents(): void {
        let self = this;
        this.sp.setCompleteListener((trackEntry) => {
            let animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName === 'hit') {
                self.HitCallBack();
            }
        })
    }

    /**播放待机动作 */
    private playStand(): void {
        if (this.mIsStand) return;
        this.mIsStand = true;
        this.sp.setAnimation(0, 'stand', true);
        this.sp.timeScale = 1;
    }
    /**播放被攻击动作 */
    private playHit(): void {
        if (!this.mIsStand) return;
        this.mIsStand = false;
        this.sp.setAnimation(0, 'hit', false);
        this.sp.timeScale = 2;
    }
    private HitCallBack(): void {
        this.playStand();
    }


    /**被击杀的效果 */
    private dieAc(): void {
        this.mEnemySys.playSpExploed(GlobalVar.CONST.ENUM.SPINE_EFFECT.die
            , this.node.position);
    }
}
