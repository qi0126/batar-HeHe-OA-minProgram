let CryptoJS = require('../utils/aes.js').CryptoJS
import $u from '../utils/util.js'

var sumList = []
var sumTime = 0;
//  加密aes  
let crypto = {

    Encrypt: (word) => {
        var key = CryptoJS.enc.Utf8.parse("acdwessdbatar123");
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },

    decrypt: (word) => {
        var key = CryptoJS.enc.Utf8.parse("acdwessdbatar123");
        var decrypt = CryptoJS.AES.decrypt(word, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
}

class Api {
    constructor() {
      const environment = 'test'; // dev = 开发 | test = 测试 | demo = 演示环境 | product = 生产环境
        switch (environment) {
            case 'dev':
                this.baseUrl = 'http://192.168.16.103:8090/';
                // this.baseUrl = 'http://192.168.33.82:8090/';
                this.$img = 'https://img.batar.cn/';
                break;
            case 'test':
                this.baseUrl = 'http://192.168.16.103:8091/';
                this.$img = 'https://demo.img.batar.cn/';
                break;
            case 'demo':
                this.baseUrl = 'https://demo.oms.f.batar.cn/';
                this.$img = 'https://demo.img.batar.cn/';
                break;
            case 'product':
                this.baseUrl = 'https://m.hhoa.ezgold.cn/';
                this.$img = 'https://image.szsjysy.com/';
                break;
        }

        this.interceptObj = (options) => {
            let obj = {
                200: `hanld200`,
                203: `hanld203`,
                205: `hanld205`,
                def: `hanldDef`
            }
            return $u.switchs(options, obj, `hanldDef`)
        }

        this.resposeData = {}
    }

    // 公用请求头方法
    setHeader(form) {
        let addHeader = {
            accessToken: wx.getStorageSync('accessToken') && crypto.Encrypt(`${new Date().getTime()},${wx.getStorageSync('accessToken')}`),
            clientType: 'HH_OA_WXAPP'
        }
        let obj = {
            'Content-type': `application/x-www-form-urlencoded`
        }
        if (form) {
            addHeader = Object.assign(addHeader, obj)
        }
        return addHeader
    }

    // 公用拦截
    intercept(res, resolve, reject) {
        // wx.hideLoading()
        wx.stopPullDownRefresh()
        const {
            code,
            data
        } = res.data
        this.resposeData = res.data
        this[this.interceptObj(code)](resolve, reject)
    }
    interceptNew(res, resolve, reject) {
      // wx.hideLoading()
      wx.stopPullDownRefresh()
      const {
        statusCode,
          data
      } = res
      this.resposeData = res
      this[this.interceptObj(statusCode)](resolve, reject)
  }

    // 公用拦截200
    hanld200(resolve) {
        resolve(this.resposeData)
    }

    // 公用拦截203
    hanld203(resolve, reject) {
        const {
            message
        } = this.resposeData
        reject(this.resposeData)
        $u.showToast(message)
        setTimeout(() => {
            wx.setStorageSync('accessToken', '')
            wx.reLaunch({
                url: '/pages/login/index'
            })
        }, 800)
    }

    // 公用拦截204
    hanld205(resolve, reject) {
        resolve(this.resposeData)
    }

    // 公用拦截其他状态码
    hanldDef(resolve, reject) {
        const {
            message
        } = this.resposeData
        reject(this.resposeData)
        $u.showToast(message)
    }

    get(url, params, needToken) {
      return new Promise((resolve, reject) => {
          wx.request({
              url: this.baseUrl + url,
              data: params,
              header: this.setHeader(),
              success(res) {
                  api.intercept(res, resolve, reject)
              }
          })
      })
  }

  getNew(url, params, needToken) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: this.baseUrl + url,
            data: params,
            header: this.setHeader(),
            success(res) {
                api.interceptNew(res, resolve, reject)
            }
        })
    })
}

    getLoop(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                data: params,
                header: this.setHeader(),
                success(res) {
                    // wx.hideLoading()
                    const {
                        code
                    } = res.data
                    code === 200 && resolve(res.data)
                }
            })
        })
    }

    post(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                method: 'POST',
                data: params,
                header: this.setHeader(true),
                success(res) {
                    api.intercept(res, resolve, reject)
                }
            })
        })
    }

    postJson(url, params, needToken) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                method: 'POST',
                data: params,
                header: this.setHeader(),
                success(res) {
                    api.intercept(res, resolve, reject)
                }
            })
        })
    }

  uploadImg(url, params) {
      let self = this
      sumList = []
        return new Promise((resolve, reject) => {
            wx.chooseImage({
                count: 9,
                success(res) {
                  var successUp = 0; //成功
                  var failUp = 0; //失败
                  var length = res.tempFilePaths.length; //总数
                  var count = 0; //第几张
                  self.uploadOneByOne(res.tempFilePaths, successUp, failUp, count, length, url)
                  var timeFun = setInterval(_ =>{
                    if (sumTime === length){
                      resolve({ data: sumList, code: 200 })
                      sumTime = 0
                      clearInterval(timeFun)
                    }
                  }, 1000)
                }
            })
        })
    }
    //递归方法
  uploadOneByOne(imgPaths, successUp, failUp, count, length, urlOne) {
    // console.log("aaa:", imgPaths, successUp, failUp, count, length, urlOne)
    var self = this;
    // return new Promise((resolve, reject) => {
      
      var returnTxtTwo = ''
      wx.showLoading({
        title: '正在上传第' + count + '张',
      })
      wx.uploadFile({
        url: self.baseUrl + urlOne,
        filePath: imgPaths[count],
        name: 'imageFile',
        formData: {},
        header: self.setHeader(),
        success: function (e) {
          let resData = JSON.parse(e.data)
          sumList.push(resData.data)
          successUp++;//成功+1
        },
        fail: function (e) {
          failUp++;//失败+1
        },
        complete: function (e) {
          sumTime++ 
          count++;//下一张
          if (count == length) {
            //上传完毕，作一下提示
            let returnObj = { successUp, failUp, sumList}
            wx.showToast({
              title: '上传成功' + successUp + '张！',
              icon: 'success',
              duration: 2000
            })
          } else {
            //递归调用，上传下一张
            self.uploadOneByOne(imgPaths, successUp, failUp, count, length, urlOne);
            // console.log('正在上传第' + count + '张');
          }
        }
      })
    // })
  }
    /**
     * Api列表 
     */

    // 用户登录
    accountLogin(params) {
        return api.post('applet/account/appletLogin', params)
    }

    // 用户退出
    logout() {
        return api.post('applet/account/logout', {})
    }

    // 查看用户信息
    getCurrUser() {
      // return api.get('account/getCurrUser')
      return api.getNew('sso/myInfo')
    }
    // 获取用户角色
    getUserRole(params) {
      return api.get('applet/account/myinfo', params)
    }
        // 授权验证
    verificationCode(params) {
        return api.post('applet/account/verificationCode', params)
    }


    // 修改当前用户信息
    accountUpdateInfo(params) {
        return api.post('account/updateInfo', params)
    }

    //查询计划
    findPlanByType(params) {
            return api.get('applet/plan/findPlanByType', params)
        }
        //查询当前账户 所在公司的全部人员
    findUserByConpanyId() {
        return api.get('applet/omsData/findUserByConpanyId')
    }

    //查询用户的客户信息
    findCurrUserClient(params) {
        return api.get('applet/omsData/findCurrUserClient', params)
    }
        //保存计划信息
    insertPlan(params) {
        return api.postJson('applet/plan/insertPlan', params)
    }
    //保存计划信息
    findRePort() {
      return api.get('applet/planReport/findRePort')
    }
    //查询报告详情
    findReportDetails(params) {
      return api.get('applet/planReport/findReportDetails', params)
    }
    //查询动态填写数据
    findReportData(params) {
      return api.get('applet/planReport/findReportData', params)
    }
    //查询动态填写数据
    reportDetails(params) {
      return api.get('applet/planReport/ReportDetails', params)
    }
    //结束报告
    updateReportStatus(params) {
      return api.post('applet/planReport/updateReportStatus', params)
    }
    
    


    // 上传图片
    uploadimage(params) {
      return api.uploadImg('file/uploadimage', params)
    }
    // 多个文件上传图片
    uploadImageFiles(params) {
      return api.uploadImg('file/uploadImageFiles', params)
    }


    //查询巡店计划详情
    findDetailsById(params) {
        return api.get('applet/plan/findDetailsById', params)
    }
    ///保存报告 或者提交报告
    insertReport(params) {
      return api.postJson('applet/planReport/insertReport', params)
    }

    //巡店审核列表
    findByAuth(params){
      return api.get('applet/planAuth/findByAuth', params)
    }

    //查询用户是有有审核功能
  currUserIsAuth(params){
    return api.get('applet/planAuth/currUserIsAuth', params)
  }

  //提交审核
  audit(params){
    return api.post('applet/planAuth/audit', params)
  }
  //巡店计划提交审核
  updateStatus(params) {
    return api.post('applet/plan/updateStatus', params)
  }
  //修改密码
  changePassword(params) {
    return api.post('applet/account/changePassword', params)
  }
  //查询报告计划列表更换
  findPlanDetailsById(params) {
    return api.get('applet/planReport/findPlanDetailsById', params)
  }
  //反馈回复列表接口
  findFeekBack(params) {
    return api.get('applet/planFeek/findFeekBack', params)
  }
  //查询门店反馈详情信息
  findStoreFeekBackDetails(params) {
    return api.get('applet/planFeek/findStoreFeekBackDetails', params)
  }
  //回复门店反馈
  reply(params) {
    return api.post('applet/planFeek/reply', params)
  }
  //回复计划详情接口
  replyFindDetailsById(params) {
    return api.get('applet/planFeek/findDetailsById', params)
  }
  //计划审核进入详情接口
  planAuthFindDetailsById(params) {
    return api.get('applet/planAuth/findDetailsById', params)
  }
}


let api = new Api()

export default api