import { PlayerBullet } from "../../Others/IBullet";

const { ccclass } = cc._decorator;

@ccclass
export class PySwordkee extends PlayerBullet {
    public static type: string = 'PySwordkee';

    private mDirection: cc.Vec2 = null;             //移动方向

    public init(rad: number = 0): void {
        /*         let radUnit: number = Math.PI / 180;
                let rad: number = 40 * radUnit + Math.random() * radUnit * 100; */
        this.mDirection = cc.v2(Math.cos(rad), Math.sin(rad));

        this.node.angle = -GlobalVar.VectorsToDegress(this.mDirection);

        this.node.stopAllActions();
        this.node.scale = 1.5;
        this.node.opacity = 100;
        this.node.runAction(
            cc.spawn(
                cc.scaleTo(.1, 2.5),
                cc.fadeIn(.1)
            )
        )
    }

    update(dt): void {
        this.move(dt);
        if (this.isRecycle()) {
            this.recycle(false);
        }
    }

    protected move(dt): void {
        this.node.x += this.mDirection.x * this.mSpeed * dt;
        this.node.y += this.mDirection.y * this.mSpeed * dt;
    }
    protected isRecycle(): boolean {
        if (this.node.y > GlobalVar.SysInfo.view.height + 80) return true;
        if (this.node.x < -100) return true;
        if (this.node.x > 850) return true;
        return false;
    }
    public isHaveEff(): boolean {
        return false;
    }
    /**
     * 回收
     * @param isOutside 在外部调用（指可以穿透敌人继续向前）
     */
    public recycle(isOutside: boolean = true): void {
        if (isOutside) return;
        GlobalVar.PoolMgr.put(PySwordkee.type, this.node);
    }
}
