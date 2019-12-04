import { ISystem } from "./ISystem";
import { ISceneFacade, MainFacade } from "../Scenes/ISceneFacade";
import { Particle } from "../Others/Particle";

/**粒子管理系统 */
export class ParticleSystem extends ISystem {

    private mDirList: Array<number> = null;             //基础角度
    private mBaseSpeed: number = 500;                   //基础速度
    private mCount: number = 10;                        //每发粒子数
    private mIndex: number = 0;
    private mUnit: number = Math.PI / 180;

    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);

        //初始化粒子池
        let effLayer: cc.Node = cc.find('Canvas/uiRoot/contentLayer/eff_layer');
        if (effLayer) {
            GlobalVar.PoolMgr.createNodePool(Particle.type, effLayer, GlobalVar.CONST.PARTICLE_PATH, 100);
        }

        this.mDirList = [90, 210, 330];
    }
    /**
     * 播放粒子特效
     * @param pos 位置
     * @param pet 是否宠物
     */
    public play(pos: cc.Vec2, pet?: string): void {
        let ang: number = 0;
        let dir: cc.Vec2 = cc.v2();
        let sp: number = 0;
        for (let i = 0; i < this.mCount; i++) {
            ang = this.mDirList[this.mIndex];
            ang += (Math.random() - .5) * 120;

            dir.x = Math.cos(ang * this.mUnit);
            dir.y = Math.sin(ang * this.mUnit);
            sp = Math.random() * 500 + this.mBaseSpeed;
            this.createPar(pos, dir.clone(), sp, pet);

            this.mIndex++;
            this.mIndex %= 3;
        }
    }
    /**
     * 创建粒子
     * @param pos 位置
     * @param dir 方向
     * @param sp 初速度
     */
    private createPar(pos: cc.Vec2, dir: cc.Vec2, sp: number, pet?: string): void {
        let typeId: string = pet || (this.mFacade as MainFacade).getRoleIDAndBtLv();
        let par: cc.Node = GlobalVar.PoolMgr.get(Particle.type);
        if (par) {
            par.setPosition(pos);
            let particle: Particle = par.getComponent(Particle);
            if (particle) {
                particle.play(dir, sp, typeId);
            }
        }
    }

}
