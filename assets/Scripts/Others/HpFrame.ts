const { ccclass, property } = cc._decorator;

@ccclass
export class HpFrame extends cc.Component {
    /**进度条 */
    public static type: string = "HpFrame";

    @property({ type: cc.Sprite, tooltip: "bar" })
    bar: cc.Sprite = null;

    public init(sc: { scaleX: number, scaleY: number } = { scaleX: 1, scaleY: 1 }): void {
        this.bar.fillRange = 1;
        this.node.scaleX = sc.scaleX;
        this.node.scaleY = sc.scaleY;
    }

    public updateBar(val: number): void {
        this.bar.fillRange = val;
    }
    public setPosition(pos: cc.Vec2): void {
        this.node.setPosition(pos);
    }

    public recycle(): void {
        GlobalVar.PoolMgr.put(HpFrame.type, this.node);
    }

}
