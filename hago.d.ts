declare namespace hago {
    export function init(
        roomID: string,
        gameID: string,
        kvHost: string,
        kvSign: string
    );
    export function getGameID(): string;
    export function getRoomID(): string;
    export function onPKLoading(): void;
    export function onPKFinishLoading(): void;
    export function onPKLoadFail(): void;
    export function onPKStart(): void;
    export function onPKFinish(result: string): void;
    export function onPKExceptionFinish(): void;
    /**
     * 通知 app 退出游戏，一般与 setGameExitCallback 配合使用，在 setGameExitCallback 的回调中调用 onGameExit
     */
    export function onGameExit(): void;

    //需要在 setGameReadyCallback 回调被通知后调用
    export function getUserInfo(paras: {
        userIDs: string;
        success: Function;
        failure: Function;
    }): void;
    export function setEnterBackgroundCallback(cb: Function): void;
    export function setEnterForegroundCallback(cb: Function): void;
    export function setGameExitCallback(cb: Function): void;
    export function setGameReadyCallback(cb: Function): void;
    export function setGameReadyCallback(cb: Function): void;
    export function getDeviceInfo(params: {
        success: (deviceInfo: {
            safeAreaInser: {
                top: number;
                left: number;
                bottom: number;
                right: number;
            };
            lang: string;
            screenSize: {
                width: number;
                height: number;
            };
        }) => void;
        failure: () => void;
    }): void;
    // langhago.getDeviceInfo
}
