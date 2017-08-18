Page({
  data: {
  },

  onLoad: function (e) {
    this.setData({
      type:e.type,
      nextStepDisabled: true
    })
  },
  chooseOnMap: function(e) {
    var that = this;
    wx.navigateTo({ url: '../map/map?type='+ that.data.type});
  },

  formSubmit: function (e) {
    var that = this
    wx.navigateTo({ url: '../questions/questions?latitude='+that.data.latitude+'&longitude='+that.data.longitude+'&adcode='+that.data.adcode+'&address='+that.data.address+'&type='+that.data.type});
  },
  
})


