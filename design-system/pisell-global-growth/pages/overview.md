# Overview · Page specification

本页继承 [MASTER](../MASTER.md)，只定义内容布局与交互，不创建独立视觉主题。

## 用途

让负责人快速看见：部门正在做哪些项目、发生在哪里、哪些需要决策，以及结果如何。部门工作包含市场、展会、伙伴、品牌、销售能力和增长流程。

## 三种视图

| View | 首屏内容 | 核心操作 |
| --- | --- | --- |
| Dashboard | Global footprint、Department pulse、Project portfolio | 查看整体，进入项目或需决策记录 |
| Projects | 完整项目集合，Grid / List 切换 | 搜索、排序、筛选、创建、批量分配 |
| Map | 扩展的全球地图、图层和地点项目预览 | 定位、聚合、进入国家或项目 |

它们是同一批项目的不同呈现方式。切换后国家、工作类型、负责人、搜索与期间不重置。

## Dashboard 构图

1. Header：Global overview；期间；New project。
2. Toolbar：Dashboard / Projects / Map；All regions；All workstreams；My team；搜索。
3. 主区：Global footprint 约占 2/3，Department pulse 约占 1/3。
4. 下区：Project portfolio，默认优先级排序，View all 进入同条件完整集合。
5. 工具区：Quotation system / Case library 的真实入口与连接状态。

地图、指标、项目区都受相同筛选影响。筛选后某区为空，显示本区域空态，不把其他区域一起清空。

## Department pulse

第一版可用指标：Active projects、Needs decision、Active partners、Open pipeline。无法核验的指标显示 Not available，不能用示例数填充正式界面。

默认数字下点击进入支撑记录。例如 Needs decision 进入带有决策需求的任务/项目集合，不进入整个待办表。

Workstreams 显示各类项目数量；This week 显示真实的即将到期里程碑。没有明确目标或分母时不显示完成百分比。

## 项目卡片内容顺序

Cover → Workstream / Region → Project name → Current phase → Task progress → Owner / Due date → Next action → Related resource（可选）。

Grid / List / Map preview 使用同一内容结构的不同密度。封面、名称、状态和进度来自同一记录。不同工作类型不改变卡片结构。

空缺内容按规则折叠：没有封面用中性占位；无截止日期显示 No due date；无任务显示 No tasks；未分配显示 Unassigned；不填虚构数据。卡片若没有下一步，显示 Set next action。

## 项目创建

点击 New project 使用统一编辑表单。首步只需 Project name、Workstream、Owner；Region、Due date 与模板可补充。支持 Global 范围与 Unscheduled 状态。

选择 Workstream 后建议对应工作流模板，允许调整任务与依赖。创建伙伴、客户和资料时复用同一表单模式。

## 视图规则

- 地图选择区域会在筛选条出现可移除的区域条件。
- 某项目在两个国家有位置时地图可有两个点，项目清单只出现一次。
- 无坐标和 Global 项目可从地图旁的清单入口进入，不能被静默遗漏。
- 从卡片、列表、地图或指标打开相同记录时，使用同一个详情。
- 返回后保持筛选、排序、滚动与已选记录。
- URL、权限和数据加载失败都使用 MASTER 的反馈规则。

## 窄屏

内容变为顺序阅读：部门摘要、项目清单、地图入口。地图独立视图按需展开；不把桌面页面等比缩小成无法点击的截图。

## 验收情景

选择 Singapore → 切换 Projects → 打开展会项目 → 查看资料 → 返回 → 切换 Map。整个过程保留 Singapore 条件，显示同一项目、同一负责人、同一进度和同一封面。

## 13 September 2026 — flow-first dashboard (current)

The latest user correction supersedes the Dashboard composition and card rules above. Overview is a department operating flow, not the project collection: Readiness (tall Sales Materials, Online Media, Local Showroom), Acquisition (AI Sales Engine, Customer Enquiries, Exhibition), and Target Customers / commercial results. Partnerships spans only the Online Media / Showroom column and Acquisition. Customer Progress follows below; Global footprint is a lower results section. Existing customer cards belong to Projects and Customers only.

Dashboard metrics use all recorded workspace data. Existing project filters remain preserved for Projects / Map and do not silently filter the department flow. Readiness shows registered files and marks unassessed readiness; no invented completion percentage. Unconnected enquiries, referrals and automated collection are labelled honestly. Imported customer history is not claimed as acquisition-engine conversion.

Customer identity: image, country on the first line, customer name on the second, service status at the right. No oversized Target Customers banner on signed service projects. Contract and payment values remain visible and unknown amounts remain unknown.

Footprint switches between Existing projects and Leads / opportunities. Both counts remain visible in the regional detail. Fixed quantity bins: 1, 2–5, 6–10, 11–50, 51+. Known zero and unavailable research are uncoloured; unavailable counts remain Not available. Hover changes the outline only.
