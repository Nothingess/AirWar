import { ISystem } from "./ISystem";
import { ISceneFacade } from "../Scenes/ISceneFacade";
import { GoldEffect } from "../Others/GoldEffect";
import { Prop } from "../Others/Prop";

/**掉落道具管理器 */
export class PropSystem extends ISystem {

    private mCurPro: number = 0;
    private mMaxPro: number = 100;

    /**道具列表 */
    private mPropList: Array<number> = [1, 2, 3, 5, 6, 8, 9];
    public removeProp(id: number): void {
        if (this.mPropList.indexOf(id) < 0) return;

        this.mPropList.splice(this.mPropList.indexOf(id), 1);
    }

    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);
        this.onEvent();
    }

    private onEvent(): void {
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.removeProp, this.removeProp.bind(this), 'PropSystem');
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.eatPower, this.eatPower.bind(this), 'PropSystem');
    }
    private offEvent(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.removeProp, 'PropSystem');
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.eatPower, 'PropSystem');
    }

    private eatPower(): void {
        if (this.mCurPro >= this.mMaxPro) return;
        this.mCurPro += 2;
        this.updatePro();
    }
    public clearPowerPro(): void {
        this.mCurPro = 0;
        this.updatePro();
    }
    /**更新进度 */
    private updatePro(): void {
        //更新进度
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.updtePowerPro, this.mCurPro / this.mMaxPro);
    }

    public endSys(): void {
        super.endSys();
        this.offEvent();
    }

    /**生成道具的id，为-1则默认金币 */
    private getPropID(): number {
        let ran: number = Math.random();
        if (ran < .80) { return -1; }
        ran = Math.random();
        if (ran > .75) return GlobalVar.CONST.ENUM.BUFF_ID.up;
        else if (ran > .6) return GlobalVar.CONST.ENUM.BUFF_ID.laser;

        //let id: number = ;
        //console.log(id, this.mPropList[id]);
        return this.mPropList[Math.floor(Math.random() * this.mPropList.length)];
    }
    private createGold(pos: cc.Vec2, isDouble: boolean): void {
        let gold: cc.Node = GlobalVar.PoolMgr.get(GoldEffect.type);
        if (gold) {
            let goldEff: GoldEffect = gold.getComponent(GoldEffect);
            if (goldEff) { goldEff.init(pos, isDouble) }
        }
    }
    private createProp(pos: cc.Vec2, isDouble: boolean, id: number): void {
        let prop: cc.Node = GlobalVar.PoolMgr.get(Prop.type);
        if (prop) {
            let sc: Prop = prop.getComponent(Prop);
            if (sc) { sc.init(pos, isDouble, id) }
        }
    }
    /**
     * 爆一个道具 or 金币
     * @param pos 爆点
     */
    private createAward(pos: cc.Vec2, isDouble: boolean = false): void {
        let id: number = this.getPropID();
        if (id < 0) { this.createGold(pos, isDouble) }
        else { this.createProp(pos, isDouble, id) }
    }
    /**
     * 爆一堆道具 or 金币
     * @param dot 圆点
     */
    private createAwards(dot: cc.Vec2): void {
        let ranX: number, ranY: number, pos: cc.Vec2;

        for (let i = 0; i < 15; i++) {
            ranX = (Math.random() - .5) * 300;
            ranY = (Math.random() - .5) * 300;
            pos = cc.v2(dot.x + ranX, dot.y + ranY);
            this.createAward(pos, true);
        }
    }
    //-------------------------------
    /**掉落奖励 */
    public dropAward(pos: cc.Vec2, isMore: boolean = false): void {
        if (isMore) { this.createAwards(pos) }
        else { this.createAward(pos) }
    }

}
