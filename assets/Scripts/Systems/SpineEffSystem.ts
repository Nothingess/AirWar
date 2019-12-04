import { ISystem } from "./ISystem";
import { ISceneFacade, MainFacade } from "../Scenes/ISceneFacade";
import { SceneRes } from "../Others/SceneRes";
import { LaserCollider } from "./RoleSystem/LaserCollider";

interface spineType {
    /**特效大小 */
    sc: number,
    /**特效速度 */
    timeSc: number,
    /**动画名称 */
    name: string
}
export class SpineEffSystem extends ISystem {
    public static type: string = "Spine_Eff";

    private mSpineDatas: Array<sp.SkeletonData> = null;
    private mSpineAcType: Array<spineType> = [
        { sc: 1, timeSc: 1, name: 'attack' },
        { sc: .8, timeSc: 3, name: 'boom' },
        { sc: .5, timeSc: 2, name: 'die' },
        { sc: 1, timeSc: 1, name: 'DJ' },
        { sc: 1, timeSc: 1, name: 'animation' },
        { sc: 2, timeSc: 1, name: 'animation' }
    ];
    private mSpineEffList: Array<SpineExploed> = null;
    private mSpineLaser: SpineLaser = null;
    private mIsLasering: boolean = false;           //激光进行中
    public endLasering(): void { this.mIsLasering = false }

    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);

        this.mSpineDatas = new Array<sp.SkeletonData>();
        this.mSpineEffList = new Array<SpineExploed>();
        this.mSpineLaser = new SpineLaser(this);

        this.initSpineEffs();
        this.onEvents();
    }
    private initSpineEffs(): void {
        let spineLayer: cc.Node = cc.find('Canvas/uiRoot/contentLayer/spineEff_layer');
        this.mSpineDatas = cc.find('Canvas').getComponent(SceneRes).spineEffList;
        GlobalVar.PoolMgr.createNodePool(SpineEffSystem.type, spineLayer, GlobalVar.CONST.SPINE_EFF_PATH);
    }

    private onEvents(): void {
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.playDie, this.playDie.bind(this), 'SpineEffSystem');
    }
    private offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.playDie, 'SpineEffSystem');
    }
    /**收到玩家死亡讯息 */
    private playDie(): void {
        //处理玩家死亡讯息：关闭正在打开的激光
        if (this.mSpineLaser) { this.mSpineLaser.recycle() }
    }

    public logicUpdate(): void {
        if (!this.mIsLasering) return;
        if (this.mSpineLaser) { this.mSpineLaser.update(); }
    }
    private getSpineCopy(): SpineExploed {
        let sp: SpineExploed = this.mSpineEffList.shift();
        if (!sp) sp = new SpineExploed(this);
        return sp;
    }
    public recycleEff(spEff: SpineExploed): void {
        this.mSpineEffList.push(spEff);
    }
    public getSpineType(id: number): spineType { return this.mSpineAcType[id] }
    public getRolePosition(): cc.Vec2 {
        return (this.mFacade as MainFacade).getRolePos();
    }
    //play Spine effect---------------------------------------------------

    /**
     * 播放spine爆炸特效
     * @param id 特效id, GlobalVar下定义的枚举
     * @param pos 播放位置
     */
    public playSpExploed(id: number, pos: cc.Vec2): cc.Node {
        let sp: SpineExploed = this.getSpineCopy();

        return sp.init(this.mSpineDatas[id], pos, this.getSpineType(id), this.mSpineAcType[id].name);
    }
    /**
     * 播放激光特效
     * @param pos 播放位置
     */
    public playSpLaser(pos: cc.Vec2): cc.Node {
        if (!this.mSpineLaser) return null;
        if (this.mIsLasering) return;
        this.mIsLasering = true;

        return this.mSpineLaser.init(
            this.mSpineDatas[GlobalVar.CONST.ENUM.SPINE_EFFECT.dj],
            pos,
            this.getSpineType(GlobalVar.CONST.ENUM.SPINE_EFFECT.dj)
        )
    }
    /**
     * 关闭激光
     */
    public closeSpLaser(): void {
        if (!this.mIsLasering) return;
        this.mSpineLaser.recycle();
    }
    public endSys(): void {
        this.offEvents();
    }
}

class SpineEff {
    protected mSpineEffSys: SpineEffSystem = null;
    protected mSp: sp.Skeleton = null;

    constructor(spineSys: SpineEffSystem) {
        this.mSpineEffSys = spineSys;
    }

