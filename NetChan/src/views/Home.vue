<template>
	<v-container fluid>
		<v-layout column align-center>
			<img src="../assets/logo.png" class="logo" />
		</v-layout>
		<v-layout column align-center>
			<v-row>
				<v-col cols="12">
					<v-card class="rounded-0">
						<v-card-title>Welcome to NetChan</v-card-title>
						<v-card-text>
							<FrontpageInfo type="about" />
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="8">
					<v-card class="rounded-0">
						<v-card-title>Boards</v-card-title>
						<v-card-text>
							<div>
								<BoardList/>
							</div>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="4">
					<v-card class="rounded-0">
						<v-card-title>News</v-card-title>
						<v-card-text>
							<FrontpageInfo type="news" />
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import FrontpageInfo from '@/components/FrontpageInfo.vue'; // @ is an alias to /src
	import BoardList from '@/components/BoardList.vue';

	@Component({
		components: {
			FrontpageInfo,
			BoardList
		},
	})
	export default class Home extends Vue { }
</script>

<style scoped>
	@import '../../public/css/site.min.css';

	.logo {
		height: 128px;
		margin-top: 16px;
		margin-bottom: 48px;
	}
</style>

