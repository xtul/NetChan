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
		<v-container no-gutters fluid v-if="boardName !== 'none' || threadId !== 0">
			<v-row>
				<v-col cols="12">
					<h1>/{{ shortBoard }}/ - {{ boardName }}</h1>
					<div class="create-post">
						[<a v-if="postingDrawerVisible === false" v-on:click="postingDrawerVisible = true">Respond to this thread</a>
						 <a v-else v-on:click="postingDrawerVisible = false">Close posting window</a>]
					</div>
					<hr />
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<div class="nav">
						[<router-link :to="{ name: 'board', params: { board: shortBoard }}">Return</router-link>]
					</div>
					<hr />
				</v-col>
				<v-col cols="12">
					<ThreadView :threadData="threadData" :board="shortBoard"/>
				</v-col>
			</v-row>
		</v-container>
		<v-container v-else column align-center>
			<v-row>
				<v-col cols="12">
					<v-card class="rounded-0">
						<v-card-title>404.</v-card-title>
						<v-card-text>
							<p>Thread doesn't exist.</p>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<BoardHeader />
	</v-container>
</template>

<script>
	import BoardHeader from '@/components/BoardHeader.vue';
	import BoardPages from '@/components/BoardPages.vue';
	import ThreadView from '@/components/ThreadView.vue';
	import PostForm from '@/components/Forms/PostForm.vue';
	import VueDraggableResizable from 'vue-draggable-resizable';
	import router from '../router';
	import axios from 'axios';

	export default {
		name: 'MainThread',
		data() {
			return {
				boardName: 'none',
				threadData: {},
				postingDrawerVisible: false
			};
		},
		components: {
			BoardHeader,
			BoardPages,
			ThreadView,
			PostForm,
			VueDraggableResizable
		},
		props: ['params'],
		computed: {
			shortBoard: () => {
				return router.currentRoute.fullPath.split('/')[1];
			}
		},
		methods: {
			initialWidth: () => {
				return window.innerWidth - 600 - 100;
			}
		},
		beforeMount() {
			// make sure this board/thread even exists
			axios
				.get('http://localhost:5934/api/' + this.shortBoard)
				.then((response) => {
					this.boardName = response.data;
				})
				.catch();
			axios
				.get('http://localhost:5934/api' + '/' + this.shortBoard + '/thread/' + this.params.threadId)
				.then((response) => {
					this.threadData = response.data;
				})
				.catch();
		}
	};
</script>

<style scoped>
	.nav {
		padding-left: 1rem;
	}

	.create-post {
		position: fixed;
		padding: 0.5rem;
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