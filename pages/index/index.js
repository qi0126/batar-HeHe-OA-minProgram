//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    userName:'',
    dayNow:{}
  },
  onLoad: function () {
    let self = this;
    wx.showLoading()
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var dayTime = util.formatDayTime(new Date());
    var dayNow = util.getDatesNow(dayTime)
    app.$api.getCurrUser().then(res => {
      if (res.statusCode === 200) {
        wx.setStorageSync('userAllData', res.data)
        wx.hideLoading()
        this.setData({
          userName: res.data.concat
        });
      }
    })
    this.setData({
      dayNow: dayNow
    });

  }
})
