// pages/login/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    passWord: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    if(wx.getStorageSync('accessToken').length > 0){
      wx.login({
        success(e) {
          const params = {
            code: e.code,
          }
          app.$api.verificationCode(params).then(res => {
            if (res.code === 200) {
              wx.setStorageSync('accessToken', res.data)
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
        }
      })
    }
    

    
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
  changeInputInfo(e) {
    const { value } = e.detail;
    const { type } = e.currentTarget.dataset;
    this.setData({ [type]: value });
  },
  loginFun(){
    let self = this
    wx.login({
      success(e) {
        const params = {
          code: e.code,
          userName: self.data.userName,
          password: self.data.passWord
        }
        // console.log(e.code)
        app.$api.accountLogin(params).then(res => {
          if (res.code === 200) {
            wx.setStorageSync('accessToken', res.data)
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        })
      }
    })
  }
})