import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import './plugins/axios';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from '@/store/index';
import './registerServiceWorker';
import dateFilter from '@/filters/date.filter';
import { boilerplate } from '@/mixins/boilerplate';

Vue.config.productionTip = true;

Vue.filter('date', dateFilter);

Vue.mixin(boilerplate);

Vue.component('Logo',
	() => import('./components/Details/Logo.vue')
);
Vue.component('BoardHeader',
	() => import('./components/Details/BoardHeader.vue')
);
Vue.component('Loading',
	() => import('./components/Details/Loading.vue')
);

new Vue({
	vuetify,
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
