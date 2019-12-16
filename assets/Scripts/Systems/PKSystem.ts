import { ISystem } from "./ISystem";
import { ISceneFacade, MainFacade } from "../Scenes/ISceneFacade";
import { CloseAnAccountPanel } from "./UISystem/IUIBase";

/**pk对局管理 */
export class PKSystem extends ISystem {

    private mBossList: Array<number> = [];              //boss列表（每次随机选取两个boss开始游戏）
    private mCountDown: number = 120;
    private mSecond: number = 1;
    private mGameOver: boolean = false;
    private mSelfPlayer: MySelf = null;
    private mOppPlayer: Oppoent = null;

    private mBossId: number = 0;    //当前boss id

    public initSys(iFacade: ISceneFacade): void {
        super.initSys(iFacade);

        this.onEvents();
    }
    /**初始化玩家阵营 */
    private initCamp(): void {

        let tempArr: Array<number> = [0, 1, 2, 3];
        for (let i = 0; i < 4; i++) {
            let rand: number = GlobalVar.SeedRandom();
            let index: number = GlobalVar.GetEleformArrByPer(tempArr, rand);
            if (!index) { index = 0 }

            this.mBossList.push(tempArr[index])
            tempArr.splice(index, 1);
        }

        //this.mBossList = [1, 0, 2, 2]
        console.log(`boss coming arr : ${this.mBossList}`);

        this.mSelfPlayer = new MySelf(this);
        if (GlobalVar.NetConfig.isAI) { this.mOppPlayer = new AI(this); }
        else { this.mOppPlayer = new Oppoent(this); }
    }
    public logicUpdate(dt): void {
        if (this.mGameOver) return;
        if (!this.mOppPlayer) return;
        this.mOppPlayer.update(dt);
        this.updateLocalTimer(dt);
    }
    private updateLocalTimer(dt): void {
        if (!GlobalVar.NetConfig.isOffLine) return;
        this.mSecond -= dt;
        if (this.mSecond < 0) {
            this.mSecond = 1;
            this.mCountDown--;
            if (this.checkCountDown()) return;
            this.updateCountDownUI(this.mCountDown);
        }
    }

    private onEvents(): void {
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.start, this.initCamp.bind(this), 'PKSystem');
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.netClose, this.netCloseOver.bind(this), 'PKSystem');
    }
    private offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.start, 'PKSystem');
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.netClose, 'PKSystem');
    }
    /**
     * 更新分数面板
     * @param id 玩家id （自己：id = 0；对方：id = 1）
     * @param scoreVal 分数值
     */
    public updateScoreUI(id: number, scoreVal: number): void {
        (this.mFacade as MainFacade).getUISystem().updateScoreUI(id, scoreVal);
    }
    public updateOppScore(val: number): void {
        this.mOppPlayer.updateOppScore(val);
    }
    public updateCountDown(timer: number): void {
        if (this.mGameOver) return;
        this.mCountDown = timer;
        this.checkCountDown();
        this.updateCountDownUI(this.mCountDown);
    }
    private updateCountDownUI(val: number): void {
        (this.mFacade as MainFacade).getUISystem().updateCountDown(val);
    }
    /**检测倒计时是否完成 */
    private checkCountDown(): boolean {
        if (this.mCountDown <= 0) {
            this.timerOutOver();
            console.log('checkCountDown end true--------------------------')
            return true;
        }
        return false;
    }
    /**游戏结束 */
    public gameOver(): void {
        if (this.mGameOver) return;
        if (this.mSelfPlayer) { this.mSelfPlayer.setEnd() }
        if (this.mOppPlayer) { this.mOppPlayer.setEnd() }

        this.mGameOver = true;
        GlobalVar.EventMgr.dispatchEvent(GlobalVar.CONST.EVENT.gameOver);
    }
    /**倒计时结束请求结算 */
    private timerOutOver(): void {
        this.gameOver();
        (this.mFacade as MainFacade).getNetSystem().reqGameOver();
    }
    /**网络断开结束 */
    private netCloseOver(): void {
        this.gameOver();
        let selfScore: number = (this.mSelfPlayer !== null) ? this.mSelfPlayer.getScore() : 0;
        let oppScore: number = (this.mOppPlayer !== null) ? this.mOppPlayer.getScore() : 0;
        console.error(`oppScore : ${oppScore}`);
        (this.mFacade as MainFacade).getUISystem().openPanel(CloseAnAccountPanel, 'CloseAnAccountPanel',
            [2, selfScore, oppScore]);
    }
    /**当前ai获取boss id */
    public getBossId(lv: number): number {
        let id: number = this.mBossList[lv];
        return (id ? id : 0);
    }
    /**ai使用道具 */
    public aiUseTool(id: number): void {
        (this.mFacade as MainFacade).getNetSystem().aiUseTool(id);
    }
    public endSys(): void {
        super.endSys();
        this.offEvents();
    }





    ///AI check score---------------------------------
    /**获取玩家分数 */
    public getPlayScore(): number {
        if (!this.mSelfPlayer) return 0;
        return this.mSelfPlayer.getScore();
    }
}

