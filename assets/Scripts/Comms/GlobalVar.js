import { LoaderMgr, gen_handler } from "./LoaderMgr";
import { EventMgr } from "./EventMgr";
import { AudioMgr } from "./AudioMgr";
import { PoolMgr } from "./PoolMgr";


/**
 * 将一个向量转化为一个角度  { 以cc.v2(1, 0)为正方向 }
 * @param {cc.Vec2} dirVec 方向向量
 * # js例子
 * this.node.angle = -this.vectorsToDegress(cc.v2(dir.x, dir.y));
 *  */
function vectorsToDegress(dirVec) {
    let radian = dirVec.signAngle(cc.v2(0, 1));                 // 求方向向量与对比向量间的弧度
    let degree = cc.misc.radiansToDegrees(radian);              // 将弧度转换为角度
    return degree;
}
/**将一个角度（弧度）转化为一个单位向量 */
function degressToVectors(radian) {
    return cc.v2(Math.cos(radian), Math.sin(radian));
}
/**设置游戏当前视窗大小 */
function setView(size) {
    if (size.width == 0 || size.height == 0) return;
    GlobalVar.SysInfo.view = size;
}
let seed = 5;
/**随机种子生成的伪随机数 */
function seedRandom(max, min) {
    max = max || 1;
    min = min || 0;

    seed = (seed * 9301 + 49297) % 233280;
    let rnd = seed / 233280.0;
    return min + rnd * (max - min);
}
/**
 * 通过百分比来获取数组中对应元素的索引
 * @param {Array} arr 目标数组
 * @param {*} per 百分比(0~1之间，不包括1)
 */
function getEleformArrByPer(arr, per) {
    if (per >= 1) { per = .99 }
    if (per < 0) { per = 0 }
    if (arr.length <= 0) return null;

    let unit = 1 / arr.length;
    let index = Math.floor(per / unit);
    return index;
}

window.GlobalVar = {}
GlobalVar.Loader = LoaderMgr.getInst();                     //资源管理器
GlobalVar.EventMgr = EventMgr.getInst();                    //事件管理器
GlobalVar.AudioMgr = AudioMgr.getInst();                    //音频管理器
GlobalVar.PoolMgr = PoolMgr.getInst();                      //对象池管理器
GlobalVar.SysInfo = {
    /**视图大小 */
    view: cc.size(750, 1334)
}

//函数----------------------------
GlobalVar.log = (message, ...optionalParams) => { console.log('s-cocosdebug// ', message, optionalParams) }
GlobalVar.error = (message, ...optionalParams) => { console.error('s-cocoserror// ', message, optionalParams) }
/** 用于绑定回调函数this指针*/
GlobalVar.GetHandler = gen_handler;
/** 将一个向量转化为一个角度  { 以cc.v2(1, 0)为正方向 }*/
GlobalVar.VectorsToDegress = vectorsToDegress;
/**将一个角度（弧度）转化为一个单位向量 */
GlobalVar.DegressToVectors = degressToVectors;
GlobalVar.SetView = setView;
GlobalVar.SeedRandom = seedRandom;
GlobalVar.SetSeed = (val) => {
    seed = GlobalVar.NetConfig.randomSeed = val;
    GlobalVar.log(`随机数${seed}`);
}
GlobalVar.GetEleformArrByPer = getEleformArrByPer;

//字段
GlobalVar.NetConfig = {
    selectRoleId: 0,
    /**对手是ai玩家 */
    isAI: false,
    /**我方玩家头像 tex2d */
    selfAvatar: null,
    /**对方玩家头像 tex2d */
    oppAvatar: null,
    /**随机种子 */
    randomSeed: 0,
    /**连接服务器成功 */
    isConnect: false,
    /**准备就绪 */
    isReady: false,
    /**开始游戏 */
    isStart: false,
    /**是否掉线 */
    isOffLine: false,
    /**当前系统语言 */
    language: 'en',
    /**游戏结束 */
    isGameOver: false,
    /**登陆游戏天数 */
    loginTimes: 0,
    /**上一次登陆日期 */
    lastLoginTime: 0
}

