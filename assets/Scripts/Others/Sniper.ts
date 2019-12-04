import { MinEnemy } from "../Systems/EnemySystem/MinEnemy";

const { ccclass } = cc._decorator;

@ccclass
export class Sniper extends cc.Component {
    public static type: string = 'Sniper';

    private mTarget: cc.Node = null;

    public sniper(target: cc.Node): void {
        this.mTarget = target;

        this.sniperAction();
    }
    private sniperAction(): void {
        this.node.scale = 10;
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(.2, 3),
                cc.fadeIn(.2)
            ),
            cc.rotateBy(.2, 60),
            cc.callFunc(() => {
                this.targetRecycle();
                this.recycle();
            })
        ))
    }

    update(dt): void {
        if (!this.mTarget) return;
        this.node.position = this.mTarget.position;
    }

    private targetRecycle(): void {
        if (!this.mTarget) return;
        let sc: MinEnemy = this.mTarget.getComponent(MinEnemy);
        if (sc) { sc.die() }
    }

    public recycle(): void {
        this.mTarget = null;

        GlobalVar.PoolMgr.put(Sniper.type, this.node);
    }



}
