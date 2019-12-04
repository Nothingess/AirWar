
const { ccclass, property } = cc._decorator;

/**静态子弹 */
@ccclass
export class StaticBullet extends cc.Component {
    public static type: string = "StaticBullet";
}
