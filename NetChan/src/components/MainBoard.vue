<template>
	<v-container fluid no-gutters>
		<BoardHeader />
		<v-layout column align-center>
			<a href="/">
				<img src="../assets/logo.png" class="logo" />
			</a>
		</v-layout>
		<v-container no-gutters fluid v-if="boardName !== 'none'">
			<v-row>
				<v-col cols="12" v-if="mode === 'catalog' || mode === 'archive'">
					<div class="nav">
						[<a :href="'/' + boardData.pageData.board">Return</a>]
					</div>
					<hr />
				</v-col>
				<v-col cols="12" v-if="mode === 'catalog'">
					<BoardCatalogView :boardData="boardData" />
				</v-col>
				<v-col cols="12" v-else>
					<BoardDefaultView :boardData="boardData" />
				</v-col>
			</v-row>
		</v-container>
		<v-container v-else column align-center>
			<v-row>
				<v-col cols="12">
					<v-card class="rounded-0">
						<v-card-title>404.</v-card-title>
						<v-card-text>
							<p>Board doesn't exist.</p>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<template v-if="mode !== 'catalog' && mode !== 'archive'">
			<BoardPages :pageCount="boardData.pageData.pageCount" :currentPage="boardData.pageData.currentPage" :currentBoard="params.board" />
		</template>
		<BoardHeader />
	</v-container>
</template>

<script>
	import BoardHeader from '@/components/BoardHeader.vue';
	import BoardPages from '@/components/BoardPages.vue';
	import BoardDefaultView from '@/components/BoardDefaultView.vue';
	import BoardCatalogView from '@/components/BoardCatalogView.vue';
	import router from '../router';
	import axios from 'axios';
	import moment from 'moment';

	export default {
		name: 'MainBoard',
		data() {
			return {
				boardName: 'none',
				boardData: {},
				postingDrawerVisible: false
			};
		},
		components: {
			BoardHeader,
			BoardPages,
			BoardDefaultView,
			BoardCatalogView
		},
		props: ['params', 'catalog', 'archive'],
		computed: {
			shortBoard: () => {
				return '/' + router.currentRoute.fullPath.split('/')[1] + '/';
			},
			mode: () => {
				return router.currentRoute.fullPath.split('/')[2];
			}
		},
		methods: {
			initialWidth: () => {
				return window.innerWidth - 600 - 100;
			}
		},
		beforeMount() {
			// make sure this board even exists
			axios
				.get('http://localhost:5934/api' + this.shortBoard)
				.then((response) => {
					this.boardName = response.data;
				});
		},
		created() {
			let page = this.params.page;
			if (page === null || page === undefined) {
				page = 1;
			}
			axios
				.get('http://localhost:5934/api' + this.shortBoard + page)
				.then((response) => {
					if (response.status === 404) {
						this.boardData = {};
					} else {
						this.boardData = response.data;
					}
				});
		},
	};
</script>
