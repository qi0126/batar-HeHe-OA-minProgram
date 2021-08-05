const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: util.getCurrentTime(),//当前时间
    moadelTxt: '请选择联系人',
    userName: {
      txt: '请选择客户',
      ind: null
    },
    timeTxt: {
      txt: '请选择巡店时间',
      ind: null
    },
    userTwoObj: {
      txt: '请选择陪同人员（选填）',
      ind: null
    },

    userModalTF: false, //弹窗一用户
    modalTxtOne: '',
    userList: [],
    modalTFTwo: false,
    modalTxtObj: '请输入巡店具体内容1000字内',
    modalTFDate: false,
    predictEndTime: '2020-02-01', //结束时间
    predictStartTime: '2019-12-20', //起启时间
    searchTxt: '', //搜索客戶字段
    peopleNum: null, //计划人数
    liveNum: null, //住宿费用
    footNum: null, //餐补费用
    airNum: null, //机票费用
    hRailNum: null, //高铁费用
    otherNum: null, //其他费用
  },
  
  //新增预算确定按钮
  conFirmBig() {
    let totalPrice = this.data.liveNum + this.data.hRailNum + this.data.footNum + this.data.airNum //总费用

    let params = {
      "predictEndTime": this.data.predictEndTime,
      "predictStartTime": this.data.predictStartTime,
      "storeId": this.data.userName.ind,
      "storeName": this.data.userName.txt,
      "putupPrice": this.data.liveNum,
      "highSpeedFee": this.data.hRailNum,
      "mealPrice": this.data.footNum,
      "ticketPrice": this.data.airNum,
      "totalPrice": totalPrice ? totalPrice:0,
      "trafficPrice": this.data.otherNum,
      "peopleNum": this.data.peopleNum,
      "addTF":"ture",
    }
    let storeObj = wx.getStorageSync('storeList')
    // console.log("aaa:",storeObj)
    let storeList = [params]
    wx.setStorageSync('storeList', storeList)
    wx.navigateTo({
      url: '/pages/shopApplyAdd/shopApplyAdd',
    })
  },
  numChange(e) {
    let numTxt = e.currentTarget.dataset.txt
    let valueList = e.detail.value.split('.');
    if (valueList.length > 2) {
      valueList.splice(2, 1);
    }
    let valueTxt = valueList.join('.');
    this.setData({
      [numTxt]: valueTxt,
    })
  },
  
  bindTextAreaBlur(e) {
    console.log(e.detail.value)
  },
  //内容弹窗关闭
  cancelMdate() {
    this.setData({
      modalTFDate: false,
    })
  },
  //内容弹窗确定事件
  confirmMdate() {
    // console.log('aaaa:')
    // this.setData({
    //   modalTFDate: false,
    // })
  },
  //弹窗
  modalTap(e) {
    let selectTxt = e.currentTarget.dataset.txt
    // this.changeListFun('userList', 'userSList', null)
    this.setData({
      modalTxtOne: `请选择${e.currentTarget.dataset.txt}`,
      userModalTF: true,
      // teleObj:
      selectTxt
    })
  },
  //日期选择弹窗
  modalTapDate() {
    // console.log("aaaa:")
    this.setData({
      modalTFDate: true,
      predictStartTime: '',
      predictEndTime: ''
    })
  },
  bindDateChange(e) {
    let datetxt = e.currentTarget.dataset.datetxt
    this.setData({
      [datetxt]: e.detail.value
    })
  },
  //关闭弹窗
  cancelM() {
    this.setData({
      userModalTF: false,
    })
  },
  //弹窗确定事件
  confirmM() {
    // console.log(this.userNTxt)
    this.setData({
      userModalTF: false,
    })
  },

  //内容弹窗
  modalTapTwo(e) {
    e.currentTarget.dataset.ddd
    this.setData({
      modalTFTwo: true,
    })
  },
  //内容弹窗关闭
  cancelMTwo() {
    this.setData({
      modalTFTwo: false,
    })
  },
  //内容弹窗确定事件
  confirmMTwo() {

    this.setData({
      modalTFTwo: false,
    })
  },

  //选择巡店人
  checkUserList(e) {
    // switch (this.data.selectTxt) {
    //   case '主访人':
    //     this.changeListFunOne('userList', 'userName', e.currentTarget.dataset.ind)
    //     break
    //   case '陪同人':
    //     this.changeListFun('userList', 'userSList', e.currentTarget.dataset.ind)
    //     break
    //   case '联系人':
    //     this.changeListFunOne('userList', 'teleObj', e.currentTarget.dataset.ind)
    //     break
    // }
    this.changeListFunOne('userList', 'userSList', e.currentTarget.dataset.ind)
  },

  //多选框事件
  changeListFun(sList, eList, index) {
    this.data[sList].forEach((ielem, indOne) => {
      if (ielem.checked === undefined) {
        ielem.checked = false
      }
      if (indOne === index) {
        ielem.true = false
      }
      // this.data.modalTxtObj[eList].forEach(jelem => {
      //   if (jelem === ielem.userId) {
      //     ielem.checked = true;
      //   }
      // })
    })
    let listN = []
    let userTwoId = []
    this.data[sList].forEach((ielem, indOne) => {
      if (indOne === index) {
        ielem.checked = !ielem.checked
      }
      if (ielem.checked === true) {
        listN.push(ielem.companyName)
        userTwoId.push(ielem.companyId)
      }
    })
    // this.setData({
    //   [sList]: this.data[sList],
    //   // [eList]: listS,
    //   userNTxt:listN.join(",")
    // })
    console.log(this.data[sList], index, userTwoId)
    this.setData({
      [sList]: this.data[sList],
      userTwoObj: {
        txt: listN.join(","),
        ind: userTwoId
      },
    })
  },

  //单选框事件
  changeListFunOne(sList, eList, index) {
    this.data[sList].forEach((ielem, indOne) => {
      if (index === indOne) {
        ielem.checked = true;
      } else {
        ielem.checked = false
      }
    })
    this.setData({
      [sList]: this.data[sList],
      userName: {
        txt: this.data[sList][index].companyName,
        ind: this.data[sList][index].companyId
      },
    })
    // switch (this.data.selectTxt) {
    //   case '主访人':
    //     this.setData({
    //       [sList]: this.data[sList],
    //       userName: { txt: this.data[sList][index].concat, ind: this.data[sList][index].userId },
    //     })
    //     break
    //   case '联系人':
    //     this.setData({
    //       [sList]: this.data[sList],
    //       teleObj: { txt: this.data[sList][index].concat, ind: this.data[sList][index].userId },
    //     })
    //     break
    // }
  },
  search(e) {
    this.setData({
      searchTxt: e.detail.value
    })
    this.findCurrUserClient(e.detail.value)
  },
  findCurrUserClient(keywork) {
    const params = {
      keywork: keywork ? keywork : '',
    }
    app.$api.findCurrUserClient(params).then(res => {
        if (res.code === 200) {
          // console.log("aaa:", res.data)
          res.data.forEach(ielem => {
            if (ielem.companyName.length > 9) {
              ielem.companyNameS = ielem.companyName.slice(0, 9) + '...'
            }
            if (ielem.area.length > 3) {
              ielem.areaS = ielem.area.slice(0, 3) + '...'
            }
          })
          this.setData({
            userList: res.data
          })
        } else {
          app.$u.showToast(res.message)
        }
      },
      err => {
        app.$u.showToast(res.message)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.findCurrUserClient();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.animation = wx.createAnimation()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindCasPickerChange: function(e) {
    console.log('乔丹选的是', this.data.casArray[e.detail.value])
    if (e.detail.value == 4) {
      this.setData({
        reply: true
      })
    } else {
      this.setData({
        reply: false
      })
    }
    this.setData({
      casIndex: e.detail.value
    })

  },

  //评价
  goFeedback() {
    console.log('评价11');
    let self = this;
    this.setData({
      modalShow: true
    })
    setTimeout(() => {
      self.animation.height(560).step()
      self.setData({
        animationData: self.animation.export()
      })
    }, 0)
  }
})