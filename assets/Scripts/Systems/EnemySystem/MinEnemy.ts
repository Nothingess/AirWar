import { IEnemy } from "./IEnemy";
import { HpFrame } from "../../Others/HpFrame";

const { ccclass, property } = cc._decorator;
//only tag----------------------------------------------
let tag = -1;
function getTag(): number {
    tag++;
    return tag;
}


//group-------------------------------------------------
let groupPool: MinEnemyGroup[] = [];

/**小怪的分组（一排小怪为一组）
 * #用来检测当前小组有没有完全被销毁的（完全销毁额外加分）
 */
export class MinEnemyGroup {

    private mTotalCount: number = 5;    //每个分组小怪个数
    private mKillCount: number = 0;     //当前分组被击杀的小怪个数
    private mMissCount: number = 0;     //当前组被遗漏的小怪个数

    public init(): void {
        this.mKillCount = this.mMissCount = 0;
    }
    /**完成一个击杀 */
    public complete(): void {
        this.mKillCount++;
        if (this.mKillCount >= this.mTotalCount) {
            GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.eatScore, 200);
            this.recycle();
        }
    }
    /**小怪被回收
     * #漏掉击杀的小怪
     */
    public miss(): void {
        this.mMissCount++;
        if (this.mKillCount + this.mMissCount >= this.mTotalCount) {
            this.recycle();
        }
    }
    /**回收 */
    private recycle(): void {
        groupPool.push(this);
    }
}
/**获取分组 */
export function getMinEnemyGroup(): MinEnemyGroup {
    let group: MinEnemyGroup = null;
    if (groupPool.length <= 0) {
        group = new MinEnemyGroup();
    } else {
        group = groupPool.pop();
    }
    group.init();
    return group;
}

@ccclass
export class MinEnemy extends IEnemy {//小怪
    //用于存放在对象池中的key
    public mType: string = null;
    public mOnlyTag: number = -1;//唯一标识

    @property({ type: sp.Skeleton, tooltip: "皮肤" })
    sp: sp.Skeleton = null;

    private mHpFrame: HpFrame = null;
    private mHpFramePos: cc.Vec2 = cc.v2(0, -50);
    private mIsStand: boolean = false;              //待机动作
    private mGroup: MinEnemyGroup = null;           //所属分组

    public init(lv: number = 1, type: string = GlobalVar.CONST.ENUM.MIN_ENEMY.m1, group: MinEnemyGroup = null): void {
        if (this.mOnlyTag < 0) { this.mOnlyTag = getTag() }
        super.init();
        this.mHp = this.mMaxHp = 100 * (1 + .3 * lv);
        this.mGroup = group;
        if (this.mEnemySys.getSniperMgr()) {//把小怪加入狙击系统
            this.mEnemySys.getSniperMgr().put(this.node);
        }

        //bar
        let node: cc.Node = GlobalVar.PoolMgr.get(HpFrame.type);
        if (node) {
            let hp: HpFrame = node.getComponent(HpFrame);
            if (hp) { this.mHpFrame = hp; hp.init(); }
        }

        //已经分配过该骨骼数据
        if (this.mType === type) {
            this.playStand();
            return;
        }
        this.mType = type;
        let han = GlobalVar.GetHandler((res) => {
            this.sp.skeletonData = res;
            this.playStand();
        }, this);
        GlobalVar.Loader.loadRes(`${this.getPath()}`, han, sp.SkeletonData)
    }
    update(dt): void {
        super.update(dt);
        if (this.mHpFrame) {
            this.mHpFrame.setPosition(this.node.position.add(this.mHpFramePos));
        }
    }
    protected move(dt): void {
        let speed: number = this.mEnemySys.getMinEnemySpeed();
        this.node.y -= dt * speed;
    }
    protected isRecycle(): boolean {
        return (this.node.y < -100);
    }
    protected award(): void {
        super.award();
        this.noAwardDie();
    }
    public noAwardDie(): void {
        if (this.mIsDie) return;
        this.mIsDie = true;
        this.dieAc();
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.eatScore, 100);
        if (this.mGroup) { this.mGroup.complete(); this.mGroup = null; }
        //GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.monsterDie);
        this.recycle();
    }
    public recycle(): void {
        this.mIsStand = false;
        if (this.mEnemySys.getSniperMgr()) {
            this.mEnemySys.getSniperMgr().remove(this.node);
        }
        if (this.mHpFrame) {
            this.mHpFrame.recycle();
            this.mHpFrame = null;
        }
        if (this.mGroup) { this.mGroup.miss(); this.mGroup = null; }
        GlobalVar.PoolMgr.put(this.mType, this.node);
    }
    protected beAttack(val: number): void {
        super.beAttack(val);
        if (this.mHpFrame) {
            this.mHpFrame.updateBar(this.mHp / this.mMaxHp)
        }
        this.playHit();
        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.monsterDie);
    }
    protected onEvents(): void {
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.changeFlyState,
            this.changeFlyState.bind(this),
            `${this.mOnlyTag}${this.node.name}`
        )
        this.onAnimationEvents();
    }
    protected offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.changeFlyState,
            `${this.mOnlyTag}${this.node.name}`
        )
    }
    private changeFlyState(isAddSpeed: boolean): void {
        if (!isAddSpeed) {
            this.die();
        }
    }


    //spine animation
    /**获取小怪骨骼数据路径 */
    private getPath(): string {
        let path: string = "";
        switch (this.mType) {
            case GlobalVar.CONST.ENUM.MIN_ENEMY.m1:
                path = GlobalVar.CONST.ANIM_PATH.MIN_MONSTER.HY;
                break;
            case GlobalVar.CONST.ENUM.MIN_ENEMY.m2:
                path = GlobalVar.CONST.ANIM_PATH.MIN_MONSTER.NG;
                break;
            case GlobalVar.CONST.ENUM.MIN_ENEMY.m3:
                path = GlobalVar.CONST.ANIM_PATH.MIN_MONSTER.ST;
                break;
            case GlobalVar.CONST.ENUM.MIN_ENEMY.m4:
                path = GlobalVar.CONST.ANIM_PATH.MIN_MONSTER.YJ;
                break;
            default:
                path = GlobalVar.CONST.ANIM_PATH.MIN_MONSTER.HY;
                break;
        }
        return path;
    }
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
        this.sp.timeScale = 2;
    }
    /**播放被攻击动作 */
    private playHit(): void {
        if (!this.mIsStand) return;
        this.mIsStand = false;
        this.sp.setAnimation(0, 'hit', false);
        this.sp.timeScale = 4;
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
