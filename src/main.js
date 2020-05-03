import Vue from 'vue'
import axios from './plugins/axios'
import App from './App.vue'
import VueKonva from 'vue-konva'
import vuetify from './plugins/vuetify';

Vue.use(axios)
Vue.use(VueKonva)
Vue.config.productionTip = false

var host = location.hostname;
if (host == "localhost") {
   Vue.prototype.$mongoresturl = "http://localhost:8088/mongorestphp/";
}
else {
  Vue.prototype.$mongoresturl = "https://saebu.nl/mongorest/";
}

new Vue({
  vuetify,
  axios,
  render: h => h(App)
}).$mount('#app')
