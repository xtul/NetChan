<template>
	<v-row>
		<v-col cols="12" class="thread">
			<div v-for="(post, index) in threadData" :key="post.id">
				<div v-if="index === 0" class="op" :id="'post-' + post.id">
					<Post :post="post" mode="op" :board="board" />
				</div>
				<div v-else class="response" :class="'thread-' + threadData[0].id" :id="'post-' + post.id">
					<Post :post="post" mode="response" :board="board" />
				</div>
			</div>
		</v-col>
	</v-row>
</template>

<script>
	import Post from '@/components/Post/Post.vue';
	import { postFinder } from '@/mixins/postFinder.ts';

	export default {
		name: 'ThreadView',
		props: ['threadData', 'board'],
		mixins: [postFinder],
		components: {
			Post
		},
		updated: async function () {
			console.log(this.threadData);

			const replyLinks = document.getElementsByClassName('reply');

			// if reply doesn't exist, remove link
			for (let x of replyLinks) {
				const id = x.innerHTML.replace('>>', '').replace('&gt;&gt;', '').replace(' (OP)', '');
				if (this.isOp(id) === true) {
					x.innerHTML += ' (OP)';
				}

				const exists = await this.postExists(id, this.board);
				if (exists === false) {
					x.classList.remove('reply');
					x.classList.add('notfound');
				}
			}

		}
	};
</script>

