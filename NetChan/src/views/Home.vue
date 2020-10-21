<template>
	<v-container>
		<Logo />
		<v-row justify="center">
			<v-col cols="12" xl="8">
				<v-row>
					<v-col cols="12">
						<v-card class="rounded-0">
							<v-card-title>Welcome to NetChan</v-card-title>
							<v-card-text>
								<FrontpageInfo type="about" />
							</v-card-text>
						</v-card>
					</v-col>
					<v-col cols="12" md="8">
						<v-card class="rounded-0">
							<v-card-title>Boards</v-card-title>
							<v-card-text>
								<div>
									<BoardList/>
								</div>
							</v-card-text>
						</v-card>
					</v-col>
					<v-col cols="12" md="4">
						<v-card class="rounded-0">
							<v-card-title>News</v-card-title>
							<v-card-text>
								<FrontpageInfo type="news" />
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</v-col>
		</v-row>		
	</v-container>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import FrontpageInfo from '@/components/Details/FrontpageInfo.vue'; // @ is an alias to /src
	import BoardList from '@/components/Details/BoardList.vue';

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

