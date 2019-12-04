import { BossEnemy } from "./BossEnemy";
import { TraceBullet } from "./TraceBullet";
import { WaterBullet } from "./WaterBullet";
import { MinMonsterCollider } from "./MinMonsterCollider";
import { StaticBullet } from "./StaticBullet";
import { EnemySys } from "./EnemySys";
import { MainFacade } from "../../Scenes/ISceneFacade";

const { ccclass } = cc._decorator;

/**boss 摩根 技能：本体散弹，附带两只小怪
 * #老三
 * #两只小怪围绕着boss缓慢旋转
 * #小怪会发射追踪型子弹
 * #打死小怪一段时间后会重新生成
 * #boss本体会发射散弹攻击
 */
@ccclass
export class BsMorgan extends BossEnemy {

    private mAtkCtrl: AtkCtrl = null;                     //技能控制器
    private mMinList: Map<number, MinMonster> = null;       //小怪列表
    private mKeys: number = 0;                              //计数当前生成的小怪id

    public init(): void {
        this.mBossId = 3;
        super.init();
        this.mMaxHp = this.mHp = 10000;
        this.mAttInterval = this.mStepInterval = 5;
        this.mAtkCtrl = new AtkCtrl();
        this.mMinList = new Map<number, MinMonster>();
        this.mMinList.set(this.mKeys, new MinMonster(this.node, this, this.mKeys));
        this.scheduleOnce(() => {
            this.mKeys++;
            this.mMinList.set(this.mKeys, new MinMonster(this.node, this, this.mKeys))
        }, 6.28);//等待半圈
    }

    //#region boss 攻击技能

    public attack(): void {
        if (this.mAtkCtrl) {
            this.playAttack();
            this.scheduleOnce(() => {
                this.mAtkCtrl.attack()
            }, .3);
        }
    }

    //#endregion

    protected ready(): void {
        super.ready();
        this.mAtkCtrl.setRootPos(this.node.position.add(cc.v2(0, 215)));
    }
    public update(dt): void {
        super.update(dt);
        this.mMinList.forEach(e => { e.update(dt) })

        //测试
        if (!this.mIsReady) return;
        this.mAtkCtrl.update(dt);
    }
    public lateUpdate(dt): void {
        this.mMinList.forEach(e => { e.lastUpdate(dt) })
    }

    public getRoleNode(): cc.Node {
        return this.mEnemySys.getRoleNode();
    }
    /**移除小怪 */
    public removeChild(key: number): void {
        if (!this.mMinList) return;
        this.mMinList.delete(key);
    }
    public recycle(): void {
        this.mMinList.forEach(e => {
            e.recycle();
        })
        this.mMinList = null;
        if (this.mAtkCtrl) { this.mAtkCtrl.recycle(); this.mAtkCtrl = null; }
        //GlobalVar.PoolMgr.removePool(Vortex.type);
        this.unscheduleAllCallbacks();
        super.recycle();
    }

    public getFacade(): MainFacade {
        return (this.mEnemySys.getFacade() as MainFacade);
    }
    public getEnemySys(): EnemySys {
        return this.mEnemySys;
    }
    ///spine 动画-----------------------------------------------------
    //protected playDie(): void {
    /*         if (!this.mSpine) return;
            this.mSpine.setAnimation(0, "die2", false); */
    //}
}
class AtkCtrl {

    private mRootPos: cc.Vec2 = cc.v2();                //boss根位置
    private mBtGroupsPool: Array<BtGroup> = null;       //池组
    private mRunBtGroups: Array<BtGroup> = null;        //正在运行的组

    private init(): void {
        this.mBtGroupsPool = new Array<BtGroup>();
        this.mRunBtGroups = new Array<BtGroup>();
        this.mBtGroupsPool.push(new BtGroup(this));
        this.mBtGroupsPool.push(new BtGroup(this));
    }
    public setRootPos(pos: cc.Vec2): void {
        this.mRootPos = pos;
        this.init();
    }

