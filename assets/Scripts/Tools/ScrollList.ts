
const { ccclass, property } = cc._decorator;

/**
 * 自定义类的写法（加 @ccclass("className")）
 * #可以在显示面板上显示出来
 */
@ccclass("View")
class View {
    @property({ type: cc.Node, tooltip: "view 视图" })
    view: cc.Node = null;
    @property({ type: cc.Float, tooltip: "view-width" })
    width: number = 0;
    @property({ type: cc.Float, tooltip: "view-height" })
    height: number = 0;

    public getView(): cc.Node { return this.view }
    public getWidth(): number { return this.width }
    public getHeight(): number { return this.height }
}
@ccclass("Bar")
class Bar {
    @property({ type: cc.Node, tooltip: "bar 滚动条" })
    bar: cc.Node = null;
    @property({ type: cc.Float, tooltip: "bar-width" })
    maxWidth: number = 0;
    @property({ type: cc.Float, tooltip: "bar-height" })
    maxHeight: number = 0;

    private mLastY: number = -1;

    public init(): void {
        this.onEvents();
    }

    private onEvents(): void {
        this.bar.on('touchstart', this.onTouchStart, this);
        this.bar.on('touchmove', this.onTouchMove, this);
    }
    private offEvents(): void {
        this.bar.off('touchstart', this.onTouchStart, this);
        this.bar.off('touchmove', this.onTouchMove, this);
    }
    private onTouchStart(e): void {
        this.mLastY = e.getLocation().y;
    }
    private onTouchMove(e): void {
        let offsetY: number = e.getLocation().y - this.mLastY;
        this.bar.y += offsetY;
        this.mLastY = e.getLocation().y;

        if (this.bar.y > 0) { this.bar.y = 0; return }
        else if (this.bar.y - this.bar.height < -this.maxHeight) { this.bar.y = this.bar.height - this.maxHeight; return }
    }

    /**
     * 需要缩小的比值
     * @param rate 减量（百分比）
     */
    public setSize(rate: number): void {
        this.bar.height = this.bar.height * (1 - rate);
    }
    /**
     * 设置bar的位置
     * @param rate 位移比率（距离顶部）
     */
    public setPos(rate: number): void {
        this.bar.y = (this.maxHeight - this.bar.height) * rate;
    }
    /**获取bar占比，bar位置占整个滚动条的比率 */
/*     public getRate(): number {

    } */
}
@ccclass("Item")
class Item {
    @property({ type: cc.Prefab, tooltip: "item 预制" })
    itemPre: cc.Prefab = null;
    @property({ type: cc.Float, tooltip: "item-width" })
    width: number = 0;
    @property({ type: cc.Float, tooltip: "item-height" })
    height: number = 0;

    public getPrefab(): cc.Prefab { return this.itemPre }
    public getWidth(): number { return this.width }
    public getHeight(): number { return this.height }
}

/**item 信息 */
interface ItemInfo {
    img: cc.SpriteFrame,
    type: number,
    name: string,
    describe: string
}

@ccclass
export class ScrollList extends cc.Component {

    @property({ type: View, tooltip: "View 视图属性" })
    mView: View = new View();
    @property({ type: Bar, tooltip: "Bar 滚动条属性" })
    mBar: Bar = new Bar();
    @property({ type: Item, tooltip: "item 属性" })
    mItem: Item = new Item();
    @property({ type: cc.Float, tooltip: "spaceY 垂直方向的间隙" })
    mSpaceY: number = 0;

    private mIsMoving: boolean = false;             //视图是否在滚动
    private mMaxItemCount: number = 0;              //视图可显示item最大个数
    private mLastViewTotalHeigth: number = 0;       //视图最近一次总高度
    private mOverY: number = 0;                     //在Y轴上超出的位移（上边）


    private mItemInfos: Array<ItemInfo> = null;
    private mItems: Array<cc.Node> = null;

    start(): void {
        this.initScrollList();

    }

    private initScrollList(): void {
        this.mBar.init();

        this.mLastViewTotalHeigth = this.mView.getHeight();
        this.mItemInfos = new Array<ItemInfo>();
        this.mItems = new Array<cc.Node>();

        this.updateBarSize();
        this.updateBarPos();
    }
    private onEvents(): void { }
    private offEvents(): void { }

    public update(): void {
        if (!this.mIsMoving) return;//禁止状态不需要更新
        this.updateItemsPos();
    }
    private updateBarSize(): void {
        let vHeight: number = this.getViewTotalHeigth();
        if (vHeight <= this.mView.getHeight()) {
            this.mBar.setSize(0);
        } else {
            this.mBar.setSize((vHeight - this.mLastViewTotalHeigth) / this.mLastViewTotalHeigth);
            this.mLastViewTotalHeigth = vHeight;
        }

    }
    private updateBarPos(): void {
        let vHeight: number = this.getViewTotalHeigth();
        if (vHeight <= this.mView.getHeight()) {
            this.mBar.setPos(0);
        } else {
            this.mBar.setPos(this.mOverY / (vHeight - this.mView.getHeight()))
        }
    }
    private updateItemsPos(): void {
        
    }

    //#region operation 操作

    public addItemInfo(): void {
        let node: cc.Node = cc.instantiate(this.mItem.getPrefab());
        this.mView.getView().addChild(node);
        node.setPosition(0, -this.mItemInfos.length * (this.mItem.getHeight() + this.mSpaceY))
        this.mItemInfos.push({ img: null, type: this.mItemInfos.length, name: 'nonde', describe: "item" });
        this.updateBarSize();
    }
    public deleteInfo(): void { }

    /**获取整个视图列表的高度 */
    public getViewTotalHeigth(): number {
        return this.mItemInfos.length * this.mItem.getHeight() + (this.mItemInfos.length - 1) * this.mSpaceY;
    }

    //#endregion
}


