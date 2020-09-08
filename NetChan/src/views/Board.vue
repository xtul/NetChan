<template>
	<MainBoard 
		:params="this.$route.params" 
		:boardName="boardName"
		:boardExists="boardExists"
		:boardData="boardData"
	/>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import router from '../router';
	import axios from 'axios';
	import MainBoard from '@/components/MainBoard.vue';

	@Component({
		components: {
			MainBoard
		},
	})
	export default class Board extends Vue {
		public data() {
			return {
				boardName: 'none',
				boardExists: false,
				boardData: {}
			};
		}
		private async beforeCreate() {
			// make sure this board even exists, also get full board name
			const board = '/' + router.currentRoute.fullPath.split('/')[1] + '/';
			await axios
				.get('http://localhost:5934/api' + board)
				.then((response) => {
					this.boardName = response.data;
					this.boardExists = true;
				})
				.catch();

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
