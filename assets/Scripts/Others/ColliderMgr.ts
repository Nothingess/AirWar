/**碰撞层级 */
/**
 * default  -------------   0
 * enemy    -------------   1
 * pyBullet -------------   2
 * role     -------------   3
 * buff     -------------   4
 * eyBullet -------------   5
 */

const { ccclass, property } = cc._decorator;
/**用来开启碰撞检测 */
@ccclass
export default class NewClass extends cc.Component {

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
    }

    onDestroy(): void {
        var manager = cc.director.getCollisionManager();
        manager.enabled = false;
    }
}
