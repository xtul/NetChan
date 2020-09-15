<template>
	<v-container fluid no-gutters>
		<BoardHeader />
		<v-layout column align-center>
			<a href="/">
				<img src="../assets/logo.png" class="logo" />
			</a>
		</v-layout>
		<v-container no-gutters fluid v-if="boardName !== 'none' || params.threadId !== 0">
			<v-row>
				<v-col cols="12">
					<h1>/{{ params.board }}/ - {{ boardName }}</h1>
					<hr />
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<div class="nav">
						[<router-link :to="{ name: 'board', params: { board: params.board }}">Return</router-link>]
					</div>
					<hr />
				</v-col>
				<v-col cols="12" class="thread">
					<!-- <ThreadView :threadData="threadData" :board="shortBoard"/> -->
					<PostForm ref="postForm" />
					<div v-for="(post, index) in threadData.posts" :key="post.id">
						<div v-if="index === 0" class="op" :id="'post-' + post.id">
							<Post :ref="'post-' + post.id" :post="post" mode="op" :board="params.board" :isThreadPreview="true" />
						</div>
						<div v-else class="response" :class="'thread-' + threadData.posts[0].id" :id="'post-' + post.id">
							<Post :ref="'post-' + post.id" :post="post" mode="response" :board="params.board" :isThreadPreview="true" />
						</div>
					</div>
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
	import BoardHeader from '@/components/Details/BoardHeader.vue';
	import BoardPages from '@/components/Details/BoardPages.vue';
	import PostForm from '@/components/Forms/PostForm.vue';
	import Post from '@/components/Posts/Post.vue';
	import { postFinder } from '@/mixins/postFinder.ts';
	import router from '../router';
	import axios from 'axios';

	export default {
		name: 'MainThread',
		data() {
			return {
				threadData: {}
			};
		},
		mixins: [postFinder],
		components: {
			BoardHeader,
			BoardPages,
			PostForm,
			Post
		},
		props: ['params', 'catalog', 'archive', 'boardName', 'boardExists', 'boardData'],
		async updated() {
			const replyLinks = document.getElementsByClassName('reply');

			// remove links from nonexistent replies
			if (replyLinks.length > 0) {
				for (const x of replyLinks) {
					const id = x.innerHTML.replaceAll('>', '').replaceAll('&gt;', '').replaceAll(' (OP)', '');
					if (this.isOp(id) === true && !x.innerHTML.includes(' (OP)')) {
						x.innerHTML += ' (OP)';
					}
	
					const exists = await this.postExists(id, this.params.board);
					if (exists === false) {
						x.classList.remove('reply');
						x.classList.add('notfound');
					}
				}
			}

		},
		methods: {
			initialWidth: () => {
				return window.innerWidth - 600 - 100;
			}
		},
		async beforeMount() {
			// get thread info
			if (this.boardName !== 'none') {
				await axios
					.get('http://localhost:5934/api' + '/' + this.params.board + '/thread/' + this.params.threadId)
					.then((response) => {
						this.threadData = response.data;
					})
					.catch();
			}
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