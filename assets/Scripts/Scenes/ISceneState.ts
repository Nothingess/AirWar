import { SceneController } from "./SceneController";
import { ISceneFacade, LoadFacade, MainFacade } from "./ISceneFacade";

export class ISceneState {
    protected mName: string = "";
    protected mResArr: Array<string> = null;            //当前场景需要预加载的资源
    protected mSceneCtrl: SceneController = null;
    protected mFacade: ISceneFacade = null;
    public getSceneName(): string {
        return this.mName;
    }

    constructor(sceneCtrl: SceneController, name: string) {
        this.mSceneCtrl = sceneCtrl;
        this.mName = name;
    }
    public setState(sceneState: any): void {
        if (this.mSceneCtrl == null) return;
        let ss: ISceneState = <ISceneState>new sceneState(this.mSceneCtrl);
        this.mSceneCtrl.setState(ss);
    }

    //#region 状态生命周期

    /**状态初始化 */
    public stateStart(): void {

    }
    /**渲染更新 */
    public rendererUpdate(dt): void {
        this.mFacade.rendererUpdate(dt);
    }
    /**逻辑更新 */
    public logicUpdate(dt): void {
        this.mFacade.logicUpdate(dt);
    }
    /**状态结束，释放资源 */
    public stateEnd(): void {
        this.mFacade.endSys();
    }

    /**加载资源 */
    public loadRes(complete: Function) {
        if (this.mResArr === null) { complete(); return; };
        //后面用load管理器代替，可以更加便利地释放不需要的资源
        let han = GlobalVar.GetHandler(() => { complete() });
        GlobalVar.Loader.loadResArray(this.mResArr, han, this.loadPro);
    }
    /**加载进度 */
    protected loadPro(completedCount: number, totalCount: number): void {
        //TODO 通知观察者
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.loadProgress, {
            completeCount: completedCount,
            totalCount: totalCount
        })
    }
    //#endregion
}

export class LoadScene extends ISceneState {
    constructor(sceneCtrl: SceneController, name: string = "LoadScene") {
        super(sceneCtrl, name);
    }

    public stateStart(): void {
        super.stateStart();
        this.mFacade = new LoadFacade();
        this.mFacade.initSys(this);
    }
}

export class MainScene extends ISceneState {

    constructor(sceneCtrl: SceneController, name: string = "MainScene") {
        super(sceneCtrl, name);

        this.mResArr = [
            //pre
            GlobalVar.CONST.ROLE_SKINPATH,
            GlobalVar.CONST.ENEMY_SKINPATH,
            GlobalVar.CONST.EE_ENEMY_SKINPATH,
            GlobalVar.CONST.BOSS_SKINPATH,
            GlobalVar.CONST.GUIDE_MISS_SKINPATH,
            GlobalVar.CONST.GUIDE_MISS_TIP_SKINPATH,
            GlobalVar.CONST.PET_SKINPATH,
            GlobalVar.CONST.MIN_MONSTER_SKINPATH,
            GlobalVar.CONST.PY_BULLET_PATH,
            GlobalVar.CONST.PET_BULLET_PATH,
            GlobalVar.CONST.LASER_GUN_PATH,
            GlobalVar.CONST.PY_FASHI_PATH,
            GlobalVar.CONST.PY_GUIDE_MISS_PATH,
            GlobalVar.CONST.PY_SWORDKEE_PATH,
            GlobalVar.CONST.EY_BULLET_PATH,
            GlobalVar.CONST.TRACE_BULLET_PATH,
            GlobalVar.CONST.WATER_BULLET_PATH,
            GlobalVar.CONST.STATIC_BULLET_PATH,
            GlobalVar.CONST.GOLD_PATH,
            GlobalVar.CONST.BOSS_COMING_PATH,
            GlobalVar.CONST.BUFF_PRE_PATH,
            GlobalVar.CONST.SNIPER_ICON_PATH,
            GlobalVar.CONST.SMOKE_PATH,
            GlobalVar.CONST.PARTICLE_PATH,
            GlobalVar.CONST.HP_FRAME_PATH,
            GlobalVar.CONST.SPINE_EFF_PATH,
            GlobalVar.CONST.USE_TOOL_TIP_PATH,
            GlobalVar.CONST.USE_TOOL_ACTION_PATH,
            GlobalVar.CONST.COVER_PATH,

            //ui
            GlobalVar.CONST.SOCRE_TIP_PATH,

            //img
            "imgs/BossBullet_1",
            `${GlobalVar.CONST.BUFF_SKINPATH_IMG}${1}`,
            `${GlobalVar.CONST.BUFF_SKINPATH_IMG}${2}`,
            `${GlobalVar.CONST.BUFF_SKINPATH_IMG}${3}`,
            `${GlobalVar.CONST.BUFF_SKINPATH_IMG}${4}`,
            `${GlobalVar.CONST.BUFF_SKINPATH_IMG}${5}`,
            `${GlobalVar.CONST.BUFF_SKINPATH_IMG}${6}`,
            `${GlobalVar.CONST.BUFF_SKINPATH_IMG}${7}`,
            `${GlobalVar.CONST.BUFF_SKINPATH_IMG}${8}`,
            `${GlobalVar.CONST.BUFF_SKINPATH_IMG}${9}`,

            //panel
            'prefabs/uiPanels/CloseAnAccountPanel',

            //json
            GlobalVar.CONST.BULLET_CONFIG,

        ]
    }

    public stateStart(): void {
        super.stateStart();
        this.mFacade = new MainFacade();
        this.mFacade.initSys(this);
    }

}
