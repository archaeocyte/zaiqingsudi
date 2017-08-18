var tengxunMapApiUrl = 'youMapApiUrl'
var tengxunMapApiKey = 'youMapApiKey'
var app = getApp()
var lng2pass, lat2pass
var lngCurr, latCurr
var lngCenter, latCenter
var redMarker = {
  id: 0,
  iconPath: "../../image/ic_position.png",
  longitude: 116,
  latitude: 39,
  width: 30,
  height: 30
}
var greenControl = {
  id: 1,
  iconPath: '../../image/ic_location.png',
  position: {
    left: app.globalData.window_width/2 - 15,
    top: app.globalData.window_width/2 - 30,
    width: 30,
    height: 30
  },
  clickable: true
}
var grayControl = {
  id: 2,
  iconPath: "../../image/Location@2x.png",
  position: {
    left: 10,
    top: app.globalData.window_width -50,
    width: 30,
    height: 30
  },        
  clickable: true
}

Page({
  data: {
      region: ['北京省', '北京市', '海淀区'],
      map_width: app.globalData.window_width,
      map_height: app.globalData.window_width
  },
  onLoad: function(e) {
    this.setData({type:e.type})
    this.mapCtx = wx.createMapContext("map4select");
    var that = this;
    // 获取定位，并把位置标示出来
    this.getCurrLocationInfo(function(locationInfo){
        redMarker.longitude = locationInfo.longitude
        redMarker.latitude = locationInfo.latitude
        lngCurr = locationInfo.longitude
        latCurr = locationInfo.latitude
        that.setData({
          longitude: locationInfo.longitude,
          latitude: locationInfo.latitude,
          type: e.type,
          markers:[
            redMarker
          ]
        })
        that.getInfoByLngLat()
    }),

    // 显示两个不随地图移动的控件
    that.setData({
      controls: [greenControl, grayControl]
    })
  },

  // 定位用户当前的位置
  getCurrLocationInfo: function(cb){
    var that = this;
    if(this.data.locationInfo){
        cb(this.data.locationInfo)
    }else{
        wx.getLocation({
          type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
          success: function(res){
            console.log('get location success')
            that.data.locationInfo = res;
            cb(that.data.locationInfo)
          },
          fail: function() {
            console.log('get location info failed')
            // fail
          },
          complete: function() {
            // complete
          }
        })
    }
  },

  getLatLgtByAddress: function(addressString) {
    var that = this
    wx.request({
      url: tengxunMapApiUrl+'?address='+addressString+'&key='+tengxunMapApiKey,
      header: {},
      method: "GET",
      data: {},
      success: function(res) {
        that.setData({
          latitude:res.data.result.location.lat,
          longitude:res.data.result.location.lng,
        })
      }
    })
  },

  //点击绿色的确定
  addressConfirm: function(e) {
    var that = this
    if (!this.data.inputVal) {
      wx.showToast({
        title: '请先输入地址',
        duration: 3000
      })
      return
    } else {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; 
      prevPage.setData({
        type: this.data.type,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        adcode: this.data.adcode,
        address: this.data.inputVal
      })
      wx.navigateBack()
    }
  },


  //用微信接口获取中间点的经纬度
  getCenterLngLat: function(){
    var that = this;     
    this.mapCtx.getCenterLocation({
      success: function(res){
          that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
  },

  // 根据当前的经纬度，获取地理位置信息
  getInfoByLngLat: function() {
    this.getCenterLngLat()
    var that = this;
    wx.request({
      url:tengxunMapApiUrl+'?location='+this.data.latitude+','+this.data.longitude+'&key='+tengxunMapApiKey,
      header: {},
      method: "GET",
      data: {},
      success: function (res) {
        console.log(res)
        that.setData({
          address : res.data.result.address,
          adcode : res.data.result.ad_info.adcode,
          inputVal: res.data.result.address,
          region:[res.data.result.address_component.province,res.data.result.address_component.city,res.data.result.address_component.district]
        })
        that.showInput()     
      },
      fail: function (err) {
        wx.showToast({title:'查询失败'})
      }
    })
  },

  testtap(e) {
    this.setData({
      longitude: lngCurr,
      latitude: latCurr
    })
  },

  // 点击左下角的控件
  controltap(e) {
    if (e.controlId == 2) {
      this.setData({
        longitude: lngCurr,
        latitude: latCurr
      })
    }
  },

  getInfoTap: function (e) {
    var that = this
    this.mapCtx.getCenterLocation({
        success: function(res){
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          that.getInfoByLngLat()
        }
      })
  },
  shengshiquChange: function (e) {
    this.setData({
      inputVal: ""
    })
    this.getLatLgtByAddress(this.data.region[0]+this.data.region[1]+this.data.region[2])
  },
  showInput: function () {
      this.setData({
          inputShowed: true
      });
  },

  clearInput: function () {
      this.setData({
          inputVal: ""
      });
  },
  inputTyping: function (e) {
      this.setData({
          inputVal: e.detail.value
      });
  },
});




