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

    // @property({ type: cc.Node, tooltip: "测试签到按钮" })
    // testSignIn: cc.Node = null;

    @property({ type: cc.Sprite, tooltip: '提示' })
    showTipLa: cc.Sprite = null;

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

    private mShowPos: cc.Vec2 = cc.v2(0, -50);    //显示的位置

    onLoad(): void {
        this.initComponent();
    }

    protected initComponent(): void {
        this.mRole = cc.find('role', this.node).getComponent(sp.Skeleton);

        this.mCurSelectBox = this.select_l;
        this.initLockItem();
        this.startAnimation();
        this.onSelect(0);
        this.onEvent();

        this.loadShowTip(GlobalVar.CONST.Language_PATH.waitForOpp);
        // this.updateSignIn();
    }
    //测试
    // private updateSignIn(): void {
    //     //测试
    //     this.testSignIn.children[0].children[0].getComponent(cc.Label).string = `signIn:${
    //         GlobalVar.NetConfig.loginTimes
    //         }`
    // }
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
        //this.mbtnEnter.opacity = 0;

        this.select_l.boxSp.node.y = -GlobalVar.SysInfo.view.height * .5;
        this.select_c.boxSp.node.y = -GlobalVar.SysInfo.view.height * .5;
        this.select_r.boxSp.node.y = -GlobalVar.SysInfo.view.height * .5;
        //this.mbtnEnter.y = -GlobalVar.SysInfo.view.height * .25;

        let ac = cc.spawn(
            cc.moveBy(.5, cc.v2(0, GlobalVar.SysInfo.view.height * .20)).easing(cc.easeBackOut()),
            cc.fadeIn(.5)
        )

        this.select_l.boxSp.node.runAction(ac.clone());
        setTimeout(() => {
            this.select_c.boxSp.node.runAction(ac.clone());
        }, 100);
        setTimeout(() => {
            this.select_r.boxSp.node.runAction(ac.clone());
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
        //if (GlobalVar.NetConfig.isReady) return;
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
        this.mRole.node.scale = 1.6;
        this.mRole.node.setPosition(this.mShowPos.sub(cc.v2(0, 200)));
        this.mRole.node.runAction(
            cc.spawn(
                cc.scaleTo(.3, 2),
                cc.moveTo(.3, this.mShowPos).easing(cc.easeOut(3)),
                cc.fadeIn(.3)
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

        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.readyCountDown, this.onStart.bind(this), 'SelectRolePanel');

        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);

        // //测试
        // this.testSignIn.on('touchend', this.onTestSignIn, this);
    }
    //测试
    // private onTestSignIn(): void {
    //     GlobalVar.NetConfig.loginTimes++;
    //     GlobalVar.NetConfig.loginTimes = (GlobalVar.NetConfig.loginTimes > 7) ? 1 : GlobalVar.NetConfig.loginTimes;
    //     this.updateSignIn();
    // }
    protected offEvent(): void {
        this.select_l.boxSp.node.off('touchend', this.onTouchL, this);
        this.select_c.boxSp.node.off('touchend', this.onTouchC, this);
        this.select_r.boxSp.node.off('touchend', this.onTouchR, this);

        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.connectSuc, 'SelectRolePanel');
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.readyCountDown, 'SelectRolePanel');

        cc.game.off(cc.game.EVENT_HIDE, this.onHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onShow, this);
    }
    private onShow(): void {
        GlobalVar.NetConfig.isHide = false;
        GlobalVar.log("游戏进入前台");
    }
    private onHide(): void {
        GlobalVar.NetConfig.isHide = true;
        GlobalVar.log("游戏进入后台");
    }
    private onStart(): void {
        this.onStartGame();
        this.unscheduleAllCallbacks();
        this.loadShowTip(GlobalVar.CONST.Language_PATH.ready, true);
        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.ready);
        setTimeout(() => {
            this.loadShowTip(GlobalVar.CONST.Language_PATH.go, true);
            GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.go);
        }, 1000);
        setTimeout(() => {

            let worldPos: cc.Vec2 = this.mRole.node.parent.convertToWorldSpaceAR(this.mRole.node.position);
            let node: cc.Node = this.mRole.node;
            node.setParent(cc.director.getScene());
            node.setPosition(worldPos);
            node.runAction(cc.sequence(
                cc.spawn(
                    cc.moveTo(.5, cc.v2(GlobalVar.SysInfo.view.width * .5,
                        GlobalVar.SysInfo.view.width * .2)),
                    cc.scaleTo(.5, .85),
                ),
                cc.callFunc(() => {
                    GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.roleBirth);
                    node.destroy();
                })
            ))

            this.node.runAction(cc.sequence(
                cc.fadeOut(.2),
                cc.callFunc(() => { this.node.destroy(); })
            ))
        }, 2000);
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
    private onStartGame(): void {
        //ac
        this.endAnimation();
        this.mRole.node.runAction(cc.spawn(
            cc.scaleBy(.5, 1.5).easing(cc.easeInOut(3)),
            cc.moveBy(.5, cc.v2(0, -300)).easing(cc.easeInOut(3))
        ));
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

        let path: string = `${GlobalVar.CONST.Language_PATH.offLine
            }${GlobalVar.NetConfig.language}`;

        let han = GlobalVar.GetHandler((sf) => {
            tip.getComponent(cc.Sprite).spriteFrame = sf;
        }, this)

        GlobalVar.Loader.loadRes(path, han, cc.SpriteFrame);
    }

    private loadShowTip(path: string, isAc?: boolean): void {
        if (isAc) {
            this.showTipAc();
            path += 'en';
        } else {
            path += GlobalVar.NetConfig.language;
        }
        let han = GlobalVar.GetHandler((sf: cc.SpriteFrame) => {
            if (this.showTipLa) {
                this.showTipLa.spriteFrame = sf;
            }
        }, this)

        GlobalVar.Loader.loadRes(path, han, cc.SpriteFrame);

    }
    private showTipAc(): void {
        this.showTipLa.node.scale = 5;
        this.showTipLa.node.opacity = 0;

        this.showTipLa.node.runAction(cc.spawn(
            cc.scaleTo(.5, 2),
            cc.fadeIn(.5)
        ))
    }
}

