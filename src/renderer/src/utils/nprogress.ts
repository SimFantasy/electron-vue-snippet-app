import NProgress from 'nprogress'

// 全局LoadingBar配置
NProgress.configure({
  easing: 'linear',
  speed: 300,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
  parent: 'body'
})
// 开始全局LoadingBar
export function loadingStart() {
  NProgress.start()
}

// 结束全局LoadingBar
export function loadingDone() {
  NProgress.done()
}
