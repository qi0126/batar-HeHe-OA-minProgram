const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopTF:true,
    imgModalTF: false,//图片预览
    imgModalUrl: "",//图片预览地址
    hiddenmodalput: false,//弹窗一

    modalTxtOne:'选择陪同巡店人',
    userList: [],
    userSList:[1,3],
    starNum:5,
    modalTxtTwo: '选择陪同巡店人',
    modelInputPhol:'请描述店铺市场周边情况',
    modalTFTwo: false,


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
    app.$api.reportDetails(params).then(res => {
      wx.hideLoading()
      if (res.code === 200) {
        let shopReportData = res.data
        shopReportData.esUserNameD = shopReportData.esUserName?JSON.parse(shopReportData.esUserName):""
        let shopTF;
        if (shopReportData.isStoreStatus === 0){
          shopTF = 0
        }else{
          shopTF = 1
          
          shopReportData.reportDataList.forEach(ielem => {
            ielem.datalist.forEach(jelem => {
              jelem.imgList = jelem.img.length > 0?jelem.img.split(","):[]
              jelem.contentD = jelem.content.slice(0, 17)
            })
          })
        }

        this.setData({
          shopReportData,
          shopTF,
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