import { IBuff } from "../../../Others/IBuff";
import { RoleCtrl } from "./RoleCtrl";
import { IEnemy } from "../../EnemySystem/IEnemy";

const { ccclass } = cc._decorator;

@ccclass
export class RoleCollider extends cc.Component {

    //private mCollider: cc.CircleCollider = null;
    private mRoleCtrl: RoleCtrl = null;
    public setRole(role: RoleCtrl): void {
        this.mRoleCtrl = role;
        //this.mCollider = this.node.getComponent(cc.CircleCollider);
    }

    onCollisionEnter(other, self) {
        switch (other.tag) {
            case GlobalVar.CONST.ENUM.COLLIDER_ID.buff:
                this.eatBuff(other);
                break;
            case GlobalVar.CONST.ENUM.COLLIDER_ID.enemy:
                this.strikeEnemy(other);
                break;
            case GlobalVar.CONST.ENUM.COLLIDER_ID.boss:
                if (!this.mRoleCtrl.isInvincible()) {
                    this.mRoleCtrl.roleDie();
                }
                break;
            case GlobalVar.CONST.ENUM.COLLIDER_ID.eyBullet:
                this.strikeEyBullet(other);
                break;
        }
    }
    /**吃到buff */
    private eatBuff(other: cc.Collider): void {
        let buf: IBuff = other.node.getComponent(IBuff);
        this.mRoleCtrl.eatBuff(buf.getBuffID());
        if (buf) { buf.recycle() }
    }
    /**撞到敌机 */
    private strikeEnemy(other: cc.Collider): void {
        if (this.mRoleCtrl.isInvincible()) {
            let iEnemy: IEnemy = other.node.getComponent(IEnemy);
            if (iEnemy) { iEnemy.noAwardDie() }
        } else {//玩家死亡
            this.mRoleCtrl.roleDie();
        }
    }
    /**撞到 eyBullet(敌人子弹) */
    private strikeEyBullet(other: cc.Collider): void {
        if (!this.mRoleCtrl.isInvincible()) {//玩家死亡
            this.mRoleCtrl.roleDie();
        }
    }
}
