//~silent
//自动日常合并版
//四区白三三
//1.自动师门。2.自动调用自动追捕和自动武道两个流程，可选择副本自动脚本、扫荡或跳过。3.当铺购买、请安。4.日常开始结束语音播报提醒。5.新增春节免费扫荡模式。
//使用call方式调用，如果想在版本更新后继续静默运行，请在 call 自动日常 后面加上参数：callmode

($localVer) = 2022100901
($changeLog) = 🆕 检测随从工作状态；优化妖族禁地扫荡。
($flowName) = 自动日常
($flowCode) = zdrc
($flowPath) = 根文件夹
($flowFinder) = 根文件夹
//($repourl) = https://cdn.jsdelivr.net/gh/mapleobserver/wsmud-script
($repourl) = http://wsmud-cdn.if404.com
@js ($version) = $.ajax({type: "GET", url: "(repourl)/version.txt", async: false, cache: false}).responseText;
[if] (version) != null
  @js ($remoteVer) = var v = (version);v.(flowCode)
[if] (localVer) < (remoteVer) && (remoteVer) != null
  [if] (UPnum) == null
    ($UPnum) = 0
  [if] (UPnum) < 2
    [if] (UPnum) == 1
      @print 未获取到最新版本，使用备用地址再次尝试...
      ($repourl) = http://wsmud-cdn.if404.com
    ($UPnum) = (UPnum) + 1
    [if] (flowPath) != 根文件夹 && (flowPath) != null
      ($flowSource) = (repourl)/(flowPath)/(flowName).flow.txt
    [else]
      ($flowSource) = (repourl)/(flowName).flow.txt
    [if] (flowFinder) == null
      ($flowFinder) = 根文件夹
    @js WG.SendCmd("tm 当前(flowName)版本【(localVer)】，将开始自动更新至最新【(remoteVer)】。")
    ($f_ss)={"name":"(flowName)","source":"(flowSource)","finder":"(flowFinder)"}
    @js var time = Date.parse( new Date());var f=(f_ss);var n=f["name"];var s=f["source"];var fd=f["finder"];WorkflowConfig.removeWorkflow({"name":n,"type":"flow","finder":fd});$.get(s,{stamp:time},function(data,status){WorkflowConfig.createWorkflow(n,data,fd);});
    @wait 1500
    ($log) = ✅(flowName)已更新至最新版【(remoteVer)】，即将自动运行。
  [else]
    ($log) = ⭕(flowName)暂时无法正常更新至【(remoteVer)】，直接运行当前版本【(localVer)】。
    ($UPnum) = null
  @js WG.SendCmd("tm (log)")
  @print <ord>(log)</ord>
  [if] (UPnum) != null
    [if] (arg0) == callmode
      tm 维持call方式运行
      @js WG.zmlfire({"name":"重新运行","zmlRun":"//~silent\n@call 自动日常","zmlShow":0,"zmlType":"1"})
    [else]
      @js var f=(f_ss);ManagedPerformerCenter.start(f["name"], FlowStore.get(f["name"]));
    [exit]
[else]
  ($UPnum) = null
  [if] (remoteVer) == null
    ($log) = ⚠️获取远程版本失败，维持当前版本不变。
  [else]
    ($log) = 🚀开始运行(flowName)，当前版本【(remoteVer)】。更新内容：(changeLog)
  @js WG.SendCmd("tm (log)")
  @print <ord>(log)</ord>

@js ($month) = var date=new Date();date.getMonth()+1
// 2022国庆免费扫荡
//[if] (month) == 10 && (:date)==1 && (:hour)>=5
//  ($RCMode) = 节日免费模式
//[if] (month) == 10 && (:date)>=2
//  ($RCMode) = 节日免费模式
//[if] (month) == 10 && (:date)>=8 && (:hour)>=5
//  ($RCMode) = 正常模式

//检测状态
($fbYes) = (:room 副本区域,忧愁谷)
[if] (fbYes) == true || (:state)==推演 || (:state)==领悟
  ($alert_start) = 正在(:state)，停止自动日常！
  [(fbYes) == true]($alert_start) = 正在副本中，停止自动日常！
  @js WG.SendCmd("tm (alert_start)")
  @print <ord>(alert_start)</ord>
  [exit]

// 自动日常模式
[if] (RCMode) == null
  ($RCMode) = 正常模式
[if] (RCMode) == 春节模式
  ($RCMode) = 节日免费模式
#select ($RCMode) = 当前模式<ord>(RCMode)</ord>，自动日常的执行模式,正常模式|节日免费模式,(RCMode)
// 是否统计收益
[if] (RecordG) == null || (RecordG) = 是
  ($RecordG) = 正常统计
#select ($RecordG) = 是否统计收益,正常统计|无弹窗统计|静默统计|否,(RecordG)

// 师门任务
score;tasks
@task 师门委托目前完成($smnum)/20个，共连续完成($smComboN)个|师门委托你去寻找($smtype)，共连续完成($smComboN)个
[if] (SMtasks) == null
  ($SMtasks) = 正常进行
[if] (smComboN) >= 100 && (SMtasks) != 无视环数
  [if] (:hour) <5 || (:hour) >= 20
    ($SMtasks) = 正常进行
    #select ($SMtasks) = <ord>处于抢首席时段，师门任务可正常进行</ord>,正常进行|跳过|无视环数,正常进行
  [else]
    ($SMtasks) = 跳过
    #select ($SMtasks) = 师门已连(smComboN)次，<ord>是否先跳过等晚上抢首席</ord>,正常进行|跳过|无视环数,跳过
[else if] (smComboN) < 30 && (SMtasks) != 无视环数
  ($SMtasks) = 正常进行
  #select ($SMtasks) = 师门任务正常进行或跳过(抢首席),正常进行|跳过|无视环数,正常进行
[else]
  #select ($SMtasks) = 师门任务正常进行或跳过(抢首席),正常进行|跳过|无视环数,(SMtasks)

// 追捕自定义参数
[if] (ZByes) == null || (ZByes) == 是
  ($ZByes) = 正常模式
[if] (ZBsx) == null
  ($ZBsx) = 转为正常模式
[if] (ZBWaitCD) == null
  ($ZBWaitCD) = 30
[if] (ZBcdskill) == null
  ($ZBcdskill) = null
[if] (ZBBefore) == null
  ($ZBBefore) = $eqskill 1;$wait 1000;$eq 1
[if] (DieToReset) == null
  ($DieToReset) = 已关闭
[if] (ZBrenew) == null
  ($ZBrenew) = 是
  [if] (:grade) == 武帝 || (:grade) == 武神 || (:grade) == 剑神 || (:grade) == 刀皇 || (:grade) == 兵主 || (:grade) == 战神
    ($ZBrenew) = 否
[if] (ZBxuruo) == null
  ($ZBxuruo) = 否
