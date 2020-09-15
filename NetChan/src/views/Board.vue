<template>
	<div v-if="loading === false">
		<MainBoard 
			v-if="boardExists"
			:params="this.$route.params" 
			:boardName="boardName"
			:boardExists="boardExists"
			:boardData="boardData"
		/>
		<NotFound v-else :message="errorMsg"/>
	</div>
	<div v-else>
		<p>loading...</p>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import router from '../router';
	import axios from 'axios';
	import MainBoard from '@/components/MainBoard.vue';
	import NotFound from '@/components/Details/NotFound.vue';

	@Component({
		components: {
			MainBoard,
			NotFound
		},
	})
	export default class Board extends Vue {
		public data() {
			return {
				boardName: 'none',
				boardExists: false,
				errorMsg: '',
				boardData: {},
				loading: true
			};
		}
		private async beforeCreate() {
			// make sure this board even exists, also get full board name
			const board = '/' + router.currentRoute.fullPath.split('/')[1] + '/';
			try {
				await axios
					.get('http://localhost:5934/api' + board)
					.then((response) => {
						this.boardName = response.data;
						this.boardExists = true;
					})
					.catch((error) => {
						console.log(error);
						this.errorMsg = error;
					});
			} catch {}


			// if board exists, get threads
			if (this.boardExists === false) {
				return;
			}
			let page = this.$route.params.page;
			if (page === undefined) {
				page = '1';
			}
			await axios
				.get('http://localhost:5934/api/' + this.$route.params.board + '/' + page)
				.then((response) => {
					if (response.status === 404) {
						this.boardData = {};
					} else {
						this.boardData = response.data;
					}
				})
				.catch();
				
			this.loading = false;
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
