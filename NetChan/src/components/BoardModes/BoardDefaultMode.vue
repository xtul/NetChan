<template>
	<v-row>
		<PostForm ref="postForm" />
		<v-col cols="12">
			<div v-for="thread in boardData.threads" :key="thread.id" class="thread">
				<div class="hiddenOverlay" :ref="'overlay-' + thread.id"></div>
				<div class="postContent" :ref="'thread-' + thread.id">
					<div class="op" :class="'thread-' + thread.id" :id="'post-' + thread.id" v-bind:class="{ emptyThread: thread.responses !== null }">
						<Post :ref="'post-' + thread.id" :post="thread" mode="op" :board="boardData.pageData.board"/>
					</div>
					<template v-if="thread.responses !== null">
						<div v-for="response in thread.responses" :key="response.id" class="response" :class="'thread-' + thread.id" :id="'post-' + response.id">
							<Post :ref="'post-' + response.id" :post="response" mode="response" :board="boardData.pageData.board"/>
						</div>
					</template>
					<hr />
				</div>
			</div>
		</v-col>
	</v-row>
</template>

<script>
	import Post from '@/components/Posts/Post.vue';
	import PostForm from '@/components/Forms/PostForm.vue';
	import { postFinder } from '@/mixins/postFinder.ts';

	export default {
		name: 'BoardDefaultMode',
		props: ['boardData', 'boardName', 'shortBoard'],
		mixins: [postFinder],
		components: {
			Post,
			PostForm
		},
		async mounted() {
			const replyLinks = document.getElementsByClassName('reply');

			if (replyLinks.length > 0) {
				for (const x of replyLinks) {
					const id = x.innerHTML.replace('>>', '').replace('&gt;&gt;', '').replace(' (OP)', '');
					if (this.isOp(id) === true && !x.innerHTML.includes(' (OP)')) {
						x.innerHTML += ' (OP)';
					}
				}
			}
		},
		beforeMount() {
			this.$nextTick(() => {
      			// hide all threads that are in localStorage
				const hiddenList = JSON.parse(localStorage.getItem('hiddenThreads'));
				for (const key of hiddenList) {
					const post = this.$refs['post-' + key];
					if (post == null) {
						return;
					}
					this.$refs['post-' + key][0].hideThread(key, true);
				}
    		});			
		}
	};
</script>

<style scoped>
	.emptyThread {
		min-height:270px;
	}
</style>