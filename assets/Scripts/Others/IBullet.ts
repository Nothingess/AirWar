
const { ccclass, property } = cc._decorator;
/**子弹基类 */
@ccclass
export class IBullet extends cc.Component {

    @property({ type: cc.Sprite, tooltip: "皮肤" })
    sp: cc.Sprite = null;
    @property({ type: cc.CircleCollider, tooltip: "碰撞包围盒" })
    collider: cc.CircleCollider = null;

    protected mSpeed: number = 2000;

    public init(): void {

    }

    update(dt): void {
        this.move(dt);
        if (this.isRecycle()) {
            this.recycle();
        }
    }
    /**移动 */
    protected move(dt): void {
        this.node.y += this.mSpeed * dt;
    }
    /**判断是否需要回收子弹 */
    protected isRecycle(): boolean {
        return (this.node.y > GlobalVar.SysInfo.view.height + 50);
    }
    /**回收子弹 */
    public recycle(): void {

    }
}
/**玩家阵营子弹 */
export class PlayerBullet extends IBullet {
    protected mATK: number = 30;
    /**获取子弹攻击力 */
    public getATK(): number { return this.mATK }
    /**是否需要粒子（效果）爆出 */
    public isHaveEff(): boolean {
        return true;
    }
    /**是否宠物子弹 */
    public isPetBt(): boolean {
        return false;
    }

}
/**敌人阵营子弹 */
export class EnemyBullet extends IBullet {

}
