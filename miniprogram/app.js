const cloudConfig = require('./config/env')

App({
  onLaunch() {
    const { enableCloud, cloudEnvId } = cloudConfig
    if (wx.cloud && enableCloud && cloudEnvId) {
App({
  onLaunch() {
    const { cloudEnvId } = this.globalData
    if (wx.cloud && cloudEnvId) {
      wx.cloud.init({
        env: cloudEnvId,
        traceUser: true
      })
    }
  },

  globalData: {
    appName: 'Lever-GaoKao',
    intakeStorageKey: 'leverGaokaoIntakeDraft',
    cloudConfig
    cloudEnvId: ''
  globalData: {
    appName: 'Lever-GaoKao',
    intakeStorageKey: 'leverGaokaoIntakeDraft'
  }
})
