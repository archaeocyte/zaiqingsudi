const disasterTypes = [
      {name : "地震", value : 'dizhen'},
      {name : "台风", value : 'taifeng'},
      {name: "水灾", value :'shuizai'},
      {name : "滑坡", value : 'huapo'},
      {name : "风灾", value : 'fengzai'},
      {name: "雪崩", value: 'xuebeng'}
];
var app = getApp()
Page({
  data: {
    // 灾情类型
    types: disasterTypes,
    nextStepDisabled: true,
    width: app.globalData.window_width,
    height: app.globalData.window_height
  },
  onLoad: function (e) {
    this.setData({
      latitude:e.latitude,
      longitude:e.longitude,
      adcode:e.adcode,
      address:e.address
    })
    // console.log(this.data.address)
  },
  formSubmit: function (e) {
    // console.log(this.data.chosenType) 
    //wx.navigateTo({ url: '../questions/questions?latitude='+this.data.latitude+'&longitude='+this.data.longitude+'&adcode='+this.data.adcode+'&type='+this.data.chosenType+'&address='+this.data.address});
    //wx.navigateTo({ url: '../questions/questions?latitude='+this.data.latitude+'&longitude='+this.data.longitude+'&adcode='+this.data.adcode+'&type='+this.data.chosenType+'&address='+this.data.address})
    
  },
  // 改变灾情类型时触发
  changeType: function (e) {
    console.log(e.detail.value)
    this.setData({chosenType:e.detail.value,
                  nextStepDisabled:false})
  }
})



