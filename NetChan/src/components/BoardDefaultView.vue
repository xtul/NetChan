<template>
	<v-row>
		<v-col cols="12" class="thread">
			<div v-for="thread in boardData.threads" :key="thread.id" class="thread">
				<div class="op" :id="'post-' + thread.id">
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
	import { postFinder } from '@/mixins/postFinder.ts';

	export default {
		name: 'BoardDefaultView',
		props: ['boardData'],
		mixins: [postFinder],
		components: {
			Post
		},
		mounted: async function () {
			const replyLinks = document.getElementsByClassName('reply');

			// if reply doesn't exist, remove link
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
	};
</script>

