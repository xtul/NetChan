<template>
	<v-container fluid no-gutters>
		<BoardHeader />
		<Logo />
		<v-container no-gutters fluid>
			<v-row>
				<v-col cols="12">
					<h1>/{{ params.board }}/ - {{ boardName }}</h1>
					<h2 v-if="threadData.posts[0].archived">This thread is closed.</h2>
					<h2 v-else>[<a v-on:click="openPostingForm">Respond to this thread</a>]</h2>
					<p class="small" style="text-align:center;">All content posted by users is their responsibility.</p>
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
					<PostForm v-if="threadData.posts[0].archived === false" ref="postForm" />
					<div v-for="(post, index) in threadData.posts" :key="post.id">
						<div v-if="index === 0" class="op" :id="'post-' + post.id">
							<Post :ref="'post-' + post.id" :name="'post-' + post.id" :post="post" mode="op" :board="params.board" />
						</div>
						<div v-else class="response" :class="'thread-' + threadData.posts[0].id" :id="'post-' + post.id">
							<Post :ref="'post-' + post.id" :name="'post-' + post.id" :post="post" mode="response" :board="params.board" />
						</div>
					</div>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols=12>
					<hr/>
					<div style="display: flex; justify-content: space-between">
						<div class="nav" v-if="threadData.posts[0].archived === false">
							[<router-link :to="{ name: 'board', params: { board: params.board }}">Return</router-link>]&nbsp;
							[<a ref="updateThread" v-on:click="updateThread">Update</a>]&nbsp;
							[
							<div v-on:click="autoUpdate.enabled = !autoUpdate.enabled; toggleTimer()">
								<input type="checkbox" v-model="autoUpdate.enabled"><a>Auto</a>
							</div>
							]
							<template v-if="autoUpdate.enabled">
								{{ autoUpdate.timer }}
							</template>
							<span style="padding-left:.2rem" v-if="autoUpdate.message != null">
								{{autoUpdate.message}}
							</span>
						</div>
						<div class="nav nav-right">
							<span title="Replies">{{threadData.data.responseCount}}</span> <span class="pad-lr">/</span>
							<span title="Images">{{threadData.data.imageCount}}</span> <span class="pad-lr">/</span>
							<span title="Posters">{{threadData.data.uniquePosters}}</span> <span class="pad-lr">/</span>
							<span title="Page">{{threadData.data.page}}</span>
						</div>
					</div>
					<hr/>
					<h2 v-if="threadData.posts[0].archived">This thread is closed.</h2>
					<h2 v-else>[<a v-on:click="openPostingForm">Respond to this thread</a>]</h2>
					<p class="small" style="text-align:center;">All content posted by users is their responsibility.</p>
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
				threadData: new Set(),
				autoUpdate: {
					enabled: false,
					timer: 20,
					timerBounceback: 20,
					message: ''
				}
			};
		},
		computed: {
			latestPostId() {
				const refArr = document.querySelectorAll('[name^=post-]');
				var highestId = 0;

				// iterate over all refs and keep increasing 'highestId' until no higher id occurs
				for (const ref of refArr) {
					const id = parseInt(ref.getAttribute('name').replace( /\D+/g, ''));
					if (id > highestId) {
						highestId = id;
					}
				}
				return highestId;
			}
		},
		watch: {
			autoUpdate: {
				handler: function(newValue) {
					if (this.autoUpdate.timer === 0) {
						this.updateThread(null);
					}
				},
				deep: true
			}
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
					const id = x.innerHTML.replace( /\D+/g, '');
					if (this.isOp(id) === true && !x.innerHTML.includes(' (OP)')) {
						x.innerHTML += ' (OP)';
					}

					if (this.$refs['post-' + id] == null) {
						const exists = await this.postExists(id, this.params.board);
						if (exists === false) {
							x.classList.remove('reply');
							x.classList.add('notfound');
						}
					}
					
					if (this.$refs['post-' + id][0].post.you) {
						if (!x.innerHTML.includes(' (You)')) {
							x.innerHTML += ' (You)';
						}
					}
				}
			}

		},
		methods: {
			initialWidth: () => {
				return window.innerWidth - 600 - 100;
			},
			openPostingForm() {
				const postingForm = this.$refs.postForm;

				postingForm.opened = true;
			},
			async updateThread(e) {
				this.autoUpdate.message = 'Fetching...';
				var failed = false;
				await axios.get(this.$getAPIUrl() + this.params.board + '/thread/' + this.params.threadId + '/' + this.latestPostId)
						.then((response) => {
							const newPosts = response.data.posts;
							const oldPosts = this.threadData.posts;

							for (const post of newPosts) {
								// prevent duplicate entries
								if (oldPosts.find(x => x.id === post.id)) {
									continue;
								}
								this.threadData.posts.push(post);
							}

							if (newPosts.length === 1) {
								this.autoUpdate.message = '1 new post.'
							} else {
								this.autoUpdate.message = newPosts.length + ' new posts.'
							}

							// reset bounceback since it looks like there's activity
							this.autoUpdate.timerBounceback = 20;

							// also update thread info
							this.threadData.data = response.data.data;
						})
						.catch(() => {
							failed = true;
						});
				
				// we're handling this outside axios because it runs multiple times for some reason
				if (failed) {
					this.autoUpdate.message = 'No new posts.'
					if (this.autoUpdate.timerBounceback < 900) {
						const increment = this.autoUpdate.timerBounceback * 1.5;
						this.autoUpdate.timerBounceback = Math.round(increment);
					} else {
						this.autoUpdate.timerBounceback = 900;
					}
				}

				// reset the timer to current bounceback
				this.autoUpdate.timer = this.autoUpdate.timerBounceback;
			},
			async toggleTimer() {
				while(true) {
					await this.$sleep(1000);
					if (!this.autoUpdate.enabled) {
						break;
					}
					this.autoUpdate.timer -= 1;
				}	
			}
		},
		async beforeMount() {
			// get thread info
			if (this.boardName !== 'none') {
				await axios
					.get(this.$getAPIUrl() + this.params.board + '/thread/' + this.params.threadId)
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