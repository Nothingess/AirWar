import { PlayerBullet } from "../../Others/IBullet";

const { ccclass } = cc._decorator;

@ccclass
export class PyBullet extends PlayerBullet {
    public static type: string = 'pyBullet';

    private mCurLv: number = -1;

    /**初始化子弹 */
    init(args: { id: number, lv: number, atk: number } = { id: 1, lv: 1, atk: 30 }, speed: number = 2000): void {
        if (args.lv == this.mCurLv) return;
        //TODO 根据等级切换皮肤
        this.mCurLv = args.lv;
        this.mATK = args.atk;
        this.mSpeed = speed;

        //加载子弹皮肤
        let han = GlobalVar.GetHandler((sf) => {
            this.sp.spriteFrame = sf;
        }, this)
        GlobalVar.Loader.loadRes(
            `${GlobalVar.CONST.BULLET_SKINPATH_IMG}${args.id}${args.lv}`,
            han,
            cc.SpriteFrame
        )
        //设置子弹配置信息
        let hanCb = GlobalVar.GetHandler((json) => {
            let config: {
                wid: number,
                hei: number,
                radius: number,
                offsetX: number,
                offsetY: number
            } = json.json.bulletConfig[args.id - 1].type[args.lv - 1];
            this.setFacade(config);
        }, this)
        GlobalVar.Loader.loadRes(GlobalVar.CONST.BULLET_CONFIG, hanCb, cc.JsonAsset);
    }
    /**根据配置信息设置子弹外观 */
    private setFacade(config: { wid: number, hei: number, radius: number, offsetX: number, offsetY: number }): void {
        this.node.setContentSize(cc.size(config.wid * 2, config.hei * 2));
        this.collider.radius = config.radius;
        //this.collider.offset = cc.v2(config.offsetX, config.offsetY);
    }

    /**回收子弹 */
    public recycle(): void {
        GlobalVar.PoolMgr.put(PyBullet.type, this.node);
    }
}
