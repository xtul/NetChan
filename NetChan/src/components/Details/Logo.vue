<template>
	<v-layout column align-center>
		<router-link :to="{ name: 'home' }">
			<img src="/img/logo.png" class="logo" />
		</router-link>
	</v-layout>
</template>

<script>
	export default {
		name: 'Logo'
	};
</script>

