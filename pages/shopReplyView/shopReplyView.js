const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allFeedBackContnt: '',//回复全部内容
    ellFeedBackContnt:'',//回复省略内容
    recoveryShow:true,//回复展开状态
    shopReportData:{},//回复数据
    imgModalTF: false,//图片预览
    imgModalUrl: "",//图片预览地址
    hiddenmodalput: false,//弹窗一

    modalTxtOne:'选择陪同巡店人',
    userList: [],
    userSList:[],
    starNum:5,
    modalTxtTwo: '选择陪同巡店人',
    modelInputPhol:'请描述店铺市场周边情况',
    modalTFTwo: false,
    modalTFReply:false,//反馈弹窗
    evaluate: '',//全部建议
    evaluateD: '',//省略建议
    contentTF:true,//展开建议
    replyTxt:'',//回复内容

  },
  //回复按钮
  replyFun(){
    this.setData({
      modalTFReply: true,
      replyTxt:''
    })
  },
  //建议展开和收起
  contentTFfun() {
    this.setData({
      contentTF: !this.data.contentTF
    })
  },
  //回复展开收起
  replyDesFun(){
    this.setData({
      recoveryShow: !this.data.recoveryShow
    })
  },

  cancelMReply(e){
    this.setData({
      modalTFReply:false
    })
  },
  confirmMReply(e) {
    if (this.data.replyTxt.length === 0){
      app.$u.showToast('回复内容不能为空！')
      return;
    }
    const params = {
      replyContent: this.data.replyTxt,
      storeId: this.data.shopReportData.storeId,
      planId: this.data.shopReportData.planId
    }
    app.$api.reply(params).then(res => {
      if (res.code === 200) {
        app.$u.showToast("此单回复成功，正在返回！")
        wx.navigateTo({
          url: '/pages/shopReplyList/shopReplyList',
        })
      } else {
        app.$u.showToast(res.message)
      }
    },
      err => {
        app.$u.showToast(res.message)
      })
    // this.setData({
    //   modalTFReply: false
    // })
  },
  //巡店内容
  changeInput(e) {
    let txtOne = e.currentTarget.dataset.txt
    this.setData({
      [txtOne]: e.detail.value
    })
  },
  //查看巡店报告
  viewReportFun(){
    wx.redirectTo({
      url: `/pages/shopReportView/shopReportView?storeId=${this.data.shopReportData.storeId}&planId=${this.data.shopReportData.planId}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    wx.showLoading()
    const params = {
      planId: options.planId,
      storeId: options.storeId,
    }
    app.$api.findStoreFeekBackDetails(params).then(res => {
      wx.hideLoading()
      if (res.code === 200) {
        let shopReportData = res.data

        //建议内容
        if (shopReportData.shopPlanFeedback){
          let evaluate = shopReportData.shopPlanFeedback.evaluate;
          this.setData({
            evaluate: evaluate
          })
          if (evaluate && evaluate.length > 17){
            this.setData({
              evaluateD: `${evaluate.slice(0, 17)}...`
            })
            
          }

        }

        //回复内容
        if (shopReportData.feedBackContnt != null){
          let allFeedBackContnt = shopReportData.feedBackContnt;
          this.setData({
            allFeedBackContnt,
          })
          if (allFeedBackContnt.length > 17){
            this.setData({
              ellFeedBackContnt: `${allFeedBackContnt.slice(0, 17)}...`
            })

          }
        }

        this.setData({
          shopReportData
        })

      } else {
        app.$u.showToast(res.message)
      }
    },
      err => {
        wx.hideLoading()
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
  //更多打开弹窗
  toast1Tap(e) {
    // console.log(e.currentTarget.dataset.txt)
    wx.showToast({
      title: e.currentTarget.dataset.txt,
      icon:"none",
      duration: 2000
    })
  },
  cancelM() {
    this.setData({
      userModalTF: false,
      imgModalTF: false,
    })
  },
  openImg(e) {
    // console.log(e.currentTarget.dataset.item)
    this.setData({
      imgModalTF: true,
      imgModalUrl: e.currentTarget.dataset.item
    })
  },
  //图片预览
  confirmImg() {
    this.setData({
      imgModalUrl: '',
      imgModalTF: false,
    })
  },
  
})