import { ISystem } from "../ISystem";
import { ISceneFacade, MainFacade } from "../../Scenes/ISceneFacade";
import { IPet, FlameDragon, GoldDragon, IceDragon, ThunderDragon } from "./IPet";

/**玩家属性 */
class RoleAttr {
    protected mPyAttInterval: number = .08;     //攻击间隔（频率）
    protected mPetAttInterval: number = 0.12;   //宠物攻击间隔（频率）
    protected mPyAtk: number = 30;              //玩家角色攻击伤害
    protected mPetAtk: number = 10;             //宠物攻击伤害
    protected mBulletLv: number = 1;            //子弹等级
    protected mScore: number = 0;               //分数

    public getPyAttInterval(): number {
        return this.mPyAttInterval;
    }
    public getPetAttInterval(): number {
        return this.mPetAttInterval;
    }
    public getPyAtk(): number {
        return this.mPyAtk;
    }
    public getPetAtk(): number {
        return this.mPetAtk;
    }
    public getBulletLv(): number {
        return this.mBulletLv;
    }
    public upBulletLv(): void {
        this.mBulletLv = (this.mBulletLv + 1) > 5 ? 5 : (this.mBulletLv + 1);
    }
    public eatScore(val: number): number {
        this.mScore += val;
        return this.mScore;
    }
}

export class IRole extends ISystem {

    protected mRoleAttr: RoleAttr = null;
    protected mName: string = "";
    protected mRoleID: number = 3;
    public getRoleType(): number { return this.mRoleID; }
    /**
     * 获取角色id和子弹等级
     * #比如 角色id为1，子弹等级为1，则返回‘11’
     */
    public getRoleIDAndBtLv(): string {
        return `${this.mRoleID}${this.mRoleAttr.getBulletLv()}`;
    }

    protected mPyInterval: number = 0;
    protected mPetInterval: number = 0;
    protected mIsDie: boolean = false;

    protected mPetList: Array<IPet> = null;

    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);

        this.mRoleAttr = new RoleAttr();
        this.mPetList = new Array<IPet>();
        this.mPyInterval = this.mRoleAttr.getPyAttInterval();
        this.mPetInterval = this.mRoleAttr.getPetAttInterval();
        this.onEvents();
    }

    /**注册监听事件 */
    private onEvents(): void {
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.changeBulletLv,
            this.upBulletLv.bind(this),
            "IRole"
        )
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.getPet,
            this.getPet.bind(this),
            "IRole"
        )
    }
    private offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.changeBulletLv,
            "IRole"
        )
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.getPet,
            "IRole"
        )
    }
    private upBulletLv(): void {
        this.mRoleAttr.upBulletLv();
    }
    /**获取宠物 */
    private getPet(id: number): void {
        if (this.mPetList.length == 2) return;
        let pet: IPet = null;
        switch (id) {
            case GlobalVar.CONST.ENUM.PET_TYPE.flame:
                pet = new FlameDragon();
                break;
            case GlobalVar.CONST.ENUM.PET_TYPE.gold:
                pet = new GoldDragon();
                break;
            case GlobalVar.CONST.ENUM.PET_TYPE.ice:
                pet = new IceDragon();
                break;
            case GlobalVar.CONST.ENUM.PET_TYPE.thunder:
                pet = new ThunderDragon();
                break;
        }

        this.mPetList.push(pet);
    }

    rendererUpdate(dt): void {
        if (this.mIsDie) return;

        this.pyFire(dt);
        this.PetFire(dt);
    }
    /**角色攻击 */
    private pyFire(dt): void {
        this.mPyInterval -= dt;
        if (this.mPyInterval < 0) {
            this.mPyInterval = this.mRoleAttr.getPyAttInterval();
            GlobalVar.EventMgr.dispatchEvent(
                GlobalVar.CONST.EVENT.pyFire,
                { id: this.mRoleID, lv: this.mRoleAttr.getBulletLv(), atk: this.mRoleAttr.getPyAtk() }
            );
        }
    }
    /**宠物攻击，两个宠物攻击频率同步 */
    private PetFire(dt): void {
        if (this.mPetList.length <= 0) return;
        this.mPetInterval -= dt;
        if (this.mPetInterval <= 0) {
            this.mPetInterval = this.mRoleAttr.getPetAttInterval();
            GlobalVar.EventMgr.dispatchEvent(
                GlobalVar.CONST.EVENT.petFire,
                this.mRoleAttr.getPetAtk()
            );
        }
    }

    public endSys(): void {
        this.offEvents();
    }
}
/**法师 */
export class MageMin extends IRole {

    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);
        this.mName = "法师";
        this.mRoleID = GlobalVar.CONST.ENUM.ROLE_TYPE.MAGE;
    }
}
/**机甲 */
export class MechaMin extends IRole {
    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);
        this.mName = "机甲";
        this.mRoleID = GlobalVar.CONST.ENUM.ROLE_TYPE.MECHA;
    }
}
/**精灵 */
export class ElfMin extends IRole {
    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);
        this.mName = "精灵";
        this.mRoleID = GlobalVar.CONST.ENUM.ROLE_TYPE.ELF;
    }
}
