# Pisell Global Growth · UI Design System

Version 1.1 · 8 Sep 2026  
状态：基于用户认可的概念图建立的第一版设计规范。用于后续设计与实现；不表示系统已开发或工具已连接。

## 1. 设计定位

这是 Pisell 全球增长部门的核心工作系统，服务 Minos、市场团队、伙伴负责人、内容团队和销售团队。

用全球地图看分布，用项目清单推进工作，用 Dashboard 判断成果。每个项目连接负责人、任务、资料、客户与伙伴，以及需要使用的已有工具。

业务目录以 [可执行工作目录](../../docs/WORK-CATALOG.md) 为准：系统追踪可描述、可分配、可交付的具体工作。每类工作通过模板组合 Skill 搜集、人工筛选、人工触发和结果回收。候选名单与正式项目分开。

目标与业务分类见 [Operating model](../../docs/OPERATING-MODEL.md)，完整工作图与最新归属以 [Department work map](../../docs/DEPARTMENT-WORK-MAP.md) 为准。Marketing Readiness 前置，包含自有固定展厅、销售资料、案例与方案；其后展开 Marketing / Partnerships 的获客工作、三类目标客户及客户推进。Market Access 表示地区级别，Revenue Growth 是共同成果。项目交付进度与目标结果进度分开。

品牌关键词：**Pisell / Light / Visual / Global / Connected / Actionable**。

界面语言统一为 **English**。这份说明使用中文便于业务讨论，所有按钮、菜单、提示和示例界面文案保持英文。

流程图与业务图谱仅展示标题和简短关键词，例如 Exhibition / Campaign / Partner；避免动作句、大段解释及 Output / Next / Check 等说明块。完整规则留在文档与详情，需要时展开，不铺在概念图上。

最新工作图按性质区分：Market Access 是当前覆盖结果，Growth Work 是部门工作，Customer Progress 是由 Acquisition 接入的独立客户流程。三者不构成顺序阶段，不使用一二三编号或整体串联箭头。Readiness 展示可复用资料；Partnerships 是只横跨 Readiness 与 Acquisition 的一个模块：左半 Partner Network 建立管理伙伴，向右连接同块内的 Partner Referrals；不再分设 Partner Acquisition 卡片，不占右侧客户区。伙伴四类分类与接洽过程是不同维度。Acquisition 暂呈现 Marketing Activities / Customer Enquiries / Outbound Outreach；Partner Referrals 从共享伙伴区由左向右接入，不重复伙伴卡片。主动获客名称为提案，尚待用户确认。移除通用 Skills 条。采用白底、深灰和 Pisell 橙红，统一摄影、字体与间距，浅色仅辅助识别，避免大面积杂色、城市拼贴和口号。

最新交付要求：三个不同性质的区域必须在同一张完整画布，Customer Progress 保留 CM 的具体工作与交付物，不能拆成另一张必读图。主动获客暂名 Outbound Outreach，AI 作为信号、匹配与预警支持，Readiness 资料库每项采用图片＋短文字并体现 AI 查找/匹配/准备。Handover 从同一批准订单分成软件配置包给 TIM、硬件采购包给 Procurement；硬件包包含客户确认的颜色和图案等要求。操作规程区分配置与另行批准的定制开发。

## 2. 已确认的视觉基准

11 Sep 最新 CI 要求：所有专题图共用品牌页眉与专题标题，顶部 Logo 区为橙红底、白色现有标志。CI 必须进入画册、网站、社交主页、展厅、展位和设备屏幕。遵照 [CI Visual Series](CI-VISUAL-SERIES.md)。取消旧专题图的大面积蓝青底；此前的蓝灰/青绿仅为未批准的概念分区色，不能覆盖现有品牌主色。外部场景统一摄影风格，但不加标志暗示归属。

![Approved UI direction](references/approved-direction-v1.png)

保留：浅色背景、白色内容表面、Pisell 橙红强调、粗体无衬线标题、地图作为主要视图、带图片的项目卡片、紧凑数据摘要、清楚的分区。

