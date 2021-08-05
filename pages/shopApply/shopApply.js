const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow:false,//评价弹框
    animationData: {},
    projectList:[]
  },
  //查询待提交
  findPlanByType(){
    const params = {
      type:0,
    }
    app.$api.findPlanByType(params).then(res => {
      if (res.code === 200) {
        wx.hideLoading()
        res.data.forEach(ielem=>{
          
          ielem.escortUserOne = ielem.escortUser?JSON.parse(ielem.escortUser):{}
        })
        this.setData({
          projectList: res.data,
          // projectList: [{}]
        })
      } else {
        this.setData({
          projectList: []
        })
        app.$u.showToast(res.message)
      }
    },
    err => {
      this.setData({
        projectList: []
      })
      app.$u.showToast(res.message)
    })

  },
  //點击
  goDeil(e){
    wx.navigateTo({
      url: `/pages/shopApplyEdit/shopApplyEdit?id=${e.currentTarget.dataset.item.id}`,
    })
  },
  //跳到新增计划页面
  shopApplyAdd(){
    wx.navigateTo({
      url: '/pages/shopApplyAdd/shopApplyAdd',
    })
  },
  goFeedback(){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
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
    this.findPlanByType()
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
  
})