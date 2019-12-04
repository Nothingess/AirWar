import { PlayerBullet } from "../../Others/IBullet";

const { ccclass, property } = cc._decorator;

@ccclass
export class LaserCollider extends PlayerBullet {
    public init(): void {
        this.mATK = 500;
    }

    public getATK(timer: number = 0): number {
        //console.log(`${this.mATK}:${timer}`)
        return this.mATK * timer;
    }
}
