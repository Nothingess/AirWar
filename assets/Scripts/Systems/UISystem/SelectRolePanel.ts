const { ccclass, property } = cc._decorator;

/**
 * 自定义类的写法（加 @ccclass("className")）
 * #可以在显示面板上显示出来
 */
@ccclass("SelectBox")
class SelectBox {
    @property({ type: cc.Sprite, tooltip: "box_sp" })
    boxSp: cc.Sprite = null;
    @property({ type: cc.Sprite, tooltip: "border_sp" })
    borderSp: cc.Sprite = null;
    @property({ type: cc.Node, tooltip: "role" })
    role: cc.Node = null;
    @property({ type: cc.Node, tooltip: "lock" })
    lock: cc.Node = null;
    @property({ type: cc.Label, tooltip: "解锁条件" })
    tip: cc.Label = null;
    @property({ type: cc.Float, tooltip: "需要登陆天数" })
    needLoginTimes: number = 0;

    private mIsLock: boolean = false;

    public setLock(): void {
        this.mIsLock = true;
        this.lock.opacity = 255;
        this.tip.node.opacity = 255;

        this.tip.string = `${this.needLoginTimes - GlobalVar.NetConfig.loginTimes}`;
    }
    public setGray(): void {
        this.role.color = cc.Color.GRAY;
    }
    public setDefault(): void {
        this.role.color = cc.Color.WHITE;
    }
    public isLock(): boolean { return this.mIsLock }

}

@ccclass
export class SelectRolePanel extends cc.Component {
    @property({ type: cc.Label, tooltip: '倒计时' })
    timerLa: cc.Label = null;
    @property({ type: cc.Label, tooltip: '提示' })
    showTipLa: cc.Label = null;
    @property({ type: cc.Label, tooltip: "准备倒计时" })
    readyTiemr: cc.Label = null;

    @property({ type: SelectBox, tooltip: '选择L' })
    select_l: SelectBox = new SelectBox();
    @property({ type: SelectBox, tooltip: '选择C' })
    select_c: SelectBox = new SelectBox();
    @property({ type: SelectBox, tooltip: '选择R' })
    select_r: SelectBox = new SelectBox();
    @property({ type: cc.Node, tooltip: "offLine tip" })
    offLineTip: cc.Node = null;
    private mCurSelectBox: SelectBox = null;

    private mCurIndex: number = -1;          //当前选择的角色索引（id）
    private mRole: sp.Skeleton = null;      //展示的角色spine组件
    private mbtnEnter: cc.Node = null;      //确定按钮

    private mShowPos: cc.Vec2 = cc.v2(0, -50);    //显示的位置

    onLoad(): void {
        this.initComponent();
    }

