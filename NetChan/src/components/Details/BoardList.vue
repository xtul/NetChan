<template>
	<div>
		<div v-for="(fullname, board, index) in boards" :key="index">
			<router-link :to="{ name: 'board', params: { board: board }}">/{{board}}/ - {{fullname}}</router-link>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'BoardList',
		data() {
			return {
				boards: {}
			};
		},
		mounted() {
			fetch(this.$getAPIUrl() + 'frontpage/boards')
				.then((response) => response.json())
				.then((data) => {
					this.boards = data;
				});
		},
	};
</script>

