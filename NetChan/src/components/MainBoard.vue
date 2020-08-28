<template>
	<v-container fluid no-gutters>
		<div v-if="postingDrawerVisible === true" class="draggable-parent">
			<vue-draggable-resizable :w="600" h="auto" class="draggable" :x="initialWidth()" :y="200" :z="99999" :parent="true">
				<PostForm />
			</vue-draggable-resizable>
		</div>
		<BoardHeader />
		<v-layout column align-center>
			<a href="/">
				<img src="../assets/logo.png" class="logo" />
			</a>
		</v-layout>
		<v-container no-gutters fluid v-if="boardName !== 'none'">
			<v-row>
				<v-col cols="12">
					<h1>{{ shortBoard }} - {{ boardName }}</h1>
					<div class="create-post">
						[<a v-if="postingDrawerVisible === false" v-on:click="postingDrawerVisible = true">Start a new thread</a>
						 <a v-else v-on:click="postingDrawerVisible = false">Close posting window</a>]
					</div>
					<hr />
				</v-col>
			</v-row>
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
	import PostForm from '@/components/Forms/PostForm.vue';
	import VueDraggableResizable from 'vue-draggable-resizable';
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
			BoardCatalogView,
			PostForm,
			VueDraggableResizable
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
			prettyDate: (date) => {
				const providedDate = moment.utc(date);
				const formattedDate = moment(providedDate).local();
				return formattedDate.format('D/M/YYYY (ddd) HH:mm:ss') + ' (' + moment(formattedDate).fromNow() + ')';
			},
			cleanup: (str) => {
				return str.replace(/(\r\n|\r|\n){2,}/g, '$1\n').split('\n');
			},
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

<style scoped>
	.nav {
		padding-left:1rem;
	}

	.create-post {
		position: fixed;
		padding:0.5rem;
		background-color: #eefaff;
		border-bottom: 1px solid #b0d9e8;
		border-right: 1px solid #bce6f5;
		top: 30px;
		right: 15px;
	}

	.draggable-parent { /* dragging box, basically */
		height: 100vh;
		width: 100vw;
		position: fixed;
		pointer-events: none;
	}

	.draggable { /* actual component */
		pointer-events: all;
		background-color: #fff;
		z-index: 999;
		padding: 0.4rem;
		top: 30px;
		right: 15px;
		background-color: #eefaff;
		border-bottom: 1px solid #b0d9e8;
		border-right: 1px solid #bce6f5;
	}
</style>