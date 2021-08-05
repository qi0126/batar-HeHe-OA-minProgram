const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopTF:true,
    custDisTF:true,
    userModalTF:false,//客户
    hiddenmodalput: false,//弹窗一
    imgModalTF: false,//图片预览
    imgModalUrl: "",//图片预览地址
    modalTxtOne:'选择陪同巡店人',
    userObj:{txt:'',id:''},
    custList:[],
    custSList:[],
    planId:'',
    storeId:'',
    modalTFDate:false,
    userList: [],
    userSList:[1,3],
    userTwoObj: { txt: '', ind: null },
    userModalTFOne:false,
    starNum:2,
    modalTxtTwo: '选择陪同巡店人',
    modelInputPhol:'请描述店铺市场周边情况',
    modalTFTwo: false,
    shopReportData:{},
    newReportData:{},//新增计划外数据
    reportDataList:[],
    rimCondition:'',//周边市场情况
    trainContent:'',//培训内容
    trainNum:'',//培训人数
    storeFlux:'',//店铺流量
    ageParagraph: '',//主要消费年龄段
    marketing:'',//营销活动内容
    outputMoney:'',//产出金额
    needSupport:'',//店铺支持
    liftSuggest: '',//提升建议
    storeStartTime: '',//开始日期
    storeEndTime: '',//结束日期
    modalTxtThree:"",//弹框标题
    modalTxtThreeObj:{},
    isStoreStatus:0,
    isTF:true,
    isPlanOut:1,
    promModalTF:false,//问题弹框
    promSTxt: '',//问题弹框标题文字
    promInd:null,
    promList:[],//问题数组
    promSList: [],//问题数组选择是数组
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
  //删除图片
  delImg(e) {
    let self = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除此图片',
      cancelText: "取消",
      cancelColor: "#919599",
      confirmText: "确认删除",
      confirmColor: "#BF1D47",
      success: function (res) {
        if (res.confirm) {
          const { indm, indone, indtwo } = e.currentTarget.dataset
          let { reportDataList } = self.data
          reportDataList[indm].datalist[indone].imgList.splice(indtwo, 1)
          self.setData({
            reportDataList
          })
        }

      }
    })
  },
  //点击编辑
  openProm(e){
    let { datalist } = e.currentTarget.dataset.item
    // console.log(e.currentTarget.dataset.ind)
    this.setData({
      promSTxt: this.data.reportDataList[e.currentTarget.dataset.ind].name,
      promList: datalist,
      promInd: e.currentTarget.dataset.ind,
      promModalTF: true
    })
  },
  //改变问题是否
  changeProM(e){
    // console.log(e.detail.value, e.target.dataset.ind, this.data.promList, this.data.promList[e.target.dataset.ind])
    var { promList } = this.data
    promList[e.target.dataset.ind].checked = e.detail.value
    promList[e.target.dataset.ind].reportResult = e.detail.value === true? 1 : 2
    this.setData({
      promList,
    })
  },
  //问题关闭弹窗
  cancelMprom(){
    this.setData({
      promModalTF:false
    })
  },
  //问题选择确认按钮
  confirmProm() {
    var { promList, promSList, reportDataList,promInd } = this.data
    console.log(promList)
    promSList = []
    promList.forEach(ielem=>{
      // if (!ielem.checked) {
      if (ielem.result && ielem.result <= 3) {
        promSList.push(ielem)
      }
    })
    // console.log('promSList:', promSList, promInd, reportDataList)
    reportDataList[promInd].datalist = promList
    reportDataList[promInd].promSList = promSList
    this.setData({
      reportDataList,
      promModalTF: false
    })
  },
  //日期选择弹窗
  modalTapDate() {
    this.setData({
      modalTFDate: true,
      modalCostAddTF: false,
      predictStartTime: '',
      predictEndTime: '',
      noStoreCause:''
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
  //弹窗确定事件
  confirmMCustOne() {

    if (this.data.storeStartTime.length === 0 || this.data.storeEndTime.length === 0 || this.data.storeEndTime < this.data.storeStartTime) {
      app.$u.showToast("计划开始时间和结束时间不能为空，或者开始时间不能大于结束时间，请重新输入提交!")
      return
    }
    this.setData({
      modalTFDate: false
    })
  },
  //内容弹窗关闭
  cancelMOne() {
    this.setData({
      modalTFDate: false
    })
  },
  bindDateChange(e) {
    let datetxt = e.currentTarget.dataset.datetxt
    this.setData({
      [datetxt]: e.detail.value
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
          let manNewList = this.data.userTwoObj.txt.split('.')

          ielem.checked = false
          manNewList.forEach(jelem => {
            if (jelem === ielem.concat) {
              ielem.checked = true
            }
          })
          break;
        case '联系人':
          if (this.data.teleObj.txt === ielem.concat) {
            ielem.checked = true
          } else {
            ielem.checked = false
          }
          break;

      }

    })


    this.setData({
      modalTxtOne: `请选择${e.currentTarget.dataset.txt}`,
      userModalTFOne: true,
      selectTxt,
      userList: this.data.userList
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    app.$api.findUserByConpanyId().then(res => {
      if (res.code === 200) {
        this.setData({
          userList: res.data,
          isStoreStatus: res.data.isStoreStatus ? res.data.isStoreStatus : 1,
          shopTF: res.data.isStoreStatus ? res.data.isStoreStatus : 1
        })
      } else {
        app.$u.showToast(res.message)
      }
    },
      err => {
        app.$u.showToast(res.message)
      })
    let params = { planId: options.planId, planId: options.planId}
    if (options.storeId){
      //店铺编辑新增
      params.storeId = options.storeId
    }
    if (options.planId){
      params.planId = options.planId
    }

    app.$api.findReportData(params).then(res => {
      wx.hideLoading()
      if (res.code === 200) {
        
        let newReportData = res.data
        newReportData.esUserNameD = newReportData.esUserName ? JSON.parse(newReportData.esUserName):"",
        // console.log("aaa:", newReportData)

        newReportData.reportDataList.forEach(ielem=>{
          ielem.score = ielem.fullMark
          ielem.datalist.forEach(jelem=>{
            jelem.contentD = jelem.content.slice(0, 15)
            jelem.result = jelem.result ? jelem.result : 5
            jelem.reportResult = jelem.shopPlanReportContentVo ? jelem.shopPlanReportContentVo.reportResult : null
            jelem.checked = (jelem.shopPlanReportContentVo && jelem.shopPlanReportContentVo.reportResult === 1) ? true : false
            jelem.imgList = (jelem.shopPlanReportContentVo && jelem.shopPlanReportContentVo.img.split(',')[0].length > 0) ? jelem.shopPlanReportContentVo.img.split(',') : []
            // if (ielem.isTrue === 0 && !jelem.shopPlanReportContentVo){
            //   jelem.checked = true,
            //   jelem.reportResult = 1
            // }
            // console.log("jelem:",jelem)
          })
          // console.log('ielem:', ielem)
          if (ielem.isTrue === 0){
            ielem.promSList = []
          }
        })
        this.setData({
          newReportData,
          isPlanOut: newReportData.isPlanOut != undefined ? newReportData.isPlanOut : 1,
          planId: options.planId ? options.planId:'',
          storeId: options.storeId ? options.storeId : '',
          reportDataList:newReportData.reportDataList
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

  search(e) {
    this.setData({
      searchTxt: e.detail.value,
      custPage:1,
    })
    this.findCurrUserClient(e.detail.value)
  },
  findCurrUserClient(keywork) {
    this.setData({ custLoadTF: true })
    wx.showLoading()
    const params = {
      page: this.data.custPage,
      size: this.data.custSum,
      keywork: keywork ? keywork : '',
    }
    app.$api.findCurrUserClient(params).then(res => {
      wx.hideLoading()
      this.setData({ custLoadTF: false })
      if (res.code === 200) {
        // console.log("aaa:", res.data)
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
        wx.hideLoading()
        this.setData({ custLoadTF: false })
        app.$u.showToast(res.message)
      })
  },
  modalTapUser(e){
    let selectTxt = e.currentTarget.dataset.txt
    this.setData({
      selectTxt,
      userModalTF:true,
      custPage: 1,
    })
    this.findCurrUserClient('')
    // console.log(this.data.selectTxt)
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

  switch1Change(e) {
    let self = this
    let numdata = e.currentTarget.dataset.numdata;

    let reportDataList = this.data.reportDataList
    reportDataList.forEach(ielem => {
      ielem.datalist.forEach(jelem => {
        if (jelem.id === numdata.id) {
          console.log("aaa:",jelem)
          jelem.reportResult = e.detail.value === true?1:2;
        }
      })
    })
    this.data.newReportData.reportDataList = reportDataList
    setTimeout(_ => {
      self.setData({
        newReportData: self.data.newReportData,
        reportDataList: self.data.reportDataList
      })
    }, 100)
  },
  //到没到店选择
  changeShopTF(e) {
    let { isStoreStatus} = this.data
    if (isStoreStatus === 0){
      isStoreStatus = 1
    }else{
      isStoreStatus = 0
    }
    this.setData({
      shopTF: e.detail.value,
      isStoreStatus,
    })
  },
  changeStarOne(e){
    let self = this
    let numdata = e.currentTarget.dataset.numdata
    numdata.result = e.currentTarget.dataset.num + 1
    let reportDataList = this.data.reportDataList
    reportDataList.forEach(ielem=>{
      ielem.score = 0
      ielem.datalist.forEach(jelem=>{
        if (jelem.id === numdata.id){
          jelem.result = numdata.result;
        }
        ielem.score += Math.round(parseFloat(jelem.score * jelem.result) * 100) / 100
      })
    })
    this.data.newReportData.reportDataList = reportDataList
    setTimeout(_=>{
      self.setData({
        newReportData: self.data.newReportData,

        reportDataList: self.data.reportDataList
      })
    },100)
  },

  //编辑内选择星星
  changeStarTwo(e) {
    var self = this
    let numdata = e.currentTarget.dataset.numdata
    numdata.result = e.currentTarget.dataset.num + 1
    let reportDataList = this.data.reportDataList
    reportDataList.forEach(ielem => {
      ielem.promSList = []
      ielem.score = 0
      ielem.datalist.forEach(jelem => {
        if (jelem.id === numdata.id) {
          jelem.result = numdata.result;
        }
        ielem.score += Math.round(parseFloat(jelem.score * jelem.result) * 100) / 100
        //在外层显示数据3个星以下
        if (jelem.result <= 3) {
          ielem.promSList.push(jelem)
        }
      })
    })
    this.data.newReportData.reportDataList = reportDataList
    setTimeout(_ => {
      let { promList } = self.data
      promList = self.data.newReportData.reportDataList[self.data.promInd].datalist
      self.setData({
        newReportData: self.data.newReportData,
        reportDataList: self.data.reportDataList,
        promList,
      })
    }, 100)
  },
  chooseImage(e) {
    let self = this
    app.$api.uploadimage().then(res => {
      if (res.code === 200) {
        let numdata = e.currentTarget.dataset.numdata;
        let reportDataList = this.data.reportDataList
        reportDataList.forEach(ielem => {
          ielem.datalist.forEach(jelem => {
            if (jelem.id === numdata.id) {
              jelem.imgList = jelem.imgList.concat(res.data)
            }
          })
        })
        this.data.newReportData.reportDataList = reportDataList
        setTimeout(_ => {
          self.setData({
            newReportData: self.data.newReportData,
            reportDataList: self.data.reportDataList
          })
        }, 100)
      } else {
        app.$u.showToast(res.message)
      }
    },
    err => {
      app.$u.showToast(res.message)
    })

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
  // //弹窗
  // modalTap() {

  //   this.changeListFun('userList', 'userSList', null)
  //   this.setData({
  //     hiddenmodalput:true,
  //   })
  // },
  //关闭弹窗
  cancelM(){
    this.setData({
      hiddenmodalput: false,
      userModalTFOne:false,
      imgModalTF: false,
    })
  },
  //弹窗确定事件
  confirmM(){

    this.setData({
      hiddenmodalput: false,
    })
  },
  confirmMFour(){
    this.setData({
      userModalTFOne: false,
    })
  },
  //关闭弹窗
  cancelMuser() {
    this.setData({
      userModalTF: false,
    })
  },
  //弹窗确定事件
  confirmMuser() {

    this.setData({
      userModalTF: false,
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
          teleObj: { txt: this.data[sList][index].concat, ind: this.data[sList][index].userId },
        })
        // console.log(this.data.teleObj)
        break
      case '联系人':

      this.setData({
          [sList]: this.data[sList],
          userTwoObj: { txt: this.data[sList][index].concat, ind: this.data[sList][index].userId },
        })
        // console.log(this.data.teleObj)
        break
      case '客户名称':
        this.setData({
          [sList]: this.data[sList],
          userObj: { txt: this.data[sList][index].companyName + '/' + this.data[sList][index].area, txtS: this.data[sList][index].companyNameS, ind: this.data[sList][index].companyId },
        })
        break
    }
  },
  //内容弹窗
  modalTapTwo(e){
    let modalTxtThreeObj = e.currentTarget.dataset
    modalTxtThreeObj.value = this.data[modalTxtThreeObj.txt]
    this.setData({
      modalTxtThreeObj,
      modalTFTwo: true,
    })
  },
  //输入框修改
  changeInput(e){
    if (e.currentTarget.dataset.txt){
      this.setData({
        [e.currentTarget.dataset.txt]: e.detail.value
      })
    }else{
      // console.log(e, this.data.modalTxtThreeObj)
      let txt = this.data.modalTxtThreeObj.txt
      this.setData({
        [txt]: e.detail.value
      })
    }
    
    // console.log(e.detail.value, e.currentTarget.dataset)

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
  //保存报告
  saveProjectFun(){
    this.conFirm(1)
  },
  //提交报告
  submitProjectFun(){
    this.conFirm(2)
  },

  conFirm(elem) {
    if (this.data.userObj.txt.length === 0 && this.data.storeId.length ===0){
      app.$u.showToast('客户名称为必填,请输入!')
      return
    }
    const { planId, storeStartTime, storeEndTime, userObj, marketing, needSupport, outputMoney, ageParagraph, storeFlux, liftSuggest, trainContent, trainNum, rimCondition, reportDataList, userTwoObj, esUserName, storeId, isStoreStatus, noStoreCause, newReportData} = this.data;

    // console.log("reportDataList:", reportDataList)
    let contentList = [];
    reportDataList.forEach(jelem => {
      jelem.datalist.forEach(kelem => {
        // console.log('kelem:',kelem)
        contentList.push({
          img: kelem.imgList ? kelem.imgList.join(',') : "",
          reportDateId: kelem.id,
          reportResult: kelem.result ? kelem.result:5
        })
      })

      // console.log(jelem)
    })
    
    let isPlanOutTxt = newReportData.isPlanOut != undefined ? newReportData.isPlanOut : 1
    const params = {
      status: elem,//1:待提交 2:已报告
      planId,//计划单号
      storeStartTime,//巡店开始时间
      storeEndTime,//巡店结整时间
      escortUser: userTwoObj.ind?userTwoObj.ind.join(','):"",//陪同人
      marketing,  //营销内容
      needSupport,//支持需要
      outputMoney, //产出金额
      ageParagraph,//主要消费年龄段
      storeFlux,//店铺人流量
      isPlanOut: isPlanOutTxt , //是否是计划外 0 : 计划内 1: 计划外
      liftSuggest,//提升建议
      trainContent,//培训内容
      trainNum,//培训人员数量
      rimCondition,//周边情况
      contentList,//动态内容反馈
      isStoreStatus, //是否到店状态 0: 未到店 1: 到店
      noStoreCause,//未到店原因
    }
    if (storeId && storeId.length > 0){
      params.storeId = storeId//店鋪ID 
    }else{
      params.storeId = userObj.ind; //客户id
      params.storeName = userObj.txt;//客户名称
    }
    
    // console.log("params:", params, JSON.stringify(params))
    app.$api.insertReport(params).then(res => {
      if (res.code === 200) {
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

  
})