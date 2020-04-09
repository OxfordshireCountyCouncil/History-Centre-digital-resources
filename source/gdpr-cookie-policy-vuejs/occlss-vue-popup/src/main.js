import Vue from 'vue'
import App from './App.vue'
import VueCookie from 'vue-cookie'

Vue.use(VueCookie);

/*new Vue({
  el: '#occ-GDRP-popup',
  render: h => h(App)
})
*/

const mountEl = document.querySelector('#occ-GDPR-popup');

new Vue({
  render: createElement => {
    const context = {
      props: { ...mountEl.dataset },
    };
    return createElement(App, context);
  }
}).$mount('#occ-GDPR-popup');
