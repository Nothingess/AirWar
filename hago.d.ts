declare namespace hg {
    export interface Result {
        timestamp: number,
        nonstr: string,
        sign: string,
        gametype: string,
        result: {
            gameid: string,
            roomid: string,
            channelid: string,
            resulttype: string,
            users: string[],
            winners: string[],
        },
    }
    export function getMatchupUrl(): string;
    export function gameLoadResult(): void;
    export function pkStart(): void;
    export function pkFinish(result: Result): void;
    export function pkFinishError(): void;

    export function listenPkExit(cb: () => void): void;
    export function exitPkGame(): void;

    export function setEnterBackgroundCallback(cb: Function): void;
    export function setEnterForegroundCallback(cb: Function): void;
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
