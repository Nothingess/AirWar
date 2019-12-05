import { PyBullet } from "../../RoleSystem/PyBullet";
import { PetMgr } from "./PetMgr";
import { PetBullet } from "../../RoleSystem/PetBullet";
import { RoleCollider } from "./RoleCollider";
import { PyGuideMiss } from "../../RoleSystem/PyGuideMiss";
import { PySwordkee } from "../../RoleSystem/PySwordkee";
import { MainUISystem } from "../IUISystem";
import { SmokeEff } from "../../../Others/SmokeEff";
import { PyFaShi } from "../../RoleSystem/PyFaShi";
import { MainFacade } from "../../../Scenes/ISceneFacade";

export class RoleCtrl {
    private mUISys: MainUISystem = null;           //ui管理器
    //touch
    private mTouchArea: cc.Node = null;         //触摸板
    private mRoleObj: cc.Node = null;           //操作对象
    private mCover: cc.Node = null;             //复活无敌罩
    private mSpine: sp.Skeleton = null;         //spine动画
    private mPyBulletLayer: cc.Node = null;     //子弹所在层级

    private mFirePosY: number = 70;             //开火位置
    //控制移动变量
    private mTargetX: number = -1;              //目标位置
    private mCurrentX: number = -1;             //当前位置
    private mRatio: number = .8;                //插值移动比率
    //控制旋转
    private mRotSpeed: number = 40;             //旋转速度
    private mTargetAng: number = 0;             //目标角度
    private mCurAng: number = 0;                //当前角度
    private mAngDir: number = 0;                //旋转方向
    //宠物
    private mPetMgr: PetMgr = null;             //宠物管理器
    private mSkill: ISkill = null;              //技能系统
    //other
    private mIsInvincible: boolean = false;     //是否无敌
    private mIsCanFire: boolean = true;         //是否能射击
    private misDie: boolean = false;            //是否死亡
    /**是否无敌 */
    public isInvincible(): boolean { return this.mIsInvincible }
    public isCanFire(): boolean { return this.mIsCanFire }
    //double
    private mIsDouble: boolean = false;         //是否双倍攻击
    private mDoubleTimer: number = 10;          //双倍攻击时间
    public setDouble(timer: number = 10): void {
        this.mIsDouble = true;
        this.mDoubleTimer = timer;
    }

    constructor(root: cc.Node, roleId: number, uiSys: MainUISystem) {
        this.mUISys = uiSys;
        this.init(root);
        this.initSkill(roleId);
        this.createRoleObj(roleId);
    }