不延续：中文后台、Ant Design / Alibaba 默认视觉、紫色后台模板、绿色衬线编辑风、整屏待办表、以销售漏斗代替部门系统。

参考图决定视觉方向，不是逐像素验收标准。图中地图标签位置、示例数字、生成的标志和头像不作为正式资料。地图坐标必须在真实实现中验证；标志必须使用已有品牌资产；头像使用真实用户授权照片或姓名首字母。

## 3. 部门工作如何进入系统

11 Sep 最后纠正：专题 [Marketing Readiness](../../docs/MARKETING-READINESS.md) 遵照用户手绘图 2。AI Sales Engine 只在 Acquisition 内；Readiness 内 Sales Materials 纵向贯穿，右侧 Online Media / Local Showroom；仅 Partnerships 横跨两区。不能再用 AI Sales Engine 横跨两区的被拒绝方案。商业规则扩充为 [V0–V3](../../docs/V0-V3-QUALIFICATION.md)：V0 全量收录已发现且符合范围的对象，包括已开业；V2 正式跟进；V3 签约或实际意向金。

11 Sep 最新商业口径以 [Growth data architecture](../../docs/GROWTH-DATA-ARCHITECTURE.md) 为准：企业/项目档案前期建立，V1 值得跟进、V2 客户确认意向、V3 签约或实际定金后成为正式客户。旧图中的 Customer Profile 不是已成交身份。Global Alerts、Opportunities、Customers 是商业专题的入口，复用记录和详情；部门工作导航与总体工作分类继续保留。

9 Sep 独立工具展开：[Customer Discovery & Proposals](../../docs/CUSTOMER-DISCOVERY-AGENT.md) 是主动获客能力的工作图，承接现有商家批量发现、新项目信号、同一客户资料、个性化提案和前台跟进。此单独工具图是用户明确要求的专题展开，不替代完整部门图。其初步提案基于已确认资料和可见假设，后续才进入 CM 正式方案与报价。前台 Map / List / Alerts 复用同一客户集合和详情结构。

完整部门工作图同时呈现工作分类、获客路径、三类客户与客户推进，责任边界以 [Department work map](../../docs/DEPARTMENT-WORK-MAP.md) 为准。商业主线以 **Customer profile** 为核心，经过 Follow-up、明确 Intent、Solution、Signed Order 到 Handover。**Operations 是边界外的接收团队，不是部门内平级工作阶段**；不展开其部署、培训和服务任务。同一客户可关联多笔独立推进的商机与订单。详细商业交接规则见 [Customer journey](../../docs/CUSTOMER-JOURNEY.md)。

当前客户分类为 Venue Management、Group Solutions / Single Business、Group Solutions / Diversified Business。Customer Progress 从 Acquisition 连接到首个 Customer Profile；总图客户流程区用同一摄影语言呈现，具体工作在 [CM Workflow](../../docs/CM-WORKFLOW.md) 中展开。Marketing Tools 增加 Digital Channels（官网、社交账号及主页建立、咨询表单），区别于后续通过这些渠道获客。

支撑工作的统一容器是 **Project**。它可以是一场展会、一项伙伴合作、一套品牌资料、一个地区支持计划，或销售团队建设项目，并可支持多个客户与商机。优先呈现客户当前阶段、下一步和所需支持；完整软件图谱是功能参考，不要求将所有模块铺在同一个首页。

Project 是工作容器；Work type 选择可复用模板；Level / Scope 决定启用的工作包；Task 是具体动作；Deliverable 和 Outcome 是完成证据。小事项可以只有一项任务，不要求所有工作都建成大型项目。Exhibition 的 Level 1 / 2 / 3 共用模板和详情布局。

