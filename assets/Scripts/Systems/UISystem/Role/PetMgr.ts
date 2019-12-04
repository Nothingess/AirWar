import { PetCtrl } from "./PetCtrl";

export class PetMgr {

    private mTarget: cc.Node = null;                    //追踪目标
    private mPetVecs: Array<cc.Vec2> = null;            //宠物位置（左右）
    private mPetCtrls: Map<number, PetCtrl> = null;           //宠物列表

    constructor(target: cc.Node) {
        this.mTarget = target;
        this.mPetCtrls = new Map<number, PetCtrl>();
        this.mPetVecs = [
            cc.v2(-150, -45),
            cc.v2(150, -45)
        ]
    }


    public createPet(id: number): void {//创建宠物
        if (this.mPetCtrls.size >= 2) return;
        if (this.mPetCtrls.get(id)) return;
        let han = GlobalVar.GetHandler((node) => {
            node.parent = this.mTarget.parent;
            node.setPosition(this.mTarget.getPosition());
            let petCtrl: PetCtrl = node.getComponent(PetCtrl);
            if (petCtrl) {
                this.mPetCtrls.set(id, petCtrl);
                petCtrl.init(this.mTarget, id, this.mPetVecs[this.mPetCtrls.size - 1])
            }
        }, this)

        GlobalVar.Loader.loadPrefabObj(GlobalVar.CONST.PET_SKINPATH, han);
    }
    /**宠物开火 */
    public fire(atk: number): void {
        this.mPetCtrls.forEach(e => {
            e.fire(atk);
        })
    }

    /**获取宠物身上的额外伤害（百分比） */
    public getAdditionalAtk(): number {
        if (this.mPetCtrls.get(GlobalVar.CONST.ENUM.PET_TYPE.flame)) {
            return 1.2;     //加百分之20的伤害
        }
        return 1;
    }
}