    protected initComponent(): void {
        this.mRole = cc.find('role', this.node).getComponent(sp.Skeleton);
        this.mbtnEnter = cc.find('btn_enter', this.node);

        this.mCurSelectBox = this.select_l;
        this.initLockItem();
        this.startAnimation();
        this.onSelect(0);
        this.onEvent();
    }
    /**初始话被锁角色 */
    private initLockItem(): void {
        if (GlobalVar.NetConfig.loginTimes < 3) {//登陆天数少于3天
            this.setLock(this.select_c);
            this.setLock(this.select_r);
        } else if (GlobalVar.NetConfig.loginTimes < 7) {//登陆天数少于7天
            this.setLock(this.select_r);
        }

        this.setGray(this.select_c);
        this.setGray(this.select_r);
    }
    /**上锁 */
    private setLock(box: SelectBox): void {
        box.setLock();
    }
    /**置灰 */
    private setGray(box: SelectBox): void {
        box.setGray();
    }
    private startAnimation(): void {
        this.select_l.boxSp.node.opacity = 0;
        this.select_c.boxSp.node.opacity = 0;
        this.select_r.boxSp.node.opacity = 0;
        this.mbtnEnter.opacity = 0;

        this.select_l.boxSp.node.y = -GlobalVar.SysInfo.view.height * .5;
        this.select_c.boxSp.node.y = -GlobalVar.SysInfo.view.height * .5;
        this.select_r.boxSp.node.y = -GlobalVar.SysInfo.view.height * .5;
        this.mbtnEnter.y = -GlobalVar.SysInfo.view.height * .25;

        let ac = cc.spawn(
            cc.moveBy(.5, cc.v2(0, GlobalVar.SysInfo.view.height * .16)).easing(cc.easeBackOut()),
            cc.fadeIn(.5)
        )

        this.select_l.boxSp.node.runAction(ac.clone());
        setTimeout(() => {
            this.select_c.boxSp.node.runAction(ac.clone());
        }, 100);
        setTimeout(() => {
            this.select_r.boxSp.node.runAction(ac.clone());
            this.mbtnEnter.runAction(cc.spawn(
                cc.moveTo(.3, cc.v2(0, -GlobalVar.SysInfo.view.height * .17)).easing(cc.easeBackOut()),
                cc.fadeIn(.3)
            ))
        }, 200);
    }
    private endAnimation(): void {
        let ac = cc.spawn(
            cc.moveBy(.5, cc.v2(0, -GlobalVar.SysInfo.view.height * .16)).easing(cc.easeBackIn()),
            cc.fadeOut(.5)
        )

        this.select_l.boxSp.node.runAction(ac.clone());
        setTimeout(() => {
            this.select_c.boxSp.node.runAction(ac.clone());
        }, 100);
        setTimeout(() => {
            this.select_r.boxSp.node.runAction(ac.clone());
        }, 200);
    }
    private onSelect(val: number): boolean {
        if (GlobalVar.NetConfig.isReady) return;
        if (val === this.mCurIndex) return false;
        this.mCurIndex = val;
        if (this.mCurIndex > 2) { this.mCurIndex = 0 }
        if (this.mCurIndex < 0) { this.mCurIndex = 2 }

        GlobalVar.NetConfig.selectRoleId = this.mCurIndex;
        this.showRole();
        return true;
    }
    /**根据索引展示角色 */
    private showRole(): void {
        if (!this.mRole) return;

        this.mRole.node.opacity = 0;
        this.mRole.node.setPosition(this.mShowPos.sub(cc.v2(0, 100)));
        this.mRole.node.runAction(
            cc.spawn(
                cc.moveTo(.2, this.mShowPos),
                cc.fadeIn(.2)
            )
        )
        this.setSpineData();
    }
    /**加载spine数据 */
    private setSpineData(): void {
        let han = GlobalVar.GetHandler((spData: sp.SkeletonData) => {
            this.mRole.skeletonData = spData;
            this.mRole.setAnimation(0, 'fly', true);
        }, this)

        GlobalVar.Loader.loadRes(this.getRoleSpinePath(), han, sp.SkeletonData);
    }
    private getRoleSpinePath(): string {
        let path: string = null;
        switch (this.mCurIndex) {
            case 0:
                path = GlobalVar.CONST.ANIM_PATH.ROLE.FS;
                break;
            case 1:
                path = GlobalVar.CONST.ANIM_PATH.ROLE.JJ;
                break;
            case 2:
                path = GlobalVar.CONST.ANIM_PATH.ROLE.JL;
                break;

            default:
                path = GlobalVar.CONST.ANIM_PATH.ROLE.FS;
                break;
        }
        return path;
    }
    protected onEvent(): void {
        this.select_l.boxSp.node.on('touchend', this.onTouchL, this);
        this.select_c.boxSp.node.on('touchend', this.onTouchC, this);
        this.select_r.boxSp.node.on('touchend', this.onTouchR, this);


        this.mbtnEnter.on('touchend', this.onTouchBtnC, this);

        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.connectSuc, this.onConnect.bind(this), 'SelectRolePanel');
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.readyCountDown, this.onStart.bind(this), 'SelectRolePanel');
    }
    protected offEvent(): void {
        this.select_l.boxSp.node.off('touchend', this.onTouchL, this);
        this.select_c.boxSp.node.off('touchend', this.onTouchC, this);
        this.select_r.boxSp.node.off('touchend', this.onTouchR, this);


        this.mbtnEnter.off('touchend', this.onTouchBtnC, this);

        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.connectSuc, 'SelectRolePanel');
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.readyCountDown, 'SelectRolePanel');
    }
    private onConnect(): void {
        this.showTipLa.string = 'Select Role';
        this.startTimer();
    }
    private onStart(): void {

        this.unscheduleAllCallbacks();
        this.timerLa.string = '';
        this.showTipLa.string = 'Ready';

        let timer: number = 3;
        let ready = setInterval(() => {
            this.playReadyCountDown(timer);
            timer--;
            if (timer < 0) {
                clearInterval(ready);
                this.node.destroy();
            }
        }, 1000)
    }
    private startTimer(): void {
        let timer: number = 10;
        this.schedule(() => {
            this.timerLa.string = `${timer}`;
            timer--;
            if (timer < 0) {
                this.onTouchBtnC();
            }
        }, 1, 10)
    }
    //播放准备倒计时动画
    private playReadyCountDown(val: number): void {
        this.readyTiemr.string = val.toString();
        this.readyTiemr.node.opacity = 0;
        this.readyTiemr.node.scale = 5;

        this.readyTiemr.node.runAction(cc.spawn(
            cc.fadeIn(.2),
            cc.scaleTo(.2, 2)
        ))
    }
    private onTouchL(): void {
        if (this.select_l.isLock()) return;
        if (!this.onSelect(0)) return;
        this.changeSp(this.select_l, this.mCurSelectBox);
        this.mCurSelectBox = this.select_l;
    }
    private onTouchC(): void {
        if (this.select_c.isLock()) return;
        if (!this.onSelect(1)) return;
        this.changeSp(this.select_c, this.mCurSelectBox);
        this.mCurSelectBox = this.select_c;
    }
    private onTouchR(): void {
        if (this.select_r.isLock()) return;
        if (!this.onSelect(2)) return;
        this.changeSp(this.select_r, this.mCurSelectBox);
        this.mCurSelectBox = this.select_r;
    }
    /**交换两个box的spriteFrame */
    private changeSp(box1: SelectBox, box2: SelectBox): void {
        let tempBox: cc.SpriteFrame = box1.boxSp.spriteFrame;
        let tempBorder: cc.SpriteFrame = box1.borderSp.spriteFrame;

        box1.boxSp.spriteFrame = box2.boxSp.spriteFrame;
        box1.borderSp.spriteFrame = box2.borderSp.spriteFrame;

        box2.boxSp.spriteFrame = tempBox;
        box2.borderSp.spriteFrame = tempBorder;

        box1.setDefault();
        box2.setGray();
        this.changeAc(box1, box2);
    }
    /**交换动画 */
    private changeAc(box1: SelectBox, box2: SelectBox): void {
        box1.borderSp.node.scale = .8;
        box1.borderSp.node.runAction(cc.scaleTo(.3, 1).easing(cc.easeBackOut()))

        box2.borderSp.node.scale = 1;
        box2.borderSp.node.runAction(cc.scaleTo(.3, .8).easing(cc.easeBackOut()))
    }
    private onTouchBtnC(): void {
        if (!GlobalVar.NetConfig.isConnect) {
            this.showOffLineTip();
            return;
        }
        if (GlobalVar.NetConfig.isReady) return;//已经准备就绪

        //ac
        this.endAnimation();
        this.mbtnEnter.active = false;
        this.mRole.node.runAction(cc.spawn(
            cc.scaleBy(.5, 1.5).easing(cc.easeInOut(3)),
            cc.moveBy(.5, cc.v2(0, -300)).easing(cc.easeInOut(3))
        ));

        this.showTipLa.string = 'Waiting for opponent';
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.ready);
    }
    private showOffLineTip(): void {
        if (!this.offLineTip) return;
        let tip: cc.Node = this.offLineTip.getChildByName('offLine_tip');
        if (!tip) return;

        this.offLineTip.stopAllActions();
        this.offLineTip.opacity = 0;
        this.offLineTip.runAction(cc.sequence(
            cc.fadeIn(.3),
            cc.delayTime(2),
            cc.fadeOut(.5)
        ))

        let path: string = `${GlobalVar.CONST.UI_PATH.OFFLINE
            }${GlobalVar.NetConfig.language}`;

        let han = GlobalVar.GetHandler((sf) => {
            tip.getComponent(cc.Sprite).spriteFrame = sf;
        }, this)

        GlobalVar.Loader.loadRes(path, han, cc.SpriteFrame);
    }
}