    private init(root: cc.Node): void {
        this.mTouchArea = cc.find("contentLayer/player_layer", root);
        this.mPyBulletLayer = cc.find("contentLayer/bullet_layer", root);
        if (this.mPyBulletLayer == null) return;
        if (this.mTouchArea == null) return;

        this.mCurrentX = this.mTouchArea.width * .5;
        GlobalVar.PoolMgr.createNodePool(PyBullet.type, this.mPyBulletLayer, GlobalVar.CONST.PY_BULLET_PATH, 25);
        GlobalVar.PoolMgr.createNodePool(PetBullet.type, this.mPyBulletLayer, GlobalVar.CONST.PET_BULLET_PATH, 15);
        this.onEvents();
    }
    private initSkill(roleId: number): void {
        switch (roleId) {
            case GlobalVar.CONST.ENUM.ROLE_TYPE.MAGE:
                this.mSkill = new MageSkill(this);
                GlobalVar.PoolMgr.createNodePool(PyFaShi.type, this.mPyBulletLayer, GlobalVar.CONST.PY_FASHI_PATH, 10);
                break;
            case GlobalVar.CONST.ENUM.ROLE_TYPE.MECHA:
                this.mSkill = new MechaSkill(this);

                let spineEff_layer: cc.Node = cc.find("Canvas/uiRoot/contentLayer/spineEff_layer");
                GlobalVar.PoolMgr.createNodePool(PyGuideMiss.type, this.mPyBulletLayer, GlobalVar.CONST.PY_GUIDE_MISS_PATH, 10);
                GlobalVar.PoolMgr.createNodePool(SmokeEff.type, spineEff_layer, GlobalVar.CONST.SMOKE_PATH, 20);
                break;
            case GlobalVar.CONST.ENUM.ROLE_TYPE.ELF:
                this.mSkill = new ElfSkill(this);
                GlobalVar.PoolMgr.createNodePool(PySwordkee.type, this.mPyBulletLayer, GlobalVar.CONST.PY_SWORDKEE_PATH, 10);
                break;
            default:
                this.mSkill = new MageSkill(this);
                GlobalVar.PoolMgr.createNodePool(PyFaShi.type, this.mPyBulletLayer, GlobalVar.CONST.PY_FASHI_PATH, 10);
                break;
        }
    }
    /**创建角色 */
    private createRoleObj(roleId: number): void {
        let hanRole = GlobalVar.GetHandler((obj) => {
            this.mRoleObj = obj;
            this.mSpine = this.mRoleObj.getComponentInChildren(sp.Skeleton);
            this.setSpine(roleId);
            let roleCollider: RoleCollider = this.mRoleObj.getComponent(RoleCollider);
            if (roleCollider) { roleCollider.setRole(this) }
            if (this.mTouchArea != null) {
                this.mRoleObj.parent = this.mTouchArea;
                this.mRoleObj.setPosition(this.mTouchArea.width * .5, -200);
                this.birth();
            }
            this.mPetMgr = new PetMgr(this.mRoleObj);
        }, this)
        let hanConver = GlobalVar.GetHandler((obj) => {
            this.mCover = obj;
            this.mCover.scale = 0;
            this.mCover.parent = this.mTouchArea;
            this.mCover.runAction(cc.repeatForever(cc.rotateBy(5, 360)))
        }, this)
        GlobalVar.Loader.loadPrefabObj(GlobalVar.CONST.COVER_PATH, hanConver);
        GlobalVar.Loader.loadPrefabObj(GlobalVar.CONST.ROLE_SKINPATH, hanRole);
    }
    /**设置spine骨骼数据 */
    private setSpine(roleId: number): void {
        let han = GlobalVar.GetHandler((spData: sp.SkeletonData) => {
            if (this.mSpine) { this.mSpine.skeletonData = spData; this.playStand() }
        }, this)

        GlobalVar.Loader.loadRes(this.getSpinePath(roleId), han, sp.SkeletonData);
    }
    /**获取spine骨骼数据路径 */
    private getSpinePath(roleId: number): string {
        let path: string = GlobalVar.CONST.ANIM_PATH.ROLE.FS;
        switch (roleId) {
            case 1:
                path = GlobalVar.CONST.ANIM_PATH.ROLE.FS
                break;
            case 2:
                path = GlobalVar.CONST.ANIM_PATH.ROLE.JJ
                break;
            case 3:
                path = GlobalVar.CONST.ANIM_PATH.ROLE.JL
                break;
            default:
                break;
        }
        return path;
    }

