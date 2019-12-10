import { ISystem } from "../ISystem";
import { PanelMgr } from "./PanelMgr";
import { IUIBase, LoadPanel } from "./IUIBase";
import { ISceneFacade, MainFacade } from "../../Scenes/ISceneFacade";
import { MainScene } from "../../Scenes/ISceneState";
import { RoleCtrl } from "./Role/RoleCtrl";
import { GoldEffect } from "../../Others/GoldEffect";
import { BgCtrl } from "../../Others/BgCtrl";
import { Shake } from "../../Comms/Shake";
import { Prop } from "../../Others/Prop";
import { NetSystem } from "../NetSystem";
import { ScoreTip } from "./ScoreTip";
import { UseToolTip } from "../../Others/UseToolTip";
import { UseToolAction } from "../../Others/UseToolAction";

export class IUISystem extends ISystem {
    protected mPanelMgr: PanelMgr = null;             //面板管理器
    protected mUIRoot: cc.Node = null;                //ui根节点

    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);
        this.mUIRoot = cc.find(GlobalVar.CONST.UI_PATH.UI_ROOT_PATH);
        if (this.mUIRoot == null) return;

        this.mPanelMgr = new PanelMgr();
        this.mPanelMgr.initSys(this.mUIRoot);

        this.initComponents();
        this.onEvent();
    }

    protected initComponents(): void {

    }

    //#region 事件
    protected onEvent(): void {
    }
    protected offEvent(): void {
    }

    //#endregion

    public waitOpenPanel<T extends IUIBase>(panelType: new () => T, name: string, args?: any[]): void {
        this.mPanelMgr.waitOpenPanel(panelType, name, args);
    }
    public openPanel<T extends IUIBase>(panelType: new () => T, name: string, args?: any[]): void {
        this.mPanelMgr.openPanel(panelType, name, args);
    }
    public closePanel(name: string): void {
        this.mPanelMgr.closePanel(name);
    }

    public endSys(): void {
        super.endSys();
        this.offEvent();
    }
}

export class LoadUISystem extends IUISystem {
    protected initComponents(): void {
        if (this.mUIRoot == null) return;
        super.initComponents();

        this.openPanel(LoadPanel, "LoadPanel");
        this.mFacade.setState(MainScene);
    }
}
export class MainUISystem extends IUISystem {

    private mRoleCtrl: RoleCtrl = null;             //玩家控制器
    private mBgCtrl: BgCtrl = null;                 //背景控制器
    //private mUseToolTipMgr: UseToolTipMgr = null;   //pk使用道具提示管理
    //private mPropMgr: PropMgr = null;               //道具管理器

    //--------------组件、节点
    private mCamera: cc.Node = null;                //摄像机
    private mPowerPro: cc.Node = null;              //能量槽
    private mPowerTip: cc.Node = null;              //能量槽提示
    private mPowerMaxWid: number = 218;             //能量槽最大宽度
    private mPowerMinWid: number = 14;              //能量槽最小宽度

    private mSelfScoreLa: cc.Label = null;          //自身分数label
    private mOppScoreLa: cc.Label = null;           //对方分数label
    private mCountDownLa: cc.Label = null;          //倒计时

    //net tip
    private mNetTip: cc.Node = null;            //网络提示
    private mCountDown: cc.Label = null;        //倒计时
    private mCurTimer = null;                   //当前存在的倒计时计时器


