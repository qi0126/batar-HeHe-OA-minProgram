const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow:false,//评价弹框
    animationData: {},
    showModal:true,
    reportList:[],//待报告数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    app.$api.findFeekBack().then(res => {
      wx.hideLoading()
      if (res.code === 200) {
        
        if (res.data.length > 0){
          res.data.forEach(ielem=>{
            ielem.escortUserD = ielem.escortUser?JSON.parse(ielem.escortUser):''
          })
          this.setData({
            reportList:res.data
          })

          // console.log("aaa:", this.data.reportList[0], this.data.reportList)
        }

      } else {
        app.$u.showToast(res.message)
      }
    },
      err => {
        app.$u.showToast(res.message)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation()
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
  //评价
  goDetail(e){
    // console.log(e, e.currentTarget.dataset.elem.id)
    wx.navigateTo({
      url: `/pages/shopReplyDetails/shopReplyDetails?id=${e.currentTarget.dataset.elem.id}`,
    })
    // console.log('评价11');
    // let self = this;
    // this.setData({
    //   modalShow:true
    // })
    // setTimeout(() => {
    //   self.animation.height(560).step()
    //   self.setData({
    //     animationData: self.animation.export()
    //   })
    // }, 0)
  },




})