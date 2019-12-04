import { PlayerBullet } from "../../Others/IBullet";
import { EnemySys } from "./EnemySys";
import { LaserCollider } from "../RoleSystem/LaserCollider";
import { MainFacade } from "../../Scenes/ISceneFacade";
import { PetBullet } from "../RoleSystem/PetBullet";

const { ccclass } = cc._decorator;

@ccclass
export class IEnemy extends cc.Component {

    protected mEnemySys: EnemySys = null;
    protected mHp: number = 100;
    protected mMaxHp: number = 100;
    protected mIsDie: boolean = false;                  //是否阵亡
    protected mIsCanGetPower: boolean = true;           //是否能获取能量

    protected mLaserTimer: number = 0;                  //激光计时器（用来辅助计算受到激光攻击的伤害）

    start(): void {
        this.onEvents();
    }

    /**初始化敌机 */
    public init(): void {
        this.mHp = this.mMaxHp = 100;
        this.mIsDie = false;
    }
    public isHaveEnemySys(): boolean { return this.mEnemySys != null }
    public setEnemySys(enemySys: EnemySys): void {
        this.mEnemySys = enemySys;
    }

    update(dt): void {
        this.move(dt);
        if (this.isRecycle()) {
            this.recycle();
        }
    }

    protected move(dt): void {

    }
    protected isRecycle(): boolean {
        return false;
    }

    protected beAttack(val: number): void {
        if (this.mIsDie) return;
        this.mHp -= val;
        if (this.mHp <= 0) {
            this.mHp = 0;
            this.die();
        }

        this.powerGranule();
    }
    public die(): void {
        if (this.mIsDie) return;
        this.mIsDie = true;

        this.award();
        this.recycle();
        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.monsterDie);
    }
    /**没奖励销毁 */
    public noAwardDie(): void {
        if (this.mIsDie) return;
        this.mIsDie = true;

        this.recycle();
        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.monsterDie);
    }
    protected award(): void {
        //金币
        this.mEnemySys.dropAward(this.node.getPosition());
    }
    /**被击打直接蓄能量 */
    protected powerGranule(): void {
        if (!this.mIsCanGetPower) return;
        this.mIsCanGetPower = false;
        setTimeout(() => {
            this.mIsCanGetPower = true;
        }, 200);
        //能量
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.eatPower);
    }

    /**回收 */
    public recycle(): void {

    }
    /**检测与玩家子弹的碰撞 */
    onCollisionEnter(other, self) {

        if (other.tag === GlobalVar.CONST.ENUM.COLLIDER_ID.pyBullet) {
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
            this.beAttack(bullet.getATK());
            bullet.recycle();
        } else if (other.tag === GlobalVar.CONST.ENUM.COLLIDER_ID.laserGun) {
            this.startTimer();
        } else {

        }
    }
    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay(other, self) {
        if (other.tag !== GlobalVar.CONST.ENUM.COLLIDER_ID.laserGun) return;
        let date: number = new Date().getTime();
        let offsetTimer: number = date - this.mLaserTimer;
        if (offsetTimer > 0) {
            offsetTimer *= .001;//转化单位为秒
            let bullet: LaserCollider = other.node.getComponent(LaserCollider);
            if (!bullet) return;
            this.beAttack(bullet.getATK(offsetTimer))
            //console.log(bullet.getATK(offsetTimer))
        }
        this.mLaserTimer = date;
    }

    protected startTimer(): void {
        this.mLaserTimer = new Date().getTime();
    }

    protected playParEff(pos: cc.Vec2, pet?: string): void {
        (this.mEnemySys.getFacade() as MainFacade).getParticleSys().play(pos, pet)
    }
    private playBoomEff(pos: cc.Vec2): void {
        this.mEnemySys.playSpExploed(GlobalVar.CONST.ENUM.SPINE_EFFECT.boom, pos);
    }
    /**计算碰撞点位置（圆形碰撞体） */
    protected getColliderPoint(other, self): cc.Vec2 {

        let dir: cc.Vec2 = other.world.position.sub(self.world.position);
        dir.normalizeSelf();
        dir.mulSelf(self.world.radius);

        return this.node.position.add(dir);
    }

    protected onEvents(): void { }
    protected offEvents(): void { }

    onDestroy(): void {
        this.offEvents();
    }
}
