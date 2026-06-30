const app = getApp()
const { buildSkillPrompt, skillProfile } = require('../../data/leverGaokaoSkill')

const fieldLabels = {
  province: '省份',
  year: '年份',
  subjectType: '选科/科类',
  score: '分数',
  rank: '位次',
  batch: '批次',
  budget: '预算',
  redLines: '不可接受项',
  preferences: '学生偏好与家庭约束'
}

Page({
  data: {
    form: {},
    prompt: '',
    result: '',
    loading: false,
    filledCount: 0,
    totalCount: Object.keys(fieldLabels).length,
    missingFields: [],
    missingFieldsText: '',
    skillName: skillProfile.name
  },

  onShow() {
    const form = wx.getStorageSync(app.globalData.intakeStorageKey) || {}
    const prompt = buildSkillPrompt(form)
    const missingFields = Object.keys(fieldLabels).filter((key) => !form[key])

    this.setData({
      form,
      prompt,
      filledCount: this.data.totalCount - missingFields.length,
      missingFields,
      missingFieldsText: missingFields.map((key) => fieldLabels[key]).join('、')
    })
  },

  goIntake() {
    wx.switchTab({ url: '/pages/intake/intake' })
  },

  copyPrompt() {
    wx.setClipboardData({ data: this.data.prompt })
  },

  runCloudSkill() {
    if (!wx.cloud) {
      wx.showToast({ title: '需基础库支持云开发', icon: 'none' })
      return
    }

    this.setData({ loading: true, result: '' })
    wx.cloud.callFunction({
      name: 'gaokaoSkill',
      data: {
        form: this.data.form,
        prompt: this.data.prompt
      },
      success: (response) => {
        const payload = response.result || {}
        this.setData({ result: payload.answer || payload.message || '云函数未返回分析结果。' })
      },
      fail: (error) => {
        this.setData({ result: `云函数调用失败：${error.errMsg || '请先部署 gaokaoSkill 云函数并配置环境变量。'}` })
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  }
})