#select ($ZByes) = 追捕方式(百姓选跳过),正常模式|快速扫荡|跳过,(ZByes)
#select ($ZBsx) = 快速扫荡达到上限后处理方式,转为正常模式|自动放弃再扫荡,(ZBsx)
#input ($ZBBefore) = 追捕前执行命令(用英文;隔开),(ZBBefore)
#select ($ZBrenew) = 每次追捕是否先回武庙恢复,是|否,(ZBrenew)
#select ($ZBxuruo) = 是否到武道塔顶层清虚弱,是|否,(ZBxuruo)
#input ($ZBWaitCD) = 从此次追捕开始，等待技能冷却,(ZBWaitCD)
#input ($ZBcdskill) = 需要冷却的技能使用英文逗号隔开或以^开头过滤不需要的，填null全部不等冷却,(ZBcdskill)
#select ($DieToReset) = 死亡自动重置追捕环数,已开启|已关闭,(DieToReset)

// 武道自定义参数
[if] (WudaoMode) == null || (WudaoMode) = 正常肝塔
  ($WudaoMode) = 正常模式
[if] (WudaoRenew) == null
  ($WudaoRenew) = 天地诀
[if] (WudaoWaitCDLevel) == null
  ($WudaoWaitCDLevel) = 30
[if] (WudaoManualMaxLevel) == null
  ($WudaoManualMaxLevel) = 84
[if] (WudaoWaitCDExp) == null
  ($WudaoWaitCDExp) = ^none
[if] (WudaoBefore) == null
  ($WudaoBefore) = $eqskill 1;$wait 1000;$eq 1
#select ($WudaoMode)=武道塔模式<ord>(快速模式建议至少已有血刀九阴)</ord>,正常模式|快速模式|只打塔主,(WudaoMode)
#select ($WudaoRenew)=<hiz>快速模式</hiz>恢复内力方式,武庙恢复|天地诀|逆天道|大道无极,(WudaoRenew)
#input ($WudaoBefore)=打塔前执行命令(用英文;隔开),(WudaoBefore)
#input ($WudaoWaitCDExp)=打塔等待以下技能冷却,(WudaoWaitCDExp)
#input ($WudaoWaitCDLevel)=从此层开始，等待技能冷却,(WudaoWaitCDLevel)
#input ($WudaoManualMaxLevel)=从此层开始快速扫荡,(WudaoManualMaxLevel)

// 副本自定义参数
[if] (FBBefore) == null
  ($FBBefore) = $eqskill 1;$wait 1000;$eq 1
[if] (FBnum) == null
  ($FBnum) = 20
[if] (DungeonHpThreshold) == null
  ($DungeonHpThreshold) = 50
[if] (DungeonWaitSkillCD) == null
  ($DungeonWaitSkillCD) = 打开
[if] (DungeonBagCleanWay) == null
  ($DungeonBagCleanWay) = 存仓及售卖
[if] (FBYabiao) == null
  ($FBYabiao) = 否
[if] (FBYzjdOver) == null
  ($FBYzjdOver) = 战神殿(困难)
[if] (SDYTjlsx) == 0 || (SDYTjlsx) == null || (SDYTjlsx) == undefined
  ($SDYTjlsx) = 85
#input ($FBBefore)=副本前执行命令(用英文;隔开),(FBBefore)
#select ($FBYabiao)=<hiz>周一快速运镖(代替当天的副本)</hiz>,是|否,(FBYabiao)
#select ($FBYzjdOver) = <ord>妖塔或妖族禁地达到设定上限后，自动转扫其它副本</ord>,妖塔|战神殿(简单)|战神殿(困难)|古宗门遗址,(FBYzjdOver)
#input ($SDYTjlsx) = <ord>扫荡妖塔的单次精力上限(超过后转扫其它副本)</ord>,(SDYTjlsx)
#select ($FBName) = <ord>⚠️ 妖族禁地每日最多2次，妖塔自动计算次数，无视下面的次数设置。</ord><br/>&nbsp*&nbsp副本(上次所选:<ord>(FBName)</ord>),财主家(简单)|财主家(困难)|丽春院|流氓巷|流氓巷(组队)|兵营|庄府|鳌拜府|天地会|神龙教|神龙教(组队)|关外|温府|五毒教|五毒教(组队)|恒山|青城山|衡山|泰山|嵩山|云梦沼泽|云梦沼泽(组队)|桃花岛(简单)|桃花岛(困难)|白驼山|白驼山(组队)|星宿海|冰火岛(简单)|冰火岛(困难)|冰火岛(偷渡)|移花宫(简单)|移花宫(困难)|移花宫(偷渡)|燕子坞(简单)|燕子坞(困难)|燕子坞(偷书)|黑木崖(简单)|黑木崖(困难)|缥缈峰(困难)|缥缈峰(偷渡)|光明顶|光明顶(组队)|光明顶(偷渡)|天龙寺(困难)|天龙寺(偷渡)|血刀门|古墓派(简单)|古墓派(困难)|古墓派(困难偷渡)|华山论剑|侠客岛|净念禅宗(简单)|净念禅宗(困难)|净念禅宗(困难偷渡)|慈航静斋(简单)|慈航静斋(困难)|慈航静斋(简单偷渡)|慈航静斋(困难偷渡)|阴阳谷|阴阳谷(偷渡)|战神殿(简单)|战神殿(困难)|战神殿(简单偷渡)|战神殿(困难偷渡)|古宗门遗址|妖塔|妖族禁地,(FBName)
#input ($FBnum) = <ord>需要完成的次数</ord>,(FBnum)
#select ($FBWay) = 刷本方式（选自动前先确定插件支持）,自动|扫荡|跳过副本,(FBWay)
#select ($DungeonHpThreshold) = 副本内疗伤，当气血低于百分比,100|90|80|70|60|50|40|30|20|10,(DungeonHpThreshold)
#select ($DungeonWaitSkillCD) = Boss战前等待技能冷却,打开|关闭,(DungeonWaitSkillCD)
#select ($DungeonBagCleanWay) = 背包清理方案,不清理|售卖|存仓及售卖,(DungeonBagCleanWay)

// 赌场兑换残页
[if] (Duihuan) == null
  ($Duihuan) = 不兑换
#select ($Duihuan) = <hiz>赌场兑换副本残页物品</hiz>,不兑换|无念禅功|长生诀|慈航剑典|阴阳九转|战神图录|神器碎片,(Duihuan)

// 古宗门遗址单独扫荡
[if] (GmpSD) == null
  ($GmpSD) = 跳过
[if] (GmpSDnum) == null
  ($GmpSDnum) = 5
#select ($GmpSD) = <ord>古宗门遗址单独扫荡</ord>,跳过|扫荡,(GmpSD)
#input ($GmpSDnum) = <ord>古宗门遗址扫荡次数</ord>,(GmpSDnum)

// 请安
[if] (RC_qingan) == null
  ($RC_qingan) = 请安
