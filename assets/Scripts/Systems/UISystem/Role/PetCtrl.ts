import { PetBullet } from "../../RoleSystem/PetBullet";

const { ccclass, property } = cc._decorator;

@ccclass
export class PetCtrl extends cc.Component {

    @property({ type: sp.Skeleton, tooltip: "皮肤" })
    sp: sp.Skeleton = null;

    private mTarget: cc.Node = null;            //追踪目标
    private mID: number = 1;                    //宠物id
    private mPos: cc.Vec2 = cc.v2();            //追踪位置（相对于追踪不表）

    private mFirePosY: number = 70;             //开火位置

    /**初始化 */
    public init(target: cc.Node, id: number, pos: cc.Vec2): void {
        this.mTarget = target;
        this.mPos = pos;

        this.mID = id;
        this.setSkin();
    }

    private setSkin(): void {
        let han = GlobalVar.GetHandler((sp) => {
            if (this.sp) {
                this.sp.skeletonData = sp;
                this.playBirth();
                this.onAnimationEvents();
            }
        }, this)
        let path: string = (this.mID === 1) ? GlobalVar.CONST.ANIM_PATH.PET.HS : GlobalVar.CONST.ANIM_PATH.PET.LS;
        //GlobalVar.Loader.loadRes(`${GlobalVar.CONST.PET_IMG}${this.mID}`, han, sp.SkeletonData);
        GlobalVar.Loader.loadRes(path, han, sp.SkeletonData);
    }
    /**获取目标位置 */
    private getTargetPos(): cc.Vec2 {
        return cc.v2(this.mTarget.position.x + this.mPos.x, this.mTarget.position.y + this.mPos.y);
    }
    update(dt): void {
        if (this.mTarget == null) return;

        this.move();
    }

    private move(): void {
        let targetPos: cc.Vec2 = cc.v2();
        this.node.position.lerp(this.getTargetPos(), .2, targetPos);
        this.node.position = targetPos;
    }

    public fire(atk: number): void {
        let bullet: cc.Node = GlobalVar.PoolMgr.get(PetBullet.type);
        if (bullet) {
            let petBullet: PetBullet = bullet.getComponent(PetBullet);
            if (petBullet) { petBullet.init(atk, this.mID) }

            //计算开火位置
            let world: cc.Vec2 = this.node.getPosition();
            world.y += this.mFirePosY;
            bullet.setPosition(world);
        }
    }


    ///spine 动画---------------------------------------------------
    /**监听spine动作回调 */
    protected onAnimationEvents(): void {
        this.sp.setCompleteListener(this.onComplete.bind(this));
    }
    protected onComplete(trackEntry): void {
        let animationName = trackEntry.animation ? trackEntry.animation.name : "";
        if (animationName === 'out') {
            this.playStand();
        }
    }


    /**出生 */
    private playBirth(): void {
        if (this.sp) {
            this.sp.setAnimation(0, 'out', false);
        }
    }
    private playStand(): void {
        if (this.sp) {
            this.sp.setAnimation(0, 'stand', true);
        }
    }
}
