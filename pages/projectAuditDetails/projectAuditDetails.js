const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentVal:'',//输入框
    authType:false,//权限状态
    detailData: {},//详情数据
    planId: '',//计划id
    modalShow:false,//评价弹框
    animationData: {},
    nickName: "",
    avatarUrl: "",
    casArray: ['双眼皮', 'TBM', '隆胸', '减肥', '手动输入'],
    casIndex: 0,
    casIndex1:'请选择主访人员',
    hiddenmodalput:false,
    contentTF:true, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    this.data.planId = options.id
    // console.log('我是审核详情页', this.data.planId);
    this.getDetail(this.data.planId);
    this.currUserIsAuth(this.data.planId)
  },
  contentTFfun(){
    this.setData({
      contentTF: !this.data.contentTF
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
  bindCasPickerChange: function (e) {
    // console.log('乔丹选的是', this.data.casArray[e.detail.value])
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
  saveProjectFun: function () {
    let self = this;
    wx.showModal({
      title: '审核通过',
      content: '确定要通过巡店计划申请',
      cancelText: "暂不通过",
      cancelColor: "#919599",
      confirmText: "确定通过",
      confirmColor: "#BF1D47",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let params = {
            planId: self.data.planId,
            status:2
          }
          app.$api.audit(params).then(res => {
            // console.log('审核成功', res.message);
            wx.showToast({
              title: res.message,
              icon: 'success',
              duration: 2000
            })
            self.getDetail(self.data.planId);
            self.currUserIsAuth(self.data.planId)
            wx.navigateTo({
              url: '/pages/projectAuditManage/projectAuditManage',
            })

          })
        } else {
          // console.log('用户点击取消')
        }

      }
    })
  },
  submitProjectFun: function () {
    this.setData({
      hiddenmodalput: true,
      contentVal:''
    })

  },
  cancel(){
    this.setData({
      hiddenmodalput: false,
      contentVal: ''
    })
  },
  confirm() {
    let self = this;
    let params = {
      planId: self.data.planId,
      status: 3,
      cause: self.data.contentVal
    }
    app.$api.audit(params).then(res => {
      console.log('审核成功', res.message);
      wx.showToast({
        title: res.message,
        icon: 'success',
        duration: 2000
      })
      self.getDetail(self.data.planId);
      self.currUserIsAuth(self.data.planId)
      self.setData({
        hiddenmodalput: false
      })
      wx.navigateTo({
        url: '/pages/projectAuditManage/projectAuditManage',
      })

    })
  },
  //获取详情
  getDetail(id) {
    let params = {
      id
    }
    app.$api.planAuthFindDetailsById(params).then(res => {
      wx.hideLoading()
      res.data.escortUser = res.data.escortUser ? JSON.parse(res.data.escortUser) : ''
      res.data.contentD = res.data.content.length > 51 ? res.data.content.substring(0,68): res.data.content
      // console.log('审核获取详情', res.data);
      this.setData({
        detailData: res.data,
      })

    })
  },
  //获取审核权限
  currUserIsAuth(id){
    let params = {
      planId:id
    }
    app.$api.currUserIsAuth(params).then(res => {
      // console.log('获取审核权限', res.data);
    
      this.setData({
        authType: res.data,
      })

    })
  },
  //文本框事件
  textFun(e){
    console.log(e.detail.value);
    this.setData({
      contentVal: e.detail.value
    })
  }

})