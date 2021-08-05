Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navBarTxt: String,
    editTF:String,
    test: String,
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
    goback(){
      switch (this.data.test){
        case 'login':
          wx.navigateTo({
            url: '/pages/login/index',
          })
          break;
        case 'index':
          wx.switchTab({
            url: '/pages/index/index',
          })
          break;
        default:
          wx.navigateBack({
            delta: 1
          })
          break;
      }
    },
    exitFun(){
      this.triggerEvent("exitFun")
    }
  }
})