| Workstream | 工作组与项目的表现方式 |
| --- | --- |
| Readiness | AI-driven Library 展开 Showroom / Digital Channels / Sales Materials；Case Study 与 Solution Pack 归入 Sales Materials，不再平级；资料是可持续使用的资源 |
| Brand Awareness | Marketing activities / Brand channels 下展开相应项目；使用 Marketing Readiness 中的展示、资料和案例 |
| Market Access | 地区档案按 Established operations / Local representation / Remote support 展示当前存在级别与支持方式；地区下关联具体项目 |
| Partnerships | 一个模块只横跨 Readiness 与 Acquisition；左半 Partner Network 建立管理四类伙伴，向右连接同块内的 Partner Referrals；不另设 Partner Acquisition 卡片，不占客户区 |
| Target Customers | Venue Management / Group Solutions · Single Business / Group Solutions · Diversified Business 三类客户；集团、业务单元、场馆关系关联项目 |

以上是经营分类，不是要求客户顺序经过的阶段。销售推进、报价、合同和交接在详情中按模板展开；不为了分类差异创建新的相似页面。项目阶段和项目状态是两回事：一个处在 Prepare 阶段的项目也可能 On hold。

Market Access 的 Level 1 / 2 / 3 是地区存在级别。Australia 已确认 Level 1；其他地区待确认。该维度与 Exhibition Level 独立，界面分别写 Region level 和 Exhibition level。每个地区显示本地机构 / 代表、负责人、支持方式和关联项目，复用 Entity card / Entity detail / Map。

销售机会是关联的业务记录，有自己的需求、演示、报价、合同等进展。只有适用的项目才显示商机或金额；品牌资料、招聘培训等项目不强行挂成交额。

## 4. 导航与视图

顶层只负责回答“我要去哪个工作区域”。

| 顶层导航 | 内容 |
| --- | --- |
| Overview | 部门项目总览与工作入口 |
| Projects | 完整项目集合、筛选与批量管理 |
| Partners | 设备制造商、渠道、技术、交付服务伙伴及其联系人、合作项目 |
| Customers | Venue Management、单业态集团、跨业态集团三类客户；集团、业务单元、场馆及其关联项目 |
| Library | 品牌素材、销售资料、行业方案与案例入口 |
| Performance | 项目成果、市场表现、伙伴贡献与销售结果 |

Overview 内使用统一切换：**Dashboard / Projects / Map**。Projects 顶层进入同一项目集合的完整视图，不建立第二套清单。

Partners 与 Customers 采用独立入口、共享企业和联系人资料。跨业务 Skill inbox 从全局工具和相应工作区进入，提供候选审核与创建 / 关联工作；不作为第五个经营领域。整体软件图谱见 [Software map](../../docs/SOFTWARE-MAP.md)。

三种视图使用相同的项目来源和相同的筛选条件。切换保留国家、工作类型、负责人、搜索词和已选项目；各视图保留自己的滚动或地图位置。只有 Reset filters 才清空筛选。

左侧窄栏保留产品切换、全局工具与个人设置，顶部负责 Global Growth 内部导航，不在两处重复一套同名菜单。窄栏图标必须提供名称提示和可键盘访问的标签。

## 5. 页面构图

默认采用稳定的四层结构：全局导航、标题与操作、视图与筛选、工作内容。

Dashboard 先呈现 Global footprint 与 Department pulse，再呈现 Project portfolio。地图约占上部工作区域的 2/3，指标约占 1/3；比例可配置，窄屏转单列。

Projects 使用卡片和列表两种表现。Map 扩展地图区域，项目资料在选择后出现。进入详情仍保留返回入口和原筛选上下文。

Connected workspaces 只显示真正需要使用的已有工具。完整入口放在全局工具区；项目详情显示与当前项目有关的报价或资料。避免每张卡、每个区域都重复同一操作。

详细布局见 [Overview](pages/overview.md) 和 [Project detail](pages/project-detail.md)。

## 6. 颜色体系

以下数值是本版唯一颜色定义。其他页面引用颜色角色，不另建色板。来源是已有 Pisell 案例库的品牌颜色；辅助状态色是本版补充规范。

