const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopTF: true,
    userModalTF: false, //客户
    hiddenmodalput: false, //弹窗一
    modalTxtOne: '',
    imgModalTF:false,//图片预览
    imgModalUrl:"",//图片预览地址
    planId:'',
    userObj: {
      txt: '',
      id: ''
    },
    custList: [],
    custSList: [],
    userList: [],
    userSList: [],
    starNum: 0,
    modalTxtTwo: '选择陪同巡店人',
    modelInputPhol: '请描述店铺市场周边情况',
    modalTFTwo: false,
    shopReportData: {},
    newReportData: {}, //新增计划外数据
    reportDataList: [],
    rimCondition: '', //周边市场情况
    trainContent: '', //培训内容
    trainNum: '', //培训人数
    storeFlux: '', //店铺流量
    ageParagraph: '', //主要消费年龄段
    marketing: '', //营销活动内容
    outputMoney: '', //产出金额
    needSupport: '', //店铺支持
    liftSuggest: '', //提升建议
    storeStartTime: '', //开始日期
    storeEndTime: '', //结束日期
    modalTxtThree: "", //弹框标题
    modalTxtThreeObj: {},
    noStoreCause:'',//不到店
    userName: { txt: '', ind: null },
    userTwoObj: { txt: '', ind: null },
    userModalTF: false,//弹窗一用户
    modalTFDate: false,//弹窗-时间
    content: '',
    isPlanOut:1,
    promModalTF: false,//问题弹框
    promSTxt: '',//问题弹框标题文字
    promInd: null,
    promList: [],//问题数组
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    // console.log("options", options)
    this.findCurrUserClient();
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
    let params = {
      planId: options.planId
    }
    if (options.storeId) {
      //店铺编辑新增
      params.storeId = options.storeId
    }

    app.$api.findReportDetails(params).then(res => {
      wx.hideLoading()
        if (res.code === 200) {

          let newReportData = res.data
          newReportData.esUserNameD = (newReportData && newReportData.esUserName) ? JSON.parse(newReportData.esUserName):''
          if (newReportData.reportDataList){
            newReportData.reportDataList.forEach(ielem => {
              ielem.promSList = []
              ielem.score = 0
              ielem.datalist.forEach(jelem => {
                jelem.contentD = jelem.content.slice(0, 15)
                jelem.reportResult = jelem.shopPlanReportContentVo ? jelem.shopPlanReportContentVo.reportResult : null
                jelem.result = jelem.result ? jelem.result:5;
                ielem.score += Math.round(parseFloat(jelem.result * jelem.score) * 100) / 100
                jelem.imgList = jelem.img ? jelem.img.split(','):[]
                if (jelem.result <= 3 && ielem.isButton === 1){
                  ielem.promSList.push(jelem)
                }
                
              })
            })
          }
          this.setData({
            isPlanOut: newReportData.isPlanOut ? newReportData.isPlanOut:1,
            newReportData,
            planId: options.planId,
            storeId : options.storeId,
            noStoreCause: newReportData.noStore,
            shopTF: (!newReportData.isStoreStatus || newReportData.isStoreStatus === 0 )? false: true,
            reportDataList: newReportData.reportDataList,
            rimCondition: newReportData.rimCondition,
            trainContent: newReportData.trainContent,
            trainNum: newReportData.trainNum,
            storeFlux: newReportData.storeFlux,
            ageParagraph: newReportData.ageParagraph,
            marketing: newReportData.marketing,
            outputMoney: newReportData.outputMoney,
            needSupport: newReportData.needSupport,
            liftSuggest: newReportData.liftSuggest,
            storeStartTime: newReportData.storeStartTime,
            storeEndTime: newReportData.storeEndTime,
            userName: { txt: newReportData.userName, ind: null },
            userTwoObj: { txt: newReportData.esUserNameD.userNames, ind: null }
          })
          // console.log(newReportData)

        } else {
          app.$u.showToast(res.message)
        }
      },
      err => {
        app.$u.showToast(res.message)
      })
  },


  //点击编辑
  openProm(e) {
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
  changeProM(e) {
    // console.log(e.detail.value, e.target.dataset.ind, this.data.promList, this.data.promList[e.target.dataset.ind])
    var { promList } = this.data
    promList[e.target.dataset.ind].checked = e.detail.value
    promList[e.target.dataset.ind].reportResult = e.detail.value === true ? 1 : 2
    this.setData({
      promList,
    })
  },
  //问题关闭弹窗
  cancelMprom() {
    this.setData({
      promModalTF: false
    })
  },
  //问题选择确认按钮
  confirmProm() {
    var { promList, promSList, reportDataList, promInd } = this.data
    this.setData({
      reportDataList,
      promModalTF: false
    })
  },
  //日期选择弹窗
  modalTapDate() {
    this.setData({
      modalTFDate: true,
      modalCostAddTF:false,
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
  //删除图片
  delImg(e){
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
          reportDataList[indm].datalist[indone].imgList.splice(indtwo,1)
          self.setData({
            reportDataList
          })
        }

      }
    })
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
            custList: res.data
          })
        } else {
          app.$u.showToast(res.message)
        }
      },
      err => {
        app.$u.showToast(res.message)
      })
  },
  modalTapUser() {
    this.setData({
      userModalTF: true
    })
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
          teleObj: { txt: this.data[sList][index].concat, ind: this.data[sList][index].userId },
        })
        // console.log(this.data.teleObj)
        break
      case '客户名称':
        this.setData({
          [sList]: this.data[sList],
          custObj: { txt: this.data[sList][index].companyName + '/' + this.data[sList][index].area, txtS: this.data[sList][index].companyNameS, ind: this.data[sList][index].companyId },
        })
        break
    }
  },
  switch1Change(e) {
    let self = this
    let numdata = e.currentTarget.dataset.numdata;

    let reportDataList = this.data.reportDataList
    reportDataList.forEach(ielem => {
      ielem.datalist.forEach(jelem => {
        if (jelem.id === numdata.id) {
          jelem.reportResult = e.detail.value === true ? 1 : 2;
          jelem.checked = !jelem.checked
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
    this.data.newReportData.isStoreStatus = e.detail.value === true ? 1 : 0
    this.setData({
      shopTF: e.detail.value,
      newReportData: this.data.newReportData
    })
  },
  changeStarOne(e) {
    let self = this
    let numdata = e.currentTarget.dataset.numdata
    numdata.result = e.currentTarget.dataset.num + 1
    var reportDataList = this.data.reportDataList
    reportDataList.forEach(ielem => {
      ielem.score = 0
      ielem.datalist.forEach(jelem => {
        if (jelem.id === numdata.id) {
          jelem.result = numdata.result;
        }
        ielem.score += Math.round(parseFloat(jelem.score * jelem.result) * 100) / 100
      })
    })
    this.data.newReportData.reportDataList = reportDataList
    setTimeout(_ => {
      self.setData({
        newReportData: self.data.newReportData,
        reportDataList: reportDataList
      })
    }, 100)
  },
  //编辑内选择星星
  changeStarTwo(e){
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
        if (jelem.result <= 3){
          ielem.promSList.push(jelem)
        }
      })
    })
    this.data.newReportData.reportDataList = reportDataList
    setTimeout(_ => {
      let {promList} = self.data 
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
          // console.log("res", res.data)
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
      icon: "none",
      duration: 2000
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
          let manNewList = this.data.userTwoObj.txt?this.data.userTwoObj.txt.split('.'):[];

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
      userModalTF: true,
      selectTxt,
      userList: this.data.userList
    })
  },
  //关闭弹窗
  cancelM() {
    this.setData({
      userModalTF: false,
      imgModalTF:false,
    })
  },
  openImg(e){
    // console.log(e.currentTarget.dataset.item)
    this.setData({
      imgModalTF:true,
      imgModalUrl: e.currentTarget.dataset.item
    })
  },
  //图片预览
  confirmImg(){
    this.setData({
      imgModalUrl:'',
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
  //弹窗确定事件
  confirmM() {
    // console.log(this.userNTxt)
    this.setData({
      userModalTF: false,
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

  //内容弹窗
  modalTapTwo(e) {
    let modalTxtThreeObj = e.currentTarget.dataset
    modalTxtThreeObj.value = this.data[modalTxtThreeObj.txt]
    // console.log('modalTxtThreeObj:', modalTxtThreeObj)
    this.setData({
      modalTxtThreeObj,
      modalTFTwo: true,
    })
  },
  //输入框修改
  changeInput(e) {
    if (e.currentTarget.dataset.txt) {
      // console.log("aaa:", e.detail.value, e.currentTarget.dataset.txt)
      this.setData({
        [e.currentTarget.dataset.txt]: e.detail.value
      })
    } else {
      // console.log(e, this.data.modalTxtThreeObj, e.detail.value)
      let txt = this.data.modalTxtThreeObj.txt
      this.setData({
        [txt]: e.detail.value
      })
    }

    // console.log(e.detail.value, e.currentTarget.dataset)

  },

  //输入框修改
  changeInputTwo(e) {
      
      let txt = this.data.modalTxtThreeObj.txt
      this.setData({
        [txt]: e.detail.value
      })
    // console.log(e, this.data.modalTxtThreeObj, e.detail.value)

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
  saveProjectFun() {
    this.conFirm(1)
  },
  //提交报告
  submitProjectFun() {
    this.conFirm(2)
  },

  conFirm(elem) {

    var {
      planId,
      storeStartTime,
      storeEndTime,
      userObj,
      marketing,
      needSupport,
      outputMoney,
      ageParagraph,
      storeFlux,
      liftSuggest,
      trainContent,
      trainNum,
      rimCondition,
      reportDataList,
      noStoreCause,
      storeId,
      newReportData,
      userTwoObj,
      isPlanOut
    } = this.data;

    // console.log("newReportData:", newReportData)
    let contentList = [];
    // console.log("aaa:", reportDataList)
    if (reportDataList){
      reportDataList.forEach(jelem => {
        jelem.datalist.forEach(kelem => {
          contentList.push({
            img: kelem.imgList ? kelem.imgList.join(',') : "",
            reportDateId: kelem.id,
            reportResult: kelem.result ? kelem.result : 5
          })
        })

        // console.log(jelem)
      })
    }

    let params
    // console.log("bbb:",newReportData, isPlanOut)
    if (this.data.shopTF) {

        
      params = {
        status: elem, //1:待提交 2:已报告
        planId, //计划单号
        storeStartTime, //巡店开始时间
        storeEndTime, //巡店结整时间
        storeId: storeId, //客户id
        storeName:newReportData.storeName,//客户名称
        marketing, //营销内容t
        needSupport, //支持需要
        outputMoney, //产出金额
        ageParagraph, //主要消费年龄段
        storeFlux, //店铺人流量
        isPlanOut: newReportData.isPlanOut, //是否是计划外 0 : 计划内 1: 计划外
        liftSuggest, //提升建议
        trainContent, //培训内容
        trainNum, //培训人员数量
        rimCondition, //周边情况
        contentList, //动态内容反馈
        isStoreStatus: 1, //是否到店状态 0: 未到店 1: 到店
        noStoreCause: '', //未到店原因
        escortUser: (userTwoObj.ind && userTwoObj.ind.length > 0) ? userTwoObj.ind.join(',') : '',
      }
      // console.log("params:", params, JSON.stringify(params))
    }else{
      params ={
        status: elem,
        isStoreStatus:0,
        noStoreCause,
        isPlanOut: newReportData.isPlanOut, //是否是计划外 0 : 计划内 1: 计划外
        storeId,
        planId,
        escortUser: (userTwoObj.ind && userTwoObj.ind.length > 0) ? userTwoObj.ind.join(',') : '',
      }
    }
    // console.log(JSON.stringify(params))
      app.$api.insertReport(params).then(res => {
          if (res.code === 200) {
            app.$u.showToast('编辑成功！')
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