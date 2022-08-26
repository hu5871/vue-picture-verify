import VuePictureVerify from './vue-picture-verify.vue'
const plugins = {
  install(Vue) {
      Vue.component('VuePictureVerify', VuePictureVerify)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VuePictureVerify) 
}

export default plugins