    private onEvents(): void {
        this.mTouchArea.on('touchstart', this.onTouchStart, this);
        this.mTouchArea.on('touchmove', this.onTouchMove, this);

        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.pyFire, this.pyFire.bind(this), "RoleCtrl");
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.petFire, this.petFire.bind(this), "RoleCtrl");
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.changeFlyState, this.changeFlyState.bind(this), "RoleCtrl");
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.getPet, this.getPet.bind(this), "RoleCtrl");
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.releaseSkills, this.releaseSkill.bind(this), 'RoleCtrl');
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.testUseTool, this.eatBuff.bind(this), 'RoleCtrl');
    }
    private offEvents(): void {
        this.mTouchArea.off('touchstart', this.onTouchStart, this);
        this.mTouchArea.off('touchmove', this.onTouchMove, this);

        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.pyFire, "RoleCtrl");
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.petFire, "RoleCtrl");
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.changeFlyState, "RoleCtrl");
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.getPet, "RoleCtrl");
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.releaseSkills, 'RoleCtrl');
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.testUseTool, 'RoleCtrl');
    }
    private onTouchStart(e): void {
        if (this.misDie) return;
        this.mTargetX = e.getLocationX();
    }
    private onTouchMove(e): void {
        if (this.misDie) return;
        this.mTargetX = e.getLocationX();
    }


    public rendererUpdate(dt): void {
        if (this.misDie) return;
        if (this.mCurrentX < 0) return;
        if (!this.mRoleObj) return;
        this.mRoleObj.x = this.mCurrentX;
        if (this.mCover) { this.mCover.position = this.mRoleObj.position }
        this.rotate(dt);
    }
    public logicUpdate(dt): void {
        if (this.misDie) return;
        if (this.mTargetX < 0) return;
        this.mSkill.update(dt);
        this.updateDouble(dt);
        if (this.mCurrentX === this.mTargetX) return;
        this.move();
    }
    /**控制移动 */
    private move(): void {
        let dir: number = (this.mTargetX > this.mCurrentX) ? 1 : -1;        //方向
        let dur: number = Math.abs(this.mTargetX - this.mCurrentX);         //总距离
        let moveDur: number = dur * this.mRatio;                            //当前需要移动的距离
        this.mCurrentX += dir * moveDur;

        if (Math.abs(this.mTargetX - this.mCurrentX) < 0.1) {
            this.mCurrentX = this.mTargetX;
            dir = 0;
        }
        this.mAngDir = dir;
    }
    /**控制旋转 */
    private rotate(dt): void {
        this.mTargetAng = (this.mAngDir > 0) ? -10 : (this.mAngDir == 0) ? 0 : 10;
        let angDir: number = (this.mCurAng > this.mTargetAng) ? -1 : 1;
        this.mCurAng += angDir * this.mRotSpeed * dt;
        if (this.mCurAng > 10) { this.mCurAng = 10 }
        else if (this.mCurAng < -10) { this.mCurAng = -10 }

        this.mRoleObj.angle = this.mCurAng;
    }
    private updateDouble(dt): void {
        if (!this.mIsDouble) return;
        this.mDoubleTimer -= dt;
        if (this.mDoubleTimer < 0) {
            this.stopDouble();
        }
    }
    /**停掉双排攻击 */
    private stopDouble(): void {
        this.mIsDouble = false;
        this.mDoubleTimer = 10;
    }
    /**玩家开火 */
    private pyFire(args: { id: number, lv: number, atk: number }): void {
        if (this.misDie) return;
        if (!this.isCanFire()) return;//冲刺不需要开火

        //加额外伤害(宠物buff)
        let ratio: number = this.mPetMgr.getAdditionalAtk();
        ratio += (args.lv * .3);
        args.atk *= ratio;

        if (!this.mIsDouble) {
            this.createPyBullet(args, 0);
        } else {
            this.createPyBullet(args, 50);
            this.createPyBullet(args, -50);
        }
    }
    private createPyBullet(args: { id: number, lv: number, atk: number }, posX: number): void {
        let bullet: cc.Node = GlobalVar.PoolMgr.get(PyBullet.type);
        if (bullet) {
            let pyBullet: PyBullet = bullet.getComponent(PyBullet);
            if (pyBullet) { pyBullet.init(args) }

            //计算开火位置
            let world: cc.Vec2 = this.mRoleObj.getPosition();
            world.x += posX;
            world.y += this.mFirePosY;
            bullet.setPosition(world);
        }
    }
    /**宠物开火 */
    private petFire(atk: number): void {
        if (this.misDie) return;
        if (!this.isCanFire()) return;//冲刺不需要开火
        this.mPetMgr.fire(atk);
    }
    /**改变飞行状态 */
    private changeFlyState(isAddSpeed: boolean): void {
        this.mIsInvincible = isAddSpeed;
        this.mIsCanFire = !isAddSpeed;

        if (this.mIsInvincible) {//无敌冲锋
            this.playSpurt();
            GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.invincible);
        }
        else {
            this.playStand();
        }
    }
    private getPet(lv: number): void {
        this.mPetMgr.createPet(lv);
    }
    public endSys(): void {
        this.offEvents();
    }


    //-------------------对外接口
    /**死亡 */
    public roleDie(): void {
        if (this.misDie) return;
        this.misDie = true;
        this.playDie();
        this.stopDouble();
        this.mSkill.setWait();

        this.mRoleObj.setPosition(cc.v2(375, -200));
        this.mRoleObj.active = false;

        setTimeout(() => {
            this.resurgence();
        }, 3000);
        (this.mUISys.getFacade() as MainFacade).getUISystem().startCountDown(3);

        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.roleDie);
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.playDie);
    }
    /**
     * 生成玩家 初始化其位置
    */
    private birth(): void {
        this.mIsInvincible = true;
        this.mIsCanFire = false;
        this.playStand();
        this.mRoleObj.runAction(cc.sequence(
            cc.moveBy(1, cc.v2(0, 450)),
            cc.callFunc(() => { this.mIsCanFire = true }),
            cc.delayTime(2),
            cc.callFunc(() => {
                this.mIsInvincible = false;
            })
        ))
    }
    /**复活 */
    private resurgence(): void {
        this.playStand();

        this.misDie = false;
        this.mIsInvincible = true;
        this.mIsCanFire = false;
        this.mRoleObj.active = true;
        this.mRoleObj.runAction(cc.sequence(
            cc.moveBy(2, cc.v2(0, 450)),
            cc.callFunc(() => { this.mIsCanFire = true }),
            cc.delayTime(2),
            cc.callFunc(() => {
                if (this.mCover) {
                    this.mCover.runAction(
                        cc.scaleTo(.3, 0).easing(cc.easeBackIn())
                    )
                }
            }),
            cc.delayTime(.5),
            cc.callFunc(() => {
                this.mIsInvincible = false;
            })
        ))

        if (this.mCover) { this.mCover.scale = 1 }
    }
    /**获取玩家节点 */
    public getRoleNode(): cc.Node {
        if (this.mRoleObj) { return this.mRoleObj };
        return null;
    }
    /**释放角色技能 */
    public releaseSkill(cb: Function): void {
        if (this.isInvincible()) { cb(); return };
        this.mSkill.releaseSkill(cb);
    }


    //eat buff-------------------------------------
    public eatBuff(id: number): void {
        let audioId: number = GlobalVar.CONST.ENUM.AUDIO_TYPE.getProp;
        switch (id) {
            case GlobalVar.CONST.ENUM.BUFF_ID.gold:
                audioId = GlobalVar.CONST.ENUM.AUDIO_TYPE.getGold;
                GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.eatScore, 100);
                break;
            case GlobalVar.CONST.ENUM.BUFF_ID.call:
                this.useToolToOpp(0);
                GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.removeProp, GlobalVar.CONST.ENUM.BUFF_ID.call);
                break;
            case GlobalVar.CONST.ENUM.BUFF_ID.charge:
                if (!this.mUISys.isBossState() && !this.isInvincible()) {
                    GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.changeFlyState, true);
                    GlobalVar.CurGameSpeed.isLongAddSpeed = true;
                    this.mSkill.setWait();
                    (this.mUISys.getFacade() as MainFacade).getSpineEffSys().closeSpLaser();
                }
                break;
            case GlobalVar.CONST.ENUM.BUFF_ID.double:
                this.setDouble();
                break;
            case GlobalVar.CONST.ENUM.BUFF_ID.laser:
                if (this.isCanFire()) {
                    this.mUISys.playSpLaser(this.mRoleObj.position.add(cc.v2(0, 100)));
                    audioId = GlobalVar.CONST.ENUM.AUDIO_TYPE.laserGun;
                }
                break;
            case GlobalVar.CONST.ENUM.BUFF_ID.snipe:
                GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.sniper);
                break;
            case GlobalVar.CONST.ENUM.BUFF_ID.speed:
                this.useToolToOpp(1);
                GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.removeProp, GlobalVar.CONST.ENUM.BUFF_ID.speed);
                break;
            case GlobalVar.CONST.ENUM.BUFF_ID.up:
                GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.changeBulletLv);
                break;
            case GlobalVar.CONST.ENUM.BUFF_ID.petFire:
                GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.getPet, 1);
                GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.removeProp, GlobalVar.CONST.ENUM.BUFF_ID.petFire);
                break;
            case GlobalVar.CONST.ENUM.BUFF_ID.petIce:
                GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.getPet, 2);
                GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.removeProp, GlobalVar.CONST.ENUM.BUFF_ID.petIce);
                break;
            default:
                break;
        }

        GlobalVar.AudioMgr.playSound(audioId);
    }
    /**
     * 给对方玩家使用道具
     * @param id 道具id (0:召唤精英怪，1：短加速)
     */
    private useToolToOpp(id: number): void {
        this.mUISys.getNetSystem().useTool(id);
        this.mUISys.playUseToolAction(id, this.getRoleNode().position);
    }


    //spine动画------------------------------------
    /**待机 */
    private playStand(): void {
        if (!this.mSpine) return;
        this.mSpine.setAnimation(0, 'fly', true);
    }
    /**冲刺 */
    private playSpurt(): void {
        if (!this.mSpine) return;
        this.mSpine.setAnimation(0, 'spurt', true);
    }
    /**死亡 */
    private playDie(): void {
        this.mUISys.playSpExploed(GlobalVar.CONST.ENUM.SPINE_EFFECT.role_die, this.mRoleObj.position);
    }
    /**技能攻击提示 */
    public attkTip(): cc.Node {
        return this.mUISys.playSpExploed(GlobalVar.CONST.ENUM.SPINE_EFFECT.attack, this.mRoleObj.position);
    }
}

