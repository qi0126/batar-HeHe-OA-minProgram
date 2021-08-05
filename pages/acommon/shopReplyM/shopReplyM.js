// pages/acommon/patrolShop-card/patrolShop-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopData:Object,
  },

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    editShop() {
      let self = this
      // wx.showModal({
      //   title: '编写店铺报告',
      //   content: '确定要编写店铺报告',
      //   cancelText: "取消",
      //   cancelColor: "#919599",
      //   confirmText: "编辑",
      //   confirmColor: "#BF1D47",
      //   success: function (res) {
      //     if (res.confirm) {
            wx.redirectTo({
              url: `/pages/shopReportEdit/shopReportEdit?storeId=${self.data.shopData.storeId}&planId=${self.data.shopData.planId}`,
            })
      //     }
      //   }
      // })
      

    },

    newShop() {
      let self = this
      // wx.showModal({
      //   title: '编写店铺报告',
      //   content: '确定要编写店铺报告',
      //   cancelText: "取消",
      //   cancelColor: "#919599",
      //   confirmText: "编辑",
      //   confirmColor: "#BF1D47",
      //   success: function (res) {
      //     if (res.confirm) {
            wx.redirectTo({
              url: `/pages/shopReportApply/shopReportApply?storeId=${self.data.shopData.storeId}&planId=${self.data.shopData.planId}`,
            })
      //     }
      //   }
      // })


    },
    //查看
    viewShop() {
      let self = this
      // wx.showModal({
      //   title: '查看店铺报告',
      //   content: '确定要查看店铺报告？',
      //   cancelText: "取消",
      //   cancelColor: "#919599",
      //   confirmText: "查看",
      //   confirmColor: "#BF1D47",
      //   success: function (res) {
      //     if (res.confirm) {
            wx.redirectTo({
              url: `/pages/shopReplyView/shopReplyView?storeId=${self.data.shopData.storeId}&planId=${self.data.shopData.planId}`,
            })
      //     }
      //   }
      // })
    }
  },

})