    private getGroup(): BtGroup {
        let bt: BtGroup = this.mBtGroupsPool.shift();
        if (!bt) { bt = new BtGroup(this); console.log('新group') }
        return bt;
    }
    private putGroup(bt: BtGroup): void {
        this.mBtGroupsPool.push(bt);
    }
    public recycleGroup(bt: BtGroup): void {
        let index: number = this.mRunBtGroups.indexOf(bt);
        if (index > -1) {
            let bts: Array<BtGroup> = this.mRunBtGroups.splice(index, 1);
            this.putGroup(bts[0]);
        }
    }

    public attack(): void {
        let bt: BtGroup = this.getGroup();
        bt.init(this.mRootPos.clone());
        this.mRunBtGroups.push(bt);
    }

    public update(dt): void {
        this.mRunBtGroups.forEach(e => {
            e.update(dt);
        })
    }
    /**回收 */
    public recycle(): void {
        this.mBtGroupsPool.forEach(e => { e.recycle() })
        this.mRunBtGroups.forEach(e => { e.recycle() })

        this.mBtGroupsPool = this.mRunBtGroups = null;
        //GlobalVar.PoolMgr.removePool(StaticBullet.type);
    }
}
class BtGroup {
    private mAtkCtrl: AtkCtrl = null;

    private mAngs: Array<Array<number>> = null;
    private mBts: Array<Array<cc.Node>> = null;
    private mRadiuss: Array<number> = null;
    private mRootPos: cc.Vec2 = cc.v2();            //中心
    private mAngSpeed: number = 10;                 //角速度
    private mMoveSpeed: number = 300;               //移动速度
    //private mRadius: number = 0;                    //半径
    private mUnit: number = Math.PI / 180;          //弧度单位（弧度/度）

    private mState: number = 0;                     //形态（总共三个形态）
    private mRow: number = 4;                       //总共四组(行)
    private mCol: number = 3;                       //每层5个子弹（列）
    private mRotDir: number = 1;                    //旋转方向

    private mTimer: number = 0;

    constructor(atkCtrl: AtkCtrl) {
        this.mAtkCtrl = atkCtrl;
    }

    public init(rootPos: cc.Vec2): void {
        this.mRootPos = rootPos;
        //this.mRadius = 0;
        this.mState = 0;
        this.mRotDir = (Math.random() - .5) > 0 ? 1 : -1;
        this.mTimer = 0;

        this.initRads();
        this.initBts();
        this.initRadiuss();
        this.setRootPos();
    }

    public setRootPos(): void {
        //设置位置
        this.mBts.forEach(nodes => {
            nodes.forEach(node => {
                node.setPosition(this.mRootPos);
            })
        })
    }
    /**初始化子弹角度 */
    private initRads(startRad: number = 0): void {
        this.mAngs = new Array<Array<number>>();
        for (let i = 0; i < this.mRow; i++) {
            for (let j = 0; j < this.mCol; j++) {
                if (this.mAngs[i]) {
                    this.mAngs[i].push(i * 90);
                } else {
                    this.mAngs[i] = [i * 90];
                }
            }
        }
    }
    /**初始化子弹 */
    private initBts(): void {
        this.mBts = new Array<Array<cc.Node>>();
        let node: cc.Node = null;
        for (let i = 0; i < this.mRow; i++) {
            for (let j = 0; j < this.mCol; j++) {
                node = GlobalVar.PoolMgr.get(StaticBullet.type);
                if (node) {
                    if (this.mBts[i]) {
                        this.mBts[i].push(node);
                    } else {
                        this.mBts[i] = [node];
                    }
                }
            }
        }
    }
    /**初始化半径列表 */
    private initRadiuss(): void {
        this.mRadiuss = [0, 0, 0, 0, 0];
    }

    public update(dt): void {
        this.mTimer += dt;
        switch (this.mState) {
            case 0:
                this.scaleState(dt);
                break;
            case 1:
                this.variantState(dt);
                break;
            case 2:
                this.moveState(dt);

            default:
                break;
        }

        if (this.isRecycle()) { this.recycleThisFromAtkCtrl() }
    }

