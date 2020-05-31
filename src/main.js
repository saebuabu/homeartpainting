import Vue from 'vue'
import axios from './plugins/axios'
import App from './App.vue'
import VueKonva from 'vue-konva'
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies';
import vueCountryRegionSelect from 'vue-country-region-select';
import CountryFlag from 'vue-country-flag'
 
Vue.component('country-flag', CountryFlag)

Vue.use(vueCountryRegionSelect)
Vue.use(VueCookies)
Vue.use(axios)
Vue.use(VueKonva)
Vue.config.productionTip = false

var host = location.hostname;
if (host == "localhost") {
   Vue.prototype.$mongoresturl = "http://localhost:8088/mongorestphp/";
}
else {
  Vue.prototype.$mongoresturl = "//saebu.nl/mongorest/";
}

//voor de communicatie tussen 2 componenten Painters => Drawart
export const bus = new Vue();

new Vue({
  vuetify,
  axios,
  VueCookies,
  vueCountryRegionSelect,
  render: h => h(App)
}).$mount('#app')