    //test btn
    private mTest: cc.Node = null;
    protected initComponents(): void {
        if (this.mUIRoot == null) return;
        super.initComponents();

        this.initPool();

        this.mCamera = cc.find('Canvas/Main Camera');
        this.mPowerPro = cc.find('viewLayer/energy/e_bar', this.mUIRoot);
        this.mPowerTip = cc.find('viewLayer/energy/power_tip', this.mUIRoot);
        this.mSelfScoreLa = cc.find('viewLayer/top_area/score_self', this.mUIRoot).getComponent(cc.Label);
        this.mOppScoreLa = cc.find('viewLayer/top_area/score_oppoent', this.mUIRoot).getComponent(cc.Label);
        this.mCountDownLa = cc.find('viewLayer/top_area/count_down', this.mUIRoot).getComponent(cc.Label);
        this.mNetTip = cc.find('topLayer/netTip', this.mUIRoot);
        this.mCountDown = cc.find('topLayer/countDownLa', this.mUIRoot).getComponent(cc.Label);
        this.initProTip();

        this.mBgCtrl = new BgCtrl(cc.find("contentLayer/bgCtrl", this.mUIRoot));
        //this.mUseToolTipMgr = new UseToolTipMgr();
        //this.mPropMgr = new PropMgr();

        //test------------------
        this.mTest = cc.find('viewLayer/btn', this.mUIRoot);
    }
    private initPool(): void {
        let effLayer: cc.Node = cc.find('contentLayer/eff_layer', this.mUIRoot);
        let goldLayer: cc.Node = cc.find('contentLayer/gold_layer', this.mUIRoot);
        let tipLayer: cc.Node = cc.find('tipLayer', this.mUIRoot);
        let topLayer: cc.Node = cc.find('topLayer', this.mUIRoot);
        let alertLayer: cc.Node = cc.find('alertLayer', this.mUIRoot);
        if (!effLayer) return
        GlobalVar.PoolMgr.createNodePool(
            GoldEffect.type,
            goldLayer,
            GlobalVar.CONST.GOLD_PATH,
            20
        );
        GlobalVar.PoolMgr.createNodePool(
            Prop.type,
            effLayer,
            GlobalVar.CONST.BUFF_PRE_PATH,
            3
        );
        GlobalVar.PoolMgr.createNodePool(
            ScoreTip.type,
            tipLayer,
            GlobalVar.CONST.SOCRE_TIP_PATH
        );
/*         GlobalVar.PoolMgr.createNodePool(
            UseToolTip.type,
            topLayer,
            GlobalVar.CONST.USE_TOOL_TIP_PATH,
            2
        ); */
        GlobalVar.PoolMgr.createNodePool(
            UseToolAction.type,
            topLayer,
            GlobalVar.CONST.USE_TOOL_ACTION_PATH,
            2
        )
        GlobalVar.PoolMgr.createNodePool(
            PropMgr.type,
            alertLayer,
            GlobalVar.CONST.PROP_ITEM_PAHT,
            5
        )
    }
    /**创建角色 */
    public createRole(): void {
        this.mRoleCtrl = new RoleCtrl(this.mUIRoot, this.getRoleType(), this);
    }

    public rendererUpdate(dt): void {
        if (this.mRoleCtrl !== null) { this.mRoleCtrl.rendererUpdate(dt); }
        this.mBgCtrl.rendererUpdate(dt);
    }
    public logicUpdate(dt): void {
        if (this.mRoleCtrl !== null) {
            this.mRoleCtrl.logicUpdate(dt);
        }
        this.mBgCtrl.logicUpdate(dt);
        //this.mUseToolTipMgr.update(dt);
        //this.mPropMgr.update(dt);
    }
    public endSys(): void {
        if (this.mRoleCtrl !== null) {
            this.mRoleCtrl.endSys();
        }
        this.mBgCtrl.end();
        //this.mUseToolTipMgr.end();
        //this.mPropMgr.end();
    }

