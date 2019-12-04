import { ISceneState } from "./ISceneState";

export class SceneController {
    private mSceneState: ISceneState = null;                //场景状态
    private isLoadSceneAndResComplete: boolean = false;     //是否加载完场景和资源
    private isRunStart: boolean = false;                    //是否已经执行过当前场景的start方法

    public setState(sceneState: ISceneState, isLoadScene: boolean = true) {
        //TODO 通知面板管理器打开loading面板
        if (this.mSceneState != null) {
            this.mSceneState.stateEnd();
        }
        this.mSceneState = sceneState;
        let self = this;
        if (isLoadScene) {
            this.isLoadSceneAndResComplete = this.isRunStart = false;
            //预加载场景，打开loading界面
            cc.director.preloadScene(this.mSceneState.getSceneName(),
                (completedCount: number, totalCount: number, item: any) => {//抛出加载进度，让loading界面接收
                    GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.loadProgress, {
                        completeCount: completedCount,
                        totalCount: totalCount
                    })
                }, () => {
                    //加载场景完成
                    self.mSceneState.loadRes(() => {
                        //预加载资源完成
                        cc.director.loadScene(this.mSceneState.getSceneName(), () => {
                            //切换场景成功
                            self.isLoadSceneAndResComplete = true;
                            //console.log('加载场景成功')
                        })
                    })
                })
        } else {
            this.isLoadSceneAndResComplete = this.isRunStart = true;
            this.mSceneState.stateStart();
        }
    }
    /**渲染更新 */
    public rendererUpdate(dt): void {
        if (!this.isLoadSceneAndResComplete) return;
        if (this.mSceneState == null) return;
        if (!this.isRunStart) {
            this.mSceneState.stateStart();
            this.isRunStart = true;
        }
        this.mSceneState.rendererUpdate(dt);
    }
    /**逻辑更新 */
    public logicUpdate(dt): void {
        if (!this.isLoadSceneAndResComplete) return;
        if (this.mSceneState == null) return;
        this.mSceneState.logicUpdate(dt);
    }
}