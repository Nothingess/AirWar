
const { ccclass, property } = cc._decorator;

@ccclass
export class IBuff extends cc.Component {//道具基类

    protected mGravity: number = -2000;               //重力加速度
    protected mCurSpeed: number = 300;                //初始速度
    protected mMaxSpeed: number = -2000;              //最大速度

    protected mDirX: number = 1;                       //侧边移动方向
    protected mAccX: number = 200;                     //减速度
    protected mSpeedX: number = 300;                   //侧边移动速度

    protected mBuffID: number = -1;                    //道具id
    public getBuffID(): number {
        return this.mBuffID;
    }

    public init(pos: cc.Vec2, isDouble: boolean = false): void {
        this.node.setPosition(pos);
        this.mDirX = (Math.random() - 0.5) > 0 ? 1 : -1;
        this.mCurSpeed = Math.random() * 200 * (isDouble ? 2 : 1) + 400;
        this.mSpeedX = 200;
    }

    update(dt): void {
        this.move(dt);
        if (this.isRecycle()) {
            this.recycle();
        }
    }

    protected move(dt): void {
        this.node.y += this.mCurSpeed * dt;
        if (this.mSpeedX < 0) return;
        this.node.x += this.mDirX * this.mSpeedX * dt;
    }
    lateUpdate(dt): void {
        this.mCurSpeed += this.mGravity * dt;
        this.mCurSpeed = (this.mCurSpeed < this.mMaxSpeed) ? this.mMaxSpeed : this.mCurSpeed;
        if (this.mSpeedX < 0) return;
        this.mSpeedX -= this.mAccX * dt;
    }
    protected isRecycle(): boolean {
        return (this.node.y < -100);
    }
    public recycle(): void {

    }
}
