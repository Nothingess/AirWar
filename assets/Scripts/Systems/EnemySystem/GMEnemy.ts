import { IEnemy } from "./IEnemy";

const { ccclass } = cc._decorator;
/**导弹 */
@ccclass
export class GMEnemy extends IEnemy {
    //用于存放在对象池中的key
    public static type: string = "GMEnemy";

    private mSpeed: number = 700;

    public init(isAddSpeed: boolean = false): void {
        if (isAddSpeed) { this.mSpeed = 1200 }
        else { this.mSpeed = 700 }

        this.mIsDie = false;
    }

    /**导弹移动方式 */
    protected move(dt): void {
        this.node.y -= (this.mEnemySys.isShortAddSpeed() ? 1.5 : 1) * this.mSpeed * dt;
    }
    protected isRecycle(): boolean {
        return (this.node.y < -100);
    }
    protected beAttack(): void { }

    protected powerGranule(): void { }

    public die(): void {
        if (this.mEnemySys) {
            this.mEnemySys.playSpExploed(GlobalVar.CONST.ENUM.SPINE_EFFECT.die, this.node.position);
        }

        this.recycle();
    }
    public noAwardDie(): void {
        if (this.mIsDie) return;
        this.mIsDie = true;
        this.die();
    }
    protected onEvents(): void {
        GlobalVar.EventMgr.addEventListener(
            GlobalVar.CONST.EVENT.changeFlyState,
            this.changeFlyState.bind(this),
            this.node.name
        )
    }
    protected offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(
            GlobalVar.CONST.EVENT.changeFlyState,
            this.node.name
        )
    }

    private changeFlyState(isAddSpeed: boolean): void {
        if (this.mIsDie) return;
        if (isAddSpeed) {
            this.die();
        }
    }
    public recycle(): void {
        this.mIsDie = true;
        GlobalVar.PoolMgr.put(GMEnemy.type, this.node);
    }

    onCollisionEnter(other, self) {
        if (other.tag !== GlobalVar.CONST.ENUM.COLLIDER_ID.laserGun) return;
        this.die();
    }
}
