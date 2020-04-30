import Vue from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import vuetify from './plugins/vuetify';

Vue.use(VueKonva)
Vue.config.productionTip = false


new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
