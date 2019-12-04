import { IEnemy } from "./IEnemy";

const { ccclass, property } = cc._decorator;

@ccclass
export class BossEnemy extends IEnemy {//BOSS    

    protected mSpine: sp.Skeleton = null;         //spine组件
    protected mBossId: number = 1;                   //boss id
    public getBossId(): number { return this.mBossId }
    protected bar: cc.Sprite = null;              //血条
    protected mAttInterval: number = 3;           //攻击频率
    protected mStepInterval: number = 3;          //暂存攻击间隔
    protected mAttPos: cc.Vec2 = null;            //攻击位置

    protected mIsReady: boolean = false;          //是否准备好了

    public init(): void {
        this.initBoss();
        this.comeOnStage();
    }
    /**
     * 初始化boss
     * @param index boss id
     */
    protected initBoss(): void {
        this.bar = cc.find("hp_frame/bar", this.node).getComponent(cc.Sprite);
        this.mSpine = this.node.getComponentInChildren(sp.Skeleton);
        this.bar.fillRange = 1;
        this.mMaxHp = this.mHp = 12000;
        this.mIsDie = false;

        //加载贴图
        //加载boss配置信息
        let han = GlobalVar.GetHandler((res) => {
            if (this.mSpine) {
                this.mSpine.skeletonData = res;
                this.playStand();
            }
        }, this)

        GlobalVar.Loader.loadRes(this.getBossSkinPath(), han, sp.SkeletonData);
    }
    protected getBossSkinPath(): string {
        let path: string = GlobalVar.CONST.ANIM_PATH.BOSS.SJB;
        switch (this.mBossId) {
            case 1:
                path = GlobalVar.CONST.ANIM_PATH.BOSS.SJB;
                break;
            case 2:
                path = GlobalVar.CONST.ANIM_PATH.BOSS.SLM;
                break;
            case 3:
                path = GlobalVar.CONST.ANIM_PATH.BOSS.ZHS;
                break;
            case 4:
                path = GlobalVar.CONST.ANIM_PATH.BOSS.ST;
                break;

            default:
                break;
        }
        return path;
    }
    /**boss登场 */
    protected comeOnStage(): void {
        //move to targetPosY
        this.node.runAction(
            cc.sequence(
                cc.moveBy(5, cc.v2(0, -GlobalVar.SysInfo.view.height * .5)),
                cc.callFunc(() => { this.ready(); })
            )
        )
    }
    protected ready(): void {
        this.mIsReady = true;
    }
    update(dt): void {
        if (!this.mIsReady) return;
        if (this.mIsDie) return;
        if (this.isAttack(dt)) {
            this.attack();
        }
    }
    /**是否攻击 */
    protected isAttack(dt): boolean {
        this.mAttInterval -= dt;
        if (this.mAttInterval <= 0) {
            this.mAttInterval = this.mStepInterval;
            return true;
        }
        return false;
    }

    /**被攻击 */
    protected beAttack(val: number): void {
        if (!this.mIsReady) return;//boss没准备好
        super.beAttack(val);
        this.bar.fillRange = this.mHp / this.mMaxHp;
    }
    /**攻击 */
    protected attack(): void {

    }
    public die(): void {
        if (this.mIsDie) return;
        this.mIsDie = true;

        this.award();
        this.playDie();
        this.recycle();
        this.mEnemySys.shakeWindow();//震屏
        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.monsterDie);
    }
    protected award(): void {
        let vec: cc.Vec2 = cc.v2(this.node.getPosition().x, 1000);
        //爆开一大堆金币和道具
        this.mEnemySys.dropAward(vec, true);
    }
    public recycle(): void {
        //直接销毁就好 不需要对象池
        this.node.destroy();
        //通知进入下一关
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.eatScore, 2000);
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.nextLevel);
    }


    protected onEvents(): void {
        super.onEvents();
        this.onAnimationEvents();
    }
    /**监听spine动作回调 */
    protected onAnimationEvents(): void {
        this.mSpine.setCompleteListener(this.onComplete.bind(this));
    }
    protected onComplete(trackEntry): void {
        let animationName = trackEntry.animation ? trackEntry.animation.name : "";
        if (this.isStandBeforeAc(animationName)) {
            this.playStand();
        }
    }
    /**获取回到待机动作之前的动作名称 */
    protected isStandBeforeAc(animationName: string): boolean {
        if (animationName === 'attack') return true;
        return false;
    }

    ///Spine 动画----------------------------------------
    /**待机 */
    protected playStand(): void {
        if (!this.mSpine) return;
        this.mSpine.setAnimation(0, "stand", true);
    }
    /**攻击 */
    protected playAttack(): void {
        if (!this.mSpine) return;
        this.mSpine.setAnimation(0, "attack", false);
    }
    /**死亡 */
    protected playDie(): void {
        this.mEnemySys.playSpExploed(GlobalVar.CONST.ENUM.SPINE_EFFECT.zhs_die, this.node.position);
    }
}