| 角色 | 值 | 用法 |
| --- | --- | --- |
| Brand | `#EF4323` | 品牌标识、地图标记、图表强调、较大的数字 |
| Action | `#C43214` | 主要按钮底色、普通字号链接、选中标签文字 |
| Action hover | `#A62910` | 主要按钮 hover / pressed |
| Canvas | `#F5F3F2` | 应用底面 |
| Surface | `#FFFFFF` | 卡片、面板、输入区域 |
| Surface selected | `#FFF0EB` | 选中行、关联内容的轻强调 |
| Border subtle | `#E5DCDA` | 非交互分区线、卡片边线 |
| Border control | `#8F8581` | 需要独立辨认的表单边界 |
| Text primary | `#343434` | 标题、正文、主要数据 |
| Text secondary | `#696366` | 辅助文字、标签、说明 |
| Success text / background | `#18734A` / `#EBF6EF` | 完成、保存成功 |
| Warning text / background | `#8A5200` / `#FFF4DF` | 需处理、待确认、阻塞提示 |
| Error text / background | `#B92424` / `#FFF0EE` | 保存失败、无效输入、危险操作 |
| Neutral text / background | `#696366` / `#F0EDEA` | 草稿、暂停、辅助状态 |
| Focus | `#C43214` | 外置 2px 焦点线，与控件保持 2px 间隔 |

Brand 与 Action 是同一品牌的不同功能层级。亮橙红 Brand 上的白色普通小字对比不足，因此主要按钮使用较深的 Action；不得把所有小字都改为亮橙红。

已计算的前景/背景对比：正文对白底 12.45:1，辅助文字对白底 5.87:1，白字对 Action 5.51:1。状态文字与对应浅底均高于 5:1。阴影、透明叠层及图片背景仍需在页面实现后单独检查。

本版锁定浅色主题。颜色全部通过角色配置，为后续主题留接口；不根据系统外观擅自把部分区域改成暗色。

### 完整工作图的分区色提案

用户明确要求增加区域辨识、图片和品牌以外的辅助色。以下仅为工作图概念扩展，不宣称已核实官方完整品牌色板，也不自动替换应用中的状态色。生成图片的实际色值需另行视觉核验。

| 工作图角色 | 提案颜色 | 用途 |
| --- | --- | --- |
| Coverage / Readiness surface | #E8EFF4 | 顶部地区覆盖、左侧准备区的蓝灰底 |
| Acquisition surface | #FFF0E7 | 三条获客路径的浅橙底；主强调沿用 Brand |
| Customer surface | #E4F2EF | 三类客户的淡青绿底 |
| Structural heading | #183345 | 主要层次与底部流程的深色标题 |
| Customer heading | #1B5D62 | 客户分区深青标题 |

颜色必须与标题、位置和图片一起表达分组，不单独代表状态或完成度。图片选择与业务对应：固定展厅、市场活动、主动咨询、伙伴介绍、游乐场、跨游乐场与高尔夫的集团；概念图中的生成场景不得当作真实项目照片。

## 7. 字体、尺寸与密度

使用一套现代无衬线字体。默认沿用已有品牌的 Arial，回退 Helvetica 和系统 sans-serif。品牌字标使用素材，不用字体拼字替代。数字启用等宽数字特性；不引入整段等宽字体或衬线标题。

| 字体角色 | 字号 / 行高 | 字重 |
| --- | --- | --- |
| Page title | 28 / 36px | 700 |
| Section title | 18 / 26px | 600 |
| Entity title | 16 / 22px | 600 |
| Body / input | 14 / 20px | 400 |
| Label / button | 13 / 20px | 500 |
| Metadata | 12 / 18px | 400 |
| Key metric | 26 / 32px | 700 |

12px 是元信息下限，不用极小字换取信息量。正文允许自然换行；长标题在卡片里最多两行，详情显示全文。按钮名称保持短而明确，不能通过缩小字号硬塞。

间距统一采用 **4 / 8 / 12 / 16 / 24 / 32px**。默认内容区边距 24px，卡片内边距 16px，面板间距 24px；紧凑模式分别为 16 / 12 / 16px。

