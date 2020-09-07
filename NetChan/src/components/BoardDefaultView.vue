<template>
	<v-row>
		<PostForm ref="postForm" />
		<v-col cols="12">
			<h1>{{ shortBoard }} - {{ boardName }}</h1>
			<hr />
		</v-col>
		<v-col cols="12" class="thread">
			<div v-for="thread in boardData.threads" :key="thread.id" class="thread">
				<div class="op" :id="'post-' + thread.id" v-bind:class="{ emptyThread: thread.responses !== null }">
					<Post :post="thread" mode="op" :board="boardData.pageData.board"/>
				</div>
				<template v-if="thread.responses !== null">
					<div v-for="response in thread.responses" :key="response.id" class="response" :id="'post-' + response.id">
						<Post :post="response" mode="response" :board="boardData.pageData.board"/>
					</div>
				</template>
				<hr />
			</div>
		</v-col>
	</v-row>
</template>

<script>
	import Post from '@/components/Post/Post.vue';
	import PostForm from '@/components/Forms/PostForm.vue';
	import { postFinder } from '@/mixins/postFinder.ts';

	export default {
		name: 'BoardDefaultView',
		props: ['boardData'],
		mixins: [postFinder],
		components: {
			Post,
			PostForm
		},
		mounted: async function () {
			const replyLinks = document.getElementsByClassName('reply');

			// remove links to replies that don't exist
			if (replyLinks.length > 0) {
				for (let x of replyLinks) {
					const id = x.innerHTML.replace('>>', '').replace('&gt;&gt;', '').replace(' (OP)', '');
					if (this.isOp(id) === true) {
						x.innerHTML += ' (OP)';
					}
	
					const exists = await this.postExists(id, this.boardData.postData.board);
					if (exists === false) {
						x.classList.remove('reply');
						x.classList.add('notfound');
					}
				}
			}

		}
	};
</script>

<style scoped>
	.emptyThread {
		min-height:270px;
	}
</style>