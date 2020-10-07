<template>
	<v-container style="background-color:rgba(255, 255, 255, 0.73);" :disabled="isPostingLoading">
		<v-form name="reportForm" id="reportForm">
			<v-row dense>
				<v-col v-if="errorMessage !== ''" cols="12">
					<p class="error">{{ errorMessage }}</p>
				</v-col>

				<v-col cols="12">
					<v-text-field :counter="32"
								placeholder="Post ID"
								v-model="form.postId"
								label="Post ID" dense></v-text-field>
				</v-col>

				<v-col cols="12">
					<v-textarea label="Reason"
								counter="128"
								v-model="form.reason"
								autofocus
								dense></v-textarea>
				</v-col>					

				<v-col cols="12">
					<vue-hcaptcha @verify="captchaOnVerify" @expired="captchaOnExpired" class="h-captcha" sitekey="d041474a-cb4d-4a32-a789-0965db939327"></vue-hcaptcha>
				</v-col>

				<v-col style="min-height:54px;">
					<v-btn :loading="isLoading" :disabled="isLoading" depressed tile block height="100%" v-on:click="submitForm" id="submitReportBtn">Report post</v-btn>
				</v-col>
			</v-row>
		</v-form>
	</v-container>
</template>

<script>
	import router from '../../router';
	import moment from 'moment';
	import axios from 'axios';
	import { boilerplate } from '@/mixins/boilerplate';
	import VueHcaptcha from '@hcaptcha/vue-hcaptcha';

	export default {
		name: 'ReportForm',
		components: {
			VueHcaptcha
		},
		mixins: [boilerplate],
		computed: {
			board() {
				return router.currentRoute.fullPath.split('/')[1];
			},
		},
		data() {
			return {
				canPost: false,
				isLoading: false,
				isPostingLoading: false,
				canPressUpload: true,
				canCreatePost: false,
				errorMessage: '',
				form: {
					postId: '',
					reason: '',
					captchaCode: ""
				}
			};
		},
		mounted() {
			this.form.postId = this.$route.query.id;
		},
		methods: {
			captchaOnVerify(event) {
				const code = document.getElementsByName('h-captcha-response')[0].value;
				this.form.captchaCode = code;
			},
			captchaOnExpired(event) {
				this.form.captchaCode = '';
			},
			captchaTest() {
				if (this.form.captchaCode == '') {
					return false;
				} else {					
					return true;
				}
			},
			async submitForm() {
				if (this.captchaTest() === false) {
					this.errorMessage = 'Invalid captcha.';
					return;
				}

				this.isPostingLoading = true;

				// API expects an int
				this.form.postId = parseInt(this.form.postId);

				// construct url
				let url = this.$getAPIUrl() + this.board + '/report';

				// send the post form
				await axios.post(url, this.form)
					.then()
					.catch((err) => {
					});
				
				this.$sleep(1000);
				window.close();
			}
		}
	};
</script>