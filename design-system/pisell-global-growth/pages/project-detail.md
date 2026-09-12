# Entity detail · Shared page specification

继承 [MASTER](../MASTER.md)。项目、伙伴、客户、资料与业务引用共用同一详情结构：Header / Tabs / Sections / Action area。

## 项目详情

Header 展示项目名称、Workstream、Region、Status、Owner 与 Due date。主操作只保留当前最重要的一项，其他操作进入 More。

| Tab | 内容 |
| --- | --- |
| Overview | 目标、成果、当前阶段、阻塞、下一步 |
| Tasks | 阶段与任务、负责人、截止日期、依赖关系 |
| People | 企业、客户、伙伴和联系人 |
| Files | 关联方案、素材、版本、审核状态 |
| Commercial | 商机、原报价引用、合同、交付与回款关联；只在适用项目显示 |
| Activity | 时间顺序的变更与跟进记录 |

没有商业环节的项目不显示 Commercial。项目“完成”的判断由工作流交付物决定，不能一律要求成交。

客户方案项目沿用同一详情结构，按 CM-WORKFLOW 增加业务需求、本地条件、图纸、设计版本、标准/定制/排除项、原报价与交接单等内容配置。不能只留下一个 Demo 或 Files 标签。需要布局、3D 虚拟展厅时引用对应设计工具与成果，实际连接状态必须核实；生成概念图不作为已验证空间方案或自动报价依据。

## 同一结构的其他配置

| 记录类型 | 可用 tabs |
| --- | --- |
| Partner / Customer | Overview、Projects、Contacts、Commercial、Activity |
| Asset | Overview、Versions、Projects、Activity |
| Quote reference | Overview、Project、Activity；实际报价编辑进入来源工具 |

tab 按配置与权限显示，顺序与行为统一。不得出现某个详情左弹、某个右弹、某个又换全新布局。

## 任务推进示例

Exhibition：确定活动目标；准备展台和演示；审核资料；执行活动；分配线索；复盘效果。

OEM partnership：确认设备适配；整理联合方案；验证样机；确认合作范围；伙伴培训；首批客户跟进。

Brand asset：确认 brief；创建内容；语言检查；审核；发布；归档旧版。

以上使用同一 Task list，通过工作流配置安排阶段、依赖和必需交付物。负责人可随任务变化；Blocked 必须有原因。

## 引用已有报价

Commercial tab 内显示 Source、Quote reference、Version、Amount / Currency、Status、Last updated 和 Open quote。

不把报价金额抄到项目自己的独立输入框中。一个项目可关联多份报价，清晰区分不同商机和版本；不能把同一报价的历史版本累计为多个收入。

案例和品牌资料也通过 Resource link 引用同一来源。未连接或无权限保持真实反馈，不显示成功标记。

## 编辑与保存

查看模式进入 Edit 后才显示编辑操作。底部统一为 Cancel / Save / Save and exit。

Save 成功时更新当前记录的所有表现和活动记录；失败保留输入，不退出。关闭存在未保存修改的详情时给出 Save changes / Discard changes / Keep editing。

非阻断的跟进记录可以就地添加。正式审核、完成任务、修改金额等必须明确展示结果，不把按钮点击当成业务成功。

## 多层内容

桌面：从右侧打开统一详情；需要更多空间可 Expand 到完整页。手机：相同内容全宽呈现。打开关联记录时复用当前详情容器并提供 Back，不叠多个抽屉。

进入已有外部系统默认使用新标签页并明确外部打开图标，保留 Global Growth 上下文。若将来来源工具支持安全内嵌，再统一增加嵌入模式。

## 验收情景

从 OEM 项目进入 Commercial → Open quote → 回到项目 → 记录客户反馈 → 设置下一步 → 保存 → 返回项目集合。项目、任务和报价来源始终清楚；列表进度和负责人保持一致。