/**
 * #技能类
 * #三种英雄对应不同的技能
 */
class ISkill {

    protected mRoleCtrl: RoleCtrl = null;
    protected mDuration: number = 0;            //技能持续时间
    protected mState: number = -1;              //攻击状态（-1待机，1正在攻击）
    protected mFrequency: number = .2;          //攻击频率
    protected mStepFrequency: number = .2;      //暂存攻击频率
    protected mIsStart: boolean = false;

    protected mCb: Function = null;
    protected mTarget: cc.Node = null;          //提示特效目标（每次技能攻击的时候都会有提示特效）

    constructor(roleCtrl: RoleCtrl) {
        this.mRoleCtrl = roleCtrl;
    }
    protected init(): void {
        this.mDuration = 3;
        this.mState = 1;
        this.mIsStart = false;

        setTimeout(() => {
            this.mIsStart = true;
            this.mTarget = null;
        }, 500);
        this.mTarget = this.attkTip();
    }
    /**停掉技能 */
    public setWait(): void {
        if (this.mState === -1) return;
        this.attEnd();
    }

    public update(dt): void {
        switch (this.mState) {
            case -1:
                this.updateWait(dt);
                break;
            case 1:
                this.updateAtt(dt);
                break;
        }
    }
    protected updateWait(dt): void {

    }
    protected updateAtt(dt): void {
        if (this.mTarget) { this.mTarget.position = this.mRoleCtrl.getRoleNode().position }

        if (!this.mIsStart) return;
        this.mDuration -= dt;
        if (this.mDuration < 0) {
            this.attEnd();
            return;
        }

        this.mFrequency -= dt;
        if (this.mFrequency < 0) {//attk
            this.mFrequency = this.mStepFrequency;
            this.attk();
        }
    }
    /**攻击 */
    protected attk(): void { }
    /**播放攻击提示 */
    protected attkTip(): cc.Node {
        return this.mRoleCtrl.attkTip();
    }
    /**攻击结束 */
    protected attEnd(): void {
        this.mIsStart = false;
        this.mState = -1;
        if (!!this.mCb) {
            this.mCb();
            this.mCb = null;
        }
    }