| 尺寸角色 | 默认值 | 使用规则 |
| --- | --- | --- |
| Header height | 64px | 高度通过主题配置，不逐页修改 |
| Icon rail width | 64px | 空间不足时折叠 |
| Control height | 36px | 紧凑桌面视觉；触摸区域扩至至少 44px |
| Form input height | 40px | 触摸模式至少 44px |
| Card radius | 12px | 所有实体卡一致 |
| Panel radius | 12px | Dashboard 内容区与详情分区 |
| Control radius | 8px | 按钮、输入、筛选 |
| Avatar / compact count | full | 仅头像、短计数使用圆形或胶囊 |
| Icon size | 16 / 20px | 表内 16，导航 20；同一图标库、1.75px 线宽 |

图标优先沿用已有项目使用的 Lucide；禁止混用 Ant Design 图标、emoji 和不同线宽图标。此项是组件风格决策，不代表已安装任何依赖。

普通内容用边线分组；实体卡和悬浮预览可使用同一个轻阴影：0px 4px 16px，品牌中性色 `#783F24`、8% 不透明度。地图、图库详情允许更明显的空间层次，日常按钮和表格不使用立体效果。

## 8. 共用组件体系

以下是组件职责说明，不是当前已有实现清单。未来先检查旧项目对应组件是否可移植；一类结构只建立一个实现。

| 共用组件 | 统一内容 | 可配置差异 |
| --- | --- | --- |
| App shell | 导航、产品切换、搜索、个人入口 | 当前区域、权限、导航项目 |
| Page header | 标题、时间范围、主操作 | 标题、操作、筛选 |
| View switch | Dashboard / Projects / Map 的切换行为 | 当前视图、可用模式 |
| Filter bar | 搜索、地区、类型、负责人、重置 | 选项、字段、当前条件 |
| Entity card | 图片、标题、元信息、状态、进度、下一步 | 图片有无、布局、密度、字段、操作 |
| Entity list | 排序、选择、批量操作、分页 | 列、单元格表现、记录来源 |
| Entity detail | Header / Tabs / Sections / Action area | 记录、tab、字段、操作、工作流 |
| Metric group | 数值、口径、期间、进入明细 | 指标配置、单位、变化比较 |
| Task list | 负责人、截止、依赖、完成、下一步 | 项目任务、个人待办、审核任务 |
| Candidate review | 来源、关键事实、匹配理由、缺项、人工筛选 | 展会、企业、客户、供应商；复用 Entity list / Entity detail |
| Map view | 地点、聚合、选择、缩放、返回 | 图层、记录、地理范围 |
| Resource link | 来源工具、记录名、状态、打开 | Quote / Case / File / Contact |
| Status badge | 文字、形状、颜色、一致的状态映射 | 所属对象的状态 |
| Form / feedback | 字段、错误、保存、加载、空态 | 字段配置、校验规则、反馈文案 |

同一个 Entity card 可以展示项目、伙伴或资料；没有图片时压缩图片区，使用品牌中性占位，不强行添加图库照片。同一个 Entity detail 支持项目、伙伴、客户、报价引用和资料。不得按每类业务复制卡片、详情或抽屉。

创建组件前检查：是否可复用已有组件，是否只是一个 variant，未来是否能用于至少三类场景。

## 9. 任务链与状态

共用记录结构和交互，不代表不同业务共用同一条销售阶段链。

| 状态集合 | 固定名称与界面标签 |
| --- | --- |
| Project | draft / Draft；active / Active；on_hold / On hold；completed / Completed；cancelled / Cancelled |
| Task | open / To do；in_progress / In progress；blocked / Blocked；done / Done；cancelled / Cancelled |
| Asset | draft / Draft；in_review / In review；approved / Approved；archived / Archived |
| Opportunity | qualified / Qualified；discovery / Discovery；demo / Demo；proposal / Proposal；negotiation / Negotiation；won / Won；lost / Lost |