    private scaleState(dt): void {
        /*         this.mRadiuss.forEach(e => {
                    e += this.mMoveSpeed * dt;
                    console.log(e);
                }) */
        for (let i = 0; i < this.mRadiuss.length; i++) {
            this.mRadiuss[i] += this.mMoveSpeed * dt;
        }
        //this.mRadius += this.mMoveSpeed * dt;
        if (this.mRadiuss[0] > 250) {
            //this.mRadiuss.forEach(e => { e = 300 })
            for (let i = 0; i < this.mRadiuss.length; i++) {
                this.mRadiuss[i] = 250;
            }
            this.mState++;
        }

        let ang: number = 0;
        let dir: cc.Vec2 = cc.v2();
        for (let i = 0; i < this.mRow; i++) {
            ang = this.getAng(i, 0);
            this.mBts[i].forEach((e, v) => {
                dir.x = Math.cos(ang * this.mUnit) * this.mRadiuss[v];
                dir.y = Math.sin(ang * this.mUnit) * this.mRadiuss[v];

                dir.addSelf(this.mRootPos);
                e.setPosition(dir);
            })
        }
    }
    private variantState(dt): void {
        let dir: cc.Vec2 = cc.v2();
        for (let i = 0; i < this.mRow; i++) {
            for (let j = 1; j < this.mCol; j++) {
                this.mAngs[i][j] += this.mAngSpeed * this.mRotDir * dt * j * .6;
                this.mRadiuss[j] += dt * 10 * j;

                dir.x = Math.cos(this.mAngs[i][j] * this.mUnit) * this.mRadiuss[j];
                dir.y = Math.sin(this.mAngs[i][j] * this.mUnit) * this.mRadiuss[j];

                dir.addSelf(this.mRootPos);
                this.mBts[i][j].setPosition(dir);
            }
        }

        if (this.mTimer > 2) {
            this.mState++;
        }
    }
    private moveState(dt): void {

        this.mRootPos.y -= this.mMoveSpeed * dt;

        let dir: cc.Vec2 = cc.v2();
        for (let i = 0; i < this.mRow; i++) {
            for (let j = 0; j < this.mCol; j++) {
                this.mAngs[i][j] += this.mAngSpeed * -this.mRotDir * dt * 5 * (1 + j * 0.1);

                dir.x = Math.cos(this.mAngs[i][j] * this.mUnit) * this.mRadiuss[j];
                dir.y = Math.sin(this.mAngs[i][j] * this.mUnit) * this.mRadiuss[j];

                dir.addSelf(this.mRootPos);
                this.mBts[i][j].setPosition(dir);
            }
        }
    }

    /**
     * 获取对应行列的角度
     * @param i row
     * @param j col
     */
    private getAng(i, j): number {
        return this.mAngs[i][j];
    }
    /**
     * 获取对应行列的节点
     * @param i row
     * @param j col
     */
    private getBt(i, j): cc.Node {
        return this.mBts[i][j];
    }

    private isRecycle(): boolean {
        if (this.mRootPos.y + this.mRadiuss[this.mRadiuss.length - 1] < 0) return true;
        return false;
    }
    /**从ctrl回收自生 */
    private recycleThisFromAtkCtrl(): void {
        this.recycle();
        if (this.mAtkCtrl) { this.mAtkCtrl.recycleGroup(this) }
    }
    public recycle(): void {
        if (this.mBts != null) {
            this.mBts.forEach(nodes => {
                nodes.forEach(node => {
                    GlobalVar.PoolMgr.put(StaticBullet.type, node);
                })
            })
        }

        this.mAngs = null;
        this.mBts = null;
    }

}
/**小怪 */
export class MinMonster {

    public static type: string = "MinMonster";
    private mKey: number = 0;
    private mIAttStrategy: IMinAttStrategy = null;
    private mBoss: BsMorgan = null;
    public getBoss(): BsMorgan { return this.mBoss }

    private mObj: cc.Node = null;                   //游戏对象(小怪)
    private mCollider: MinMonsterCollider = null;   //mObj collider
    public getObj(): cc.Node { return this.mObj }
    private mTarget: cc.Node = null;                //目标对象
    private mCurAng: number = 0;                    //当前旋转角度（弧度）
    private mAngSpeed: number = .5;                 //角速度（弧度）
    private mRadius: number = 300;                  //旋转半径
    private mRotDir: number = 1;                    //旋转方向（顺时针）
    private mTargetPos: cc.Vec2 = cc.v2(-100, 0);   //下一帧目标位置

