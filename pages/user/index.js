const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    app.$api.getCurrUser().then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        this.setData({
          userName: res.data.concat
        });
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //用户退出
  loginOut:function(){
    wx.showModal({
      title: '用户退出',
      content: '确定要退出返回登录页',
      cancelText: "取消",
      cancelColor: "#919599",
      confirmText: "确定退出",
      confirmColor: "#BF1D47",
      success: function (res) {
        if (res.confirm) {
          app.$api.logout().then(res => {
            if (res.code === 200) {
              wx.setStorageSync('accessToken','')
              wx.reLaunch({
                url: '/pages/login/index',
              })
            }
          })
        } else {
          // console.log('用户点击取消')
        }
      }
    })
  }
})