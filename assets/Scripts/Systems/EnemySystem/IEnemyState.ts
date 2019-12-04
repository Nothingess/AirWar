import { EnemySys } from "./EnemySys";

/**状态id */
export enum EnemyState {
    /**等待 */
    wait = 1,
    /**正常飞行 */
    default = 2,
    /**加速 */
    addSpeed = 3,
    /**boss关卡 */
    boss = 4,
    /**结束状态 */
    over = 5
}

export class IEnemyState {

    protected mID: number = 0;                      //状态id
    public getID(): number { return this.mID }
    protected mEnemySys: EnemySys = null;           //敌机管理系统
    protected mMinEyCurSpeed: number = 450;         //小怪的速度
    protected mPrepare: number = 5;                 //准备时间
    protected mTimes: number = 0;                   //记录当前小怪波次

    constructor(enemySys: EnemySys) {
        this.mEnemySys = enemySys;
    }
    protected setEnemyState(enemyState: any): void {
        if (this.mEnemySys == null) return;
        let es: IEnemyState = <IEnemyState>new enemyState(this.mEnemySys);
        this.mEnemySys.setEnemyState(es);
    }

    public init(): void { }
    public getTimes(): number {
        return this.mTimes;
    }
    public setTimes(val: number): void {
        if (val > 0) { this.mTimes = val }
    }
    public getMinEySpeed(): number {
        return this.mEnemySys.getCurMinSpeed();
    }
    protected createEnemy(): void {

    }
    public rendererUpdte(dt): void { }
    public logicUpdate(dt): void { }
    public end(): void { }

}
/**等待状态
 * 播放云层动画，等待时间过后切换到默认状态 EyDefault
 */
export class EyWait extends IEnemyState {

    constructor(enemySys: EnemySys) {
        super(enemySys);
        this.mID = EnemyState.wait;
    }

    public logicUpdate(dt): void {
        this.mPrepare -= dt;
        if (this.mPrepare < 0) {
            this.setEnemyState(EyDefault);
        }
    }
}
/**默认状态 */
export class EyDefault extends IEnemyState {

    protected mCurInterval: number = 2.5;                 //生成小怪的时间间隔
    protected mStepInterval: number = 2.5;                //暂存时间间隔

    constructor(enemySys: EnemySys) {
        super(enemySys);
        this.mID = EnemyState.default;
    }
    public init(): void {
        super.init();
        this.mTimes = 10;
    }

    public rendererUpdte(dt): void {
        this.mCurInterval -= dt;
        if (this.mCurInterval < 0) {
            this.mCurInterval = this.mEnemySys.isShortAddSpeedState() ? this.mStepInterval * .5 : this.mStepInterval;
            this.createEnemy();
        }
    }

    protected createEnemy(): void {
        super.createEnemy();
        this.mEnemySys.createEnemy();
        this.mTimes--;
        if (this.mTimes <= 0) {//切换boss关卡
            this.setEnemyState(EyBoss);
        }
    }
}
/**加速状态 */
export class EyAddSpeed extends IEnemyState {
    protected mCurInterval: number = 0.05;                 //生成小怪的时间间隔
    protected mStepInterval: number = 0.05;                //暂存时间间隔
    private mCreateIndex: number = 0;                     //生成敌人位置的索引
    private mDir: number = 1;                             //方向

    constructor(enemySys: EnemySys) {
        super(enemySys);
        this.mID = EnemyState.addSpeed;
    }

    public init(): void {
        super.init();
        this.mTimes = 50;
        this.mMinEyCurSpeed = 2400;
    }
    public getMinEySpeed(): number {
        return this.mMinEyCurSpeed;
    }
    protected createEnemy(): void {
        super.createEnemy();
        this.mEnemySys.createEnemySingle(this.mCreateIndex);
        this.mTimes--;
        if (this.mTimes <= 0) {
            GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.changeFlyState, false);
            GlobalVar.CurGameSpeed.isLongAddSpeed = false;
            return;
        }

        this.mCreateIndex += this.mDir;
        if (this.mDir > 0) {
            if (this.mCreateIndex > 4) {
                this.mCreateIndex -= 2;
                this.mDir = -this.mDir;
            }
        } else {
            if (this.mCreateIndex < 0) {
                this.mCreateIndex += 2;
                this.mDir = -this.mDir;
            }
        }
    }

    public rendererUpdte(dt): void {
        this.mCurInterval -= dt;
        if (this.mCurInterval < 0) {
            this.mCurInterval = this.mStepInterval;
            this.createEnemy();
        }
    }

}
/**boos关卡 */
export class EyBoss extends IEnemyState {

    private mIsReady: boolean = false;

    constructor(enemySys: EnemySys) {
        super(enemySys);
        this.mID = EnemyState.boss;
    }

    public init(): void {
        super.init();
        this.bossComingAc();
        this.mPrepare = 5;
    }
    /**boss 来临动画 */
    protected bossComingAc(): void {
        this.mEnemySys.bossComingAction();
    }
    protected createEnemy(): void {
        super.createEnemy();
        this.mEnemySys.createBoss();
    }

    public logicUpdate(dt): void {
        if (this.mIsReady) return;
        this.mPrepare -= dt;
        if (this.mPrepare < 0) {
            this.mIsReady = true;
            this.createEnemy();
        }
    }
}

export class OverState extends IEnemyState {
    constructor(enemySys: EnemySys) {
        super(enemySys);
        this.mID = EnemyState.over;
    }
}