    public init(spData: sp.SkeletonData, pos: cc.Vec2, type: spineType): cc.Node {
        let node: cc.Node = GlobalVar.PoolMgr.get(SpineEffSystem.type);
        if (node) {
            node.setPosition(pos);
            let spine: sp.Skeleton = node.getComponent(sp.Skeleton);
            if (!spine) return;
            node.scale = type.sc;
            spine.timeScale = type.timeSc;
            this.mSp = spine;
            spine.skeletonData = spData;

            this.onEvent();
            this.play();
        }

        return node || null;
    }
    public update(): void { }
    protected onEvent(): void {
        if (this.mSp) {
            this.mSp.setCompleteListener(this.onComplete.bind(this))
        }
    }
    protected onComplete(trackEntry): void {
        let animationName = trackEntry.animation ? trackEntry.animation.name : "";
        if (animationName === this.getCompleteAcName()) {
            this.recycle();
        }
    }
    protected getCompleteAcName(): string { return "" }
    protected play(): void { }
    protected recycle(): void {
        if (this.mSp) { GlobalVar.PoolMgr.put(SpineEffSystem.type, this.mSp.node); }
        this.mSp = null;
    }
}

class SpineExploed extends SpineEff {
    private mDefaultAcName: string = '';            //动画name

    constructor(spineSys: SpineEffSystem) {
        super(spineSys);
        console.log('new SpineExploed')
    }
    public init(spData: sp.SkeletonData, pos: cc.Vec2, type: spineType, defaultName: string = ''): cc.Node {
        this.mDefaultAcName = defaultName;
        return super.init(spData, pos, type);
    }
    protected getCompleteAcName(): string { return this.mDefaultAcName }
    /**播放 */
    protected play(): void {
        if (this.mSp) {
            this.mSp.setAnimation(0, this.mDefaultAcName, false);
        }
    }
    /**回收 */
    protected recycle(): void {
        super.recycle();

        if (this.mSpineEffSys) {
            this.mSpineEffSys.recycleEff(this);
        }
    }
}

class SpineLaser extends SpineEff {

    //动画片段 name
    private mLaunchName: string = 'DJ';         //开始发射
    private mDurationName: string = 'DJ2';      //持续发射
    private mTimer: number = 3000;              //激光持续时间(毫秒)
    private mCollider: cc.Node = null;          //激光炮的碰撞体
    private timer: any = null;                  //计时器

    constructor(spineSys: SpineEffSystem) {
        super(spineSys);
        console.log('new SpineLaser')
    }
    public init(spData: sp.SkeletonData, pos: cc.Vec2, type: spineType): cc.Node {

        //震屏
        if (this.mSpineEffSys) {
            (this.mSpineEffSys.getFacade() as MainFacade).getUISystem().LaserGunShakeWindow();
        }

        this.timer = setTimeout(() => {
            this.timer = null;
            this.recycle();
        }, this.mTimer);

        let han = GlobalVar.GetHandler((obj) => {
            this.mCollider = obj;
            let laser: LaserCollider = this.mCollider.getComponent(LaserCollider);
            if (laser) { laser.init() }
            cc.director.getScene().addChild(this.mCollider);
        }, this)
        GlobalVar.Loader.loadPrefabObj(GlobalVar.CONST.LASER_GUN_PATH, han);

        return super.init(spData, pos, type);
    }
    public update(): void {
        if (this.mSp) {
            let rolePos: cc.Vec2 = this.mSpineEffSys.getRolePosition();
            this.mSp.node.setPosition(rolePos.add(cc.v2(0, 100)))
            if (this.mCollider) {
                this.mCollider.setPosition(rolePos)
            }
        }
    }
    protected onEvent() { }
    protected onComplete() { }
    protected getCompleteAcName(): string { return this.mDurationName }
    protected play(): void {
        if (this.mSp) {
            this.mSp.node.angle = 90;
            this.mSp.setAnimation(0, this.mLaunchName, false);
            this.mSp.addAnimation(0, this.mDurationName, true);
        }
    }
    public recycle(): void {

        //停止震屏
        if (this.mSpineEffSys) {
            (this.mSpineEffSys.getFacade() as MainFacade).getUISystem().stopShakeWindow();
        }

        this.mSpineEffSys.endLasering();
        if (this.mCollider) {
            this.mCollider.destroy();
            this.mCollider = null;
        }
        super.recycle();
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
