const app = getApp()

const defaultForm = {
  province: '',
  year: '',
  subjectType: '',
  score: '',
  rank: '',
  batch: '',
  budget: '',
  redLines: '',
  preferences: ''
}

Page({
  data: {
    fields: [
      { key: 'province', label: '省份', placeholder: '例如：河南' },
      { key: 'year', label: '年份', placeholder: '例如：2026' },
      { key: 'subjectType', label: '选科 / 科类', placeholder: '例如：物化生 / 理科 / 历史类' },
      { key: 'score', label: '分数', placeholder: '请输入高考分数' },
      { key: 'rank', label: '位次', placeholder: '位次优先于分数，尽量填写' },
      { key: 'batch', label: '批次', placeholder: '例如：本科批 / 专科批' },
      { key: 'budget', label: '预算', placeholder: '学费、生活费、城市成本上限' }
    ],
    form: { ...defaultForm }
  },

  onLoad() {
    const saved = wx.getStorageSync(app.globalData.intakeStorageKey)
    if (saved) {
      this.setData({ form: { ...defaultForm, ...saved } })
    }
  },

  onInput(event) {
    const key = event.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: event.detail.value })
  },

  saveDraft() {
    wx.setStorageSync(app.globalData.intakeStorageKey, this.data.form)
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  copyPrompt() {
    const form = this.data.form
    const prompt = `请使用 lever-gaokao 方法，先核验规则和资料，再为考生生成有依据、讲风险、兼顾长期机会的志愿填报建议。\n\n省份：${form.province}\n年份：${form.year}\n选科/科类：${form.subjectType}\n分数：${form.score}\n位次：${form.rank}\n批次：${form.batch}\n预算：${form.budget}\n不可接受项/风险底线：${form.redLines}\n学生偏好与家庭约束：${form.preferences}\n\n请输出：缺失信息、候选方向、低估机会备选、风险清单、待官方核验事项和下一步行动。`

    wx.setClipboardData({ data: prompt })
  }
})
