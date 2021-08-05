// pages/acommon/patrolShop-card/patrolShop-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    editTF: String,
    costData:Object,
    indexTxt: String,
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
    delFun() {
      // console.log('aaa:', this.data.indexTxt)
      this.triggerEvent('delFunS', { ind:this.data.indexTxt})
    },
  }
})
