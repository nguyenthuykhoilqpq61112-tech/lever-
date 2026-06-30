# Skill 封装与微信 AI 接入说明

本说明面向维护者：如何把仓库中的 `lever-gaokao` Skill 封装进微信小程序，并为后续接入微信 AI/云开发能力预留后端入口。

## 参考来源

- 微信小程序 AI 接入文档：https://developers.weixin.qq.com/miniprogram/dev/ai/integration.html
- 参考仓库：https://github.com/nguyenthuykhoilqpq61112-tech/gaokao-
- 本仓库 Skill：`lever-gaokao/SKILL.md`

参考仓库 `gaokao-` 的核心启发是：政策优先、场景识别、读取年度配置、分数线/位次检索、ADI 评估和报告生成分层。当前实现没有直接复制其完整 Skill 文本，而是把这些思路压缩为适合小程序调用的 `skillProfile` 与 `buildSkillPrompt`。

## 当前封装方式

```text
miniprogram/data/leverGaokaoSkill.js
```

该文件导出：

- `skillProfile`：Skill 的定位、来源说明、硬性边界、执行流程和输出结构。
- `buildSkillPrompt(form)`：把问诊页本地草稿封装成可复制、可提交云函数的完整提示词。

小程序新增 `pages/ai/ai` 页面：

1. 从 `leverGaokaoIntakeDraft` 读取问诊草稿。
2. 展示资料完整度和缺失字段。
3. 生成封装后的 Skill Prompt。
4. 支持复制 Prompt。
5. 支持调用 `gaokaoSkill` 云函数；未配置模型环境变量时返回下一步配置提示。

## 云函数入口

```text
cloudfunctions/gaokaoSkill/index.js
```

云函数默认使用 OpenAI-compatible Chat Completions 形式，环境变量如下：

| 环境变量 | 必填 | 说明 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 是 | 模型服务 API Key；不要写入小程序前端代码。 |
| `OPENAI_BASE_URL` | 否 | OpenAI-compatible 服务地址，默认 `https://api.openai.com/v1`。 |
| `OPENAI_MODEL` | 否 | 模型名称，默认 `gpt-4.1-mini`。 |

> 注意：如果后续改用微信 AI 官方 Skill/智能体托管能力，应保留 `miniprogram/data/leverGaokaoSkill.js` 作为 Skill 契约来源，把云函数中的模型调用替换成微信 AI 平台分配的调用方式。

## 部署步骤

1. 在微信开发者工具中开通云开发环境。
2. 把 `miniprogram/app.js` 中 `cloudEnvId` 改为真实云开发环境 ID。
3. 在开发者工具中右键 `cloudfunctions/gaokaoSkill`，安装依赖并上传部署。
4. 在云函数配置中添加模型环境变量，不要把 API Key 写入仓库或小程序前端。
5. 打开小程序 `AI` tab，先复制 Prompt 验证内容，再点击“调用云函数分析”测试后端链路。
6. 正式上线前，确认隐私政策、免责声明、官方资料核验说明和数据删除机制符合真实功能。

## 安全边界

- 当前小程序仍应默认 local-first：问诊草稿只保存在用户本机。
- 云函数调用模型时，用户填写的分数、位次、偏好和家庭约束会发送到后端及模型服务；正式开启前必须更新隐私政策。
- 不要在前端暴露任何模型 API Key。
- 不要把 AI 输出当作录取保证；正式填报仍需省级考试院、高校招生网、招生章程和官方志愿系统复核。
