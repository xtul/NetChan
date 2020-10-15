<template>
	<div v-if="loading">
		<Loading />
	</div>
	<div v-else>
		<MainThread 
			v-if="threadExists"
			:boardName="boardName"
			:threadData="threadData"
		/>
		<NotFound v-else :message="errMessage"/>
	</div>	
</template>

<script>
	import MainThread from '@/components/MainThread.vue';
	import NotFound from '@/components/Details/NotFound.vue';
	import router from '../router';
	import axios from 'axios';

	export default {
		data() {
			return {
				boardName: 'none',
				threadExists: false,
				threadData: {},
				errMessage: '',
				loading: true
			};
		},
		components: {
			MainThread,
			NotFound
		},
		watch: {
			$route: {
				handler: function(to, from) {
					this.getThread();
					document.title = '/' + to.params.board + '/ - NetChan';
				},
				deep: true
			},
		},
		async mounted() {
			const apiUrl = this.$getAPIUrl();

			// make sure this thread even exists, also get full board name
			const board = router.currentRoute.fullPath.split('/')[1];
			await axios
				.get(apiUrl + this.$route.params.board, { validateStatus: (status) => status === 200 })
				.then((response) => {
					this.boardName = response.data;
				})
				.catch((err) => {
					this.errMessage = err;
				});
			
			// get thread info
			await this.getThread();

			// update page title
			const threadId = this.threadData.posts[0].id;
			const subject = this.threadData.posts[0].subject || null;

			if (subject != null) {
				document.title = '/' + this.$route.params.board + '/' + this.threadData.posts[0].id + ' - ' + this.threadData.posts[0].subject +  ' - NetChan';
			} else {
				const content = this.threadData.posts[0].content;
				var excerpt = content.substring(0, 32);
				if (content.length > 32) {
					excerpt += '...';
				}
				document.title = '/' + this.$route.params.board + '/' + this.threadData.posts[0].id + ' - ' + excerpt + ' - NetChan';
			}

			this.loading = false;
		},
		methods: {
			async getThread() {
				await axios
					.get(this.$getAPIUrl() + this.$route.params.board + '/thread/' + this.$route.params.threadId)
					.then((response) => {
						this.threadData = response.data;
						this.threadExists = true;
					})
					.catch((err) => {
						this.errMessage = 'Thread doesn\'t exist.';
					});
			}
		}
	}
</script>
