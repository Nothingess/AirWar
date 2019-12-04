import { PlayerBullet } from "../../Others/IBullet";

const { ccclass } = cc._decorator;

@ccclass
export class PyFaShi extends PlayerBullet {
    public static type: string = 'PyFaShi';

    public init(): void {
        this.mATK = 60;
    }

    protected isRecycle(): boolean {
        return (this.node.y > GlobalVar.SysInfo.view.height + 80)
    }
    public isHaveEff(): boolean {
        return false;
    }
    public recycle(): void {
        GlobalVar.PoolMgr.put(PyFaShi.type, this.node);
    }

}
