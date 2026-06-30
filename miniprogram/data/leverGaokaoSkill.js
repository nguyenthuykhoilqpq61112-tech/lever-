const skillProfile = {
  id: 'lever-gaokao-mini-skill',
  name: 'Lever-GaoKao 小程序 Skill',
  version: '0.2.0',
  purpose: '把高考志愿填报视为一次受约束的人生杠杆配置，先咨询收集资料、先核验政策和官方资料，再输出可讨论的候选方向、风险清单和待核验事项。',
  sourceNotes: [
    '基于本仓库 lever-gaokao/SKILL.md 的咨询收集、低估机会扫描、第一性原理审查和风险边界。',
    '参考 gaokao-advisor 的政策优先、场景识别、分数/位次数据检索和报告生成思路。'
  ],
  requiredFields: [
    '省份',
    '年份',
    '选科/科类',
    '分数',
    '位次',
    '批次',
    '预算',
    '不可接受项',
    '学生偏好与家庭约束'
  ],
  guardrails: [
    '不得承诺录取，不输出伪精确概率。',
    '当年政策、招生计划、专业组、章程、投档线和征集志愿以省级考试院、高校招生网、阳光高考等官方渠道为准。',
    '不能替代官方志愿系统、高中老师或可信专业人士复核。',
    '不要收集身份证号、准考证号、手机号、完整住址等敏感信息。',
    '如果缺少位次、选科、批次或不可接受项，必须先标注缺失，最多只能粗筛。'
  ],
  workflow: [
    '先共情和确认填报阶段，再补齐必要信息。',
    '先搜索或要求核验当年政策，再做推荐。',
    '用位次优先于分数，区分录取概率和人生杠杆。',
    '识别迷茫、纠结、冲突、紧急、目标、艺体、军警、低分段、复读、特殊需求等场景。',
    '建立候选池后按冲、稳、保、兜底分层，并保留低估机会备选和非同源对照组。',
    '对热门城市、热门专业、合并更名、升格、捡漏叙事做风险审计。',
    '输出候选方向、风险清单、待核验事项、下一步行动和入学后规划。'
  ],
  outputContract: [
    '信息完整度判断',
    '今年政策/资料待核验清单',
    '第一性原理判断：考生在用有限位次购买什么未来选择权',
    '候选方向与低估机会备选',
    '冲稳保/兜底组合建议（仅梯度，不给精确概率）',
    '风险与反向证据',
    '正式填报前核验步骤',
    '入学后 30/90/180 天行动建议'
  ]
}

function normalize(value) {
  return value || '未填写'
}

function buildSkillPrompt(form) {
  const intake = [
    `省份：${normalize(form.province)}`,
    `年份：${normalize(form.year)}`,
    `选科/科类：${normalize(form.subjectType)}`,
    `分数：${normalize(form.score)}`,
    `位次：${normalize(form.rank)}`,
    `批次：${normalize(form.batch)}`,
    `预算：${normalize(form.budget)}`,
    `不可接受项/风险底线：${normalize(form.redLines)}`,
    `学生偏好与家庭约束：${normalize(form.preferences)}`
  ].join('\n')

  return [
    `你正在运行 ${skillProfile.name}（${skillProfile.id}）。`,
    '',
    `定位：${skillProfile.purpose}`,
    '',
    '资料来源/封装说明：',
    ...skillProfile.sourceNotes.map((item) => `- ${item}`),
    '',
    '硬性边界：',
    ...skillProfile.guardrails.map((item) => `- ${item}`),
    '',
    '执行流程：',
    ...skillProfile.workflow.map((item, index) => `${index + 1}. ${item}`),
    '',
    '考生资料：',
    intake,
    '',
    '请按以下结构输出：',
    ...skillProfile.outputContract.map((item, index) => `${index + 1}. ${item}`)
  ].join('\n')
}

module.exports = {
  skillProfile,
  buildSkillPrompt
}
