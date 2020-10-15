<template>
	<div v-if="loading">
		<Loading />
	</div>
	<div v-else>
		<MainBoard 
			v-if="boardExists"
			:params="this.$route.params" 
			:boardName="boardName"
			:boardExists="boardExists"
			:boardData="boardData"
			:list="list"
			:archive="archive"
		/>
		<NotFound v-else :message="errorMsg"/>
	</div>
	
</template>

<script>
	import router from '../router';
	import axios from 'axios';
	import MainBoard from '@/components/MainBoard.vue';
	import NotFound from '@/components/Details/NotFound.vue';

	export default {
		data() {
			return {
				boardName: 'none',
				boardExists: false,
				errorMsg: '',
				boardData: {},
				loading: true
			};
		},
		props: ['list', 'archive'],
		components: {
			MainBoard,
			NotFound
		},
		watch: {
			$route: {
				handler: function(to, from) {
					this.getBoard();
					document.title = '/' + to.params.board + '/ - NetChan';
				},
				deep: true
			},
		},
		async mounted() {
			document.title = '/' + this.$route.params.board + '/ - NetChan';
			await this.getBoard();
		},
		methods: {
			async getBoard() {
				const apiUrl = this.$getAPIUrl();

				// make sure this board even exists, also get full board name
				try {
					await axios
						.get(apiUrl + this.$route.params.board)
						.then((response) => {
							this.boardName = response.data;
							this.boardExists = true;
						})
						.catch((error) => {
							this.errorMsg = error;
							this.loading = false;
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
				if (this.list === true) {
					await axios
						.get(apiUrl + this.$route.params.board + '/list')
						.then((response) => {
							if (response.status === 404) {
								this.boardData = {};
							} else {
								this.boardData = response.data;
							}
						})
						.catch();
				} else {
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

				this.loading = false;
			}
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
