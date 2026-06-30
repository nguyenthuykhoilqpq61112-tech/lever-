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
    cloudEnvId: ''
  globalData: {
    appName: 'Lever-GaoKao',
    intakeStorageKey: 'leverGaokaoIntakeDraft'
  }
})
