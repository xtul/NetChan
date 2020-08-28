<template>
	<MainBoard :params="this.$route.params"/>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import MainBoard from '@/components/MainBoard.vue';

	@Component({
		components: {
			MainBoard
		},
	})
	export default class Board extends Vue {}
</script>

<style scoped>
	.logo {
		height: 128px;
		margin-top: 16px;
		margin-bottom: 48px;
	}
</style>
