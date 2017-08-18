const tcity = require("../../utils/citys.js");
const accountKey = "yourAzureAccountKey";
const accountName = "yourAzureAccountName";
const baseUrl = "yourAzureStorageTableUrl";
const CryptoJS = require('../../utils/crypto-js');



Page({
  data: {
    autoQuestions: [],
  },

  onLoad: function (e) {
    this.setData({
      latitude:e.latitude,
      longitude:e.longitude,
      adcode:e.adcode,
      type:e.type,
      address:e.address
    })
    console.log('address:', this.data.address)
    // 从azure获取问题
    this.getQuestion(this.data.type+'Qst');
  },
  checkboxChange: function(e) {
    console.log(e)
  },


  formSubmit: function (e) {
    var data = e.detail.value;
    var item = {
      'PartitionKey' : this.data.adcode,
      'RowKey' : guid().toString(),
      'Latitude' : this.data.latitude,
      'Longitude' : this.data.longitude,
      'Address' : this.data.address
    }
    console.log(data)
    for (var i in Object.keys(data)){
      item['Q' + (Number(i)+1).toString()] = data[i].toString();
    }
    console.log(item)
    this.insertItem(this.data.type + 'Ans', item);
    console.log('here')
    wx.navigateTo({url: '../submitSuccess/submitSuccess',
      fail: function(e) {
        console.log(e)
      }});
  },

  // 从azure中读取问题
  getQuestion: function (tableName) {
    var that = this;
    var strTime = (new Date()).toUTCString();
    var strToSign = strTime + '\n/' + accountName + '/' + tableName + '()';
    var secret = CryptoJS.enc.Base64.parse(accountKey);
    var hash = CryptoJS.HmacSHA256(strToSign, secret);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    var auth = "SharedKeyLite " + accountName + ":" + hashInBase64;
    wx.request({
      url: baseUrl + tableName + '()',
      data: {},
      header: {
        'Authorization': auth,
        'x-ms-version': '2014-02-14',
        'x-ms-date': strTime,
        'Content-Type': 'application/json',
        'Content-Encoding': 'UTF-8',
        'Accept': 'application/json;odata=nometadata'
      },
      method: "GET"
      ,
      success: function (res) {
        // console.log(res.data.value)
        var questions = res.data.value
        
        for (var i = 0; i < questions.length; i++) {
          if (questions[i].Type == "singleChoice" || questions[i].Type == "multiChoice") {
            questions[i].Choices = questions[i].Choices.split(" ")
          }
        }

        that.setData({autoQuestions:questions})
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  // 把用户填写的信息存入azure
  insertItem: function(tableName, item) {
    var strTime = (new Date()).toUTCString();
    var strToSign = strTime + '\n/' + accountName + '/' + tableName;
    var secret = CryptoJS.enc.Base64.parse(accountKey);
    var hash = CryptoJS.HmacSHA256(strToSign, secret);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    var auth = "SharedKeyLite " + accountName + ":" + hashInBase64;
    wx.request({
      url: baseUrl + tableName,
      data: item,
      header: {
        "Content-Type": "application/json",
        'Authorization': auth,
        'x-ms-version': '2014-02-14',
        'x-ms-date': strTime,
        'Content-Type': 'application/json',
        'Content-Encoding': 'UTF-8'
      },
      method: "POST"
      ,
      success: function (res) {
        console.log(res.data)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})



// 生成收集信息的RowKey，随机字符串
function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


