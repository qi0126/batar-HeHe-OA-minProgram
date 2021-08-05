// pages/acommon/patrolShop-card/patrolShop-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    liData: {
      type: Object
    }
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
    goDetail(){
      // console.log('lkkkk', this.data.liData);
      this.triggerEvent('goDetail', this.data.liData)
    }
  }
})
