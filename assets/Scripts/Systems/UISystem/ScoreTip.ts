
const { ccclass, property } = cc._decorator;

@ccclass
export class ScoreTip extends cc.Component {
    public static type: string = 'ScoreTip';

    @property({ type: cc.Label, tooltip: 'show conent' })
    label: cc.Label = null;

    public play(pos: cc.Vec2, str: string): void {
        this.node.stopAllActions();
        this.node.position = pos.add(cc.v2(100, 0));
        this.node.opacity = 0;
        this.label.string = str;

        this.node.runAction(cc.sequence(
            cc.spawn(
                cc.moveBy(.2, cc.v2(-100, 0)),
                cc.fadeIn(.2)
            ),
            cc.spawn(
                cc.moveBy(.5, cc.v2(0, 100)),
                cc.fadeOut(.5)
            ),
            cc.callFunc(() => {
                this.recycle();
            })
        ))

    }

    public recycle(): void {
        GlobalVar.PoolMgr.put(ScoreTip.type, this.node);
    }

}