GlobalVar.CurGameSpeed = {
    /**长加速 */
    isLongAddSpeed: false,
    /**短加速 */
    isShortAddSpeed: false
}
/**常量 */
GlobalVar.CONST = {
    /**事件类型 */
    EVENT: {
        /**开始游戏 */
        gameStart: 1,
        /**加载进度 */
        loadProgress: 2,
        /**玩家开火 */
        pyFire: 3,
        /**宠物开火 */
        petFire: 4,
        /**切换子弹等级 */
        changeBulletLv: 5,
        /**获取宠物 */
        getPet: 6,
        /**改变飞行速度 */
        changeSpeedFly: 7,
        /**改变飞行状态（加速 or 减速） */
        changeFlyState: 8,
        /**进入下一关 */
        nextLevel: 9,
        /**拾取能量 */
        eatPower: 10,
        /**更新能量进度 */
        updtePowerPro: 11,
        /**玩家角色释放技能 */
        releaseSkills: 12,
        /**增加分数 */
        eatScore: 13,
        /**狙击 */
        sniper: 14,
        /**召唤精英小怪(对方玩家召唤)) */
        callEeEnemy: 15,
        /**玩家死亡 */
        playDie: 16,
        /**打开面板 */
        openPanel: 17,
        /**角色生成初始话 */
        roleBirth: 18,


        //Net
        /**连接成功 */
        connectSuc: 19,
        /**准备就绪 */
        ready: 20,
        /**准备开始倒计时 */
        readyCountDown: 21,
        /**开始 */
        start: 22,
        /**倒计时 */
        countDown: 23,
        /**断线重连中 */
        offLine: 24,
        /**重连成功 */
        onLine: 25,
        /**重连失败 */
        offLineEnd: 26,
        /**游戏结束，进行结算 */
        gameOver: 27,
        /**网络断开，游戏结束 */
        netClose: 28,
        /**暴力退出 */
        forceClose: 29,


        /**移除道具 */
        removeProp: 30,


        testUseTool: 31

    },
    /**枚举类型 */
    ENUM: {
        /**面板层级枚举 */
        PANEL_LAYER: {
            /**功能面板层 */
            funcLayer: "funcLayer",
            /**特效层 */
            effLayer: "effLayer",
            /**弹窗层 */
            alertLayer: "alertLayer",
            /**提示层 */
            tipLayer: "tipLayer",
            /**顶层（一般用于全屏覆盖） */
            topLayer: "topLayer"
        },
        /**玩家角色 */
        ROLE_TYPE: {
            /**法师 */
            MAGE: 1,
            /**机甲 */
            MECHA: 2,
            /**精灵 */
            ELF: 3
        },
        /**宠物类型 */
        PET_TYPE: {
            /**烈焰龙 */
            flame: 1,
            /**黄金龙 */
            ice: 2,
            /**冰原龙 */
            gold: 3,
            /**雷电龙 */
            thunder: 4
        },
        /**小怪类型要区分开 */
        MIN_ENEMY: {
            m1: "m1",
            m2: "m2",
            m3: "m3",
            m4: "m4"
        },
        /**碰撞分层tag */
        COLLIDER_ID: {
            /**默认id */
            default: 0,
            /**敌人 */
            enemy: 1,
            /**玩家角色子弹 */
            pyBullet: 2,
            /**玩家角色 */
            role: 3,
            /**道具buff */
            buff: 4,
            /**敌人子弹 */
            eyBullet: 5,
            /**激光炮（碰撞分组group属于pyBullet, 只是tag不一样） */
            laserGun: 6,
            /**敌人boss（碰撞分组group属于enemy， 只是tag不一样，用来区分标识enemy和boss） */
            boss: 7,
            /**buff 触发器：吃buff（碰撞分组group属于role, 只是tag不一样，用来区别role和buffTrigger） */
            buffTrigger: 8
        },
        /**道具id分类 */
        BUFF_ID: {
            /**金币 */
            gold: -1,
            /**给对方召唤个精英小怪 */
            call: 1,
            /**无敌冲锋 */
            charge: 2,
            /**双排子弹 */
            double: 3,
            /**激光炮 */
            laser: 4,
            /**狙击 */
            snipe: 5,
            /**加速 */
            speed: 6,
            /**子弹升级 */
            up: 7,
            /**宠物火精灵 */
            petFire: 8,
            /**宠物冰精灵 */
            petIce: 9
        },
        /**spine 爆炸特效 */
        SPINE_EFFECT: {
            attack: 0,
            boom: 1,
            die: 2,
            dj: 3,
            role_die: 4,
            zhs_die: 5
        },
        AUDIO_TYPE: {
            /**背景音乐 */
            bgm: 0,
            bossComing: 1,
            getGold: 2,
            getProp: 3,
            invincible: 4,
            laserGun: 5,
            monsterDie: 6,
            roleDie: 7,
            roleSkill_1: 8,
            roleSkill_2: 9,
            roleSkill_3: 10,
            useProp: 11,
            win: 12,
            lose: 13,
            ready: 14,
            go: 15,
            boss: 16
        }
    },
    /**图片资源路径 and ui根目录*/
    UI_PATH: {
        /**ui根目录 */
        UI_ROOT_PATH: "Canvas/uiRoot",
        /**面板预制资源路径 */
        PANEL_PATH: "prefabs/uiPanels/",
        /**图片资源加载根路径 */
        IMGS_PATH: "imgs/"
    },
    /**音效资源路径 */
    AUDIO_PATH: [
        'audios/bgm',
        'audios/bossComing',
        'audios/getGold',
        'audios/getProp',
        'audios/invincible',
        'audios/laserGun',
        'audios/monsterDie',
        'audios/roleDie',
        'audios/roleSkill_1',
        'audios/roleSkill_2',
        'audios/roleSkill_3',
        'audios/useProp',
        'audios/win',
        'audios/lose',
        'audios/ready',
        'audios/go',
        'audios/boss'
    ],
    /**spine数据路径 */
    ANIM_PATH: {
        /**玩家动作数据路径 */
        ROLE: {
            /**法师 */
            FS: "anims/role_fs/FS",
            /**机甲 */
            JJ: "anims/role_jj/JJA",
            /**精灵 */
            JL: "anims/role_jl/JL"
        },
        /**宠物spine数据路径 */
        PET: {
            HS: "anims/pets/red/HS",
            LS: "anims/pets/blue/LS"
        },
        /**小怪动作数据路径 */
        MIN_MONSTER: {
            /**火焰小怪动作 */
            HY: "anims/monster_1/HYX",
            /**南瓜小怪动作 */
            NG: "anims/monster_2/NGX",
            /**石头小怪动作 */
            ST: "anims/monster_3/STX",
            /**羊角小怪动作 */
            YJ: "anims/monster_4/YJ"
        },
        /**boss动作数据路径 */
        BOSS: {
            /**树精怪 */
            SJB: "anims/boss_sjb/SJB",
            /**史莱姆 */
            SLM: "anims/boss_slm/SLM",
            /**石头怪 */
            ST: "anims/boss_st/ST",
            /**召唤师 */
            ZHS: "anims/boss_zhs/ZHS"
        }
    },
    /**语言包路径 */
    Language_PATH: {
        /**boss来袭 */
        bossComing: 'language/bossComing_',
        /**loading */
        loading: 'language/loading_',
        /**离线 */
        offLine: 'language/offLine_',
        /**准备结束 */
        ready: 'language/ready_',
        /**go */
        go: 'language/go_',
        /**重连中 */
        reconnect: 'language/reconnect_',
        /**选择角色 */
        selectRole: 'language/selectRole_',
        /**等待对手 */
        waitForOpp: 'language/waitForOpp_'
    },
    /**角色预制路径 pre */
    ROLE_SKINPATH: "prefabs/roles/role",
    /**敌人预制路径 pre*/
    ENEMY_SKINPATH: "prefabs/roles/enemy",
    /**精英敌人预制路径 pre*/
    EE_ENEMY_SKINPATH: "prefabs/roles/eeEnemy",
    /**boss 预制路径 pre*/
    BOSS_SKINPATH: "prefabs/roles/boss",
    /**导弹 预制路径 pre*/
    GUIDE_MISS_SKINPATH: "prefabs/roles/guideMiss",
    /**导弹提示 pre*/
    GUIDE_MISS_TIP_SKINPATH: "prefabs/others/guide_line",
    /**宠物预制路径 pre*/
    PET_SKINPATH: "prefabs/roles/pet",
    /**第四关卡boss的小怪预制路径 pre*/
    MIN_MONSTER_SKINPATH: "prefabs/roles/minMonster",
    /**角色子弹预制路劲 pre*/
    PY_BULLET_PATH: "prefabs/bullets/pyBulletPre",
    /**宠物子弹预制 pre*/
    PET_BULLET_PATH: "prefabs/bullets/petBulletPre",
    /**玩家激光炮预制路径 pre*/
    LASER_GUN_PATH: "prefabs/bullets/laserCollider",
    /**法师 技能：大火球预制路径 pre */
    PY_FASHI_PATH: "prefabs/bullets/pyFaShiBt",
    /**机器人 技能：导弹预制 pre*/
    PY_GUIDE_MISS_PATH: "prefabs/bullets/pyGuideMiss",
    /**精灵 技能：剑光预制 pre*/
    PY_SWORDKEE_PATH: "prefabs/bullets/pySwordGang",
    /**敌人子弹预制 pre*/
    EY_BULLET_PATH: "prefabs/bullets/eyBulletPre",
    /**追踪子弹路径 pre*/
    TRACE_BULLET_PATH: "prefabs/bullets/traceBullet",
    /**水属性小怪子弹 pre*/
    WATER_BULLET_PATH: "prefabs/bullets/waterBullet",
    /**静态子弹预制路径 pre */
    STATIC_BULLET_PATH: "prefabs/bullets/staticBullet",
    /**金币预制路径 pre*/
    GOLD_PATH: "prefabs/others/gold",
    /**boss来临特效预制 pre*/
    BOSS_COMING_PATH: "prefabs/others/boss_coming",
    /**道具预制路径 pre*/
    BUFF_PRE_PATH: "prefabs/others/prop",
    /**狙击图标预制 pre*/
    SNIPER_ICON_PATH: "prefabs/others/sniper_icon",
    /**机器人导弹尾气 pre*/
    SMOKE_PATH: "prefabs/others/smoke_eff",
    /**粒子预制 pre*/
    PARTICLE_PATH: "prefabs/others/particle",
    /**敌人血量进度条 pre */
    HP_FRAME_PATH: "prefabs/others/hp_frame",
    /**spine 爆炸特效路径 pre */
    SPINE_EFF_PATH: "prefabs/others/spineEff",
    /**对方使用道具时的提示 */
    USE_TOOL_TIP_PATH: "prefabs/others/useToolTip",
    /**玩家给对方使用道具的提示 */
    USE_TOOL_ACTION_PATH: "prefabs/others/useToolAction",
    /**复活无敌罩 */
    COVER_PATH: "prefabs/others/cover",
    /**道具item pre */
    PROP_ITEM_PAHT: "prefabs/others/propItem",


    ///UI
    /**分数飘字 */
    SOCRE_TIP_PATH: "prefabs/uiPanels/ScoreTip",

    /**boss 皮肤路径 png*/
    BOSS_SKINPATH_IMG: "imgs/boss_",
    /**道具皮肤路径 png*/
    BUFF_SKINPATH_IMG: "imgs/buff_",
    /**子弹皮肤路径 png*/
    BULLET_SKINPATH_IMG: "imgs/bullet_r_lv",
    /**宠物子弹皮肤路径 png*/
    PET_BT_IMG: "imgs/pet_bt_",


    /**子弹配置路径 json*/
    BULLET_CONFIG: "config/bullet"
}


