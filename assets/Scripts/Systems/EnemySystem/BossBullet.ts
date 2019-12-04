import { EnemyBullet } from "../../Others/IBullet";

const { ccclass } = cc._decorator;
/**敌人子弹 */
@ccclass
export class BossBullet extends EnemyBullet {
    public static type: string = "BossBullet";

    private mIsRecycle: boolean = true;         //是否回收状态
    private mEyBulletID: number = -1;            //子弹id
    private mDir: cc.Vec2 = cc.v2();            //子弹移动的方向（包含速度）

    private onEvents(): void {
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.nextLevel,
            this.onNextLevel.bind(this),
            this.node.name
        )
    }
    private offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.nextLevel,
            this.node.name
        )
    }
    private onNextLevel(): void {
        if (this.mIsRecycle) return;
        this.recycle();
    }
    public start(): void {
        this.onEvents();
    }
    /**
     * 初始化子弹
     * @param eyBulletID boss id
     * @param dir 移动方向
     */
    public init(eyBulletID: number = 0, dir: cc.Vec2 = cc.v2(), speed: number = 600): void {
        this.mSpeed = speed;
        this.mDir = dir.mulSelf(this.mSpeed);
        this.mIsRecycle = false;

        /**初始子弹形态 */
        if (this.mEyBulletID == eyBulletID) return;
        this.mEyBulletID = eyBulletID;
        this.initSkin();
    }
    /**初始化子弹形态，根据bossId改变 */
    private initSkin(): void {
        //皮肤
        let spHan = GlobalVar.GetHandler((sf) => {
            this.sp.spriteFrame = sf;
        }, this)
        GlobalVar.Loader.loadRes(
            `${GlobalVar.CONST.UI_PATH.IMGS_PATH}${BossBullet.type}_${this.mEyBulletID + 1}`,
            spHan,
            cc.SpriteFrame
        )
        //子弹配置信息
        let configHan = GlobalVar.GetHandler((json) => {
            let cofig: {
                scale: number,
                radius: number,
                isRot: number
            } = json.json.eyBulletType[this.mEyBulletID];
            this.loadConfig(cofig);
        }, this)
        GlobalVar.Loader.loadRes(GlobalVar.CONST.BULLET_CONFIG, configHan, cc.JsonAsset);
    }
    private loadConfig(config: {
        scale: number,
        radius: number,
        isRot: number
    }): void {
        this.node.scale = config.scale;
        this.collider.radius = config.radius;
        if (config.isRot > 0) {
            this.rotate();
        }
    }
    protected move(dt): void {
        this.node.x += this.mDir.x * dt;
        this.node.y += this.mDir.y * dt;
    }
    private rotate(): void {
        this.node.runAction(cc.rotateBy(3, 360));
    }
    protected isRecycle(): boolean {
        if (this.node.y > GlobalVar.SysInfo.view.height + 50) return true;
        if (this.node.y < -50) return true;
        if (this.node.x < -50) return true;
        if (this.node.x > GlobalVar.SysInfo.view.width + 50) return true;
        return false;
    }
    public recycle(): void {
        this.mIsRecycle = true;
        this.node.stopAllActions();
        GlobalVar.PoolMgr.put(BossBullet.type, this.node);
    }

    onDestroy(): void {
        this.offEvents();
    }
}

