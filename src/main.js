import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vueMeta from './plugins/vue-meta'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  vueMeta,
  render: (h) => h(App)
}).$mount('#app')