    protected onEvent(): void {
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.updtePowerPro,
            this.updatePowerPro.bind(this),
            'IUISystem'
        );
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.openPanel,
            this.onOpenPanel.bind(this),
            'IUISystem'
        )


        this.mTest.on('touchend', () => {
            GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.testUseTool, 2)
        }, this)
    }
    protected offEvent(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.updtePowerPro,
            'IUISystem'
        );
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.openPanel,
            'IUISystem'
        )
    }
    private onOpenPanel(obj: { type: any, name: string, args: [] }): void {
        this.openPanel(obj.type, obj.name, obj.args);
    }
    /**分数飘字效果 */
    public openLocalTip(str: string): void {
        let node: cc.Node = GlobalVar.PoolMgr.get(ScoreTip.type);
        if (node) {
            let scoreTip: ScoreTip = node.getComponent(ScoreTip);
            if (scoreTip) {
                scoreTip.play(this.mSelfScoreLa.node.parent.position.add(cc.v2(
                    this.mSelfScoreLa.node.x, 55)), str)
            }
        }
    }
    private updatePowerPro(val: number): void {
        if (this.mPowerPro) {
            this.mPowerPro.width = (this.mPowerMaxWid - this.mPowerMinWid) * val + this.mPowerMinWid;

            if (val == 0) { this.hideProTip() }
            if (val == 1) { this.showProTip() }
        }
    }
    private initProTip(): void {
        if (!this.mPowerTip) return;
        this.mPowerTip.runAction(cc.repeatForever(cc.sequence(
            cc.spawn(
                cc.scaleTo(1, 3, 3),
                cc.fadeOut(1)
            ),
            cc.callFunc(() => {
                this.mPowerTip.scale = 1;
                this.mPowerTip.opacity = 255;
            })
        )))

        this.mPowerTip.active = false;
    }
    private showProTip(): void {
        if (!this.mPowerTip) return;
        this.mPowerTip.active = true;
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.releaseSkills, this.clearPowerPro.bind(this))
    }
    private hideProTip(): void {
        if (!this.mPowerTip) return;
        this.mPowerTip.active = false;
    }
    private clearPowerPro(): void {
        (this.mFacade as MainFacade).clearPowerPro();
    }


    //-----------提供对外接口
    /**获取当前玩家的位置 */
    public getRolePos(): cc.Vec2 {
        if (this.getRoleNode() == null) { return cc.v2(375, 150); };
        return this.getRoleNode().getPosition();
    }
    /**获取当前玩家节点（用做敌人目标） */
    public getRoleNode(): cc.Node {
        if (this.mRoleCtrl !== null) return this.mRoleCtrl.getRoleNode()
        return null;
    }
    /**屏幕震动 */
    public shakeWindow(): void {
        this.mCamera.stopAllActions();
        this.mCamera.runAction(cc.sequence(Shake.create(.5, 8, 8), cc.callFunc(() => { this.mCamera.position = cc.v2(); })))
    }
    /**激光震屏 */
    public LaserGunShakeWindow(): void {
        this.mCamera.stopAllActions();
        this.mCamera.runAction(
            cc.sequence(
                Shake.create(.5, 3, 3),
                Shake.create(3, 8, 8),
                cc.callFunc(() => { this.mCamera.position = cc.v2(); })
            )
        )
    }
    /**停止震屏 */
    public stopShakeWindow(): void {
        this.mCamera.stopAllActions();
        this.mCamera.position = cc.v2();
    }
    //Facade
    /**获取角色类型 */
    public getRoleType(): number {
        return (this.mFacade as MainFacade).getRoleType();
    }
    /**是否处于boss状态 */
    public isBossState(): boolean {
        return (this.mFacade as MainFacade).isBossState();
    }

    /**
     * 播放spine爆炸特效
     * @param id 特效id, GlobalVar下定义的枚举
     */
    public playSpExploed(id: number, pos: cc.Vec2): cc.Node {
        return (this.mFacade as MainFacade).playSpineExploed(id, pos);
    }
    /**播放激光特效 */
    public playSpLaser(pos: cc.Vec2): cc.Node {
        return (this.mFacade as MainFacade).playSpLaser(pos);
    }
    /**
     * 更新分数面板
     * @param id 玩家id （自己：id = 0；对方：id = 1）
     * @param scoreVal 分数值
     */
    public updateScoreUI(id: number, scoreVal: number): void {
        switch (id) {
            case 0:
                if (this.mSelfScoreLa) { this.mSelfScoreLa.string = scoreVal.toString(); }
                break;
            case 1:
                if (this.mOppScoreLa) { this.mOppScoreLa.string = scoreVal.toString(); }
                break;
            default:
                break;
        }
    }
    /**更新倒计时ui */
    public updateCountDown(timer: number): void {
        if (this.mCountDownLa) {
            this.mCountDownLa.string = timer.toString();
        }
    }
    /**对方使用道具的提示 */
    public playUseToolTip(id: number): void {
        //if (this.mUseToolTipMgr) {
            //this.mUseToolTipMgr.playTip(id);
        //}
    }
    /**我方使用道具的提示 */
    public playUseToolAction(id: number, pos: cc.Vec2): void {
        let node: cc.Node = GlobalVar.PoolMgr.get(UseToolAction.type);
        if (node) {
            node.position = pos;
            let sc: UseToolAction = node.getComponent(UseToolAction);
            if (sc) {
                sc.init(id);
            }
        }
    }
    /**获取道具 */
    public getProp(id: number): void {
        //if (this.mPropMgr) {
        //    this.mPropMgr.addItem(id);
        //}
    }

    public getNetSystem(): NetSystem {
        return (this.mFacade as MainFacade).getNetSystem();
    }




    ///net tip
    /**
     * 显示网络提示
     * @param code 0:重连，1断线
     */
    public netShow(code: number): void {
        let path: string = `${
            (code === 0) ?
                GlobalVar.CONST.Language_PATH.reconnect : GlobalVar.CONST.Language_PATH.offLine
            }${GlobalVar.NetConfig.language}`;

        let han = GlobalVar.GetHandler((sf) => {
            if (this.mNetTip) {
                this.mNetTip.getChildByName('sp').getComponent(cc.Sprite).spriteFrame = sf;
            }
        }, this)

        GlobalVar.Loader.loadRes(path, han, cc.SpriteFrame);

        this.mNetTip.stopAllActions();
        if (this.mNetTip) {
            this.mNetTip.runAction(cc.repeatForever(
                cc.sequence(
                    cc.fadeIn(2),
                    cc.delayTime(1),
                    cc.fadeOut(2)
                )
            ))
        }

    }
    public netHide(): void {
        if (this.mNetTip) {
            this.mNetTip.opacity = 0;
        }
    }
    /**
     * 播放倒计时
     * @param timer 倒计时
     */
    public startCountDown(timer: number = 3): void {
        if (GlobalVar.NetConfig.isGameOver) return;
        if (this.mCurTimer !== null) {
            clearInterval(this.mCurTimer);
        }
        this.mCurTimer = setInterval(() => {
            this.playCountDownVal(timer);
            timer--;
            if (timer < 0) {
                clearInterval(this.mCurTimer);
                this.mCurTimer = null;
                if (this.mCountDown) { this.mCountDown.string = '' }
            }
        }, 1000)

    }
    private playCountDownVal(val: number): void {
        if (!this.mCountDown) return;
        this.mCountDown.string = `${val}`;
        this.mCountDown.node.scale = 5;
        this.mCountDown.node.opacity = 0;
        this.mCountDown.node.runAction(cc.spawn(
            cc.scaleTo(.3, 1),
            cc.fadeIn(.3)
        ))
    }
}