状态名称按对象集中维护，跨页面使用同一标签。新增状态先补充定义，不能在某一页临时发明同义词。阶段、健康状况、审批、完成度分开呈现。

Overdue 是根据截止时间和未完成状态计算的提示，不创建第二份“逾期状态”。Needs decision 是等待明确决策的记录集合，不能把所有未完成任务都算成需决策。

任务支持依赖与负责人。前置任务未完成时，后续操作解释原因；有权限跳过时必须记录原因。不同项目选择不同工作流配置。

项目进度默认按已完成有效任务 / 有效任务总数计算，排除已取消任务。无任务时显示 No tasks，不能显示误导性的 0% 或 100%。跨项目汇总需标注按任务加权或按项目平均。

## 10. 图片与地图

项目封面优先使用真实项目、展会、设备或获批物料图片。图片的用途是帮助识别项目，不用与项目无关的装饰摄影。默认封面比例 16:7，裁切焦点可配置；卡片、列表与地图预览引用同一封面来源。

保留“轻立体地图 + 项目图片入口”的品牌体验。地图同时提供标准平面模式，低性能设备与减少动态效果偏好使用平面模式。

Project / Partner / Case 图层用形状、标签和图例共同区分。选中地区筛选项目清单；再次选择或 Clear region 取消地区筛选。地图右侧提供 Zoom in / Zoom out / Fit all，不能只有滚轮与手势。

地图只显示验证过的坐标。缺少坐标显示 Location needed，并能进入无坐标项目清单。Global 类型项目仍显示在清单与指标中，不编造地图位置。聚合数量按唯一记录编号去重；跨国项目可有多个位置，但总项目数只计算一次。

概念图的地域标签不能作为地图数据。上线验收必须核对国家、经纬度、归属区域及统计数量。地理区域面积不能被误读为业绩大小。动效连线只呈现真实关系，禁止为了装饰制造合作路线。

## 11. 交互与反馈

所有可以操作的元素都有可见的 hover、pressed、focus、disabled、loading 规则；操作结果具有 success 或 error 反馈。Warning 仅在需要提醒的具体情况下出现。

| 行为 | 统一规则 |
| --- | --- |
| Hover | 表面轻着色或边线加强，不改变周边布局 |
| Pressed | 颜色加深，允许极轻按压反馈，不使文字抖动 |
| Focus | 使用外置清楚焦点线，键盘顺序与视觉一致 |
| Loading | 保留原数据和布局；区域内显示加载与更新时间 |
| Saving | 按钮显示 Saving…，防止重复提交 |
| Success | Saved / Task completed；真实成功后才显示 |
| Error | 保留输入，说明可采取的下一步；提供 Retry |
| Empty | 区分无数据与无匹配，如 No projects yet / No matching projects |
| Disabled | 不能点击；解释缺少条件或权限，支持点击外的信息入口 |
| Stale data | 显示 Last updated；不伪装为实时状态 |

详情从右侧打开，扩展完整页仍使用同一套详情内容；手机适配为全宽。关闭返回此前的列表位置、筛选和焦点，不层层叠加抽屉。删除确认使用统一对话框。

数据编辑操作固定为 Cancel / Save / Save and exit：Cancel 放弃本次未保存修改；Save 保存并留在当前详情；Save and exit 保存后返回入口视图。存在未保存内容时，关闭、返回和 Cancel 采用同一防丢失提示。普通查看无需确认。

标签和卡片内的链接各自触发自己的操作，不因为点击 Open quote 同时打开项目详情。菜单、tooltip 与地图预览均需触摸和键盘替代方式。

错误首先在字段旁出现；多个错误时表单顶部显示简短错误汇总并能进入对应字段。日常界面隐藏长说明；必要的错误、金额口径和权限限制不能隐藏到 hover 才能发现。

## 12. 动效

| 动效角色 | 时长 | 规则 |
| --- | --- | --- |
| Micro feedback | 120ms | hover / pressed / focus |
| Content change | 180ms | 筛选结果、tab、区域内容 |
| Detail enter / exit | 240 / 160ms | 同一方向，退出更快 |
| Geographic focus | 450ms | 选中地区后平滑定位，可立即打断 |

