import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IRootState } from './types';

Vue.use(Vuex);

// Vuex structure based on https://codeburst.io/vuex-and-typescript-3427ba78cfa8

const store: StoreOptions<IRootState> = {
	state: {
		version: '1.0.0', // a simple property
	},
	modules: {},
};

export default new Vuex.Store<IRootState>(store);
