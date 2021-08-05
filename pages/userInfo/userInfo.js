// pages/user/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    modalTFTwo:false,//修改密码提交
    oldPassword: '',
    password: '',
    passwordAgain: '',
    show: false,
    buttons: [
      {
        type: 'default',
        className: '',
        text: '辅助操作',
        value: 0
      },
      {
        type: 'primary',
        className: '',
        text: '主操作',
        value: 1
      }
    ]
  },
  //密码弹框
  passwordTF(){
    this.setData({
      modalTFTwo:true
    })
  },
  numChange(e) {
    let numTxt = e.currentTarget.dataset.txt
    let valueList = e.detail.value.split('.');
    if (valueList.length > 2) {
      valueList.splice(2, 1);
    }
    let valueTxt = valueList.join('.');
    this.setData({
      [numTxt]: valueTxt,
    })
  },
  cancelMTwo(){
    this.setData({
      modalTFTwo: false
    })
  },
  confirmMTwo(){
    const { oldPassword, password, passwordAgain} = this.data
    if (oldPassword.length === 0 || password.length === 0 || passwordAgain.length === 0 || passwordAgain != password ){
      app.$u.showToast('原始密码或新密码未填或再次确认密码与新密码不一样，请检查！')
      return
    }
    const params = {
      oldPassword,
      password,
    }
    app.$api.changePassword(params).then(res => {
      if (res.code === 200) {
        app.$u.showToast('修改密码成功！')
        this.setData({
          modalTFTwo: false,
          oldPassword:'',
          password:'',
          passwordAgain:''
        })
      } else {
        app.$u.showToast(res.message)
      }
    },
      err => {
        app.$u.showToast(res.message)
      })
    

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    app.$api.getCurrUser().then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        let userInfo = res.data
        if(userInfo.userId){
          let param={id:userInfo.userId}
          app.$api.getUserRole(param).then(resOne => {
            if(resOne.data.role && resOne.data.role.length>0){
              userInfo.roleName = resOne.data.role.join(',')
            }
            this.setData({
              userInfo
            });
          })
        }
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
  
  }
})