import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Board from './views/Board.vue';
import Thread from './views/Thread.vue';
import ReportForm from './components/Forms/ReportForm.vue';

Vue.use(Router);

// @ts-ignore
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
			meta: {
				title: 'Home'
			}
		},
		{
			path: '/:board/report',
			name: 'report',
			component: ReportForm,
			meta: {
				title: 'Report post'
			}
		},
		{
			path: '/:board/list',
			name: 'board-list',
			component: Board,
			props: { list: true }
		},
		{
			path: '/:board/archive',
			name: 'board-archive',
			component: Board,
			props: { archive: true }
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
				}			
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
			meta: {
				title: 'Not found'
			}
		},
	],
});
