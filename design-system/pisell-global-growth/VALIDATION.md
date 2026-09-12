# Design validation

11 Sep 2026 · CI 系列图片检查：已检查 marketing-readiness-v4.png 与 global-playground-signals-v5.png 的橙红底白色 Logo 页眉、专题标题、品牌配图及主要文字。Readiness 保留纵向 Sales Materials、媒体两个出口、展厅两个出口和共享伙伴模块边界；国家图保留六阶段、六地区、V0–V3 与来源注记。图片通过内置 imagegen 生成并定向修改顶部底色；图内微小屏幕文字和标志不是可直接用于印刷的矢量品牌物料。未把概念屏幕或场景当成运行系统或真实展厅。

8 Sep 2026 · 当前验证对象是规范文件与已确认的视觉方向。以下不代表运行中的应用已经通过验收。

## 本轮已核对

- 以认可的红白概念图为视觉基准；保留本地参考副本与已有 Pisell 标志素材。
- 用户界面文案规定为英文，说明文档使用中文。
- 系统范围包含部门各类工作，没有缩成市场追踪或销售漏斗。
- Work catalog 将各节点落实为对象、动作、责任人、交付物、结果和下一步。
- Exhibition Level 1 / 2 / 3 共用模板，通过工作包配置区分。
- Skill 抓取、人工筛选、人工触发和结果回收分开；不把搜集到的候选当作正式项目或商机。
- Dashboard / Projects / Map 使用同一数据和筛选；项目、伙伴、资料复用详情和卡片。
- 报价与案例库作为来源工具，不在本项目重复维护。
- 颜色对比已用相对亮度计算。Brand 对白底为 3.82:1，不用于普通小字；Action 对白底为 5.51:1。
- 正文、辅助文字、success / warning / error 配色已计算，结果见 MASTER。
- Skill 检索的偏题结果已记录并排除，没有套用落地页模板。

## 下一版设计图必须覆盖

- Overview 的 Dashboard / Projects / Map 三种布局。
- Exhibition Level 1 / 2 / 3 的统一详情与不同工作包。
- 候选清单的 Source / Facts / Missing information / Shortlist。
- 人工选入后的工作创建与下一步。
- OEM 或供应商谈判中原报价的引用和版本对比。
- Cloud sales 从候选客户到演示、原报价和下一步。
- Loading、Empty、Error、No permission、Not connected 状态。
- 手机项目列表与全宽详情。

## 有可运行页面后再验收

- 375 / 768 / 1024 / 1440 / 1920px 与 200% 文字放大。
- 三种视图切换保留条件、选中项与返回位置。
- 地图坐标准确，Global 和未定位项目可找到，聚合数量不重复。
- 同一记录从卡片、列表、地图进入详情时数据一致。
- Skill 重跑去重，不覆盖人工备注，不重复立项。
- 选择候选不自动发送、报名、采购、签署或发布；人工触发的具体结果可追溯。
- 保存失败保留输入；完成状态只在真实成功后变化。
- 报价金额、版本和状态来自原系统；连接失败有真实反馈。
- 有效任务进度、未关闭商机金额、签约和回款分别可复算。
- 所有操作键盘可达，焦点可见且返回正确；无 hover-only 关键操作。
- 图片/地图加载失败有可用替代；减少动态效果不影响完成工作。
- 所有图片上的文字与半透明内容按实际画面复核对比。

## 参考图需要修正的细节

保留地图的浅色空间表现，但不沿用生成图中的错误地域标注或任意连线。图中生成的头像不能被当成 Minos 的真实头像。正式品牌用已验证的原始资产。工作类别的数量条使用统一数量比例并提供数字，不能把数量条误作任务进度。

## Melbourne venue inventory — 12 September 2026

Implemented the user-requested sourced directory with 147 records. Verified desktop 1440 × 1000 and mobile 390 × 844; stage and type filters, search including former names, empty/reset, URL retention, source links, shared detail drawer, Escape, no horizontal overflow and no browser page errors. Verified the standalone HTML loads and filters without a server. Existing Pisell logo and approved orange header retained. All newly collected records remain V0. Unread social feeds, uncertain dates, partial openings, old names and closure evidence are explicit. This is a research snapshot; exhaustive coverage, live scanning and outreach are not claimed.

### Working views and permanent exclusions

Verified List / Map / Calendar at desktop and 390px mobile, shared region filters, URL reload, opening-day vs window placement (September conflicting date, October provisional dates), shared area/council detail, Google place photo loading, and map lookup for 129 records (127 venues, 2 mall references). Unlocated records stay in the adjacent list. Local authenticated owner delete, reload persistence and restore passed; public/foreign-account writes and cross-origin writes rejected in server tests. A repeat-import test with a changed record ID and historic alias remains excluded while another branch stays visible. Storage-failure behavior is fail-closed. Production ChatGPT sign-in is platform-managed and not impersonated in testing. Photos are current Google listing contributions, not independently dated construction evidence; area is sourced for 15 of 147 records at this snapshot.
