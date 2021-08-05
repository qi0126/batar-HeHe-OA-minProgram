//年-月-日 时：分：秒
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//年-月-日
const formatDayTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

//获取当前的年-月-日
const getCurrentTime = function() {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return `${Y}-${M}-${D}`
}


//todate默认参数是当前日期，可以传入对应时间 todate格式为2018-10-05
const getDates = (days, todate) => {
    var dateArry = [];
    for (var i = 0; i < days; i++) {
        var dateObj = dateLater(todate, i);
        dateArry.push(dateObj)
    }
    return dateArry;
}

//获取当天星期几
const getDatesNow = (todate) => {
    var dataNow = dateLater(todate, 0)
    return dataNow;
}

const dateLater = (dates, later) => {
    let dateObj = {};
    let show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay();
    let yearDate = date.getFullYear();
    let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.time = yearDate + '-' + month + '-' + dayFormate;
    dateObj.week = show_day[day];
    return dateObj;
}

// 模拟switch
const switchs = (options, obj, def) => {
    let flag = true
    flag = Object.keys(obj).some(item => item === options + '')
    if (!flag) {
        return def
    }
    return obj[options]
}


const showToast = (cont) => {
    return new Promise((reslove, reject) => {
        wx.showToast({
            title: cont,
            icon: 'none',
            mask: true,
            success(res) {
                reslove(res)
            }
        })
    })
}

const showLoading = () => {
    return new Promise((reslove, reject) => {
        // wx.showLoading({
        //   title: '',
        //   mask: true,
        //   success(res) {
        //     reslove(res)
        //   },
        // })
        reslove()
    })
}



module.exports = {
    formatTime: formatTime,
    formatDayTime: formatDayTime,
    getDates: getDates,
    getDatesNow: getDatesNow,
    switchs: switchs,
    showToast: showToast,
    showLoading: showLoading,
    getCurrentTime: getCurrentTime
}