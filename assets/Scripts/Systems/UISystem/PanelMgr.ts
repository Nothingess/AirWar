import { IUIBase } from "./IUIBase";

/**面板信息 */
interface PanelInfo {
    /**面板类型（继承自IUIBase） */
    type: any,
    /**面板名称 */
    name: string,
    /**面板参数 */
    args: any[],
}

export class PanelMgr {

    private mRoot: cc.Node = null;                   //UI跟节点
    private mLayerDict: Map<string, cc.Node>;        //存放各层级面板所对应的父物体
    private mOpenDict: Map<string, IUIBase>;         //用于存放已打开的面板
    private mMaskLyer: cc.Node = null;               //遮罩层

    private mWaitQueue: Array<PanelInfo> = null;     //等待打开的面板队列

    public initSys(root: cc.Node): void {
        this.initLayer(root);
        this.mOpenDict = new Map<string, IUIBase>();
        this.mWaitQueue = new Array<PanelInfo>();
    }
    /**初始化层级 */
    private initLayer(root: cc.Node): void {
        this.mRoot = root;
        this.mMaskLyer = cc.find("funcLayer/mask", this.mRoot);
        if (this.mRoot == null) {
            console.error("UISystem.initLayer fail, uiLayer is null!");
        }
        this.mLayerDict = new Map<string, cc.Node>();
        for (let pl in GlobalVar.CONST.ENUM.PANEL_LAYER) {
            this.mLayerDict.set(pl, this.mRoot.getChildByName(pl));
        }
    }

    /**通过队列打开面板 */
    public waitOpenPanel<T extends IUIBase>(panelType: new () => T, name: string, args?: any[]): void {
        let push: boolean = true;
        this.mWaitQueue.forEach(e => {
            if (e.name == name) {
                push = false;
            }
        })
        if (!push) return;
        let info: PanelInfo = {
            type: panelType,
            name: name,
            args: args
        }
        this.mWaitQueue.push(info);
        this.openWaitPanel();
    }
    private openWaitPanel(): void {
        if (this.mOpenDict.size > 0) return;
        if (this.mWaitQueue.length <= 0) return;
        let info: PanelInfo = this.mWaitQueue.shift();
        this.openPanel(info.type, info.name, info.args);
    }
    /**
     * 打开任意类型面板（泛型方法）
     * @param panelType 面板类型
     * @param args 参数
     */
    public openPanel<T extends IUIBase>(panelType: new () => T, name: string, args?: any[]): void {
        if (this.mOpenDict.get(name) != null) return;//已经打开
        this.openMask();
        let uiPanel: IUIBase = this.mRoot.addComponent(panelType);
        uiPanel.init(this, args);
        this.mOpenDict.set(name, uiPanel);
        let han = GlobalVar.GetHandler((panel) => {
            if (panel) {
                uiPanel.setSkin(panel);
                uiPanel.initStrategy();
                let parent: cc.Node = this.mLayerDict.get(uiPanel.getLayer());
                uiPanel.getSkin().setParent(parent);
                uiPanel.open();
            }
        });
        GlobalVar.Loader.loadPrefabObj(uiPanel.getSkinPath(), han);
    }
    /**关闭面板 */
    public closePanel(name: string): void {
        let panel: IUIBase = this.mOpenDict.get(name);
        if (panel == null) return;

        panel.close(() => { this.closeEndHandle(panel) })
    }
    private closeEndHandle(panel: IUIBase): void {
        panel.getSkin().destroy();
        this.mRoot.removeComponent(panel);
        this.mOpenDict.delete(panel.getSkinName());
        this.closeMask();
        if (this.mOpenDict.size <= 0) {
            this.openWaitPanel();
        }
    }
    private openMask(): void {
        if (this.mMaskLyer == null) return;
        if (this.mOpenDict.size == 0) {
            this.mMaskLyer.active = true;
        }
    }
    private closeMask(): void {
        if (this.mMaskLyer == null) return;
        if (this.mOpenDict.size == 0) {
            this.mMaskLyer.active = false;
        }
    }
    public rendererUpdate(dt): void { }
    public logicUpdate(dt): void { }
    public endSys(): void { }
}
