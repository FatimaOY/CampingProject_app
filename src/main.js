import Vue from 'vue';
import App from './App.vue';
import VCalendar from 'v-calendar';
import router from './router'


Vue.config.productionTip = false;

// Use VCalendar with default config
Vue.use(VCalendar);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
