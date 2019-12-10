import { ISystem } from "../ISystem";
import { ISceneFacade, MainFacade } from "../../Scenes/ISceneFacade";
import { MinEnemy, getMinEnemyGroup, MinEnemyGroup } from "./MinEnemy";
import { IEnemyState, EyDefault, EyAddSpeed, EyWait, EnemyState, OverState } from "./IEnemyState";
import { BossEnemy } from "./BossEnemy";
import { GMEnemy } from "./GMEnemy";
import { BsUndoer } from "./BsUndoer";
import { BsGhost } from "./BsGhost";
import { BsLarva } from "./BsLarva";
import { BossBullet } from "./BossBullet";
import { BsMorgan, MinMonster } from "./BsMorgan";
import { TraceBullet } from "./TraceBullet";
import { MissileLine } from "../../Others/MissileLine";
import { WaterBullet } from "./WaterBullet";
import { BossComing } from "../../Others/BossComing";
import { EeEnemy } from "./EeEnemy";
import { Sniper } from "../../Others/Sniper";
import { HpFrame } from "../../Others/HpFrame";
import { StaticBullet } from "./StaticBullet";

export class EnemySys extends ISystem {

    private mSniperMgr: SniperMgr = null;               //狙击管理器
    /**获取狙击系统 */
    public getSniperMgr(): SniperMgr { return this.mSniperMgr; }
    private mPointList: Array<number> = null;           //敌机出生点集合
    private mLayer: cc.Node = null;                     //敌人所处层级
    private mEffLayer: cc.Node = null;                  //特效层
    private mBulletLayer: cc.Node = null;               //子弹所在层级
    private mEnemyState: IEnemyState = null;            //敌人波次

    private mLevel: number = 0;                         //游戏关卡
    private mMinMonsterStrengthLv = 0;                  //小怪强度等级
    private mIsGameOver: boolean = false;               //游戏结束

    private mMissTimer: number = 5;                     //导弹cd
    private mBaseMissTime: number = 5;                  //基准导弹cd

    private mCurBossIndex: number = 0;                  //当前boss索引

    /**当前是否持有对方给我放的加速道具 */
    private mCurIshaveAddTool: boolean = false;
    /**
     * #在默认状态下每10波小怪就进入boss关卡
     * #当进入加速状态时不算小怪波次
     * #记录当前默认状态剩余的波次
     */
    private mLastTimes: number = -1;
    /**是否有特殊boss(对方玩家召唤) */
    //private mIsHaveSpecialBoss: boolean = false;
    /**敌人默认状态的基础速度 */
    private mEnemySpeedDefaultState: number = 450;
    /**
     * 速度的差值（当前速度 = this.mEnemySpeedDefaultState + this.mAddSpeedVal）
     * #this.mAddSpeedVal可以为负值
     */
    private mAddSpeedVal: number = 450;
    private mIsAddSpeed: boolean = false;//当前是否加速状态
    public isShortAddSpeed(): boolean { return this.mIsAddSpeed }
    /**获取当前速度 */
    public getCurMinSpeed(): number {
        return this.mEnemySpeedDefaultState + (this.mIsAddSpeed ? this.mAddSpeedVal : 0);
    }
    public isShortAddSpeedState(): boolean {
        return this.mIsAddSpeed;
    }
    /**进入加速状态 */
    public setAddSpeedState(): void {
        if (this.mIsAddSpeed) return;
        if (this.mEnemyState.getID() != EnemyState.default) {
            this.mCurIshaveAddTool = true;
        } else {
            this.setShortAddSpeed();
        }
    }
    public checkShortAddSpeedState(): void {
        if (this.mCurIshaveAddTool) {
            this.mCurIshaveAddTool = false;
            this.setShortAddSpeed();
        }
    }
    private setShortAddSpeed(): void {
        //(this.mFacade as MainFacade).getUISystem().playUseToolTip(1);
        GlobalVar.CurGameSpeed.isShortAddSpeed = this.mIsAddSpeed = true;
        setTimeout(() => {
            GlobalVar.CurGameSpeed.isShortAddSpeed = this.mIsAddSpeed = false;
            //console.log('short add speed end')
        }, 5000);
    }

