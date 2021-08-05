// pages/acommon/patrolShop-card/patrolShop-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    applyData:Object
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
    goFeedback(){
      console.log('lkkkk');
      this.triggerEvent('goFeedback')
    }
  }
})
