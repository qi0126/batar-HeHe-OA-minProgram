const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData:{},//详情数据
    planId:'',//计划id
    modalShow:false,//评价弹框
    animationData: {},
    nickName: "",
    avatarUrl: "",
    casArray: ['双眼皮', 'TBM', '隆胸', '减肥', '手动输入'],
    casIndex: 0,
    casIndex1:'请选择主访人员',
    contentTF: true, 
  },
  contentTFfun() {
    this.setData({
      contentTF: !this.data.contentTF
    })
  },
  goEdit(){
    wx.navigateTo({
      url: `/pages/shopApplyEdit/shopApplyEdit?id=${this.data.planId}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.data.planId = options.id
    // console.log('我是详情页', this.data.planId);
    this.getDetail(this.data.planId);
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
  bindCasPickerChange: function (e) {
    console.log('乔丹选的是', this.data.casArray[e.detail.value])
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      casIndex: e.detail.value
    })

  },

  //评价
  goFeedback(){
    console.log('评价11');
    let self = this;
    this.setData({
      modalShow:true
    })
    setTimeout(() => {
      self.animation.height(560).step()
      self.setData({
        animationData: self.animation.export()
      })
    }, 0)
  },
  //获取详情
  getDetail(id){
    let params = {
      id
    }
    app.$api.findDetailsById(params).then(res => {
      // console.log('获取详情', res.data);
      res.data.escortUser = res.data.escortUser ? JSON.parse(res.data.escortUser) : ''
      res.data.contentD = res.data.content.length > 51 ? res.data.content.substring(0, 68) : res.data.content

      this.setData({
        detailData: res.data,
      })
 
    })
  }
})