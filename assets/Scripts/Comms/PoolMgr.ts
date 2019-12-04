export class PoolMgr {

    private static inst: PoolMgr = null;
    public static getInst(): PoolMgr {
        if (this.inst == null) {
            this.inst = new PoolMgr();
        }
        return this.inst;
    }
    constructor() {
        this.mPoolList = new Map<string, IPool>();
    }

    private mPoolList: Map<string, IPool> = null;
    /**创建非节点对象池 */
    public createObjPool(type: string): void {
        if (this.mPoolList.get(type)) return;
        let pool: ObjPool = new ObjPool(type);
        this.mPoolList.set(type, pool);
    }
    /**
     * 创建节点对象池
     * @param type 对象池库中的key
     * @param parent 实例对象的父节点
     * @param path 预制路径
     * @param initCount 初始化个数
     */
    public createNodePool(type: string, parent: cc.Node, path: string, initCount: number = 10): void {
        if (this.mPoolList.get(type)) return;
        let pool: NodePool = new NodePool(parent, path, initCount);
        this.mPoolList.set(type, pool);
    }

    public get(type: string): any {
        return this.mPoolList.get(type).get();
    }
    public put(type: string, obj: any): any {
        if (this.mPoolList.get(type) == null) {//对象池已销毁 or 对象池不存在
            obj.destroy();
            return;
        }
        return this.mPoolList.get(type).put(obj);
    }
    public getSize(type: string): number {
        return 0;
    }

    public removePool(type: string): void {
        let pool: IPool = this.mPoolList.get(type);
        if (pool) {
            pool.clear();
            this.mPoolList.delete(type);
        }
    }
    public removeAll(): void {
        this.mPoolList.forEach(e => {
            e.clear();
        })
        this.mPoolList.clear();
    }
}

class IPool {

    protected mList: Array<any> = null;
    protected mTotal: number = 0;

    constructor() {
        this.mList = new Array<any>();
    }

    public get(): any {

    }
    public put(obj: any): any {

    }
    public size(): number {
        return this.mList.length;
    }
    protected create(): void {

    }

    public clear(): void {

    }

}

class ObjPool extends IPool {
    private mObjRef: object = null;

    constructor(objRef: any, initCount: number = 10) {
        super();
        this.mObjRef = objRef;

        let timer = setInterval(() => {
            initCount--;
            if (initCount < 0) {
                clearInterval(timer);
                return;
            }

            this.mList.push(new objRef());
            this.mTotal++;
        }, 50)
    }

    public get(): any {
        let obj = this.mList.shift();
        if(obj === null || obj === undefined){
        }
    }
    public put(node: cc.Node): void {

    }
    protected create(): any {

    }

    public clear(): void {

    }
}

class NodePool extends IPool {
    private mParent: cc.Node = null;
    private mPrefab: cc.Prefab = null;

    /**初始化池 */
    constructor(parent: cc.Node, path: string, initCount: number = 10) {
        super();
        this.mParent = parent;

        let han = GlobalVar.GetHandler((pre) => {
            this.mPrefab = pre;
            let timer = setInterval(() => {

                initCount--;
                if (initCount < 0) {
                    clearInterval(timer);
                    return;
                }

                let node: cc.Node = cc.instantiate(pre);
                node.parent = this.mParent;
                node.setPosition(cc.v2(-100, 0));
                node.active = false;
                this.mList.push(node);
                node.name = `${pre.name}${this.mTotal}`;
                this.mTotal++;
            }, 50);

            /*             for (let i = 0; i < initCount; i++) {
                            let node: cc.Node = cc.instantiate(pre);
                            node.parent = this.mParent;
                            node.setPosition(cc.v2(-100, 0));
                            node.active = false;
                            this.mList.push(node);
                            node.name = `${pre.name}${this.mTotal}`;
                            this.mTotal++;
                        } */

            //console.log(`池id:${this.mPrefab.name}, 数量：${this.mList.length}`);
        }, this);
        GlobalVar.Loader.loadRes(path, han, cc.Prefab);
    }
    public get(): cc.Node {
        let node: cc.Node = this.mList.shift();
        if (node == null || node == undefined) {
            node = this.create();
        }
        else {
            node.active = true;
        }
        return node;
    }
    public put(node: cc.Node): void {
        node.setPosition(cc.v2(-100, 0));
        node.active = false;
        if (this.mList.indexOf(node) >= 0) return;
        this.mList.push(node);
    }
    protected create(): cc.Node {
        if (this.mPrefab == null) {
            console.log(`创建节点失败！请检查 this.mPrefab 是否为空`);
            return null;
        }
        let node: cc.Node = cc.instantiate(this.mPrefab);
        node.setPosition(cc.v2(-100, 0));
        node.setParent(this.mParent);
        node.name = `${this.mPrefab.name}${this.mTotal}`;
        this.mTotal++;
        console.log(node.name);
        return node;
    }

    public clear(): void {
        this.mList.forEach(e => {
            e.destroy();
        })
        this.mList = [];
    }
}
