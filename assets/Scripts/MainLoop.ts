import { SceneController } from "./Scenes/SceneController";
import { LoadScene } from "./Scenes/ISceneState";

const { ccclass } = cc._decorator;

@ccclass
export class MainLoop extends cc.Component {

    private mSceneCtrl: SceneController = null;

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        GlobalVar.SetView(cc.view.getVisibleSize());
    }

    start() {
        this.mSceneCtrl = new SceneController();
        this.mSceneCtrl.setState(new LoadScene(this.mSceneCtrl), false);
    }
    //渲染更新
    update(dt) {
        this.mSceneCtrl.rendererUpdate(dt);
    }
    //逻辑更新
    lateUpdate(dt) {
        this.mSceneCtrl.logicUpdate(dt);
    }
}


//连接服务端
if (typeof (hg) !== 'undefined') {
    LCHago.connect();
    LCHago.onCreate = (data) => {
        GlobalVar.error(`onCreate : ${JSON.stringify(data)}`);
        GlobalVar.NetConfig.isAI = data.opponent.isAI;
        GlobalVar.NetConfig.isConnect = true;
        GlobalVar.SetSeed(data.seed);
    }
} else {
    LCHago.connect(1);
    LCHago.onCreate = (data) => {
        GlobalVar.error(`onCreate : ${JSON.stringify(data)}`);
        GlobalVar.NetConfig.isAI = data.opponent.isAI;
        GlobalVar.NetConfig.isConnect = true;
        GlobalVar.SetSeed(data.seed);
    }
}
