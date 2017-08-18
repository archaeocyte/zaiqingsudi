//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.window_width= res.windowWidth,
        that.globalData.window_height = res.windowHeight
      }
    })
    // var that = this
    // wx.getSystemInfo({
    //   success: function(res) {
    //     that.setData({
    //       screen_width: res.windowWidth,
    //       screen_height: res.windowWidth
    //     })
    //   }
    // })

  },
  
  globalData:{

  }
})