    public initSys(iFcade: ISceneFacade): void {
        super.initSys(iFcade);
        this.mLayer = cc.find("Canvas/uiRoot/contentLayer/enemy_layer");
        this.mEffLayer = cc.find("eff_layer", this.mLayer.parent);
        this.mBulletLayer = cc.find('bullet_layer', this.mLayer.parent);
        if (this.mLayer == null) return;

        this.mSniperMgr = new SniperMgr();
        this.initPool();
        this.initPointList();
        this.onEvents();

        //模拟创建精英，测试用
        //setTimeout(() => { this.createEeEnemy() }, 5000)
    }
    //初始化对象池
    private initPool(): void {
        let hpLayer: cc.Node = cc.find("hp_layer", this.mLayer.parent);
        let guideMissLayer: cc.Node = cc.find("guideMiss_layer", this.mLayer.parent);
        //初始化小怪对象池（分开四种是为了spine合批）
        GlobalVar.PoolMgr.createNodePool(GlobalVar.CONST.ENUM.MIN_ENEMY.m1, this.mLayer.children[0], GlobalVar.CONST.ENEMY_SKINPATH, 5);
        GlobalVar.PoolMgr.createNodePool(GlobalVar.CONST.ENUM.MIN_ENEMY.m2, this.mLayer.children[1], GlobalVar.CONST.ENEMY_SKINPATH, 5);
        GlobalVar.PoolMgr.createNodePool(GlobalVar.CONST.ENUM.MIN_ENEMY.m3, this.mLayer.children[2], GlobalVar.CONST.ENEMY_SKINPATH, 5);
        GlobalVar.PoolMgr.createNodePool(GlobalVar.CONST.ENUM.MIN_ENEMY.m4, this.mLayer.children[3], GlobalVar.CONST.ENEMY_SKINPATH, 5);
        GlobalVar.PoolMgr.createNodePool(HpFrame.type, hpLayer, GlobalVar.CONST.HP_FRAME_PATH, 20);

        GlobalVar.PoolMgr.createNodePool(GMEnemy.type, guideMissLayer, GlobalVar.CONST.GUIDE_MISS_SKINPATH, 5);
        GlobalVar.PoolMgr.createNodePool(MissileLine.type, this.mEffLayer, GlobalVar.CONST.GUIDE_MISS_TIP_SKINPATH, 5);
        GlobalVar.PoolMgr.createNodePool(BossBullet.type, this.mBulletLayer, GlobalVar.CONST.EY_BULLET_PATH, 100);
        GlobalVar.PoolMgr.createNodePool(MinMonster.type, this.mLayer, GlobalVar.CONST.MIN_MONSTER_SKINPATH, 2);
        GlobalVar.PoolMgr.createNodePool(TraceBullet.type, this.mBulletLayer, GlobalVar.CONST.TRACE_BULLET_PATH, 5);
        GlobalVar.PoolMgr.createNodePool(WaterBullet.type, this.mBulletLayer, GlobalVar.CONST.WATER_BULLET_PATH, 8);
        GlobalVar.PoolMgr.createNodePool(StaticBullet.type, this.mBulletLayer, GlobalVar.CONST.STATIC_BULLET_PATH, 60);
        GlobalVar.PoolMgr.createNodePool(EeEnemy.type, this.mLayer, GlobalVar.CONST.EE_ENEMY_SKINPATH, 1);
        GlobalVar.PoolMgr.createNodePool(Sniper.type, this.mEffLayer, GlobalVar.CONST.SNIPER_ICON_PATH, 5);
    }
    public setEnemyState(enemyState: IEnemyState): void {
        if (this.mIsGameOver) return;
        if (this.mEnemyState != null) { this.mEnemyState.end() }
        this.mEnemyState = enemyState;
        this.mEnemyState.init();

        if (enemyState.getID() === EnemyState.default) {
            this.checkShortAddSpeedState();
            if (this.mLastTimes > 0) {
                this.mEnemyState.setTimes(this.mLastTimes);
                this.mLastTimes = -1;
            }
        } else {
            GlobalVar.CurGameSpeed.isShortAddSpeed = this.mIsAddSpeed = false;
        }
    }
    /**结束状态 */
    public setOverState(): void {
        if (this.mIsGameOver) return;
        this.setEnemyState(new OverState(this));
        //GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.changeFlyState, false);
        GlobalVar.CurGameSpeed.isLongAddSpeed = false;

        this.mIsGameOver = true;
    }
    /**初始化小怪生成的点位置 */
    private initPointList(): void {
        this.mPointList = new Array<number>();
        let enemyWidth: number = GlobalVar.SysInfo.view.width * .16;
        let spaceX: number = (GlobalVar.SysInfo.view.width - (enemyWidth * 5)) / 6;
        for (let i = 0; i < 5; i++) {
            if (i == 0) {
                this.mPointList.push((enemyWidth * .5 + spaceX));
            } else {
                let lastX: number = this.mPointList[i - 1];
                this.mPointList.push((lastX + enemyWidth + spaceX));
            }
        }
        this.setEnemyState(new EyDefault(this));
    }
    //#region 生成敌人