[if] (:grade) == 武神 || (:grade) == 剑神 || (:grade) == 刀皇 || (:grade) == 兵主 || (:grade) == 战神
  ($RC_qingan) = 跳过
#select ($RC_qingan) = 是否给首席请安,请安|跳过,(RC_qingan)

// 日常结束后动作
[if](RCAfter_action) == null
  ($RCAfter_action) = $zdwk
#input ($RCAfter_action) = 日常结束后命令(用英文;隔开),(RCAfter_action)

// 语音播报
[if] (TTSover) == null
  ($TTSover) = 播报
#select ($TTSover) = 日常结束后语音播报提醒,播报|不播报,(TTSover)

// 运行模式
#input ($callmode) = 流程运行模式(无需改动),正常

#config

// 判断运行模式和副本方式
[if] (callmode) == null
  @js ($fbtd) = "(FBName)".replace(/\(|\)/g,"").indexOf("偷渡")
  //[if] (fbtd) == -1 && (FBWay) == 自动
    //tm 当前副本为自动模式，流程从call方式转为正常模式。
    //@js ManagedPerformerCenter.start("自动日常", FlowStore.get("自动日常"));
    //[exit]

// 获取角色名
[if] (TTSover) == 播报
  $tts 开始(:name)的自动日常。

// 停止，清包
@stopSSAuto
stopstate

// 检查随从工作状态
@cmdDelay 500
stopstate;team out
[if] (:room)==住房-练功房
  go east
[else]
  jh fam 0 start
  $to 住房
@await 1000
@js G.items.forEach((v,k)=>{console.log(k),WG.SendCmd("team with "+k)})
go northeast
@js G.items.forEach((v,k)=>{console.log(k),WG.SendCmd("dc "+k+" diao")})
@await 1000
@js G.items.forEach((v,k)=>{console.log(k),WG.SendCmd("dc "+k+" cai")})
@await 1000
team out

// 清包
@tidyBag
@await 2000
jh fam lack;pack
($money1) =  (:money)

// 师门
[if] (SMtasks) == 正常进行 || (SMtasks) == 无视环数
  $sm
  @tip 你先去休息一下吧
[else]
  ($alert_sm) = 根据设置，已跳过师门任务。
  @js WG.SendCmd("tm (alert_sm)")

