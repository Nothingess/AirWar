import { GMEnemy } from "../Systems/EnemySystem/GMEnemy";
import { EnemySys } from "../Systems/EnemySystem/EnemySys";

const { ccclass, property } = cc._decorator;
/**导弹线 */
@ccclass
export class MissileLine extends cc.Component {

    public static type: string = 'MissileLine';

    @property({ type: cc.Node, tooltip: 'line' })
    line: cc.Node = null;
    @property({ type: cc.Node, tooltip: 'head' })
    head: cc.Node = null;

    private mEnemySys: EnemySys = null;         //敌人系统
    private mTargetNode: cc.Node = null;        //目标节点
    private mBorder: number = 100;              //导弹边界
    private mDir: number = 0;                   //移动方向
    private mMoveSpeed: number = 30;            //移动速度
    private mMoveLength: number = 0;            //移动距离
    private mStartPosX: number = 0;             //初始位置

    private mIsAddSpeed: boolean = false;       //是否加速

    public init(eySys: EnemySys, target: cc.Node, isAddSpeed?: boolean): void {
        this.mEnemySys = eySys;
        this.mMoveLength = 0;
        this.mStartPosX = this.node.x;

        this.mTargetNode = target;
        this.mIsAddSpeed = !!isAddSpeed;

        this.prepare();
    }
    /**准备阶段 */
    private prepare(): void {
        this.node.stopAllActions();
        this.head.stopAllActions();
        this.line.stopAllActions();
        this.node.y = GlobalVar.SysInfo.view.height * .85;
        this.head.scale = 0;
        this.line.setScale(1, 1);
        this.head.runAction(cc.scaleTo(.5, 1.5).easing(cc.easeBackOut()));
        let scaleY: number = GlobalVar.SysInfo.view.height / this.line.height;
        this.line.runAction(cc.sequence(
            cc.delayTime(.5),
            cc.scaleTo(.3, 1, scaleY)
        ))

        let action = (dur: number) => {
            return cc.sequence(
                cc.fadeOut(dur),
                cc.fadeIn(dur)
            )
        }
        this.node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.repeat(action(.5), 2),
            cc.repeat(action(.35), 2),
            cc.callFunc(() => {
                this.fire();
            })
        ))
    }
    /**开火 */
    private fire(): void {
        //生成炮弹 回收自身
        if (this.isFire()) { this.createMissile(); }

        this.recycle();
    }
    /**是否能发射，加速状态不能 */
    private isFire(): boolean {
        if (!this.mEnemySys) return true;
        if (this.mEnemySys.isAddSpeed()) return false;
        return true;
    }
    /**生成导弹 */
    private createMissile(): void {
        let miss: cc.Node = GlobalVar.PoolMgr.get(GMEnemy.type);
        if (miss) {
            let gmEnemy: GMEnemy = miss.getComponent(GMEnemy);
            if (gmEnemy) {
                gmEnemy.setEnemySys(this.mEnemySys);
                gmEnemy.init(this.mIsAddSpeed);
            }

            //设置导弹初始位置
            miss.setPosition(cc.v2(this.node.x, 1600));
        }
    }

    update(dt): void {
        if (!this.mTargetNode) { this.mDir = 0 }
        else {
            this.mDir = (this.node.x > this.mTargetNode.x) ? -1 : ((this.node.x < this.mTargetNode.x) ? 1 : 0);
        }

        this.mMoveLength += this.mDir * dt * this.mMoveSpeed;
        if (this.mMoveLength > this.mBorder) { this.mMoveLength = this.mBorder }
        else if (this.mMoveLength < -this.mBorder) { this.mMoveLength = -this.mBorder }

        this.node.x = this.mStartPosX + this.mMoveLength;
    }

    /**回收 */
    private recycle(): void {
        GlobalVar.PoolMgr.put(MissileLine.type, this.node);
    }
}
