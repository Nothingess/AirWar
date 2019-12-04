/**hago平台工具 */
declare namespace LCHago {

    ///api---------------------------------------------
    /**
     * 发起连接请求
     * @param val 是否是测试服，测试 val = 1
     */
    export function connect(val?: number): void;
    /**准备结束,在onCreate里面调用 */
    export function ready(): void;
    /**
     * 给对方使用道具
     * @param id 道具id
     */
    export function tool(id: number, isAi?: boolean): void;
    /**
     * 上传分数
     * @param val 分数值
     * @param isAi 是否上传ai分数（默认自己）
     */
    export function score(val: number, isAi?: boolean): void;
    /**请求结算
     * #当收到服务端发送过来的倒计时为0时发起请求
     */
    export function finish(): void;
    ///回调--------------------------------------------
    export let onCreate: Function;
    export let onStart: Function;
    export let onCountDown: Function;
    export let onOpponentScore: Function;
    export let onOpponentTool: Function;
    export let onResult: Function;
    export let onReconnectBegin: Function;
    export let onReconnectFinish: Function;
    export let onClose: Function;
}