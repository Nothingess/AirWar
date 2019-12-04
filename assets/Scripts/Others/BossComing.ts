
const { ccclass, property } = cc._decorator;

@ccclass
export class BossComing extends cc.Component {

    @property({ type: cc.Node, tooltip: "left_bar" })
    leftBar: cc.Node = null;
    @property({ type: cc.Node, tooltip: "right_bar" })
    rightBar: cc.Node = null;
    @property({ type: cc.Node, tooltip: "boss阴影" })
    bossShadow: cc.Node = null;
    @property({ type: cc.Node, tooltip: "文字描述" })
    showTxt: cc.Node = null;

    public start(): void {
        //初始化位置
        let windowsize: cc.Size = cc.view.getVisibleSize();
        this.leftBar.y = windowsize.height * .5;
        this.rightBar.y = -this.leftBar.y;

        this.node.runAction(cc.sequence(
            cc.fadeIn(1),
            cc.callFunc(() => {
                this.showTxt.runAction(cc.sequence(
                    cc.moveBy(1, cc.v2(600, 0)).easing(cc.easeOut(3)),
                    cc.moveBy(1, cc.v2(600, 0)).easing(cc.easeIn(3)),
                    cc.callFunc(() => {
                        this.bossShadow.opacity = 255;
                        this.bossShadow.runAction(
                            cc.sequence(
                                cc.blink(1, 5),
                                cc.delayTime(1),
                                cc.callFunc(() => {
                                    this.node.runAction(
                                        cc.sequence(
                                            cc.fadeOut(1),
                                            cc.callFunc(() => {
                                                this.node.destroy();
                                            })
                                        )
                                    )
                                })
                            )
                        );
                    })
                ))
            })
        ))
        this.leftBar.runAction(this.runActon(this.leftBar, 1, 1));
        this.rightBar.runAction(this.runActon(this.rightBar, -1, 2));

        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.bossComing);
    }

    private runActon(node: cc.Node, dir: number, dur: number): cc.ActionInterval {
        return cc.repeatForever(
            cc.sequence(
                cc.moveBy(dur, cc.v2(0, dir * 334)),
                cc.callFunc(() => {
                    node.y -= dir * 334;
                })
            )
        )
    }

    public setImg(boosID: number): void {
        let han = GlobalVar.GetHandler((res) => {
            if (this.bossShadow) {
                this.bossShadow.getComponent(cc.Sprite).spriteFrame = res;
            }
        }, this)

        GlobalVar.Loader.loadRes(`${GlobalVar.CONST.BOSS_SKINPATH_IMG}${boosID}`, han, cc.SpriteFrame);
    }

}
