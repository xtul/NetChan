<template>
	<MainThread :params="this.$route.params"/>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import MainThread from '@/components/MainThread.vue';

	@Component({
		components: {
			MainThread
		},
	})
	export default class Thread extends Vue {}
</script>

<style scoped>
	.logo {
		height: 128px;
		margin-top: 16px;
		margin-bottom: 48px;
	}
</style>
