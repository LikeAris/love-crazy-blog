// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// 引入element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'mavon-editor/dist/css/index.css'
import App from './App';
// 引入路由
import router from './router';
// 引入状态管理
import store from './vuex/store';
// 引入icon
import './assets/icon/iconfont.css'
// 引入Markdown编辑器
import mavonEditor from 'mavon-editor'

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import axios from 'axios';
Vue.prototype.$axios = axios;
//引入评论和私信
import VueAxios from 'vue-axios'
//avue
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import Chat from 'jwchat';

Vue.config.productionTip = false;

// 使用element UI
Vue.use(ElementUI);
//使用Markdown编辑器
Vue.use(mavonEditor);
//评论和私信
Vue.use(VueAxios, axios)
Vue.use(Avue);
Vue.use(Chat);
// 过滤器
// import * as custom from './utils/util'

// Object.keys(custom).forEach(key => {
//     Vue.filter(key, custom[key])
// })

// 路由拦截器
// router.beforeEach((to, from, next) => {
//     if (to.matched.length != 0) {
//         if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
//             if (Boolean(localStorage.getItem("userInfo"))) { // 通过vuex state获取当前的user是否存在
//                 next();
//             } else {
//                 next({
//                     path: '/login',
//                     query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
//                 })
//             }
//         } else {
//             if (Boolean(localStorage.getItem("userInfo"))) { // 判断是否登录
//                 if (to.path != "/" && to.path != "/login") { //判断是否要跳到登录界面
//                     next();
//                 } else {
//                     /**
//                      * 防刷新，如果登录，修改路由跳转到登录页面，修改路由为登录后的首页 
//                      */
//                     next({
//                         path: '/goods/Goods'
//                     })
//                 }
//             } else {
//                 next();
//             }
//         }
//     } else {
//         next({
//             path: '/login',
//             query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
//         })
//     }
// })

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store, //使用store vuex状态管理
	axios,//axios字典
    components: { App },
    template: '<App/>',
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    }

})