class IPlayer {

    protected mPkSys: PKSystem = null;
    protected mId: number = 0;
    protected mScoreVal: number = 0;
    protected mIsEnd: boolean = false;            //是否结束
    public setEnd(): void { this.mIsEnd = true }
    public getScore(): number { return this.mScoreVal }


    constructor(pkSys: PKSystem) {
        this.mPkSys = pkSys;
        this.init();
        this.onEvents();
    }

    protected init(): void { }
    protected onEvents(): void { }
    protected offEvents(): void { }

    public update(dt): void { }
    /**加分 */
    public addScore(val: number): void {
        if (this.mIsEnd) return;
        this.mScoreVal += val;
        if (this.mPkSys) { this.mPkSys.updateScoreUI(this.mId, this.mScoreVal) }
    }
}
class MySelf extends IPlayer {
    protected init(): void {
        super.init();
        this.mId = 0;
    }

    public addScore(val: number): void {
        if (this.mIsEnd) return;
        super.addScore(val);
        (this.mPkSys.getFacade() as MainFacade).getUISystem().openLocalTip(`+${val}`);
        (this.mPkSys.getFacade() as MainFacade).getNetSystem().uploadScore(this.mScoreVal);
    }

    protected onEvents(): void {
        GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.eatScore, this.addScore.bind(this), 'MySelf');
    }
    protected offEvents(): void {
        GlobalVar.EventMgr.removeEventListenerByTag(GlobalVar.CONST.EVENT.eatScore, 'MySelf');
    }
}
class Oppoent extends IPlayer {
    protected init(): void {
        this.mId = 1;
    }
    /**更新对手分数 */
    public updateOppScore(val: number): void {
        if (this.mIsEnd) return;
        this.mScoreVal = val;
        if (this.mPkSys) { this.mPkSys.updateScoreUI(this.mId, this.mScoreVal) }
    }
}
class AI extends Oppoent {

    protected mAIStateMgr: AIStateMgr = null;
    protected mBossList: Array<number> = [];

    constructor(pkSys: PKSystem) {
        super(pkSys);
        this.mAIStateMgr = new AIStateMgr(this);
        this.mAIStateMgr.setState(new MinMonsterState(this.mAIStateMgr));
    }
    public update(dt): void {
        if (this.mIsEnd) return;

        this.mAIStateMgr.update(dt);
    }
    public updateOppScore(val: number): void {
        if (this.mIsEnd) return;
        this.checkAIScore(val);
        if (this.mPkSys) {
            //this.mPkSys.updateScoreUI(this.mId, this.mScoreVal);
            (this.mPkSys.getFacade() as MainFacade).getNetSystem().uploadOppScore(this.mScoreVal);
        }
    }
    /**检测ai分数，合理化 */
    private checkAIScore(val: number): void {
        let playerScore: number = this.mPkSys.getPlayScore();
        let offset: number = 0;
        if (this.mScoreVal > playerScore) {//ai 分数大于玩家分数

            offset = this.mScoreVal - playerScore;
            if (offset > (playerScore * .3)) {
                val -= 100;
            }

        } else if (this.mScoreVal < playerScore) {//ai 分数小于玩家分数
            if (this.mScoreVal > 2000) {
                offset = playerScore - this.mScoreVal;

                if (offset > (this.mScoreVal * .5)) {
                    val += 200;
                } else if (offset > (this.mScoreVal * .3)) {
                    val += 100;
                }
            }
        }
        this.mScoreVal += val;
    }
    /**ai使用道具 */
    public useTool(id: number): void {
        this.mPkSys.aiUseTool(id);
    }
    /**当前ai获取boss id */
    public getAIBossId(lv: number): number {
        return this.mPkSys.getBossId(lv);
    }
}
class AIStateMgr {

    private mAI: AI = null;
    public getAi(): AI { return this.mAI }
    private mCurState: AIState = null;
    private mCurBossIndex: number = 0;
    public getCurBossId(): number { return this.mAI.getAIBossId(this.mCurBossIndex) }
    public nextBoss(): void { this.mCurBossIndex++; }

