
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow:false,//评价弹框
    reportData:{},
    storeList: [],//计划内店铺巡店列表
    storeListOut: [],//计划外店铺巡店列表
    storeListNew:[],//计划外店铺巡店列表
    storeInOut:"IN",//计划内IN，计划外OUT
    shopId:"",//计虹ID
    contentTF: true, 
  },
  contentTFfun() {
    this.setData({
      contentTF: !this.data.contentTF
    })
  },
  //计划内计划外列表转换
  changeStore(e){
    this.setData({
      storeInOut:e.currentTarget.dataset.txt
    })
    switch (e.currentTarget.dataset.txt){
      case "IN":
        this.setData({
          storeList: this.data.reportData.storeList ? this.data.reportData.storeList : [],
          storeListNew: this.data.reportData.storeList ? this.data.reportData.storeList:[]
        })
        break;
      case "OUT":
        this.setData({
          storeListOut: this.data.reportData.storeListOut ? this.data.reportData.storeListOut : [],
          storeListNew: this.data.reportData.storeListOut ? this.data.reportData.storeListOut : []
        })
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    const params = {
      id: options.id,
    }
    this.setData({
      shopId: options.id,
    })
    app.$api.findPlanDetailsById(params).then(res => {
      wx.hideLoading()
      if (res.code === 200) {
        // console.log(res.data)
        res.data.contentD = res.data.content.length > 51 ? res.data.content.substring(0, 68) : res.data.content
        this.setData({
          reportData:res.data,
          storeList: res.data.storeList ? res.data.storeList : [],
          storeListOut: res.data.storeListOut ? res.data.storeListOut : [],
          storeListNew: res.data.storeList ? res.data.storeList : [],
        })
        // console.log("aaa:", this.data.storeListNew)
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
  saveProjectFun: function () {
    let self = this
    wx.showModal({
      title: '新增计划外报告',
      content: '确定要新增计划外报告申请',
      cancelText: "取消",
      cancelColor: "#919599",
      confirmText: "确定申请",
      confirmColor: "#BF1D47",
      success: function (res) {
        if (res.confirm) {
          // console.log("aaaa:", self.data)
          // wx.setStorageSync('reportData', self.data.reportData.shopId)
          wx.navigateTo({
            url: `/pages/shopReportApply/shopReportApply?planId=${self.data.shopId}`,
          })
        }
      }
    })
  },
  submitProjectFun: function () {
    let self = this
    wx.showModal({
      title: '结束报告',
      content: '确定要结束报告？',
      cancelText: "取消",
      cancelColor: "#919599",
      confirmText: "确定结束",
      confirmColor: "#BF1D47",
      success: function (res) {
        if (res.confirm) {
          
          const params = {
            planId: self.data.shopId,
          }
          app.$api.updateReportStatus(params).then(res => {
            if (res.code === 200) {
              app.$u.showToast("此单结束!")
              wx.navigateTo({
                url: '/pages/shopReportList/shopReportList',
              })
            } else {
              app.$u.showToast(res.message)
            }
          },
            err => {
              app.$u.showToast(res.message)
            })
        }
      }
    })
  },
})