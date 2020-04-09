import Vue from 'vue'
import App from './App.vue'
import VueCookie from 'vue-cookie'

Vue.use(VueCookie);

/*new Vue({
  el: '#occ-GDPR-form',
  render: h => h(App)
})*/


const mountEl = document.querySelector('#occ-GDPR-form');

new Vue({
  render: createElement => {
    const context = {
      props: { ...mountEl.dataset },
    };
    return createElement(App, context);
  }
}).$mount('#occ-GDPR-form');