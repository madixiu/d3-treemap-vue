import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

// import vue-panzoom
import panZoom from 'vue-panzoom'

// install plugin
Vue.use(panZoom);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
