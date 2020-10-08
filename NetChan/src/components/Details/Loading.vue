<template>
	<v-container fill-height fluid class="centered">
		<v-row align="center" justify="center">
			<v-col>
				<img src="/img/logo-sm.png" /> <br/>
				Loading
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		name: 'Loading'
	};
</script>

<style scoped>
	.centered {
		height:100vh;
		text-align: center;
	}
</style>