    /**生成小怪一排 */
    public createEnemy(): void {
        let group: MinEnemyGroup = getMinEnemyGroup();
        for (let i = 0; i < this.mPointList.length; i++) {
            this.createEnemySingle(i, group);
        }
    }
    /**生成小怪单个 */
    public createEnemySingle(index: number, group?: MinEnemyGroup): void {
        let ran: string = `m${Math.floor(Math.random() * 4) + 1}`;
        let node: cc.Node = GlobalVar.PoolMgr.get(ran);
        if (node) {
            let iEnemy: MinEnemy = node.getComponent(MinEnemy);
            if (iEnemy) {
                iEnemy.setEnemySys(this);
                iEnemy.init(this.mMinMonsterStrengthLv, ran, group);
            }
            node.setPosition(cc.v2(this.mPointList[index], GlobalVar.SysInfo.view.height * 1.2));
        }
    }
    /**生产精英怪 */
    public createEeEnemy(): void {
        let node: cc.Node = GlobalVar.PoolMgr.get(EeEnemy.type);
        if (node) {
            let sc: EeEnemy = node.getComponent(EeEnemy);
            if (sc) {
                sc.setEnemySys(this);
                sc.init();
            }

            node.setPosition(cc.v2(Math.random() * GlobalVar.SysInfo.view.width,
                GlobalVar.SysInfo.view.height))
        }
    }
    /**
     * 创建boss
     * @param isSpecial 是否召唤特殊boss(特殊boss不计关卡)
     */
    public createBoss(isSpecial: boolean = false): void {

        let level: number = isSpecial ? 3 : this.mLevel;
        //测试关卡
        //level = 1;

        let type: any = null;
        switch (level) {
            case 0:
                type = BsGhost;
                break;
            case 1:
                type = BsLarva;
                break;
            case 2:
                type = BsMorgan;
                break;
            case 3:
                type = BsUndoer;
                break;
            default:
                type = BsUndoer;
        }

        GlobalVar.Loader.loadPrefabObj(
            GlobalVar.CONST.BOSS_SKINPATH,
            GlobalVar.GetHandler((obj: cc.Node) => {
                obj.parent = this.mLayer;
                obj.opacity = 0;
                obj.setPosition(cc.v2(this.mPointList[2], GlobalVar.SysInfo.view.height * .7));
                let boss: BossEnemy = obj.addComponent(type);

                if (boss) {
                    boss.setEnemySys(this);
                    boss.init();
                }
            })
        )
    }
    private createMissiles(): void {
        /*         let posList: Array<number> = [125, 250, 375, 500, 625];
        
                let count: number = posList.length;
                let times = setInterval(() => {
                    this.createGuidedMissile(cc.v2(posList[count - 1], pos.y));
                    count--;
                    if (count < 0) {
                        clearInterval(times);
                    }
                }, 300) */
        /*         posList.forEach(e => {
                    this.createGuidedMissile(cc.v2(e, pos.y))
                }) */
        if (this.mIsGameOver) return;
        //boss 关卡没有导弹
        if (this.mEnemyState.getID() == EnemyState.boss
            || this.mEnemyState.getID() == EnemyState.addSpeed) return;

        let count: number = Math.floor(Math.random() * 2) + ((this.mLevel > 0) ? 3 : 0);
        let id = setInterval(() => {
            this.createGuidedMissile(cc.v2(this.mPointList[
                Math.floor(Math.random() * 5)
            ], GlobalVar.SysInfo.view.height + 100));
            count--
            if (count < 0) { clearInterval(id) }
        }, 300)
    }
    /**
     * 创建导弹提示
     * @param pos 坐标
     */
    public createGuidedMissile(pos: cc.Vec2): void {
        let miss: cc.Node = GlobalVar.PoolMgr.get(MissileLine.type);
        if (miss) {
            miss.setPosition(cc.v2(pos.x, GlobalVar.SysInfo.view.height * .5));

            let gmEnemy: MissileLine = miss.getComponent(MissileLine);
            if (gmEnemy) { gmEnemy.init(this, this.getRoleNode(), (this.mLevel > 0 ? true : false)); }
        }
    }
    //#endregion
    /**boss来临提示
     * @param index boss图标索引
     */
    public bossComingAction(): void {
        let han = GlobalVar.GetHandler((node) => {
            node.parent = this.mEffLayer;
            let bossCome: BossComing = node.getComponent(BossComing);
            if (bossCome) { bossCome.setImg(this.mLevel + 1) }
        })

        GlobalVar.Loader.loadPrefabObj(GlobalVar.CONST.BOSS_COMING_PATH, han);
    }
    /**获取小怪的飞行速度 */
    public getMinEnemySpeed(): number {
        return this.mEnemyState.getMinEySpeed();
    }
    public rendererUpdate(dt): void {
        if (this.mEnemyState != null) { this.mEnemyState.rendererUpdte(dt) }
    }
    public logicUpdate(dt): void {
        if (this.mEnemyState != null) { this.mEnemyState.logicUpdate(dt) }
        this.updateMissTime(dt);
    }
    public endSys(): void {
        this.offEvents();
    }
    /**刷新导弹cd */
    private updateMissTime(dt): void {
        this.mMissTimer -= dt;
        if (this.mMissTimer < 0) {
            this.createMissiles();
            this.mMissTimer = Math.random() * 3 + this.mBaseMissTime;
        }
    }

