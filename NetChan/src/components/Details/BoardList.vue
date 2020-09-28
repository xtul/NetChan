<template>
	<div>
		<div v-for="(fullname, board) in boards">
			<a v-bind:href="'/'+ board + '/'">/{{board}}/ - {{fullname}}</a>
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
			fetch(this.getAPIUrl() + 'frontpage/boards')
				.then((response) => response.json())
				.then((data) => {
					this.boards = data;
				});
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
	color: #42b983;
}
</style>
