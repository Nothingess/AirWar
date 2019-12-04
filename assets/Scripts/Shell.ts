const { ccclass, property } = cc._decorator;

/**万剑齐发的效果 */
@ccclass
export class Shell extends cc.Component {

    @property({ type: cc.Node, tooltip: "测试目标" })
    mTarget: cc.Node = null;

    private mSpeed: number = 1000;

    //private mTarget: cc.Node = null;                //追踪目标（没有目标是慢慢转向正前方）
    private mTargetDir: cc.Vec2 = cc.v2();          //目标转向（向目标转向慢慢靠拢）
    private mCurrRadian: number = 0;                //当前弧度值【以cc.v(1, 0)为x正方向】
    private mRotSpeed: number = 3;                  //转向速度

    start() {
        this.init();
    }

    public init(): void {
        this.initDir();
    }
    /**初始化当前方向 */
    private initDir(): void {
        this.mCurrRadian = Math.random() * Math.PI;
    }

    update(dt) {
        this.move(dt);
    }
    lateUpdate(dt): void {
        this.updateTargetDir();
        this.updateCurDir(dt);
        this.updateShowDir();
    }

    /**更新移动方向 */
    private updateTargetDir(): void {
        if (!this.mTarget) {
            let x:number = Math.random() * .3;
            this.mTargetDir = cc.v2(0, 1);
            return;
        }

        this.mTarget.position.sub(this.node.position, this.mTargetDir);
    }
    /**更新当前移动的方向 */
    private updateCurDir(dt): void {
        let curDir: cc.Vec2 = cc.v2(Math.cos(this.mCurrRadian), Math.sin(this.mCurrRadian));
        let rad: number = curDir.signAngle(this.mTargetDir);//与目标向量的夹角（弧度）
        if (Math.abs(rad) < 0.088) return;//误差角度(5度对应的弧度值)
        let dir: number = rad / Math.abs(rad);//方向

        this.mCurrRadian += ((dir > 0) ? 1 : -1) * this.mRotSpeed * dt;
    }
    /**更新节点显示的方向 */
    private updateShowDir(): void {
        this.node.angle = -GlobalVar.VectorsToDegress(cc.v2(Math.cos(this.mCurrRadian), Math.sin(this.mCurrRadian)))
    }
    /**移动 */
    private move(dt): void {
        this.node.x += Math.cos(this.mCurrRadian) * this.mSpeed * dt;
        this.node.y += Math.sin(this.mCurrRadian) * this.mSpeed * dt;
    }

}
