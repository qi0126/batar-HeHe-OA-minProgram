// pages/patrolShop/patrolShop.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:1,//选中下标
    planData:[],//计划数据
    modalShow:false,//评价弹框
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    // console.log('hx', this.data.activeIndex)
    this.getPlanFun(this.data.activeIndex);
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
  goDetail(elem){
    // console.log("aaaaa", elem.detail.id)
    wx.navigateTo({
      url: `/pages/projectDetails/projectDetails?id=${elem.detail.id}`,
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
  //选项卡事件
  tasFun(e) {
    // console.log('ppppgg', e.currentTarget.dataset.index);
    let type = e.currentTarget.dataset.index;
    this.getPlanFun(type);
  },

  //获取计划
  getPlanFun(type){
    wx.showLoading()
    let params = {
      type
    }
    app.$api.findPlanByType(params).then(res => {
      wx.hideLoading()
      res.data.forEach(item => {
        item.escortUser = item.escortUser?JSON.parse(item.escortUser):''
      })
      this.setData({
        planData: res.data,
        activeIndex: type
      })

      // console.log('数据123', res.data);

    })
  }

})