// 吃养精丹和潜能丹药
stopstate
@await 500
[if] {b朱果g}? != null
  [if] {b朱果g#} <= 10
    use {b朱果g}[{b朱果g#}]
  [else]
    use {b朱果g}[10]
  @await 2000
[if] {b潜灵果g}? != null
  [if] {b潜灵果g#} <= 10
    use {b潜灵果g}[{b潜灵果g#}]
  [else]
    use {b潜灵果g}[10]
  @await 2000

// 开始统计收益
[if] (RecordG) != 否
  <-recordGains

// 追捕
jh fb lock
($currentN) = null
[while] (currentN) == null
  @await 500
  score;tasks
  @task 追杀逃犯：目前完成($currentN)/20个，共连续完成($comboN)个|追杀逃犯：($empty)目前完成($currentN)/20个，共连续完成($comboN)个
($zbtemp) = (ZByes)
[if] (RCMode) == 节日免费模式 && (zbtemp) == 正常模式
  //($zbtemp) = (ZByes)
  ($zbtemp) = 快速扫荡
[if] (currentN) < 20 && (zbtemp) == 快速扫荡
  @print 开始快速追捕
  stopstate
  @tidyBag
  @await 2000
  [while] (:room) != 扬州城-衙门正厅
    $to 扬州城-衙门正厅
    @await 500
  [while] true
    [if] {b扫荡符#}? < 20 || {b扫荡符}? == null
      [if] (RCMode) == 正常模式
        shop 0 20
    ask3 {r程药发}
    @tip 无法($speed)完成|目前完成20/20个|已经完成|你的($sdfnum)符不够
    [if] (speed) != null || (sdfnum) != null
      [if] (ZBsx) == 转为正常模式
        ($alert_zb) = 追捕到达上限，无法快速扫荡，转为正常模式！
        ($ZByes) = 正常模式
      [else if] (ZBsx) == 自动放弃再扫荡
        [if] (comboN) < 200
          ($alert_zb) = 追捕到达上限，无法快速扫荡，环数低于200环，不自动放弃，转为正常模式！
          ($ZByes) = 正常模式
        [else if] (sdfnum) != null
          ($alert_zb) = 买不起扫荡符，无法快速扫荡，转为正常模式！
          ($ZByes) = 正常模式
          ($sdfnum) = null
        [else]
          ($alert_zb) = 追捕到达上限，无法快速扫荡，自动放弃再扫荡！
          ask1 {r程药发}
          ask2 {r程药发}
          ($speed) = null
          @await 1000
          [continue]
      ($zbtemp) = (ZByes)
    [else]
      ($currentN) = 20
    [break]
  [if] (alert_zb) != null
    @print <ord>(alert_zb)</ord>
    tm (alert_zb)
[if] (currentN) < 20 && (zbtemp) == 正常模式
  @print 开始自动追捕
  @cd
  stopstate
  (ZBBefore)
  @await 5000
  @tidyBag
  @await 2000
  @js $('#zb_prog').remove()
  @js $(`.state-bar`).before($(`<div id=zb_prog>开始追捕</div>`).click(() => $('#zb_prog').remove()))
  [while](currentN) < 20
    ($zb) = true
    [if] (:status xuruo) == true && (ZBxuruo) == 是
        jh fam 9 start;go enter
        $killall
        @until (:combating) == false
    [if] (ZBrenew) == 是 || (:status xuruo) == true || (type1) != null
      [while] (:room) != 扬州城-武庙
        $to 扬州城-武庙
        @await 500
      @liaoshang
    @until (:status xuruo) == false
    [if](comboN)>=(ZBWaitCD)
      @cd (ZBcdskill)
    [while] (:room) != 扬州城-衙门正厅
      $to 扬州城-衙门正厅
      @await 500
    @await 1000
    ($olddir1) = (dir1)
    ($olddir2) = (dir2)
    //@print (olddir1)
    ($escapee) = null
    [while] (escapee) == null
      ($zbing) = null
      ask1 {r程药发}
      @tip 说道：($escapee)作恶多端($info)最近在($dir1)-($dir2)出现|你不是在($zbing)吗|没有在逃的逃犯|你的($party)正在进攻|不要急，($needwait)来|最近没有($zbEnd)的逃犯了，你先休息下吧
      [if] (zbEnd) != null
        ($currentN) = 20
        [break]
      [if] (needwait) != null
        ($needwait) = null
        @await 30000
        [continue]
      [if] (party) != null
        ($party) = null
        @print <ord>帮战未结束，获取逃犯信息失败，10秒后重试。</ord>
        @await 10000
        [continue]
      [if] (zbing) != null
        ($zbing) = null
        [if] (dir1) == null || (dir2) == null || (escapee) == null
          @await 1000
          score;tasks
          @await 500
          @task 追杀逃犯：($escapee)，据说最近在($dir1)-($dir2)出现过，你还有($time)去寻找他，目前完成($currentN)/20个，共连续完成($comboN)个。|追杀逃犯：目前完成($currentN)/20个，共连续完成($comboN)个
      @print <hiy>追捕目标：(escapee) 目标地点：(dir1)-(dir2)</hiy>
    [if](olddir1) != (dir1) && (olddir2) != (dir2)
      ($start_h) = (:hour)
      ($start_m) = (:minute)
    @await 500
    [while] {r(escapee)}? == null && (zbEnd) == null
      [if] (tb) == null
        ($tb) = 0
      <---
      [if] (zb) == true
        @cmdDelay 1000
        [if] {r(escapee)}? != null
          ($type1) = null
          ($hunmi) = null
          [if] (:room 武当派-后山小院) == true
            @await 1000
          kill {r(escapee)}?
          @until {(escapee)的尸体}? != null || {r(escapee)}? ==  null || (:combating) == false || (:living) == false
          @tip 你的追捕任务($done)了，目前完成($currentN)/20个，已连续完成($comboN)个。|你($type1)死了($type2)|你要攻击谁|追捕任务失败了|你又($hunmi)了知觉|不要急，($needwait)来|你现在是($linghun)状态，不能那么做
          [if] (done) != null
            ($done) = null
            @js $('#zb_prog').html(`<hiy>当前追捕任务已完成，进度 (currentN)/20</hiy>`)
          //[if] (hunmi) != null
            //($hunmi) = null
          [while] (:living)==false || (linghun) == 灵魂
            @await 1500
            relive
            @await 500
            ($linghun) = null
          [if] (type1) != null && (DieToReset) == 已开启
            [while] (:room) != 扬州城-衙门正厅
              $to 扬州城-衙门正厅
              @await 500
            ask2 {r程药发}
          [break]
        [if] (DieToReset) == 已关闭
          [if] (:hour) == 0 && (start_h) != 0
            ($tb) = 24*60+(:minute)-(start_h)*60-(start_m)
          [else]
            ($tb) = (:hour)*60+(:minute)-(start_h)*60-(start_m)
          @js $('#zb_prog').html(`<hiy>已耗时(tb)分钟</hiy> <ord>追捕目标：(dir1)-(dir2) (escapee)</ord>`)
          //@print <hiy>已耗时(tb)分钟。</hiy><ord>追捕目标：(escapee) 目标地点：(dir1)-(dir2)</ord>
          [if] (tb) >= 10 || (tb) < 0
            @print <hiy>追捕超时！</hiy>
            ($dir1) = null
            ($dir2) = null
            ($tb) = null
            [break]
      --->
      @cmdDelay 1000
      $to (dir1)-(dir2)
      [if] (dir1) == 武当派
        [if](dir2) == 林间小径
          go south
        jh fam 1 start
        go north
        go south;go west
        go west
        go east;go northup
        go north
        go east
        go west;go west
        go northup
        go northup
        go northup
        go north
        go north
        go north
        go north
        go north
        go north
      [else if] (dir1) == 华山派
        jh fam 3 start
        go eastup
        go southup
        jumpdown
        go southup
        go south
        go east
        jh fam 3 start
        go westup
        go north
        go east
        go west;go north
        go east
        go west;go north
        go south[3];go west
        go east;go south
        go southup
        go southup
        look bi;break bi;go enter
        go westup
        go westup
        jumpup
      [else if] (dir1) == 少林派
        [if](dir2) == 竹林
          go north
        jh fam 2 start
        go north
        go west
        go east;go east
        go west;go north
        go northup
        go southdown;go northeast
        go northwest
        go southwest
        go northeast;go north
        go east
        go west;go west
        go east;go north
        go east
        go west;go west
        go east;go north
        go west
        go east;go north
        go north
      [else if] (dir1) == 峨眉派
        [if](dir2) == 走廊
          go north
          go south[2]
          go north;go east[2]
        jh fam 4 start
        go northup
        go east
        go west;go southdown;go west
        go south
        go east
        go east
        go west;go south
        go north;go west;go south
        go north;go west
        go south
        go south
        go north;go north;go west
        go east;go north
        go north
      [else if] (dir1) == 逍遥派
        [if](dir2) == 林间小道
          go west;go north
          go south;go west
          go east;go south
        [else if](dir2) == 木屋
          go south[4]
        [else if](dir2) == 地下石室
          go up
        jh fam 5 start
        go north
        go north
        jh fam 5 start;go east
        go north
        go south;go south
        go south
        jh fam 5 start;go west
        go south
        jh fam 5 start;go south
        go south
        jh fam 5 start;go down
        go down
      [else if] (dir1) == 丐帮
        [if](dir2) == 暗道
          go east
          go east[2]
          go east
        jh fam 6 start
        go down
        go east
        go east
        go east
        go up
        go down;go east
        go east
        go up
($zb) = false
//[if] (RCMode) == 节日免费模式 && (zbtemp) != null
  //($ZByes) = (zbtemp)
@js $('#zb_prog').remove()
@cmdDelay
@await 2000
@tidyBag
@await 2000

// 武道塔
($currentN) = null
[if] (WudaoMode) != 只打塔主
//[if] (WudaoMode) == 正常模式 || (WudaoMode) == 快速模式  || (RCMode) == 节日免费模式
  score;tasks
  @task 武道塔($reset)重置，进度($currentN)/($finalN)，|武道塔($reset)重置，进度($currentN)/($finalN)，|今日副本($noWudao)次数
  [if] (reset) == 已 && (currentN) != null && (currentN) == (finalN) && (finalN) != 0
    @print <hiy>当日武道塔已完成。</hiy>
  [else if] (noWudao) != null && (reset)==null && (currentN)==null && (finalN)==null
    @print <hiy>检测到玩家已设置为只打塔主，跳过武道塔，流程武道塔模式将更改为只打塔主。</hiy>
    tm 检测到玩家已设置为只打塔主，跳过武道塔，流程武道塔模式将更改为只打塔主。
    ($WudaoMode) = 只打塔主
  [else]
    stopstate
    @cd
    @print 开始自动武道塔
    @tidyBag
    @await 2000
    (WudaoBefore)
    @await 5000
    @renew
    [if] (WudaoMode) == 快速模式
      @cmdDelay 500
    jh fam 9 start
    score;tasks
    @task 武道塔可以重置，进度($currentN)/($finalN)，|武道塔已重置，进度($currentN)/($finalN)，
    @print 当前武道塔进度：(currentN)/(finalN)
    @await 2000
    [if] (currentN) == (finalN)
      ask1 {r守门人}
      @tip 从头开始挑战|已经重置
      @await 2000
    [while] (wdlevel) == null
      jh fam 9 start
      @await 500
      @tip 你目前可以直接去挑战第($wdlevel)层
    @print 开始挑战第(wdlevel)层
    [if] (RCMode) == 正常模式
      go enter
    [while] (RCMode) == 正常模式
      [if] (:room) == 武道塔-第一百层 || (:room) == 武道塔-塔顶
        [break]
      [if] (WudaoMode) == 正常模式
        [if] (WudaoManualMaxLevel) >= 100
          ($WudaoManualMaxLevel) = 100
        [else]
          ($wudaoDif) = (finalN) - (WudaoManualMaxLevel)
          [if] (wudaoDif) == 0
            ($WudaoManualMaxLevel) = (WudaoManualMaxLevel) - 1
          [else if] (wudaoDif) < 0
            ($WudaoManualMaxLevel) = (finalN) - 1
        [if] (wdlevel) >= (WudaoManualMaxLevel) || (wdlevel) >= 100
          [break]
        [if] (:room) == 武道塔-第一百层 || (:room) == 武道塔-塔顶
          [break]
        [if] (:hpPer) < 0.7 || (:mpPer) < 0.3
          @renew
          jh fam 9 start;go enter
        [if] (wdlevel) >= (WudaoWaitCDLevel)
          @cd (WudaoWaitCDExp)
      [else if] (WudaoMode) == 快速模式
        [(wdfail) == null]($wdfail) = 0
        [if] (:mpPer) <= 0.2 || (wdfail) > 3
          [if] (WudaoRenew) == null
            ($WudaoRenew) = 天地诀
          [if] (WudaoRenew) != 武庙恢复
            [if] (WudaoRenew) == 天地诀
              ($wdOriginal)=(:kf_nei)
              enable force changshengjue
              ($renewSkill) = force.zhen
              [(:kf_nei) != changshengjue]($wdRenewSkill)=false
            [else if] (WudaoRenew) == 逆天道
              ($wdOriginal)=(:kf_nei)
              enable force nitiandao
              ($renewSkill) = force.nian
              [(:kf_nei) != nitiandao]($wdRenewSkill)=false
            [else if] (WudaoRenew) == 大道无极
              ($wdOriginal)=(:kf_zhao)
              enable parry taijishengong4
              ($renewSkill) = parry.da
              [(:kf_zhao) != taijishengong4]($wdRenewSkill)=false
            [if] (wdRenewSkill)=false
              [if] (wdOriginal) != null
                [(WudaoRenew) == 天地诀 || (WudaoRenew) == 逆天道]enable force (wdOriginal)
                [(WudaoRenew) == 大道无极]enable parry (wdOriginal)
              @print <hiy>无法使用(WudaoRenew)，改回武庙恢复模式。</hiy>
              ($WudaoRenew) = 武庙恢复
            [else]
              @cd (renewSkill)
              @perform (renewSkill)
              @tip 你的($less)不够，无法使用|转瞬间重获新生
              [if] (wdOriginal) != null
                [(WudaoRenew) == 天地诀 || (WudaoRenew) == 逆天道]enable force (wdOriginal)
                [(WudaoRenew) == 大道无极]enable parry (wdOriginal)
              [if] (less) != null
                ($less) = null
                [while] (:room) != 扬州城-武庙
                  $to 扬州城-武庙
                  @await 500
                @dazuo
                jh fam 9 start;go enter
          [if] (WudaoRenew) == 武庙恢复
            [while] (:room) != 扬州城-武庙
              $to 扬州城-武庙
              @await 500
            @dazuo
            jh fam 9 start;go enter
          [if] (wdfail) > 3
            ($wdfail) = 0
          @await 2000
        //stopstate
        [if] (:hpPer) <= 0.01
          @js var jy='(:room)'.indexOf('第七十');if(jy!=-1){WG.SendCmd('liaoshang;$wait 10000;stopstate')}
          @await 100
          @until (:state) != 疗伤
      kill {r武道塔守护者}?
      [if] (WudaoMode) == 正常模式
        @await 500
      @until (:combating) == false && (:free) == true && (:status faint) == false && (:status miss) == false
      [if] {r武道塔守护者}? != null
        [(WudaoMode) == 快速模式]($wdfail) = (wdfail) + 1
        [continue]
      [else]
        [(WudaoMode) == 快速模式]($wdfail) = 0
        ($wdlevel) = (wdlevel) + 1
        go up
    [if] (WudaoMode) == 正常模式 || (RCMode) == 节日免费模式
      ($num)=0
      jh fam 9 start
      ask2 {r守门人}
      @tip 用不着快速挑战了|不用快速挑战|快速挑战需要($num)张扫荡符
      [if] (num) > 0 && (RCMode) != 节日免费模式
        [if] {b扫荡符#}? < (num) || {b扫荡符}? == null
          shop 0 (num)
      ask2 {r守门人};ask3 {r守门人}
      @tip 你的扫荡符不够|挑战完成|用不着快速挑战了|不用快速挑战
    @cmdDelay
    @await 2000
    stopstate
    @tidyBag
    @await 2000
    //@liaoshang
[else if] (WudaoMode) == 只打塔主
  @print <hiy>已设置只打塔主，跳过武道塔。</hiy>
  tm 已设置只打塔主，跳过武道塔。
@tidyBag
@await 2000
// 周一快速运镖
[if] (FBYabiao) == 是 && (:day) == 1 && (:hour) >= 5
  @print <hiy>今天是周一，执行快速运镖。</hiy>
  @js DungeonsShortcuts.xianyu_ksyb();
  @await 3000
  @until (:state) == 闭关 || (:state) == 挖矿
  @await 3000
// 副本
[if] (FBWay) == 跳过副本
  ($alert_fb) = 跳过副本部分，请自己手动完成想要的副本。
[else]
  [if] (FBName) == 妖族禁地 || (FBName) == 妖塔
    ($fb_spe) == true
    @print 等待5秒后继续...
    @await 5000
    stopstate;team out
    jh fam 9 start;go enter
    go up
    @tip 打败($tading)就可以上去|你想要去古老的大陆寻找|你可以上去
    [if] (tading) != null
      ($logGDL) = 无法进入古大陆！
      @print <ord>(logGDL)</ord>
      @push ⚠️【自动日常】(:name)，(logGDL)
    [else]
      score;tasks
      @task 精力消耗：($tag2)>($jl_com)/200
      [if] (jl_com) == null
        ($jl_com) = 200
      [if] (jl_com) >= 200
        @print <hiy>今日精力已消耗(jl_com)，日常不再扫荡副本。</hiy>
      [else]
        [if] (FBName) == 妖族禁地
          @js ($fb_com) = parseInt((jl_com)/100)
          ($fb_num) = 2 - (fb_com)
          [while] (:room) != 武道塔-塔顶
            jh fam 9 start;go enter
            go up
            @await 500
          ggdl {r疯癫的老头}
          go south
          go south
          @tip 进入副本|你尚未($yzjd_lock)副本妖族禁地|本周($yzjd_over)的次数已经达到上限。
          [if] (yzjd_lock) != null
            ($fb_spe) = false
            [if] (FBYzjdOver) == 妖塔
              ($FBYzjdOver) = 战神殿(困难)
            @print <hiy>妖族禁地未解锁，转为扫荡正常副本(FBYzjdOver)</hiy>
          [else if] (yzjd_over) != null
            [if] (FBYzjdOver) == 妖塔
              @print <hiy>本周妖族禁地已达上限，转扫妖塔。</hiy>
              ($yzjd_turn) = 妖塔
            [else]
              @print <hiy>本周妖族禁地已达上限，转扫正常副本(FBYzjdOver)。</hiy>
              ($yzjd_turn) = 正常副本
          [else]
            [if] {b扫荡符#}? < (fb_num) || {b扫荡符}? == null
              shop 0 (fb_num)
            cr yzjd/pingyuan 0 (fb_num)
            @await 5000
        [if] (FBName) == 妖塔 || (yzjd_turn) == 妖塔
          ($jl_re) = 200 - (jl_com)
          @await 5000
          jh fam 9 start;go enter
          go up
          ggdl {r疯癫的老头}
          go north[2]
          @await 1000
          go north[2]
          go north[2]
          @await 3000
          look shi
          tiao1 shi;tiao3 shi
          tiao1 shi;tiao3 shi
          tiao2 shi
          go north
          @await 3000
          ($ytjl_cum) = 0
          ($ytjl_one) = 15
          [while] (ytjl_cum) < (jl_re)
            [if] {b扫荡符}? == null
              shop 0 10
            @await 500
            ss muyuan
            @tip 你即将消耗一个扫荡符，($ytjl_one)精力快速完成一次弑妖塔|你尚未($yt_lock)弑妖塔，不能快速完成。
            [if] (yt_lock) != null
              @print <hiy>妖塔扫荡未解锁，默认改为正常副本战神殿(困难)。</hiy>
              ($fb_spe) == false
              ($FBName) = 战神殿(困难)
              [break]
            [else if] (ytjl_one) > (SDYTjlsx) && (ytjl_one) != null
              [if] (FBYzjdOver) == 妖塔
                ($FBYzjdOver) = 战神殿(困难)
              @print <hiy>单次扫荡精力超过(SDYTjlsx)，转扫正常副本(FBYzjdOver)。</hiy>
              ($fb_spe) == false
              ($yzjd_turn) = 正常副本
              [break]
            [else]
              saodang muyuan
              @tip 你消耗一个扫荡符，($ytjl_one)精力快速完成弑妖塔，共获得了
              ($ytjl_cum) = (ytjl_cum) + (ytjl_one)
          @print <hic>本日扫荡妖塔已消耗(ytjl_cum)精力。</hic>
  [if] (yzjd_turn) == 正常副本 || (fb_spe) != true
    stopstate
    score;tasks
    @task 精力消耗：($tag2)>($jl_com)/200
    //@task 今日副本完成次数：($fb_com)。
    [if] (FBnum) == null || (FBnum) < 1
      ($FBnum) = 20
    [if] (jl_com) == null
      ($jl_com) = 200
    [if] (jl_com) >= 200 && (jl_com) != null
      @print <hiy>今日精力已消耗(jl_com)，日常不再扫荡副本
    [else]
      @js ($fb_com) = parseInt((jl_com)/10)
      [if] (FBnum) <= (fb_com)
        ($fb_num) = (FBnum)
      [else]
        ($fb_num) = (FBnum) - (fb_com)
      [if] (fb_spe) == false
        ($FBName) = (FBYzjdOver)
      [if] (yzjd_turn) == 正常副本
        @js ($fbName) = "(FBYzjdOver)".replace(/\(|\)/g,"")
      [else]
        @js ($fbName) = "(FBName)".replace(/\(|\)/g,"")
      ($fbdata) = "财主家简单":"cr yz/cuifu/caizhu 0","财主家困难":"cr yz/cuifu/caizhu 1","丽春院":"cr yz/lcy/dating 0","流氓巷":"cr yz/lmw/xiangzi1 0","兵营":"cr yz/by/damen 0","庄府":"cr bj/zhuang/xiaolu 0","鳌拜府":"cr bj/ao/damen 0","天地会":"cr bj/tdh/hct 0","神龙教":"cr bj/shenlong/haitan 0","关外":"cr bj/guanwai/damen 0","温府":"cr cd/wen/damen 0","五毒教":"cr cd/wudu/damen 0","恒山":"cr wuyue/hengshan/daziling 0","青城山":"cr wuyue/qingcheng/shanlu 0","衡山":"cr wuyue/henshan/hengyang 0","泰山":"cr wuyue/taishan/daizong 0","嵩山":"cr wuyue/songshan/taishi 0","云梦沼泽":"cr cd/yunmeng/senlin 0","桃花岛简单":"cr taohua/haitan 0","桃花岛困难":"cr taohua/haitan 1","白驼山":"cr baituo/damen 0","星宿海":"cr xingxiu/xxh6 0","冰火岛简单":"cr mj/bhd/haibian 1","冰火岛困难":"cr mj/bhd/haibian 1","冰火岛偷渡":"cr mj/bhd/haibian 1","移花宫简单":"cr huashan/yihua/shandao 0","移花宫困难":"cr huashan/yihua/shandao 1","移花宫偷渡":"cr huashan/yihua/shandao 1","燕子坞简单":"cr murong/anbian 0","燕子坞困难":"cr murong/anbian 1","黑木崖简单":"cr heimuya/shangu 0","黑木崖困难":"cr heimuya/shangu 1","缥缈峰困难":"cr lingjiu/shanjiao 1","缥缈峰偷渡":"cr lingjiu/shanjiao 1","光明顶":"cr mj/shanmen 0","光明顶偷渡":"cr mj/shanmen 0","天龙寺困难":"cr tianlong/damen 1","天龙寺偷渡":"cr tianlong/damen 1","血刀门":"cr xuedao/shankou 0","古墓派简单":"cr gumu/gumukou 0","古墓派困难":"cr gumu/gumukou 1","古墓派困难偷渡":"cr gumu/gumukou 1","华山论剑":"cr huashan/lunjian/leitaixia 0","侠客岛":"cr xkd/shimen 0","净念禅宗简单":"cr chanzong/shanmen 0","净念禅宗困难":"cr chanzong/shanmen 1","净念禅宗困难偷渡":"cr chanzong/shanmen 1","慈航静斋简单":"cr cihang/shanmen 0","慈航静斋困难":"cr cihang/shanmen 1","慈航静斋简单偷渡":"cr cihang/shanmen 0","慈航静斋困难偷渡":"cr cihang/shanmen 1","阴阳谷":"cr yyg/ya 0","阴阳谷偷渡":"cr yyg/ya 0","战神殿简单":"cr zsd/damen 0","战神殿困难":"cr zsd/damen 1","战神殿简单偷渡":"cr zsd/damen 0","战神殿困难偷渡":"cr zsd/damen 1","古宗门遗址":"cr gmp/shanmen 0"
      @js ($fbcr) = var fb={(fbdata)};fb.(fbName)
      [if] (FBWay) == 扫荡
        //扫荡模式
        [if] (FBName) == 流氓巷(组队) || (FBName) == 神龙教(组队) || (FBName) == 五毒教(组队) || (FBName) == 云梦沼泽(组队) || (FBName) == 白驼山(组队) || (FBName) == 冰火岛(偷渡) || (FBName) == 移花宫(偷渡) || (FBName) == 燕子坞(偷书) || (FBName) == 缥缈峰(偷渡) || (FBName) == 光明顶(组队) || (FBName) == 光明顶(偷渡) || (FBName) == 天龙寺(偷渡) || (FBName) == 古墓派(困难偷渡) || (FBName) == 净念禅宗(困难偷渡) || (FBName) == 慈航静斋(简单偷渡) || (FBName) == 慈航静斋(困难偷渡) || (FBName) == 阴阳谷(偷渡) || (FBName) == 战神殿(简单偷渡) || (FBName) == 战神殿(困难偷渡)
          ($alert_fb) = (FBName)无法扫荡，请改为自动模式！
        [else]
          //team out
          @tidyBag
          @await 3000
          [if] {b扫荡符#}? < (fb_num) || {b扫荡符}? == null
            [if] (RCMode) == 正常模式
              shop 0 (fb_num)
          [if] (FBName) == 古宗门遗址
            jh fam 9 start;go enter
            go up
            @tip 打败($tading)就可以上去|你想要去古老的大陆寻找|你可以上去
            [if] (tading) != null
              ($logGDL) = 无法进入古大陆！
              @print <ord>(logGDL)</ord>
              @push ⚠️【自动日常】(:name)，(logGDL)
            [else]
              ggdl {r疯癫的老头}
              go north[2]
              go north[2]
              go north[2]
              @await 2000
              look shi
              tiao1 shi;tiao1 shi;tiao2 shi
              jumpdown
              @await 2000
          [if] (logGDL) == null
            (fbcr) (fb_num)
            [if] (fb_num) > 1
              @tip 扫荡完成|扫荡符($lack)继续扫荡|你的($jingli)不够
            [if] (lack) != null
              ($alert_fb) = 扫荡符不足，无法完成对【(FBName)】副本的(FBnum)次扫荡！
            [else if] (jingli) == 精力
              ($alert_fb) = 精力不足，无法完成对【(FBName)】副本的(FBnum)次扫荡！
            @tidyBag
            @await 2000
      [else if] (FBWay) == 自动
        //脚本自动模式
        stopstate
        (FBBefore)
        @await 5000
        [if] (FBName) == 冰火岛(偷渡) || (FBName) == 移花宫(偷渡) || (FBName) == 缥缈峰(偷渡) || (FBName) == 光明顶(偷渡) || (FBName) == 天龙寺(偷渡) || (FBName) == 古墓派(困难偷渡) || (FBName) == 净念禅宗(困难偷渡) || (FBName) == 慈航静斋(简单偷渡) || (FBName) == 慈航静斋(困难偷渡) || (FBName) == 阴阳谷(偷渡) || (FBName) == 战神殿(简单偷渡) || (FBName) == 战神殿(困难偷渡)
          team out
          ($tdnum) = 0
          [while] (tdnum) < (fb_num)
            (fbcr) 0;cr over
            @await 500
            ($tdnum) = (tdnum) + 1
        [else]
          @js ($fbexist) = if(GetDungeonFlow(`(FBName)`)!=null){true}else{false}
          [if] (fbexist) == true
            [if] (FBName) != 白驼山(组队)
              team out
            [if] (callmode) == null
              ($fb_auto_num) = 0
              [while] (fb_auto_num) < (fb_num)
                stopstate
                [while] (:room) != 扬州城-武庙
                  stopstate
                  $to 扬州城-武庙
                  @await 1000
                @js ManagedPerformerCenter.start(`自动副本-(FBName)`, GetDungeonSource("(FBName)").replace(/#.*\n/g,'($_DungeonHpThreshold)=(DungeonHpThreshold)\n($_DungeonWaitSkillCD)=(DungeonWaitSkillCD)\n($_DungeonBagCleanWay)=(DungeonBagCleanWay)\n($_DungeonRecordGains)=否\n($_repeat)=(fb_num)\n'))
                @until (:room 副本区域) == true
                @await 3000
                @until (:room 副本区域) == false
                @until (:room) == 住房-练功房 || (:room) == 住房-卧室 || (:room) == 住房-院子 || (:room) == 扬州城-大门 || (:room) == 帮会-练功房
                ($fb_auto_num) = (fb_auto_num) + 1
            [else]
              @js ManagedPerformerCenter.start(`自动副本-(FBName)`, GetDungeonSource("(FBName)").replace(/#.*\n/g,'($_DungeonHpThreshold)=(DungeonHpThreshold)\n($_DungeonWaitSkillCD)=(DungeonWaitSkillCD)\n($_DungeonBagCleanWay)=(DungeonBagCleanWay)\n($_DungeonRecordGains)=否\n($_repeat)=(fb_num)\n'))
              @until (:room) == 住房-练功房 || (:room) == 住房-卧室 || (:room) == 住房-院子 || (:room) == 扬州城-大门 || (:room) == 帮会-练功房
          [else]
            ($alert_fb) = (FBName)没有自动脚本！

// 赌场兑换残页
[if] (Duihuan) != 不兑换
  //($dhdata) = "无念禅功":"0_32","长生诀":"1_32","慈航剑典":"1_33","阴阳九转":"0_34","战神图录":"0_35","神器碎片":"1_35"
  //@js ($dhfb) = var dh={(dhdata)};dh.(Duihuan)
  [if] (Duihuan) == 无念禅功
    ($dhfb) = 0_32
  [else if] (Duihuan) == 长生诀
    ($dhfb) = 1_32
  [else if] (Duihuan) == 慈航剑典
    ($dhfb) = 1_33
  [else if] (Duihuan) == 阴阳九转
    ($dhfb) = 0_34
  [else if] (Duihuan) == 战神图录
    ($dhfb) = 0_35
  [else if] (Duihuan) == 神器碎片
    ($dhfb) = 1_35
  [if] (dhfb) != null
    stopstate
    [while] (:room) != 扬州城-赌场
      $to 扬州城-赌场
      @await 500
    ask3 {r易直非}?
    duihuan (dhfb)
    @tip 你目前共完成($dhtotal)次
    @await 200
    @js ($dhcy) = $(".content-message").find(".item-commands").last().children("span:contains('(Duihuan)')").attr("cmd")
    @js ($dhpl) = $(".content-message").find(".item-commands").last().children("span:contains('(Duihuan)')").text().match(/[0-9]+/)
    [if] (dhcy) != null && (dhpl) != null
      @js ($dhnum) = parseInt((dhtotal)/(dhpl))
    [if] (dhnum) > 0 && (dhnum) != null
      ($num) = 0
      [while] (num) < (dhnum)
        (dhcy)
        @await 500
        ($num) = (num) + 1
      ($dhinfo) = 当前完成次数(dhtotal)，每(dhpl)次兑换1份(Duihuan)，共计兑换(num)页。
    [else]
      ($dhinfo) = 当前完成次数(dhtotal)，无法兑换(Duihuan)。
    [if] (dhinfo) != null
      @print <hic>(dhinfo)</hic>
      tm (dhinfo)

[if] (GmpSD) == 扫荡
  @await 3000
  stopstate
  jh fam 9 start;go enter
  go up
  @tip 打败($tading)就可以上去|你想要去古老的大陆寻找|你可以上去
  [if] (tading) == null
    ggdl {r疯癫的老头}
    go north[2]
    go north[2]
    go north[2]
    @await 2000
    look shi
    tiao1 shi;tiao1 shi;tiao2 shi
    jumpdown
    [if] (GmpSDnum) == null || (GmpSDnum) == 0
      ($GmpSDnum) = 5
    [if] {b扫荡符#}? < (GmpSDnum) || {b扫荡符}? == null
      [if] (RCMode) == 正常模式
        shop 0 (GmpSDnum)
    cr gmp/shanmen 0 (GmpSDnum)
    [if] (GmpSDnum) > 1
      @tip 古宗门遗址扫荡完成|扫荡符($gmplack)继续扫荡|你的($gmpjingli)不够
    [if] (gmplack) != null
      ($alert_gmp) = 扫荡符不足，无法完成对【古宗门遗址】副本的(GmpSDnum)次扫荡！
    [else if] (gmpjingli) == 精力
      ($alert_gmp) = 精力不足，无法完成对【古宗门遗址】副本的(GmpSDnum)次扫荡！

// 使用玉简
@await 1000
[while] {b玉简p%}? != null
  use {b玉简p%}?
  @tip 找到宗门传承线索|没有($yujian)反应
  [if] (yujian) != null
    [break]
  @await 500

// 当铺购买
stopstate
$tnbuy
@await 3000
@tidyBag

// 请安
greet master
[if] (RC_qingan) == 请安
  @await 2000
  @js WG.oneKeyQA()
  @await 5000
[else]
  [if] (:grade) != 武神 && (:grade) != 战神 && (:grade) != 刀皇 && (:grade) != 剑神 && (:grade) != 兵主
    ($alert_qa) = 根据设置，已跳过请安。

// 领取签到奖励
stopstate
taskover signin;taskover zz1;taskover zz2

// 检查精力
[(:grade) == 百姓]($j) = 1000
[(:grade) == 武士]($jjMax) = 2000
[(:grade) == 武师]($jjMax) = 3000
[(:grade) == 宗师]($jjMax) = 5000
[(:grade) == 武圣]($jjMax) = 7000
[(:grade) == 武帝]($jjMax) = 10000
[(:grade) == 武神 || (:grade) == 剑神 || (:grade) == 刀神 ||(:grade) == 兵主 || (:grade) == 战神]($jjMax) = 15000
[if] (:grade) == 百姓 || (:grade) == 武士 || (:grade) == 武师
  ($jlOver) = 300
[else if] (:grade) == 宗师 || (:grade) == 武圣
  ($jlOver) = 500
[else]
  ($jlOver) = 1000

@await 1000
jh fb lock;score
@await 500
[if] (jjMax) != null && (jlOver) != null && (jjMax) >= (:energy)
  ($jlDif) = (jjMax) - (:energy)
[if] (jlDif) <= (jlOver) && (jlDif) != null
  ($alert_jl) = ⚡️ 当前精力 (:energy)/(jjMax)，即将溢出不再增加，请及时使用。
// 检查元宝
score;transmoney
@tip 账号转入：($cashCharge)
@tip 每日签到：($cashSign)/
[if] (cashSign) != null && (jjMax) != null
  ($cashOver) = (jjMax) - (cashSign)
[if] (cashOver) <= 100
  ($alert_cash) = 💰 当前签到元宝(cashSign)/(jjMax)，即将溢出不再增加
// 黄金收益统计
jh fam lack;pack
($money2) =  (:money)
[if] (money1) != null && (money2) != null
  @js ($gainMoney) = Math.floor(((money2) - (money1))/10000)

// 结束收益统计
[if] (RecordG) == 正常统计
  recordGains->
[else if] (RecordG) == 无弹窗统计
  recordGains->nopopup
[else if] (RecordG) == 静默统计
  recordGains->silent
@recoverSSAuto

// 日常结束后
(RCAfter_action)
@print &nbsp;&nbsp;* <hiy>黄金 (gainMoney)</hiy>
@print <hiy>(month)月(:date)日 (:hour):(:minute)</hiy> <hic>自动日常结束！</hic>
@print 当前精力：<hic>(:energy)/(jjMax)</hic>，签到元宝：<hiy>(cashSign)/(jjMax)</hiy>，充值元宝：<hiy>(cashCharge)</hiy>
@print ----------
($bobao) = (:name)，自动日常结束！
($report) = 日常报告
[if] (alert_sm) != null
  @print <ord>(alert_sm)</ord>
  ($bobao) = (bobao)(alert_sm)
  ($report) = (report)⚠️(alert_sm)
[if] (alert_fb) != null
  @print <ord>(alert_fb)</ord>
  ($bobao) = (bobao)(alert_fb)
  ($report) = (report)⚠️(alert_fb)
[if] (alert_gmp) != null
  @print <ord>(alert_gmp)</ord>
  ($bobao) = (bobao)(alert_gmp)
  ($report) = (report)⚠️(alert_gmp)
[if] (alert_qa) != null
  @print <ord>(alert_qa)</ord>
  ($bobao) = (bobao)(alert_qa)
  ($report) = (report)⚠️(alert_qa)
@js $('#report_prog').remove()
[if] (report) != 日常报告
  @js $(`.state-bar`).before($(`<div id=report_prog><ord>(report)</ord></div>`).click(() => $('#report_prog').remove()))
[if] (TTSover) == 播报
  $tts (bobao)
@js $('#report_jl').remove()
[if] (alert_jl) != null
  @js $(`.state-bar`).before($(`<div id=report_jl><ord>(alert_jl)</ord></div>`).click(() => $('#report_jl').remove()))
  @push (:name)：(alert_jl)
@js $('#report_cash').remove()
[if] (alert_cash) != null
  @js $(`.state-bar`).before($(`<div id=report_cash><ord>(alert_cash)</ord></div>`).click(() => $('#report_cash').remove()))
  @push (:name)：(alert_cash)