// pages/acommon/patrolShop-assess/patrolShop-assess.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean,
    animationData: Object
  },

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabArr: { curHdIndex:3},
  },

  ready() {
    let self = this
    this.animation = wx.createAnimation({
      duration: 200
    })
    // wx.getSystemInfo({
    //   success: function (res) {
    //     self.setData({
    //       scrollHeight: (res.windowHeight - 320) * 2
    //     })
    //   }
    // })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeFun(){
      console.log('关闭');
      let self = this
      setTimeout(() => {
        self.animation.height(800).step()
        self.setData({
          animationData: self.animation.export(),
        })
      }, 0)
      setTimeout(() => {
        self.setData({
          modalShow: false,
        })
      }, 300)
    },
    chooseicon(e) {
      var strnumber = e.target.dataset.id;
      var _obj = {};
      _obj.curHdIndex = strnumber;
      this.setData({
        tabArr: _obj
      });

    },
  }
})
