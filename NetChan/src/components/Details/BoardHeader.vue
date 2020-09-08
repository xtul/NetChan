<template>
	<v-row no-gutters>
		<v-col cols="12" class="boards">
			[ 
			<template v-for="(boardlong, board, index) in boards">
				<p v-if="board === currentBoard">&nbsp;<span class="currentBoard">{{board}}</span>&nbsp;</p>
				<p v-else>&nbsp;<a class="board" :href="'/' + board">{{board}}</a>&nbsp;</p>
				<p v-if="index !== -1 && index !== Object.values(boards).length - 1">&nbsp;/</p>
			</template>
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
			currentBoard: () => {
				return router.currentRoute.fullPath.split('/')[1];
			},
		},
		data() {
			return {
				boards: {}
			};
		},
		mounted() {
			axios
				.get('http://localhost:5934/api/frontpage/boards')
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
