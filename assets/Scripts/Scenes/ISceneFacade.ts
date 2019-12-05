import { ISystem } from "../Systems/ISystem";
import { LoadUISystem, MainUISystem } from "../Systems/UISystem/IUISystem";
import { ISceneState } from "./ISceneState";
import { IRole, MageMin, MechaMin, ElfMin } from "../Systems/RoleSystem/IRole";
import { EnemySys } from "../Systems/EnemySystem/EnemySys";
import { PropSystem } from "../Systems/PropSystem";
import { ParticleSystem } from "../Systems/ParticleSystem";
import { SpineEffSystem } from "../Systems/SpineEffSystem";
import { NetSystem } from "../Systems/NetSystem";
import { PKSystem } from "../Systems/PKSystem";

/**每个场景拥有一个 SceneFacade
 * 用来统一管理子系统，向客户端供高级接口
 */
export class ISceneFacade {
    protected mSceneState: ISceneState = null;
    //系统
    protected mUISystem: ISystem = null;
    /**切换场景 */
    public setState(sceneState: any): void {
        if (this.mSceneState == null) return;
        this.mSceneState.setState(sceneState);
    }
    public initSys(ss: ISceneState): void {
        this.mSceneState = ss;
    }
    public rendererUpdate(dt): void {
        this.mUISystem.rendererUpdate(dt);
    }
    public logicUpdate(dt): void {
        this.mUISystem.logicUpdate(dt);
    }
    public endSys(): void {
        this.mUISystem.endSys();
    }

}

export class LoadFacade extends ISceneFacade {
    public initSys(ss: ISceneState): void {
        super.initSys(ss);
        this.mUISystem = new LoadUISystem();
        this.mUISystem.initSys(this);
    }
}

export class MainFacade extends ISceneFacade {

    private mRole: IRole = null;
    private mEnemySys: EnemySys = null;
    private mPropSys: PropSystem = null;
    private mParticleSys: ParticleSystem = null;
    private mSpineEffSys: SpineEffSystem = null;
    private mNetSys: NetSystem = null;
    private mPKSys: PKSystem = null;

    private mIsReady: boolean = false;//准备

    public initSys(ss: ISceneState): void {
        super.initSys(ss);
        this.mPKSys = new PKSystem();
        this.mNetSys = new NetSystem();
        this.mUISystem = new MainUISystem();
        this.mEnemySys = new EnemySys();
        this.mPropSys = new PropSystem();
        this.mParticleSys = new ParticleSystem();
        this.mSpineEffSys = new SpineEffSystem();

        this.mPKSys.initSys(this);
        this.mNetSys.initSys(this);
        this.mUISystem.initSys(this);
        this.mEnemySys.initSys(this);
        this.mPropSys.initSys(this);
        this.mParticleSys.initSys(this);
        this.mSpineEffSys.initSys(this);

        GlobalVar.AudioMgr.playBGM(GlobalVar.CONST.ENUM.AUDIO_TYPE.bgm);
        this.onEvents();
    }
    private onEvents(): void {
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.start, this.ready.bind(this), 'MainFacade');
    }
    private offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.start, 'MainFacade');
    }

    private ready(): void {
        this.mIsReady = true;
        switch (GlobalVar.NetConfig.selectRoleId) {
            case 0:
                this.mRole = new MageMin();
                break;
            case 1:
                this.mRole = new MechaMin();
                break;
            case 2:
                this.mRole = new ElfMin();
                break;
            default:
                this.mRole = new MageMin();
                break;
        }
        this.mRole.initSys(this);
        (this.mUISystem as MainUISystem).createRole();
    }

    public rendererUpdate(dt): void {
        if (!this.mIsReady) return;
        this.mNetSys.rendererUpdate(dt);
        this.mRole.rendererUpdate(dt);
        this.mPKSys.rendererUpdate(dt);
        this.mUISystem.rendererUpdate(dt);
        this.mEnemySys.rendererUpdate(dt);
        this.mParticleSys.rendererUpdate(dt);
        this.mSpineEffSys.rendererUpdate(dt);
    }
    public logicUpdate(dt): void {
        if (!this.mIsReady) return;
        this.mNetSys.logicUpdate(dt);
        this.mRole.logicUpdate(dt);
        this.mPKSys.logicUpdate(dt);
        this.mUISystem.logicUpdate(dt);
        this.mEnemySys.logicUpdate(dt);
        this.mParticleSys.logicUpdate(dt);
        this.mSpineEffSys.logicUpdate();
    }
    public endSys(): void {
        this.offEvents();
        if (!this.mIsReady) return;
        this.mNetSys.endSys();
        this.mRole.endSys();
        this.mPKSys.endSys();
        this.mUISystem.endSys();
        this.mEnemySys.endSys();
        this.mPropSys.endSys();
        this.mParticleSys.endSys();
        this.mSpineEffSys.endSys();
    }

    //interface mediator 作为中介者向其他系统提供接口

    //UISystem---------------------------
    /**获取玩家当前所在坐标 */
    public getRolePos(): cc.Vec2 {
        return (this.mUISystem as MainUISystem).getRolePos();
    }
    public getRoleNode(): cc.Node {
        return (this.mUISystem as MainUISystem).getRoleNode();
    }
    public shakeWindow(): void {
        (this.mUISystem as MainUISystem).shakeWindow();
    }

    //Role-------------------------------
    /**获取当前角色的类型（总共有三种类型） */
    public getRoleType(): number {
        return this.mRole.getRoleType();
    }

    //PropSystem-------------------------
    /**掉落奖励 */
    public dropAward(pos: cc.Vec2, isMore: boolean = false): void {
        this.mPropSys.dropAward(pos, isMore);
    }
    public clearPowerPro(): void {
        this.mPropSys.clearPowerPro();
    }
    /**是否处于boss状态 */
    public isBossState(): boolean {
        return this.mEnemySys.isBossState();
    }

    //ParticleSystem----------------------
    /**
     * 获取角色id和子弹等级
     * #比如 角色id为1，子弹等级为1，则返回‘11’
     */
    public getRoleIDAndBtLv(): string {
        return this.mRole.getRoleIDAndBtLv();
    }

    //SpineEffSystem-----------------------
    /**
     * 播放spine爆炸特效
     * @param id 特效id, GlobalVar下定义的枚举
     */
    public playSpineExploed(id: number, pos: cc.Vec2): cc.Node {
        return this.mSpineEffSys.playSpExploed(id, pos);
    }
    /**播放激光特效 */
    public playSpLaser(pos: cc.Vec2): cc.Node {
        return this.mSpineEffSys.playSpLaser(pos);
    }

    public getNetSystem(): NetSystem {
        return this.mNetSys;
    }
    /**获取pk系统 */
    public getUISystem(): MainUISystem {
        return (this.mUISystem as MainUISystem);
    }
    public getPKSystem(): PKSystem {
        return this.mPKSys;
    }
    public getEnemySys(): EnemySys {
        return this.mEnemySys;
    }
    public getParticleSys(): ParticleSystem {
        return this.mParticleSys;
    }
    public getSpineEffSys(): SpineEffSystem {
        return this.mSpineEffSys;
    }
}
