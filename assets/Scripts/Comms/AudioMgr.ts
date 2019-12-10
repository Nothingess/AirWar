
interface waitSound {
    type: number,
    loop: boolean,
    volume: number
}
export class AudioMgr {
    private static inst: AudioMgr;

    private mIsMuteBgm: boolean = false;
    private mIsMuteEff: boolean = false;

    private mCurEffCount: number = 0;

    /**切换背景音乐状态 */
    public changeBgmState(): boolean {
        this.mIsMuteBgm = !this.mIsMuteBgm;
        return this.mIsMuteBgm;
    }
    /**切换音效状态 */
    public changeEffState(): boolean {
        this.mIsMuteEff = !this.mIsMuteEff;
        return this.mIsMuteEff;
    }

    public static getInst(): AudioMgr {
        if (!this.inst) {
            this.inst = new AudioMgr();
        }
        return this.inst;
    }

    public playSound(type: number, loop?: boolean, volume?: number): void {
        if (this.mIsMuteEff) return;
        if (this.mCurEffCount >= 10) return;//同时多于五个音效不继续播放

        this.mCurEffCount++;
        let path: string = GlobalVar.CONST.AUDIO_PATH[type];

        let han = GlobalVar.GetHandler((clip: cc.AudioClip) => {
            let audioId: number = cc.audioEngine.play(clip, loop ? loop : false, volume)
            cc.audioEngine.setFinishCallback(audioId, () => {
                this.mCurEffCount--;
            });
        }, this)

        GlobalVar.Loader.loadRes(path, han, cc.AudioClip);
    }
    public playBGM(type: number): void {
        if (this.mIsMuteBgm) return;
        let path: string = GlobalVar.CONST.AUDIO_PATH[type];

        let han = GlobalVar.GetHandler((clip: cc.AudioClip) => {
            cc.audioEngine.playMusic(clip, true);
            cc.audioEngine.setMusicVolume(.8);
        }, this)

        GlobalVar.Loader.loadRes(path, han, cc.AudioClip);
    }

    public stopAll() {
        cc.audioEngine.stopAll();
    }

    public pauseAll() {
        cc.audioEngine.pauseAll();
    }

    public resumeAll() {
        cc.audioEngine.resumeAll();
    }

    public stopBgm(): void {
        cc.audioEngine.stopMusic();
    }
    public pauseMusic(): void {
        if (cc.audioEngine.isMusicPlaying())
            cc.audioEngine.pauseMusic();
    }
    public resumeBGM() {
        if (!cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.resumeMusic();
        }
    }

}