    constructor(ai: AI) {
        this.mAI = ai;
        this.mCurBossIndex = 0;
    }

    public setState(aiState: AIState): void {
        if (this.mCurState) { this.mCurState.end() }
        this.mCurState = aiState;
        this.mCurState.init();
    }

    public update(dt): void {
        if (this.mCurState) {
            this.mCurState.update(dt);
        }
    }
    public end(): void {
        if (this.mCurState) {
            this.mCurState.end();
        }
    }

    public getScore(val: number): void {
        this.mAI.updateOppScore(val);
    }
}

class AIState {

    protected mAIStateMgr: AIStateMgr = null;

    constructor(stateMgr: AIStateMgr) {
        this.mAIStateMgr = stateMgr;
    }
    public init(): void {

    }
    public update(dt): void {

    }
    public end(): void {

    }

    protected getScore(val: number): void {
        if (!this.mAIStateMgr) return;
        this.mAIStateMgr.getScore(val);
    }
}

class MinMonsterState extends AIState {

    private mBoutTime: number = 3.2;    //一波小怪的时间
    private mStepBoutTime: number = 3.2;
    private mUseToolTime: number = Math.random() * 10 + 5;
    private mIsUseTool: boolean = false;

    private mTimerTotal: number = 0;

    public update(dt): void {
        this.mBoutTime -= dt;
        if (this.mBoutTime < 0) {
            this.mTimerTotal++;
            if (this.mTimerTotal > 10) {
                this.mAIStateMgr.setState(new BossState(this.mAIStateMgr))
                return;
            }
            this.mBoutTime = this.mStepBoutTime;
            this.killBoutMonster();
        }

        if (this.mIsUseTool) return;
        this.mUseToolTime -= dt;
        if (this.mUseToolTime < 0) {
            this.mIsUseTool = true;
            this.useTool(Math.floor(Math.random() * 2));
        }
    }
    /**杀死一波小怪 */
    public killBoutMonster(): void {
        let count: number = Math.floor(Math.random() * 4) + 2;//随机击杀个数
        let goldCount: number = Math.floor(Math.random() * 6);//随机拾取金币个数

        let score: number = count * 100;
        if (count === 5) { score += 200 }

        this.getScore(score);
        setTimeout(() => {
            this.getScore(goldCount * 100);
        }, 2000);
    }
    /**ai使用道具 */
    public useTool(id: number): void {
        this.mAIStateMgr.getAi().useTool(id);
    }
}
class AddSpeedStaet extends AIState {
    private mTotalTimer: number = 4;
    private mInterval: number = .5;

    public update(dt): void {
        this.mTotalTimer -= dt;
        if (this.mTotalTimer < 0) {
            this.mAIStateMgr.setState(new MinMonsterState(this.mAIStateMgr));
            return;
        }

        this.mInterval -= dt;
        if (this.mInterval < 0) {
            this.mInterval = Math.random() * .2 + .3;
            this.getScore(100);
        }
    }
}
class DieState extends AIState {

}
class BossState extends AIState {

    private mBossTimer: number = 20;

    public init(): void {
        super.init();
        this.setBossTimer();
    }
    /**根据bossid 初始话boss的难度（击败需要的时间） */
    private setBossTimer(): void {
        let id: number = this.mAIStateMgr.getCurBossId();
        switch (id) {
            case 0://老一
                this.mBossTimer = Math.random() * 10 + 10;
                break;
            case 1://老二
                this.mBossTimer = Math.random() * 10 + 20;
                break;
            case 2://老三
                this.mBossTimer = Math.random() * 10 + 25;
                break;
            case 3://老四
                this.mBossTimer = Math.random() * 10 + 25;
                break;

            default:
                break;
        }
    }

    public update(dt): void {
        this.mBossTimer -= dt;
        if (this.mBossTimer < 0) {
            this.getBossAward();
            if (Math.random() > .5) {
                this.mAIStateMgr.setState(new MinMonsterState(this.mAIStateMgr));
                this.mAIStateMgr.nextBoss();
                return;
            } else {
                this.mAIStateMgr.setState(new AddSpeedStaet(this.mAIStateMgr));
                this.mAIStateMgr.nextBoss();
                console.log('对方玩家进入加速状态');
                return;
            }
        }
    }

    public getBossAward(): void {
        let score: number = 2000 + (Math.floor(Math.random() + 2) * 4) * 100;
        this.getScore(score);
    }
}