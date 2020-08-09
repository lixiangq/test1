
//axios.js
import Axios from 'axios';

 const axios=Axios.create({
    //api的根地址
    baseURL: "http://api.zhinengshe.com/10001-you163/",
    headers: {
      //为所有请求添加默认头
      apikey: "9de0bdf56c8943e494984b2714fc6a4b"
    }
})

export default axios;

//图片 放main.js
//Vue
Vue.filter('imgpath', val => {
  return 'http://api.zhinengshe.com/10001-you163/' + val + '?apikey=9de0bdf56c8943e494984b2714fc6a4b'
})

//通用 放common.js
export function imgPath(src){
  return 'http://api.zhinengshe.com/10001-you163/' +
   src + 
   '?apikey=9de0bdf56c8943e494984b2714fc6a4b'
}



// 1 生成一周时间
// new Array 创建的数组只是添加了length属性，并没有实际的内容。通过扩展后，变为可用数组用于循环

function getWeekTime(){
  return [...new Array(7)].map((j,i)=> new Date(Date.now()+i*8.64e7).toLocaleDateString())
}
// 使用
// getWeekTime()
// ["2020/2/26", "2020/2/27", "2020/2/28", "2020/2/29", "2020/3/1", "2020/3/2", "2020/3/3"]


// 2 类型判断
// 判断核心使用Object.prototype.toString，这种方式可以准确的判断数据类型。
//   @param {any} target 
//   @param {string} type 
//   @return {boolean} 

function isType(target, type) {
  let targetType = Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
  return targetType === type.toLowerCase()
}
// 使用
// isType([], 'Array') // true
// isType(/\d/, 'RegExp') // true
// isType(new Date(), 'Date') // true
// isType(function(){}, 'Function') // true
// isType(Symbol(1), 'Symbol') // true


// 3 对象属性剔除
// 应用场景很简单，当你需要使用一个对象，但想移除部分属性时，可以使用该方法。同样的，你可以实现一个对象属性选取方法。


//   @param {object} object
//   @param {string[]} props
//   @return {object}
 
function omit(object, props=[]){
  let res = {}
  Object.keys(object).forEach(key=>{
    if(props.includes(key) === false){
      res[key] = typeof object[key] === 'object' && object[key] !== null ?
        JSON.parse(JSON.stringify(object[key])):
        object[key]
    }
  })
  return res
}
// 使用
// let data = {
//   id: 1,
//   title: 'xxx',
//   comment: []
// }
// omit(data, ['id']) // {title: 'xxx', comment: []}


//4 日期格式化
// 一个很灵活的日期格式化函数，可以根据使用者给定的格式进行格式化，能应对大部分场景
//   @param {string} format
//   @param {number} timestamp - 时间戳
//   @return {string} 
 