//#region  LCHago

if (typeof (hg) !== 'undefined') {
    hg.gameLoadResult && hg.gameLoadResult({ code: 0 });
    let date = new Date();
    GlobalVar.error(`当前系统时间：${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
    //console.log(date.getFullYear())
    //console.log(date.getMonth())
    //console.log(date.getDate())
    //获取数据
    hg.getUserCloudStorage({
        keyList: ["data"],
        success: function (res) {
            if (res.length > 0) {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].key === "data") {
                        let value = JSON.parse(res[i].value);
                        let loginTimes = value.loginTimes;

                        GlobalVar.error(`拉取到data数据{loginTimes:${value.loginTimes},date:${value.date}}`);

                        if (value.date !== `${date.getFullYear()}${date.getMonth()}${date.getDate()}`) {//今天没有登陆
                            loginTimes++;
                            GlobalVar.error('今天没有登陆过，登陆天数加一');
                        }
                        GlobalVar.NetConfig.loginTimes = loginTimes;
                    } else {
                        GlobalVar.NetConfig.loginTimes = 1;
                    }
                    continue;
                }
            }
            GlobalVar.error(`拉取数据：${JSON.stringify(res)}`);//[{"key":hello,"value":"world"]
        },
        fail: function () {
            GlobalVar.log('fail');
        }
    })
    let saveData = () => {
        GlobalVar.error('开始保存数据--------------------------')
        let val = { loginTimes: GlobalVar.NetConfig.loginTimes, date: `${date.getFullYear()}${date.getMonth()}${date.getDate()}` }
        GlobalVar.error(`数据：${JSON.stringify(val)}`)

        hg.setUserCloudStorage({
            KVDataList: [{
                key: "data",
                value: JSON.stringify(val)  //只支持字符串
            }],
            success: function (res) {
                GlobalVar.error("保存数据 Success: " + JSON.stringify(res));
            },
            fail: function () {
                GlobalVar.error("保存数据 fail");
            }
        })

    }
    document.addEventListener("visibilitychange", function (event) {
        GlobalVar.error(`true表示隐藏，false表示显示：${event.hidden}`); // true标识隐藏，false表示显示
        if (event.hidden) { saveData(); }
    });

    GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.gameOver, () => {
        GlobalVar.error('开始退出游戏---------------------------')
        saveData();
        /*         setTimeout(() => {
                    hg.pkFinishError({ message: "connect to server error", code: "100" });
                }, 5000); */
    }, 'LCHago')
    GlobalVar.EventMgr.addEventListener(GlobalVar.CONST.EVENT.forceClose, () => {
        setTimeout(() => {
            hg.pkFinishError({ message: "connect to server error", code: "100" });
        }, 2500);
    }, 'LCHago')

    //获取匹配信息
    //let matchupInfo = hg.getMatchupInfo();
    //GlobalVar.NetConfig.selfAvatar = true;
    /*     let loadPlayAvatar = GlobalVar.GetHandler((tex2d) => {
            GlobalVar.NetConfig.selfAvatar = tex2d;
        }, this) */
    /*     GlobalVar.Loader.loadExternalAsset(
            matchupInfo.player.avatarurl,
            loadPlayAvatar
        ) */

    //console.error(`获取匹配信息：\n${JSON.stringify(matchupInfo)}`);
    //let opt = matchupInfo.player.opt;
    //opt = opt.replace("\\", "");
    //let optObj = JSON.parse(opt);

    //console.error(opt);

    /*     hg.getUserInfoByUids({
            uids: [optObj.ai_info.uid],
            success: function (res) {
                console.error("getUserInfoByUids result:" + JSON.stringify(res))
                GlobalVar.NetConfig.oppAvatar = true;
                let loadOppAvatar = GlobalVar.GetHandler((tex2d) => {
                    GlobalVar.NetConfig.oppAvatar = tex2d;
                }, this)
                GlobalVar.Loader.loadExternalAsset(
                    res[0].avatar,
                    loadOppAvatar
                )
                console.error(`对手头像路径：${GlobalVar.NetConfig.oppAvatar}`);
            }
            , fail: function (res) {
                console.error("hg.getUserInfoByUids fail " + res.errCode)
            }
        }) */
} else {
    GlobalVar.NetConfig.loginTimes = 7;
}

//#endregion