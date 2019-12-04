import { MinMonster } from "./BsMorgan";
import { PlayerBullet } from "../../Others/IBullet";
import { MainFacade } from "../../Scenes/ISceneFacade";
import { PetBullet } from "../RoleSystem/PetBullet";

const { ccclass, property } = cc._decorator;

@ccclass
export class MinMonsterCollider extends cc.Component {

    @property({ type: cc.Node, tooltip: 'img' })
    img: cc.Node = null;
    @property({ type: cc.Sprite, tooltip: '血条' })
    bar: cc.Sprite = null;

    private mMinMonster: MinMonster = null;
    public setMinMonster(minMonster: MinMonster) {
        this.mMinMonster = minMonster;
        if (this.bar) { this.bar.fillRange = 1; }
    }
    /**播放攻击动画 */
    public playAtkAction(): void {
        if (!this.img) return;
        this.img.active = true;
        this.img.scale = 1;
        this.img.opacity = 255;
        this.img.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(.5, 2),
                cc.fadeOut(1)
            ),
            cc.callFunc(() => {
                this.img.active = false;
            })
        ))
    }

    onCollisionEnter(other, self) {
        if (!this.mMinMonster) return;
        let bullet: PlayerBullet = other.node.getComponent(PlayerBullet);
        if (!bullet) return;

        if (bullet.isHaveEff()) {//产生粒子特效
            if (bullet.isPetBt()) {
                this.playParEff(this.getColliderPoint(other, self), (bullet as PetBullet).getTypeId());
            } else {
                this.playParEff(this.getColliderPoint(other, self));
            }
        } else {//产生炮弹爆炸特效
            this.playBoomEff(this.getColliderPoint(other, self))
        }


        let rate: number = this.mMinMonster.beAttack(bullet.getATK());
        if (this.bar) { this.bar.fillRange = rate }
        bullet.recycle();
    }
    protected playParEff(pos: cc.Vec2, pet?: string): void {
        this.mMinMonster.getBoss().getFacade().getParticleSys().play(pos, pet)
    }
    private playBoomEff(pos: cc.Vec2): void {
        this.mMinMonster.getBoss().getEnemySys().playSpExploed(GlobalVar.CONST.ENUM.SPINE_EFFECT.boom, pos);
    }
    /**计算碰撞点位置（圆形碰撞体） */
    protected getColliderPoint(other, self): cc.Vec2 {
        if (!other.world.position) return this.node.position;//不是圆形碰撞器
        let dir: cc.Vec2 = other.world.position.sub(self.world.position);
        dir.normalizeSelf();
        dir.mulSelf(self.world.radius);

        return this.node.position.add(dir);
    }
}
