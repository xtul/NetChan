import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify, {
	VAlert,
	VApp,
	VNavigationDrawer,
	VFooter,
	VList,
	VBtn,
	VIcon,
	VToolbar,
	VDataTable,
	VProgressLinear,
} from 'vuetify/lib';

// vue-cli a-la-carte installation
Vue.use(Vuetify, {
	components: {
		VAlert,
		VApp,
		VNavigationDrawer,
		VFooter,
		VList,
		VBtn,
		VIcon,
		VToolbar,
		VDataTable,
		VProgressLinear,
	},
});

const opts = {
	theme: {
		themes: {
			light: {
				primary: '#00ADEF',
				secondary: '#99DEF9',
				accent: '#005F83',
				error: '#F1511B',
				info: '#FBBC09',
				success: '#80CC28',
			},
			// dark: {
			// }
		},
	},
};

export default new Vuetify(opts);