    /**释放技能 */
    public releaseSkill(cb: Function): void {
        if (this.mState > 0) return;//攻击状态
        this.mCb = cb;
        this.init();
        this.playSkillAudio();
    }
    protected playSkillAudio(): void {

    }

}
/**法师技能 ------激光 */
class MageSkill extends ISkill {
    /**X轴方向的三个基础固定位置 */
    private mPosXList: Array<number> = [
        GlobalVar.SysInfo.view.width * .5 - 180,
        GlobalVar.SysInfo.view.width * .5,
        GlobalVar.SysInfo.view.width * .5 + 180,
    ]
    private mIndex: number = 0;

    protected attk(): void {
        let node: cc.Node = GlobalVar.PoolMgr.get(PyFaShi.type);
        if (node) {
            node.setPosition(this.getPos());
            let nodeSc: PyFaShi = node.getComponent(PyFaShi);
            if (nodeSc) {
                nodeSc.init();
            }
        }
    }
    /**获取攻击位置 */
    private getPos(): cc.Vec2 {
        let posX: number = this.mPosXList[this.mIndex];
        posX += (Math.random() - .5) * 2 * 200;

        this.mIndex = (this.mIndex + 1) % this.mPosXList.length;

        return cc.v2(posX, -100);
    }
    protected playSkillAudio(): void {
        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.roleSkill_1);
    }

}
/**机甲人技能-------炮弹 */
class MechaSkill extends ISkill {
    private mDirList: Array<number> = [
        75 * Math.PI / 180,
        90 * Math.PI / 180,
        105 * Math.PI / 180
    ];
    private mIndex: number = 0;

