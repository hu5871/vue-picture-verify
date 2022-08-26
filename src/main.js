import Vue from 'vue'
import App from './App.vue'
import VuePictureVerify from './lib/install.js';

Vue.use(VuePictureVerify)

new Vue({
  el: '#app',
  render: h => h(App)
})