export class UseToolTipMgr {

    private mTopVec: cc.Vec2 = null;    //列表顶部位置
    private mSpaceY: number = 80;      //每个item直接的间隙

    private mTipList: Array<UseToolTip> = null;

    constructor() {
        this.mTopVec = cc.v2(GlobalVar.SysInfo.view.width * .5,
            GlobalVar.SysInfo.view.height * .7);
        this.mTipList = [];
    }
    /**
     * 对方对我使用道具
     * @param toolId 道具id（0：召唤精英怪，1：加速）
     */
    public playTip(toolId: number): void {
        let node: cc.Node = GlobalVar.PoolMgr.get(UseToolTip.type);
        if (node) {
            node.position = cc.v2(this.mTopVec.x,
                this.mTopVec.y - this.mTipList.length * this.mSpaceY);
            let sc: UseToolTip = node.getComponent(UseToolTip);
            if (sc) { sc.init(toolId, this) }
            this.mTipList.push(sc);
        }
    }
    public removeTip(useToolTip: UseToolTip): void {
        let index: number = this.mTipList.indexOf(useToolTip)
        if (index >= 0) {
            this.mTipList.splice(index, 1);
        }
    }

    public update(dt): void {
        if (this.mTipList.length <= 0) return;
        let index: number = 0;
        let tagetY: number = 0;
        let offsetY: number = 0;
        this.mTipList.forEach(e => {
            tagetY = this.mTopVec.y - index * this.mSpaceY;
            offsetY = tagetY - e.node.y
            if (offsetY > 1) {
                e.node.y += offsetY * .2;
            }
            index++;
        })
    }
    public end(): void {

    }
}

interface Item {
    id: number,
    node: cc.Node,
    RemainingTime: number
}
/**吃到的道具管理系统 */
export class PropMgr {
    public static type: string = 'PropItem';

    private mRoot: cc.Vec2 = null;                  //根位置
    private mItemWidth: number = 50;                //item 宽度
    private mSpaceY: number = 10;                    //Y轴方向间隙
    private mItemTimer: number = 5;                 //item 存在时间
    private mItemList: Map<number, Item> = null;

    constructor() {
        this.init();
    }

    private init(): void {
        this.mItemWidth = 50;
        this.mSpaceY = 20;
        this.mRoot = cc.v2(this.mItemWidth, GlobalVar.SysInfo.view.height * .35);
        this.mItemList = new Map<number, Item>();
    }
    public update(dt): void {
        if (this.mItemList.size <= 0) return;

        let count = 0;
        let targetY = 0;
        let offsetY = 0;
        this.mItemList.forEach((v, k) => {
            targetY = this.mRoot.y + (this.mItemList.size - count - 1) * (this.mItemWidth + this.mSpaceY);
            offsetY = targetY - v.node.y;
            if (offsetY > 1) {
                v.node.y += offsetY * .1;
            }
            this.checkRemove(v, dt);
            count++;
        })
    }
    public end(): void { }


    //operation
    public addItem(id: number): void {
        if (this.mItemList.get(id)) return;
        console.log('get item--------------------')
        let han = GlobalVar.GetHandler((sf: cc.SpriteFrame) => {
            let node: cc.Node = GlobalVar.PoolMgr.get(PropMgr.type);
            if (node) {
                node.setPosition(this.mRoot);
                node.scale = 0;
                node.getComponent(cc.Sprite).spriteFrame = sf;
                node.runAction(cc.scaleTo(.2, 1.5));
                this.mItemList.set(id, { id: id, node: node, RemainingTime: this.mItemTimer })
            }
        }, this)

        GlobalVar.Loader.loadRes(`${GlobalVar.CONST.BUFF_SKINPATH_IMG}${id}`, han, cc.SpriteFrame);
    }
    private checkRemove(item: Item, dt: number): void {
        item.RemainingTime -= dt;
        if (item.RemainingTime <= 0) {
            this.removeItem(item);
        }
    }
    private removeItem(item: Item): void {
        let node: cc.Node = item.node;
        node.runAction(cc.sequence(
            cc.scaleTo(.2, 0),
            cc.callFunc(() => { GlobalVar.PoolMgr.put(PropMgr.type, node) })
        ));
        this.mItemList.delete(item.id);
    }
}
