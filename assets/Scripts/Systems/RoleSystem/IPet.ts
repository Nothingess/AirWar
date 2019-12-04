/**宠物 */
export class IPet {

    protected mName: string = "";                   //名字
    protected mID: number = 1;                      //宠物id
    protected mDescribe: string = "";               //描述

    protected mAttInterval: number = .2;            //攻击频率
    protected mDamage: number = 10;                 //攻击力

    public init(): void {

    }
    public rendererUpdate(dt): void {

    }
    public endSys(): void {

    }
}
/**烈焰龙 */
export class FlameDragon extends IPet {
    constructor() {
        super();

        this.mName = "火焰龙";
        this.mID = 1;
    }
}
/**黄金龙 */
export class GoldDragon extends IPet { }
/**冰原龙 */
export class IceDragon extends IPet { }
/**雷电龙 */
export class ThunderDragon extends IPet { }