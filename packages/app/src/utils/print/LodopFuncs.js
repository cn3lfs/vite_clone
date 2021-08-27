//==本JS是加载Lodop插件及CLodop服务的综合示例，可直接使用，建议看懂后融进自己页面程序==
import {
  ElMessage as Message
} from 'element-plus'
let CreatedOKLodopObject, CLodopIsLocal, CLodopJsState
const CLODOP = window.LODOP
//==判断是否需要CLodop(那些不支持插件的浏览器):==
function getCLodop() {
  return window.CLODOP2015_7028
}

export function needCLodop() {
  try {
    const ua = navigator.userAgent
    if (ua.match(/Windows\sPhone/i)) return true
    if (ua.match(/iPhone|iPod|iPad/i)) return true
    if (ua.match(/Android/i)) return true
    if (ua.match(/Edge\D?\d+/i)) return true

    const verTrident = ua.match(/Trident\D?\d+/i)
    const verIE = ua.match(/MSIE\D?\d+/i)
    let verOPR = ua.match(/OPR\D?\d+/i)
    let verFF = ua.match(/Firefox\D?\d+/i)
    const x64 = ua.match(/x64/i)
    if (!verTrident && !verIE && x64) return true
    else if (verFF) {
      verFF = verFF[0].match(/\d+/)
      if (verFF[0] >= 41 || x64) return true
    } else if (verOPR) {
      verOPR = verOPR[0].match(/\d+/)
      if (verOPR[0] >= 32) return true
    } else if (!verTrident && !verIE) {
      let verChrome = ua.match(/Chrome\D?\d+/i)
      if (verChrome) {
        verChrome = verChrome[0].match(/\d+/)
        if (verChrome[0] >= 41) return true
      }
    }
    return false
  } catch (err) {
    return true
  }
}

//==加载引用CLodop的主JS,用双端口8000和18000(以防其中一个被占):==
// export function loadCLodop() {
//   if (CLodopJsState == 'loading' || CLodopJsState == 'complete') return
//   CLodopJsState = 'loading'
//   const head =
//     document.head ||
//     document.getElementsByTagName('head')[0] ||
//     document.documentElement
//   const JS1 = document.createElement('script')
//   const JS2 = document.createElement('script')
//   JS1.src = 'http://localhost:8000/CLodopfuncs.js?priority=1'
//   JS2.src = 'http://localhost:18000/CLodopfuncs.js'
//   JS1.onload = JS2.onload = function() {
//     CLodopJsState = 'complete'
//   }
//   JS1.onerror = JS2.onerror = function(evt) {
//     CLodopJsState = 'complete'
//   }
//   head.insertBefore(JS1, head.firstChild)
//   head.insertBefore(JS2, head.firstChild)
//   CLodopIsLocal = !!(JS1.src + JS2.src).match(/\/\/localho|\/\/127.0.0./i)
// }

// if (needCLodop()) {
//   loadCLodop()
// } //加载
needCLodop()
//==获取LODOP对象主过程,判断是否安装、需否升级:==
export function getLodop(oOBJECT, oEMBED) {
  let LODOP
  try {
    const ua = navigator.userAgent
    const isIE = !!ua.match(/MSIE/i) || !!ua.match(/Trident/i)
    if (needCLodop()) {
      try {
        LODOP = getCLodop()
      } catch (err) {
        console.log('')
      }
      if (!LODOP && CLodopJsState !== 'complete') {
        if (CLodopJsState == 'loading')
          alert('网页还没下载完毕，请稍等一下再操作.')
        else alert('没有加载CLodop的主js，请先调用loadCLodop过程.')
        return
      }
      if (!LODOP) {
        Message({
          type: 'error',
          message: 'CLodop打印控件未安装',
          duration: 2000
        })
        return
      } else {
        if (CLODOP.CVERSION < '3.0.9.3') {
          Message({
            type: 'warning',
            message: 'CLodop打印控件需升级',
            duration: 2000
          })
        }
        if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED)
        if (oOBJECT && oOBJECT.parentNode)
          oOBJECT.parentNode.removeChild(oOBJECT)
      }
    } else {
      const is64IE = isIE && !!ua.match(/x64/i)
      //==如果页面有Lodop就直接使用,否则新建:==
      if (oOBJECT || oEMBED) {
        if (isIE) LODOP = oOBJECT
        else LODOP = oEMBED
      } else if (!CreatedOKLodopObject) {
        LODOP = document.createElement('object')
        LODOP.setAttribute('width', 0)
        LODOP.setAttribute('height', 0)
        LODOP.setAttribute(
          'style',
          'position:absolute;left:0px;top:-100px;width:0px;height:0px;'
        )
        if (isIE)
          LODOP.setAttribute(
            'classid',
            'clsid:2105C259-1E0C-4534-8141-A753534CB4CA'
          )
        else LODOP.setAttribute('type', 'application/x-print-lodop')
        document.documentElement.appendChild(LODOP)
        CreatedOKLodopObject = LODOP
      } else LODOP = CreatedOKLodopObject
      //==Lodop插件未安装时提示下载地址:==
      if (!LODOP || !LODOP.VERSION) {
        if (ua.indexOf('Chrome') >= 0)
          Message({
            type: 'error',
            message: 'CLodop打印控件未安装',
            duration: 2000
          })
        if (ua.indexOf('Firefox') >= 0)
          Message({
            type: 'error',
            message: 'CLodop打印控件未安装',
            duration: 2000
          })
        return LODOP
      }
    }
    if (LODOP.VERSION < '6.2.2.6') {
      if (!needCLodop())
        Message({
          type: 'warning',
          message: 'CLodop打印控件需升级',
          duration: 2000
        })
    }
    //===如下空白位置适合调用统一功能(如注册语句、语言选择等):==

    //=======================================================
    return LODOP
  } catch (err) {
    alert('getLodop出错:' + err)
  }
}
