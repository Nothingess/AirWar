
const { ccclass, property } = cc._decorator;

@ccclass
export class Particle extends cc.Component {
    public static type: "Particle";

    @property({ type: cc.Sprite, tooltip: "skin" })
    sp: cc.Sprite = null;

    private mTypeID: string = "";
    private mDir: cc.Vec2 = null;           //移动方向
    private mCurSpeed: number = 500;        //当前速度
    private mSpDamping: number = 4000;      //速度衰减值

    private mEnable: boolean = true;        //是否启用

    public play(dir: cc.Vec2, curSp: number, typeId: string): void {
        this.mEnable = true;
        this.mDir = dir;
        this.mCurSpeed = curSp;
        this.initSkin(typeId);

        this.node.stopAllActions();
        this.node.scale = 1;
        this.node.runAction(cc.scaleTo((this.mCurSpeed / this.mSpDamping), .2));
    }
    /**初始化外形 */
    private initSkin(typeId: string): void {
        if (this.mTypeID === typeId) return;
        this.mTypeID = typeId;
        let path: string = "particle_red";
        switch (this.mTypeID) {
            case "11":
            case "12":
            case "13":
            case "14":
            case "15":
            case "pet_blue"://蓝色宠物
                path = "particle_blue";
                break;
            case "21":
            case "22":
                path = "particle_cyan";
                break;
            case "23":
            case "24":
            case "pet_red"://红色宠物,子弹黄色
                path = "particle_yellow";
                break;
            case "25":
                path = "particle_red";
                break;
            case "31":
            case "32":
            case "33":
            case "34":
            case "35":
                path = "particle_violet";
                break;
            default:
                break;
        }

        let han = GlobalVar.GetHandler((res) => {
            this.sp.spriteFrame = res;
        }, this);

        GlobalVar.Loader.loadRes(`imgs/${path}`, han, cc.SpriteFrame);
    }

    update(dt): void {
        if (!this.mEnable) return;
        this.node.x += this.mDir.x * this.mCurSpeed * dt;
        this.node.y += this.mDir.y * this.mCurSpeed * dt;

        this.mCurSpeed -= this.mSpDamping * dt;
        if (this.isRecycle()) this.recycle();
    }

    private isRecycle(): boolean {
        return this.mCurSpeed < 0;
    }


    private recycle(): void {
        this.mEnable = false;
        GlobalVar.PoolMgr.put(Particle.type, this.node);
    }
}