    constructor(roleCtrl: RoleCtrl) {
        super(roleCtrl);
        this.mFrequency = this.mStepFrequency = .1;
    }

    protected attk(): void {
        this.createSwordkee();
    }
    private createSwordkee(): void {
        let node: cc.Node = GlobalVar.PoolMgr.get(PyGuideMiss.type);
        if (node) {
            node.setPosition(this.mRoleCtrl.getRoleNode().position);
            let nodeSc: PyGuideMiss = node.getComponent(PyGuideMiss);
            if (nodeSc) {
                nodeSc.init(this.getRandRad());
            }
        }
    }
    /**获取随机弧度 */
    private getRandRad(): number {
        let ang: number = (this.mIndex == 1) ? 10 : 30;
        let rad: number = this.mDirList[this.mIndex] + (Math.random() - .5) * ang * Math.PI / 180;
        this.mIndex = (this.mIndex + 1) % 3;
        return rad;
    }
    protected playSkillAudio(): void {
        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.roleSkill_2);
    }
}
/**精灵技能-------剑罡 */
class ElfSkill extends ISkill {

    /*     private mRadians: Array<number> = [
            45 * Math.PI / 180,
            90 * Math.PI / 180,
            135 * Math.PI / 180
        ]; */

    protected attk(): void {
        this.createSwordkee(90 * Math.PI / 180);
    }

    private createSwordkee(rad: number): void {
        let node: cc.Node = GlobalVar.PoolMgr.get(PySwordkee.type);
        if (node) {
            let nodeSc: PySwordkee = node.getComponent(PySwordkee);
            if (nodeSc) {
                nodeSc.init(rad);
            }

            node.setPosition(this.mRoleCtrl.getRoleNode().position);
        }
    }
    protected playSkillAudio(): void {
        GlobalVar.AudioMgr.playSound(GlobalVar.CONST.ENUM.AUDIO_TYPE.roleSkill_3);
    }
}