    private mAttInterval: number = 3;               //攻击频率
    private mHp: number = 500;                      //血量
    private mMaxHp: number = 500;                   //血量上限
    private mIsDie: boolean = false;                //是否死亡

    constructor(target: cc.Node, boss: BsMorgan, key: number) {
        this.mTarget = target;
        this.mBoss = boss;
        this.mHp = this.mMaxHp = 2000;
        this.mIsDie = false;
        this.mKey = key;
        let node: cc.Node = GlobalVar.PoolMgr.get(MinMonster.type);
        if (node) {
            this.mObj = node;
            this.mCollider = node.getComponent(MinMonsterCollider);
            if (this.mCollider) {
                this.mCollider.setMinMonster(this);
            }
            this.mIAttStrategy = new IWater(this);
        }
    }

    public update(dt): void {
        this.move(dt);
    }
    public lastUpdate(dt): void {
        this.mAttInterval -= dt;
        if (this.mAttInterval < 0) {
            this.mAttInterval = 3;
            this.attack();
        }
        this.mCurAng -= dt * this.mAngSpeed * this.mRotDir;
        let y: number = Math.sin(this.mCurAng) * this.mRadius;
        let x: number = Math.cos(this.mCurAng) * this.mRadius;
        let pos: cc.Vec2 = cc.v2(x, y);
        pos.addSelf(this.mTarget.getPosition());
        this.mTargetPos = pos;
    }
    /**攻击 */
    private attack(): void {
        //获取子弹实例
        if (!this.mIAttStrategy) return;
        this.mIAttStrategy.attack();
        if (this.mCollider) {
            this.mCollider.playAtkAction();
        }
    }
    private move(dt): void {
        this.mObj.setPosition(this.mTargetPos);
    }
    /**获取当前玩家节点，方便追踪子弹的追踪 */
    public getRoleNode(): cc.Node {
        return this.mBoss.getRoleNode();
    }

    public beAttack(val: number): number {
        if (this.mIsDie) return;
        this.mHp -= val;
        if (this.mHp <= 0) {
            this.mHp = 0;
            this.die();
        }

        return this.mHp / this.mMaxHp;
    }
    private die(): void {//重BsMorgan里移除自身
        this.mIsDie = true;
        this.mBoss.removeChild(this.mKey);
        this.recycle();

        this.getBoss().getEnemySys().playSpExploed(GlobalVar.CONST.ENUM.SPINE_EFFECT.die,
            this.mTargetPos)

        //console.log(`MinMoster.die():${this.mTargetPos}`)
    }
    /**回收小怪 */
    public recycle(): void {
        GlobalVar.PoolMgr.put(MinMonster.type, this.mObj);
    }
}

/**小怪攻击策略
 * #小怪自由攻击方式不一样，抽象一个攻击类
 */
class IMinAttStrategy {
    protected mMinMonster: MinMonster = null;               //小怪

    constructor(monster: MinMonster) {
        this.mMinMonster = monster;
    }

    /**攻击方式 */
    public attack(): void { }
}
/**风 */
class IWind extends IMinAttStrategy {
    public attack(): void {
        if (!this.mMinMonster.getRoleNode()) return;
        let node: cc.Node = GlobalVar.PoolMgr.get(TraceBullet.type);
        if (node) {
            node.setPosition(this.mMinMonster.getObj().position);
            let trace: TraceBullet = node.getComponent(TraceBullet);
            if (trace) {
                let ang: number = 80 + Math.random() * 20;          //目标角度
                let rad: number = ang * Math.PI / 180;              //对应的弧度
                trace.init(rad, this.mMinMonster.getRoleNode());
            }
        }
    }
}
/**火 */
class IFire extends IMinAttStrategy { }
/**水 */
class IWater extends IMinAttStrategy {
    public attack(): void {
        for (let i = 0; i < 8; i++) {
            this.createBullet();
        }
    }

    private createBullet(): void {
        let node: cc.Node = GlobalVar.PoolMgr.get(WaterBullet.type);
        if (node) {
            node.setPosition(this.mMinMonster.getObj().position);
            let water: WaterBullet = node.getComponent(WaterBullet);
            if (water) {
                water.init();
            }
        }
    }
}
/**木 */
class IWood extends IMinAttStrategy { }

