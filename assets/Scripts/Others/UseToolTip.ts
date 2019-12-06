import { UseToolTipMgr } from "../Systems/UISystem/IUISystem";
import { timingSafeEqual } from "crypto";

const { ccclass, property } = cc._decorator;

@ccclass
export class UseToolTip extends cc.Component {
    public static type: string = 'UseToolTip';

    @property(cc.Node)
    arrow: cc.Node = null;
    @property(cc.Sprite)
    bufSp: cc.Sprite = null;
    @property({ type: cc.Sprite, tooltip: "我方头像" })
    avatar_l: cc.Sprite = null;
    @property({ type: cc.Sprite, tooltip: "对方头像" })
    avatar_r: cc.Sprite = null;
    private mToolId: number = -1;
    private mIsLoadAvatar: boolean = false;

    private mUseToolTipMgr: UseToolTipMgr = null;

    /**
     * 
     * @param toolId 道具id（0：召唤精英怪，1：加速）
     */
    public init(toolId: number, tipMgr: UseToolTipMgr): void {
        this.mUseToolTipMgr = tipMgr;
        this.arrow.opacity = 0;
        this.bufSp.node.opacity = 255;

        this.arrow.position = this.bufSp.node.position = cc.v2(150, 0);
        this.arrow.runAction(cc.sequence(
            cc.spawn(
                cc.moveBy(.3, cc.v2(-150, 0)),
                cc.fadeIn(.3)
            ),
            cc.callFunc(() => {
                this.bufSp.node.runAction(cc.sequence(
                    cc.moveBy(2, cc.v2(-300, 0)),
                    cc.fadeOut(2),
                    cc.callFunc(() => { this.recycle() })
                ))
            })
        ))


        //load avatar
        if (!this.mIsLoadAvatar) {
            this.initAvatar();
            this.mIsLoadAvatar = true;
        }

        if (this.mToolId === toolId) return;
        this.mToolId = toolId;
        this.initSkin();
    }
    private initSkin(): void {
        let id: number = (this.mToolId === 0) ? 1 : 6;
        let han = GlobalVar.GetHandler((res) => {
            if (this.bufSp) {
                this.bufSp.spriteFrame = res;
            }
        }, this)

        GlobalVar.Loader.loadRes(`${GlobalVar.CONST.BUFF_SKINPATH_IMG}${id}`, han, cc.SpriteFrame);
    }
    private initAvatar(): void {
        this.setAvatar(this.avatar_l, GlobalVar.NetConfig.selfAvatar);
        this.setAvatar(this.avatar_r, GlobalVar.NetConfig.oppAvatar);
    }
    private setAvatar(sp: cc.Sprite, tex2d: cc.Texture2D): void {
        console.error(`头像精灵：${sp}, 路径：${tex2d}`);

        if (!sp || !tex2d) return;//其一为 null or undefined
        if (!!sp.spriteFrame) return;//已经加载过了
        let sf: cc.SpriteFrame = new cc.SpriteFrame(tex2d);
        sp.spriteFrame = sf;


        /*         console.error('开始加载头像-----------------------------------');
                
                let han = GlobalVar.GetHandler((tex2d: cc.Texture2D) => {
                    console.error('加载头像结束----------------------------------')
                    let sf: cc.SpriteFrame = new cc.SpriteFrame(tex2d);
                    sp.spriteFrame = sf;
                }, this);
        
                GlobalVar.Loader.loadExternalAsset(path, han); */
    }

    public recycle(): void {
        if (this.mUseToolTipMgr) { this.mUseToolTipMgr.removeTip(this) }
        GlobalVar.PoolMgr.put(UseToolTip.type, this.node);
    }
}