    private onEvents(): void {
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.changeFlyState,
            this.changeFlyState.bind(this),
            "MinEnemy"
        )
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.nextLevel,
            this.nextLevel.bind(this),
            "MinEnemy"
        )
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.sniper,
            this.sniperEnemy.bind(this),
            "MinEnemy"
        )
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.start,
            this.setCurLevel.bind(this),
            "MinEnemy"
        )
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.gameOver,
            this.setOverState.bind(this),
            "MinEnemy"
        )
    }
    private offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.changeFlyState,
            "MinEnemy"
        )
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.nextLevel,
            "MinEnemy"
        )
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.sniper,
            "MinEnemy"
        )
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.start,
            "MinEnemy"
        )
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.gameOver,
            "MinEnemy"
        )
    }
    /**改变飞行速度状态 */
    private changeFlyState(isAddSpeed: boolean): void {
        if (isAddSpeed) {
            if (this.mEnemyState.getID() == EnemyState.default) {
                this.mLastTimes = (this.mEnemyState.getTimes() > 0 ? this.mEnemyState.getTimes() : -1)
            }
            this.setEnemyState(new EyAddSpeed(this));
        } else {
            this.setEnemyState(new EyDefault(this));
        }
    }
    /**进入下一关卡 */
    private nextLevel(): void {
        //this.mLevel += 1
        //this.mLevel = this.mLevel > 3 ? 0 : this.mLevel;
        this.mMinMonsterStrengthLv++;

        this.setCurLevel();
        this.setEnemyState(new EyWait(this));
    }
    private setCurLevel(): void {
        this.mLevel = (this.mFacade as MainFacade).getPKSystem().getBossId(this.mCurBossIndex);
        this.mCurBossIndex++;
    }
    /**狙击敌人 */
    private sniperEnemy(): void {
        for (let i = 0; i < 3; i++) {
            this.mSniperMgr.sniper();
        }
    }


    //-------------------
    /**获取特效层 */
    public getEffLyer(): cc.Node {
        return this.mEffLayer;
    }
    /**获取玩家当前所在位置 */
    public getRolePos(): cc.Vec2 {
        return (this.mFacade as MainFacade).getRolePos();
    }
    /**获取当前玩家节点 */
    public getRoleNode(): cc.Node {
        return (this.mFacade as MainFacade).getRoleNode();
    }
    /**震屏 */
    public shakeWindow(): void {
        (this.mFacade as MainFacade).shakeWindow();
    }
    /**
     * 掉落奖励
     * @param pos 位置
     * @param isMore 是否爆一堆奖励
     */
    public dropAward(pos: cc.Vec2, isMore: boolean = false): void {
        (this.mFacade as MainFacade).dropAward(pos, isMore);
    }
    /**是否处于加速状态 */
    public isAddSpeed(): boolean {
        if (this.mEnemyState.getID() == EnemyState.addSpeed) return true;
        return false;
    }
    /**是否处于boss状态 */
    public isBossState(): boolean {
        if (this.mEnemyState.getID() == EnemyState.boss) return true;
        return false;
    }

    public playSpExploed(id: number, pos: cc.Vec2): cc.Node {
        return (this.mFacade as MainFacade).playSpineExploed(id, pos);
    }
}

/**狙击对象管理 */
class SniperMgr {

    private mTargetList: Array<cc.Node> = null;

    constructor() {
        this.mTargetList = new Array<cc.Node>();
    }

    public put(target: cc.Node): void {
        let index: number = this.mTargetList.indexOf(target);
        if (index >= 0) return;

        this.mTargetList.push(target);

    }
    public get(): cc.Node {
        return this.mTargetList.shift();
    }
    public remove(target: cc.Node): void {
        let index: number = this.mTargetList.indexOf(target);
        if (index >= 0) {//存在
            this.mTargetList.splice(index, 1);
        }
    }


    /**狙击 */
    public sniper(): void {
        let targetNode: cc.Node = this.get();
        if (!targetNode) return;

        let sniperNode: cc.Node = GlobalVar.PoolMgr.get(Sniper.type);
        if (sniperNode) {
            let sc: Sniper = sniperNode.getComponent(Sniper);
            if (sc) {
                sc.sniper(targetNode);
            }
        }
    }

}
