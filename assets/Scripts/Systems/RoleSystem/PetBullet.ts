import { PlayerBullet } from "../../Others/IBullet";

const { ccclass } = cc._decorator;

@ccclass
export class PetBullet extends PlayerBullet {

    public static type: string = 'petBullet';
    private mPetID: number = 1;
    /**获取子弹颜色类型 */
    public getTypeId(): string {
        if (this.mPetID === 1) return 'pet_red';
        return 'pet_blue';
    }
    public isPetBt(): boolean { return true; }
    public init(atk: number = 25, id: number = 1, speed: number = 2000): void {
        this.mATK = atk;
        this.mSpeed = speed;

        if (this.mPetID == id) return;
        this.mPetID = id;
        this.initSkin();
    }
    /**初始化皮肤 */
    private initSkin(): void {
        let han = GlobalVar.GetHandler((sf) => {
            if (this.sp) {
                this.sp.spriteFrame = sf;
            }
        }, this)

        GlobalVar.Loader.loadRes(`${GlobalVar.CONST.PET_BT_IMG}${this.mPetID}`, han, cc.SpriteFrame);
    }

    public recycle(): void {
        GlobalVar.PoolMgr.put(PetBullet.type, this.node);
    }
}
