import { MainUISystem } from "../IUISystem";

/**能量槽管理 */
export class EnergyMgr {

    private mUISys: MainUISystem = null;            //持有uisys引用
    private mBar: cc.Sprite = null;
    private mVal: number = 0;
    private mIsWait: boolean = false;               //正在释放技能中

    constructor(uiSys: MainUISystem, barNode: cc.Node) {
        this.mUISys = uiSys;
        this.mBar = barNode.getComponent(cc.Sprite);
        this.mVal = 0;
    }

    /**增加能量 */
    private addEnergy(val: number): void {
        this.mVal += val;
        if (this.mVal >= 1) {
            //能量满了，通知角色释放技能
            
        }
    }

}
