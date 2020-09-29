<template>
	<div v-if="loading === false">
		<MainThread 
			v-if="boardExists"
			:params="this.$route.params" 
			:boardName="boardName"
			:boardExists="boardExists"
			:boardData="boardData"
		/>
		<NotFound v-else/>
	</div>
	<div v-else>
		<p>loading...</p>
	</div>
	
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import MainThread from '@/components/MainThread.vue';
	import NotFound from '@/components/Details/NotFound.vue';
	import router from '../router';
	import axios from 'axios';

	@Component({
		components: {
			MainThread,
			NotFound
		},
	})
	export default class Thread extends Vue {
		public data() {
			return {
				boardName: 'none',
				boardExists: false,
				threadExists: false,
				boardData: {},
				loading: true
			};
		}
		private async mounted() {
			const apiUrl = this.$getAPIUrl();

			// make sure this thread even exists, also get full board name
			const board = router.currentRoute.fullPath.split('/')[1];
			try {
				await axios
					.get(apiUrl + this.$route.params.board)
					.then((response) => {
						this.boardName = response.data;
						this.boardExists = true;
					})
					.catch();
			} catch {}
			try {
				await axios
					.get(apiUrl + this.$route.params.board)
					.then((response) => {
						this.boardName = response.data;
						this.boardExists = true;
					})
					.catch();
			} catch {}

			this.loading = false;

			// if board exists, get thread data
			if (this.boardExists === false) {
				return;
			}
			let page = this.$route.params.page;
			if (page === undefined) {
				page = '1';
			}
			await axios
				.get(apiUrl + this.$route.params.board + '/' + page)
				.then((response) => {
					if (response.status === 404) {
						this.boardData = {};
					} else {
						this.boardData = response.data;
					}
				})
				.catch();
		}
	}
</script>

<style scoped>
	.logo {
		height: 128px;
		margin-top: 16px;
		margin-bottom: 48px;
	}
</style>
