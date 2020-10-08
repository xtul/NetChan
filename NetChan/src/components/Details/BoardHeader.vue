<template>
	<v-row no-gutters>
		<v-col cols="12" class="boards">
			[ 
			<span v-for="(boardlong, board, index) in boards" :key="index">
				<p v-if="board === currentBoard">&nbsp;<span class="currentBoard">{{board}}</span>&nbsp;</p>
				<p v-else>&nbsp;<router-link class="board" :to="{ name: 'board', params: { board: board }}">{{board}}</router-link>&nbsp;</p>
				<p v-if="index !== -1 && index !== Object.values(boards).length - 1">&nbsp;/</p>
			</span>
			 ]
		</v-col>
	</v-row>
</template>

<script>
	import axios from 'axios';
	import router from '../../router';

	export default {
		name: 'BoardHeader',
		computed: {
			currentBoard() {
				return this.$route.params.board;
			},
		},
		data() {
			return {
				boards: {}
			};
		},
		mounted() {
			axios
				.get(this.$getAPIUrl() + 'frontpage/boards')
				.then((response) => {
					this.boards = response.data;
				});
		},
	};
</script>

<style scoped>
	p {
		display:inline;
	}
	.boards {
		font-size:12px;
		color:rgba(0, 0, 0, 0.50)
	}
	.board, .currentBoard {
		color: rgba(0, 0, 0, 1)
	}
	.currentBoard {
		font-weight:700;
	}
</style>
