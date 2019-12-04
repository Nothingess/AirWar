
const { ccclass, property } = cc._decorator;

@ccclass
export class SceneRes extends cc.Component {

    @property({ type: cc.SpriteFrame, tooltip: '背景3' })
    bg3: cc.SpriteFrame = null;

    @property({ type: [sp.SkeletonData], tooltip: "spine爆炸特效列表" })
    spineEffList: Array<sp.SkeletonData> = [];


    //-----------------------获取资源
    public getBg(): cc.SpriteFrame { return this.bg3 }
}
