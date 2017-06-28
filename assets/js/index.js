// DO NOT EDIT THIS FILE DIRECTLY.
import runtime from 'serviceworker-webpack-plugin/lib/runtime'

if('serviceWorker' in navigator){
  const registration = runtime.register()
}

const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
const type = connection.type

console.log(type)

//BEGIN index
if(window.preemo_router.indexOf('index') > -1) require('../../layouts/index/index.js')()
//END index

//BEGIN content
if(window.preemo_router.indexOf('content') > -1) require('../../partials/content/content.js')()
//END content

//BEGIN header
if(window.preemo_router.indexOf('header') > -1) require('../../partials/header/header.js')()
//END header

//BEGIN footer
if(window.preemo_router.indexOf('footer') > -1) require('../../partials/footer/footer.js')()
//END footer

//BEGIN home
if(window.preemo_router.indexOf('home') > -1) require('../../layouts/home/home.js')()
//END home

//BEGIN single
if(window.preemo_router.indexOf('single') > -1) require('../../layouts/single/single.js')()
//END single

//BEGIN content-home
if(window.preemo_router.indexOf('content-home') > -1) require('../../partials/content-home/content-home.js')()
//END content-home

//BEGIN front_page
if(window.preemo_router.indexOf('front_page') > -1) require('../../layouts/front_page/front_page.js')()
//END front_page
