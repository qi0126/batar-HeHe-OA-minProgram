const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: util.getCurrentTime(),//当前时间
    orderId:"",//巡店单ID
    orderAllData:{},//订单详情
    modalShow: false,//评价弹框
    modalCostAddTF: false,//新增预算弹框
    applyTF: '0',
    animationData: {},
    nickName: "",
    userName: { txt: wx.getStorageSync('userAllData').concat, ind: wx.getStorageSync('userAllData').userId },

    teleObj: { txt: '', ind: null },
    userTwoObj: { txt: '', ind: null },
    storeList: [],//新增预算

    userModalTF: false,//弹窗一用户
    custModalTF: false,//弹窗-客户列表
    modalTxtOne: '',
    userList: [],
    custList: [],//客户列表
    custSList: [],//客户
    custObj: { txt: '请选择客户', ind: null },
    modalTFTwo: false,
    content: '',
    contentD:'',
    predictEndTime: '', //结束时间
    predictStartTime: '', //起启时间
    searchTxt: '', //搜索客戶字段
    peopleNum: null, //计划人数
    liveNum: null, //住宿费用
    footNum: null, //餐补费用
    airNum: null, //机票费用
    hRailNum: null, //高铁费用
    otherNum: null, //其他费用
    storeListNew: {},//新增预算
    modalTFDate:false,
    contentTF: true, 
    custPage: 1,//客户列表分页页码
    custSum: 24,//客户列表分页每页数量
    custLoadTF: false,//客户列表分页加载中文字
  },
  //下拉加载
  lower(e) {
    let custPage = this.data.custPage + 1
    this.setData({
      custPage
    })
    this.findCurrUserClient(this.data.searchTxt)
  },
  //删除预算
  delFunOne(e) {
    // console.log("aaa:", e, e.detail.ind)
    let self = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删此预算',
      cancelText: "取消",
      cancelColor: "#919599",
      confirmText: "确定删除",
      confirmColor: "#BF1D47",
      success: function (res) {
        if (res.confirm) {
          let { storeList } = self.data
          storeList.splice(parseInt(e.detail.ind), 1)
          self.setData({
            storeList
          })
        }

      }
    })

  },
  contentTFfun() {
    this.setData({
      contentTF: !this.data.contentTF
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    const params = {
      id: options.id,
    }
    app.$api.findDetailsById(params).then(res => {
      wx.hideLoading()
      if (res.code === 200) {
        let { phone, planUserName, type, planUserId, content, storeList, escortUserIds, escortUserNamae } = res.data
        
        let contentD = res.data.content.length > 51 ? res.data.content.substring(0, 68) : res.data.content
        // console.log(contentD)

        this.setData({
          orderAllData: res.data,
          applyTF: type+'',
          userName: { txt: planUserName, ind: planUserId },
          teleObj: { txt: phone},
          userTwoObj: { txt: escortUserNamae, ind: escortUserIds},
          content,
          storeList,
          orderId: options.id,
          contentD
        })
      } else {
        app.$u.showToast(res.message)
      }
    },
      err => {
        app.$u.showToast(res.message)
      })
    //用户列表
    app.$api.findUserByConpanyId().then(res => {
      if (res.code === 200) {
        this.setData({
          userList: res.data,
        })
      } else {
        app.$u.showToast(res.message)
      }
    },
      err => {
        app.$u.showToast(res.message)
      })
  },

  //日期选择弹窗
  modalTapDate() {
    this.setData({
      modalTFDate: true,
      modalCostAddTF: false,
    })
  },

  //弹窗确定事件
  confirmMCustOne() {
    if (this.data.predictEndTime.length === 0 || this.data.predictStartTime.length === 0 || this.data.predictEndTime < this.data.predictStartTime) {
      app.$u.showToast("计划开始时间和结束时间不能为空，或者开始时间不能大于结束时间，请重新输入提交!")
      return
    }
    this.setData({
      modalCostAddTF: true,
      modalTFDate: false
    })
  },
  //内容弹窗关闭
  cancelMOne() {
    this.setData({
      modalCostAddTF: true,
      
      modalTFDate: false
    })
  },
  bindDateChange(e) {
    let datetxt = e.currentTarget.dataset.datetxt
    this.setData({
      [datetxt]: e.detail.value
    })
  },
  search(e) {
    this.setData({
      searchTxt: e.detail.value,
      custPage: 1,
    })
    this.findCurrUserClient(e.detail.value)
  },
  //客户
  findCurrUserClient(keywork) {
    wx.showLoading()
    this.setData({ custLoadTF: true })
    const params = {
      page: this.data.custPage,
      size: this.data.custSum,
      keywork: keywork ? keywork : '',
    }
    app.$api.findCurrUserClient(params).then(res => {
      wx.hideLoading()
      this.setData({ custLoadTF: false })
      if (res.code === 200) {
        res.data.forEach(ielem => {
          if (ielem.companyName.length > 9) {
            ielem.companyNameS = ielem.companyName.slice(0, 9) + '..'
          }
          if (ielem.companyCode.length > 5) {
            ielem.companyCodeS = ielem.companyCode.slice(0, 5) + '.'
          }
          if (ielem.area.length > 3) {
            ielem.areaS = ielem.area.slice(0, 3) + '.'
          }
        })
        this.setData({
          custList: this.data.custPage === 1 ? res.data : this.data.custList.concat(res.data)
        })
      } else {
        app.$u.showToast(res.message)
      }
    },
    err => {
      this.setData({ custLoadTF: false })
      wx.hideLoading()
      app.$u.showToast(res.message)
    })
  },

  //提交申请按钮事件
  submitFun() {
    this.submitSFun(1)
  },

  submitSFun(elem) {
    // console.log(this.data)
    const { applyTF, storeList, content, userTwoObj, teleObj, userName } = this.data
    const params = {
      id:this.data.orderId,
      type: parseInt(applyTF),
      escortUser: userTwoObj.ind ? userTwoObj.ind.join(',') : '',
      phone: teleObj.txt,
      planUserId: userName.ind,
      planUserName: userName.txt,
      storeList,
      content,
      status: elem,
    }
    // console.log("params:", JSON.stringify(params))
    app.$api.insertPlan(params).then(res => {
      console.log(res)
      if (res.code === 200) {
        // this.$message.success("计划提交成功，正在跳转到计划列表页面！")
        // wx.removeStorageSync('storeList')
        //待审核 
        if (elem === 1) {
          wx.redirectTo({
            url: '/pages/projectAuditManage/projectAuditManage',
          })
        }
        //待提交
        if (elem === 0) {
          wx.redirectTo({
            url: '/pages/shopApply/shopApply',
          })
        }

      } else {
        app.$u.showToast(res.message)
      }
    },
      err => {
        app.$u.showToast(res.message)
      })
  },

  checkCustList() {
    this.changeListFunOne('custList', 'custSList', e.currentTarget.dataset.ind)
  },

  //巡店内容
  changeInput(e) {
    let txtOne = e.currentTarget.dataset.txt
    if (txtOne === 'content'){
      let contentD = e.detail.value.length > 51 ? e.detail.value.substring(0, 68) : e.detail.value
      this.setData({
        contentD
      })
    }

    this.setData({
      [txtOne]: e.detail.value
    })
  },
  changeApplyFun(e) {
    let applytf = e.currentTarget.dataset.applytf === "0" ? "0" : "1";
    if (e.currentTarget.dataset.applytf === "1") {
      this.setData({
        userName: { txt: wx.getStorageSync('userAllData').concat, ind: wx.getStorageSync('userAllData').userId }
      })
    }
    this.setData({
      applyTF: applytf
    })
  },

  //弹窗
  modalTap(e) {
    let selectTxt = e.currentTarget.dataset.txt
    this.data.userList.forEach(ielem => {
      switch (selectTxt) {
        case '主访人':
          if (this.data.userName.txt === ielem.concat) {
            ielem.checked = true
          } else {
            ielem.checked = false
          }
          break;
        case '陪同人':
          // console.log("aaa:",this.data.userTwoObj)
          let manNewList = this.data.userTwoObj.txt?this.data.userTwoObj.txt.split('.'):[]

          ielem.checked = false
          manNewList.forEach(jelem => {
            if (jelem === ielem.concat) {
              ielem.checked = true
            }
          })
          break;
        case '联系人':
          if (this.data.teleObj.ind === ielem.userId) {
            ielem.checked = true
          } else {
            ielem.checked = false
          }
          break;

      }

    })


    this.setData({
      modalTxtOne: `请选择${e.currentTarget.dataset.txt}`,
      userModalTF: true,
      userList: this.data.userList,
      selectTxt
    })
  },
  //关闭弹窗
  cancelM() {
    console.log(this.data.modalTxtOne)
    this.setData({
      userModalTF: false,
      modalCostAddTF: this.data.modalTxtOne==='请选择陪同人'?false:true,
      custModalTF: false,
    })
  },
  //弹窗确定事件
  confirmM() {
    // console.log(this.userNTxt)
    this.setData({
      userModalTF: false,
    })
  },
  //弹窗确定事件
  confirmMCust() {

    this.setData({
      custModalTF: false,
      modalCostAddTF:true
    })
  },
  exitFun() {
    let self = this
    wx.showModal({
      title: '确认离开',
      content: '确定离开巡店计划申请，此记录将被保存',
      cancelText: "不保存",
      cancelColor: "#919599",
      confirmText: "保存",
      confirmColor: "#BF1D47",
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          self.submitSFun(0)
        }
        if (res.cancel) {
          wx.redirectTo({
            url: '/pages/shopApply/shopApply',
          })
        }

      }
    })
  },
  //新增预算成功
  conFirmCost(e) {
    var { storeList, custObj, predictEndTime, predictStartTime, hRailNum, footNum, liveNum, airNum, otherNum, peopleNum  } = this.data
    if (!custObj.ind || predictStartTime.length === 0 || predictEndTime.length === 0 || !peopleNum || !liveNum || !footNum || predictEndTime < predictStartTime) {
      app.$u.showToast('有必填字段未填，请检查！')
      return
    }
    let totalPrice = Math.round(parseFloat(parseFloat(liveNum ? liveNum : 0) + parseFloat(hRailNum ? hRailNum : 0) + parseFloat(footNum ? footNum : 0) + parseFloat(airNum ? airNum : 0) + parseFloat(otherNum ? otherNum : 0)) * 100) / 100

    let storeListNew = {
      storeId: custObj.ind,
      storeName: custObj.txt,
      predictStartTime,
      predictEndTime,
      highSpeedFee: hRailNum,
      mealPrice: footNum,
      putupPrice: liveNum,
      ticketPrice: airNum,
      trafficPrice: otherNum,
      peopleNum: peopleNum,
      totalPrice: totalPrice,
    }
    var length = storeList.length
    storeList[length] = storeListNew
    this.setData({
      storeList,
      custObj: { txt: '请选择客户', ind: null },
      predictStartTime: null,
      predictEndTime: null,
      hRailNum: null,
      footNum: null,
      airNum: null,
      otherNum: null,
      peopleNum: null,
      liveNum: null,
      totalPrice: null,
      modalCostAddTF: false,

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
  //内容弹窗
  modalTapTwo(e) {
    this.setData({
      modalTFTwo: true

    })
  },
  //内容弹窗关闭
  cancelMTwo() {
    this.setData({
      modalTFTwo: false,
      // custModalTF: true,
      modalCostAddTF: false,
    })
  },
  //内容弹窗关闭
  cancelMThree() {
    this.setData({
      modalTFTwo: false,
      modalCostAddTF: false,
    })
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
      "totalPrice": totalPrice ? totalPrice : 0,
      "trafficPrice": this.data.otherNum,
      "peopleNum": this.data.peopleNum,
      "addTF": "ture",
    }

    // let storeObj = wx.getStorageSync('storeList')
    // console.log("aaa:",storeObj)
    this.findCurrUserClient()
    this.setData({
      custModalTF: true,
      modalCostAddTF: false,
      
    })
    // let storeList = [params]
    // wx.setStorageSync('storeList', storeList)
    // wx.navigateTo({
    //   url: '/pages/shopApplyAdd/shopApplyAdd',
    // })
  },
  //内容弹窗确定事件
  confirmMTwo() {

    this.setData({
      modalTFTwo: false,
    })
  },
  //选择巡店人
  checkUserList(e) {
    // console.log('e', e, this.data.selectTxt)
    switch (this.data.selectTxt) {
      case '主访人':
        this.changeListFunOne('userList', 'userName', e.currentTarget.dataset.ind)
        break
      case '陪同人':
        this.changeListFun('userList', 'userSList', e.currentTarget.dataset.ind)
        break
      case '联系人':
        this.changeListFunOne('userList', 'teleObj', e.currentTarget.dataset.ind)
        break
      case '客户名称':
        this.changeListFunOne('custList', 'custSList', e.currentTarget.dataset.ind)
        break
    }
    // this.changeListFun('userList', 'userSList', e.currentTarget.dataset.ind)
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
        listN.push(ielem.concat)
        userTwoId.push(ielem.userId)
      }
    })
    // console.log(this.data[sList], index, userTwoId)
    this.setData({
      [sList]: this.data[sList],
      userTwoObj: { txt: listN.join("."), ind: userTwoId },
    })
  },

  //单选框事件
  changeListFunOne(sList, eList, index) {
    if (index != undefined) {
      this.data[sList].forEach((ielem, indOne) => {
        if (index === indOne) {
          ielem.checked = true;
        } else {
          ielem.checked = false
        }
      })
    } else {
      this.data[sList].forEach((ielem, indOne) => {
        if (ielem.concat === wx.getStorageSync('userAllData').concat) {
          ielem.checked = true;
        } else {
          ielem.checked = false
        }
      })
    }
    switch (this.data.selectTxt) {
      case '主访人':
        this.setData({
          [sList]: this.data[sList],
          userName: { txt: this.data[sList][index].concat, ind: this.data[sList][index].userId },
        })
        break
      case '联系人':

        this.setData({
          [sList]: this.data[sList],
          teleObj: { txt: this.data[sList][index].concat + "-" + (this.data[sList][index].telephone ? this.data[sList][index].telephone : ""), ind: this.data[sList][index].userId },
        })
        break
      case '客户名称':
        console.log(this.data[sList][index])
        this.setData({
          [sList]: this.data[sList],
          custObj: { txt: this.data[sList][index].companyName + '/' + this.data[sList][index].area, txtS: this.data[sList][index].companyNameS, ind: this.data[sList][index].companyId },
        })
        break
    }
  },
  //更多打开弹窗
  toast1Tap(e) {
    // console.log(e.currentTarget.dataset.txt)
    wx.showToast({
      title: e.currentTarget.dataset.txt,
      icon: "none",
      duration: 2000
    })
  },

  //新增预算
  addSaleFun() {
    this.setData({
      modalCostAddTF: true
    })


    // wx.navigateTo({
    //   url: '/pages/shopCostAdd/shopCostAdd',
    // })
  },
  //客户名称点击
  modalTapCost(e) {

    let selectTxt = e.currentTarget.dataset.txt
    this.setData({
      custModalTF: true,
      modalCostAddTF:false,
      // teleObj:
      selectTxt,
      custPage: 1,
    })
    this.findCurrUserClient()
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
})