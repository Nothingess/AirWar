
const { ccclass, property } = cc._decorator;

@ccclass
export class SmokeEff extends cc.Component {

    public static type: string = 'SmokeEff'

    @property({ type: cc.ParticleSystem, tooltip: "机器人导弹尾气特效" })
    particle: cc.ParticleSystem = null;

    public init(): void {
        this.particle.resetSystem();
        this.particle.emissionRate = 200;
    }

    public setAngle(ang: number): void {
        this.particle.angle = ang;
    }

    /**回收 */
    public recycle(): void {
        this.particle.emissionRate = 0;
        this.scheduleOnce(() => {
            GlobalVar.PoolMgr.put(SmokeEff.type, this.node);
        }, 1)
    }
}
