const accountKey = "yeChqK0zEaVpvxkST5Bj0Ov6rtlU38dl6zotUMNvga/mjObKlsQxGr50Ys4MIV1A77QyEomYAtTQ0THGZQct3w==";
const accountName = "wuaotian";
const baseUrl = "https://wuaotian.table.core.windows.net/";
const CryptoJS = require('../../utils/crypto-js');

Page({
  data: {
    plusClass : "images-image images-image-plus",
    imageUrlList : []
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 3,
      success: function (res) {
        // console.log(res.tempFiles)

        that.setData({
          imageUrlList: res.tempFilePaths,
          // imageList: res.tempFiles,
          plusClass: "hidden"
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageUrlList
    })
  },
  uploadImage: function() {
    var strTime = (new Date()).toUTCString();
    //var strToSign = strTime + '\n/' + accountName + '/' + 'mycontainer/testImg';
    var strToSign = 'PUT\n\n' + 'image/png\n\n' + 'x-ms-blob-type:BlockBlob\n' + 'x-ms-date:' + strTime + '\nx-ms-version:2014-02-14'+ '\n/' + accountName + '/' + 'mycontainer/testImg2';
    var secret = CryptoJS.enc.Base64.parse(accountKey);
    var hash = CryptoJS.HmacSHA256(strToSign, secret);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    var auth = "SharedKeyLite " + accountName + ":" + hashInBase64;
    var that = this;
    // wx.uploadFile({
    //   url: 'https://wuaotian.blob.core.windows.net/mycontainer/testImg', //仅为示例，非真实的接口地址
    //   filePath: that.data.imageList[0],
    //   name: 'testImg',
    //   header: {
    //     'Authorization': auth,
    //     'x-ms-version': '2014-02-14',
    //     'x-ms-date': strTime,
    //     'Content-Type': 'application/png'
    //   },
    //   success: function(res){
    //     var data = res.data
    //     console.log(data)
    //     //do something
    //   }
    // })
    console.log(this.data.imageList)
    wx.request({
      url: 'https://wuaotian.blob.core.windows.net/mycontainer/testImg2',
      header: {
        'Authorization': auth,
        'x-ms-version': '2014-02-14',
        'x-ms-date': strTime,
        'Content-Type': 'image/png',
        'x-ms-blob-type' : 'BlockBlob'
      },
      method: "PUT"
      ,
      data: new File(this.data.imageUrlList[0]),
      success: function (res) {
        console.log(res.data)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})
