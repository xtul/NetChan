import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Board from './views/Board.vue';
import Thread from './views/Thread.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) {
			return {
				selector: to.hash
			};
		}
		return { x: 0, y: 0 };
	},
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/:board',
			name: 'board',
			component: Board,
			children: [
				{
					path: ':page',
					name: 'board-page',
					component: Board
				},
				{
					path: '/archive',
					name: 'board-archive',
					component: Board,
					props: { archive: true }
				},
				{
					path: '/catalog',
					name: 'board-catalog',
					component: Board,
					props: { catalog: true }
				},
			]
		},
		{
			path: '/:board/thread/:threadId',
			name: 'thread',
			component: Thread,
		},
		{
			path: '/*',
			name: 'notfound',
			component: Board,
		},
	],
});