function formatDate(format='Y-M-D h:m', timestamp=Date.now()){
  let date = new Date(timestamp)
  let dateInfo = {
    Y: date.getFullYear(),
    M: date.getMonth()+1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
  let formatNumber = (n) => n > 10 ? n : '0' + n
  let res = format
    .replace('Y', dateInfo.Y)
    .replace('M', dateInfo.M)
    .replace('D', dateInfo.D)
    .replace('h', formatNumber(dateInfo.h))
    .replace('m', formatNumber(dateInfo.m))
    .replace('s', formatNumber(dateInfo.s))
  return res
}

// 使用
// formatDate() // "2020-2-24 13:44"
// formatDate('M月D日 h:m') // "2月24日 13:45"
// formatDate('h:m Y-M-D', 1582526221604) // "14:37 2020-2-24"


// 5 性能分析
// Web Performance API允许网页访问某些函数来测量网页和Web应用程序的性能
// performance.timing 包含延迟相关的性能信息
// performance.memory 包含内存信息，是Chrome中添加的一个非标准扩展，在使用时需要注意
//直接显示不用调用
window.onload = function(){
  setTimeout(()=>{
    let t = performance.timing,
        m = performance.memory
    console.table({
      'DNS查询耗时': (t.domainLookupEnd - t.domainLookupStart).toFixed(0),
      'TCP链接耗时': (t.connectEnd - t.connectStart).toFixed(0),
      'request请求耗时': (t.responseEnd - t.responseStart).toFixed(0),
      '解析dom树耗时': (t.domComplete - t.domInteractive).toFixed(0),
      '白屏时间': (t.responseStart - t.navigationStart).toFixed(0),
      'domready时间': (t.domContentLoadedEventEnd - t.navigationStart).toFixed(0),
      'onload时间': (t.loadEventEnd - t.navigationStart).toFixed(0),
      'js内存使用占比': m ? (m.usedJSHeapSize / m.totalJSHeapSize * 100).toFixed(2) + '%' : undefined
    })
  })
}

// 6 防抖
// 性能优化方案，防抖用于减少函数请求次数，对于频繁的请求，只执行这些请求的最后一次。

// 基础版本
// function debounce(func, wait = 300){
//   let timer = null;
//   return function(){
//     if(timer !== null){
//       clearTimeout(timer);
//     }
//     timer = setTimeout(func.bind(this),wait);
//   }
// }
// 改进版本添加是否立即执行的参数，因为有些场景下，我们希望函数能立即执行。


//   @param {function} func - 执行函数
//   @param {number} wait - 等待时间
//   @param {boolean} immediate - 是否立即执行
//   @return {function}
 
function debounce(func, wait = 300, immediate = false){
  let timer, ctx;
  let later = (arg) => setTimeout(()=>{
    func.apply(ctx, arg)
    timer = ctx = null
  }, wait)
  return function(...arg){
    if(!timer){
      timer = later(arg)
      ctx = this
      if(immediate){
        func.apply(ctx, arg)
      }
    }else{
      clearTimeout(timer)
      timer = later(arg)
    }
  }
}
// 使用
// let scrollHandler = debounce(function(e){
//   console.log(e)
// }, 500)
// window.onscroll = scrollHandler



// 7 节流
// 性能优化方案，节流用于减少函数请求次数，与防抖不同，节流是在一段时间执行一次。


//   @param {function} func - 执行函数
//   @param {number} delay - 延迟时间
//   @return {function}

function throttle(func, delay){
  let timer = null
  return function(...arg){
    if(!timer){
      timer = setTimeout(()=>{
        func.apply(this, arg)
        timer = null
      }, delay)
    }
  }
}
// 使用
// let scrollHandler = throttle(function(e){
//   console.log(e)
// }, 500)
// window.onscroll = scrollHandler

// 8 base64数据导出文件下载

//   @param {string} filename - 下载时的文件名
//   @param {string} data - base64字符串
 
function downloadFile(filename, data){  
  let downloadLink = document.createElement('a');  
  if ( downloadLink ){  
    document.body.appendChild(downloadLink);  
    downloadLink.style = 'display: none';  
    downloadLink.download = filename;  
    downloadLink.href = data;  
    if ( document.createEvent ){  
      let downloadEvt = document.createEvent('MouseEvents');  
      downloadEvt.initEvent('click', true, false);  
      downloadLink.dispatchEvent(downloadEvt);  
    } else if ( document.createEventObject ) {
      downloadLink.fireEvent('onclick');  
    } else if (typeof downloadLink.onclick == 'function' ) {
      downloadLink.onclick();
    }
    document.body.removeChild(downloadLink);  
  }  
}

// 9  检测是否为PC端浏览器
function isPCBroswer() {  
  let e = window.navigator.userAgent.toLowerCase()  
    , t = "ipad" == e.match(/ipad/i)  
    , i = "iphone" == e.match(/iphone/i)  
    , r = "midp" == e.match(/midp/i)  
    , n = "rv:1.2.3.4" == e.match(/rv:1.2.3.4/i)  
    , a = "ucweb" == e.match(/ucweb/i)  
    , o = "android" == e.match(/android/i)  
    , s = "windows ce" == e.match(/windows ce/i)  
    , l = "windows mobile" == e.match(/windows mobile/i);
  return !(t || i || r || n || a || o || s || l)  
}
// 识别浏览器及平台
function getPlatformInfo(){
  //运行环境是浏览器 
  let inBrowser = typeof window !== 'undefined';  
  //运行环境是微信 
  let inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;  
  let weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();  
  //浏览器 UA 判断 
  let UA = inBrowser && window.navigator.userAgent.toLowerCase();
  if(UA){
    let platforms = {
      IE: /msie|trident/.test(UA),
      IE9: UA.indexOf('msie 9.0') > 0,
      Edge: UA.indexOf('edge/') > 0,
      Android: UA.indexOf('android') > 0 || (weexPlatform === 'android'),
      IOS: /iphone|ipad|ipod|ios/.test(UA) || (weexPlatform === 'ios'),
      Chrome: /chrome\/\d+/.test(UA) && !(UA.indexOf('edge/') > 0),
    }
    for (const key in platforms) {
      if (platforms.hasOwnProperty(key)) {
        if(platforms[key]) return key
      }
    }
  }
}