动效只表达状态或空间关系。默认无自动旋转地球、闪烁地图、循环粒子和图片自动轮播。减少动态效果时直接定位，取消位移和尺度动画，仍保留文字与状态反馈。

## 13. 自适应规则

所有断点与密度都通过配置维护。以下是第一版默认值，布局可根据内容不足提前折叠。

| 宽度 | 默认布局 |
| --- | --- |
| ≥1440px | 地图与摘要 2:1，项目卡片四列 |
| 1024–1439px | 地图与摘要按内容保持双列或转单列，项目卡片三列 |
| 768–1023px | 地图与摘要上下排列，项目卡片两列，导航收拢 |
| <768px | 单列卡片，全宽详情，图标导航带文字或展开菜单 |

手机保留 Dashboard / Projects / Map；Overview 默认将当前项目放在地图之前，Map 视图仍可主动全屏查看。筛选收进同一个 Filters 面板，已生效条件始终可见。表格可在自身区域横向滚动，整页不得横向溢出。

验证宽度：375、768、1024、1440、1920px。文字放大到 200% 后不丢失操作。触摸目标至少 44×44px，相邻目标不互相覆盖。

## 14. 已有系统与闭环

报价系统继续负责报价记录、版本、金额和自己的业务状态；案例库继续负责案例内容。Global Growth 显示关联记录与必要摘要，不创建一份独立报价编辑器或第二套案例库。

每个工具引用必须显示来源、更新时间及实际连接情况。Open quote 进入原记录；无权限时显示 Access required；未连接时显示 Not connected；找不到原记录时保留引用并提示 Record unavailable。

通用接口能力未确认前，仅定义引用交互，不承诺双向同步、内嵌编辑或自动回写。工具中的原始状态通过集中映射呈现，不擅自改写原状态。

商业闭环允许来源活动 / 伙伴关联商机，商机关联报价、合同、交付与回款，再将结果用于项目复盘。资料和销售建设项目通过交付物或支持的业务记录体现成果，不被强制推入成交链。

共享内容：Tasks / Contacts / Files / Activity。企业可同时是伙伴与客户，身份通过角色区分，只保留一份企业与联系人主档。

## 15. 指标呈现

数字必须有对象、期间、单位和明细入口。Dashboard、Map 与 Projects 使用同一数据源、筛选和时间口径。只有有真实来源数据时才显示变化率或目标完成率。

项目总览的时间筛选默认表示项目计划区间与所选期间重叠；未排期项目单列 Unscheduled。销售期间按明示的预计成交日或实际成交日统计，不与项目期间混称一个指标。全生命周期金额明确标注 Lifetime。

币种默认显示 AUD，但金额保留原币种。汇总不同币种需要一致的换算来源与日期；未配置汇率时按币种分组，不直接相加。

Open pipeline 排除 Won / Lost；Signed value、Recognised revenue、Received payments 分开展示。一个项目包含多笔商机时，按关联商机唯一编号去重。来源贡献区分唯一主要来源与协助来源，避免收入重复归因。

Workstreams 的项目数量使用计数或条形对比，长度代表项目数量，不伪装成任务完成度。进度条有明确分母与标签。图表旁保留明细或列表入口。

## 16. 设计交付与复用

每次新增页面先确定：使用哪一种共用视图、哪一种详情配置、哪些现有数据和工具。相似页面共享结构；允许调整数据、tab、字段、规则和密度，不允许为了一个业务单独发明布局。

后续需要视觉讨论时直接提供 imagegen 效果图，界面全部英文。不用 Mermaid、程序架构框图或代码代替用户要看的画面。

本版文件是后续工作的依据，修改视觉基准时应升级版本并记录原因；不在单页暗中替换字体、主色、圆角、抽屉行为或导航名称。

实施前后检查见 [Validation](VALIDATION.md)。技能使用与采用范围见 [Skill application](SKILL-APPLICATION.md)。



