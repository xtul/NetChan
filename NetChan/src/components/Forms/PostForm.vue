<template>
	<v-navigation-drawer
		v-show="opened"
        right permanent fixed
		width="auto"
		class="form"
	>
		<v-form name="postForm">
			<v-container style="padding:0;" fluid :disabled="isPostingLoading">
				<v-row dense>
					<v-col cols="9" lg="11" style="margin-bottom:20px;">
						<span class="small">Closing posting panel will not discard your changes unless you navigate to a different page.</span>
					</v-col>
					<v-col cols="3" lg="1" class="close" v-on:click="opened = false">
						<v-icon>mdi-close-thick</v-icon>
					</v-col>

					<v-col v-if="errorMessage !== ''" cols="12">
						<p class="error">{{ errorMessage }}</p>
					</v-col>
					<v-col cols="12" lg="6">
						<v-text-field :counter="32"
									placeholder="Anonymous"
									v-model="form.name"
									label="Name" dense></v-text-field>
					</v-col>
					<v-col cols="12" lg="6">
						<v-text-field :counter="32"
									placeholder="<sage>"
									v-model="form.options"
									label="Options" dense></v-text-field>
					</v-col>

					<v-col v-if="mode === 'thread'" cols="7" lg="8" md="12" sm="12">
						<v-text-field :counter="64"
									placeholder="<empty>"
									v-model="form.subject"
									label="Subject" dense></v-text-field>
					</v-col>

					<v-col v-if="mode === 'thread'" cols="5" lg="4" md="12" sm="12">
						<v-text-field :counter="64"
									type="password"
									placeholder="<empty>"
									v-model="form.password"
									label="Password" dense></v-text-field>
					</v-col>

					<v-col v-else cols="12">
						<v-text-field :counter="64"
									type="password"
									placeholder="<empty>"
									v-model="form.password"
									label="Password" dense></v-text-field>
					</v-col>

					<v-col cols="12">
						<v-textarea label="Content"
									counter="4000"
									v-model="form.content"
									autofocus
									dense></v-textarea>
					</v-col>

					<v-col cols="8">
						<v-file-input accept="image/png, image/jpeg, image/gif"
									show-size dense label="Image" 
									ref="imageUploader" id="imageUploader"
									:loading="isLoading"
									:disabled="isLoading || !canPressUpload"></v-file-input>
					</v-col>
					<v-col>
						<v-checkbox v-model="form.spoilerImage" dense label="Spoiler"></v-checkbox>
					</v-col>

					<v-col cols="12">
						<vue-hcaptcha @verify="captchaOnVerify" @expired="captchaOnExpired" class="h-captcha" sitekey="d041474a-cb4d-4a32-a789-0965db939327"></vue-hcaptcha>
					</v-col>

					<v-col>
						<v-btn depressed tile block height="100%" :disabled="!canPressUpload" v-on:click="uploadImage">Upload image</v-btn>
					</v-col>

					<v-col style="min-height:54px;">
						<v-btn v-if="mode === 'thread'" :disabled="!canCreatePost" depressed tile block height="100%" v-on:click="submitForm" id="submitBtn">Create {{mode}}</v-btn>
						<v-btn v-else :loading="isLoading" :disabled="isLoading" depressed tile block height="100%" v-on:click="submitForm" id="submitBtn">Create {{mode}}</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-form>
	</v-navigation-drawer>
</template>

<script>
	import router from '../../router';
	import moment from 'moment';
	import axios from 'axios';
	import VueHcaptcha from '@hcaptcha/vue-hcaptcha';

	export default {
		name: 'PostForm',
		components: {
			VueHcaptcha
		},
		computed: {
			board() {
				return router.currentRoute.fullPath.split('/')[1];
			},
			mode() {
				const route = router.currentRoute.fullPath.split('/')[2];
				// i know this is confusing
				// 'thread' endpoint refers to specific thread details
				// if the form is within thread details we want to post a response to it
				// otherwise we want to create a new thread
				if (route === 'thread') {
					return 'post';
				}
				return 'thread';
			},
			threadId() {
				if (this.mode === 'post') {
					return router.currentRoute.fullPath.split('/')[3].replace( /(?!\d+)(.*)/g, '');
				}
				return null;
			},
			latestPostId() {
				const refArr = document.querySelectorAll('[name^=post-]');
				var highestId = 0;

				// iterate over all refs and keep increasing 'highestId' until no higher id occurs
				for (const ref of refArr) {
					const id = parseInt(ref.getAttribute('name').replace( /\D+/g, ''));
					if (id > highestId) {
						highestId = id;
					}
				}
				return highestId;
			}
		},
		data() {
			return {
				opened: false,
				canPost: false,
				file: '',
				isLoading: false,
				isPostingLoading: false,
				canPressUpload: true,
				canCreatePost: false,
				errorMessage: '',
				form: {
					name: '',
					options: '',
					subject: '',
					content: '',
					image: '',
					password: '',
					spoilerImage: false,
					captchaCode: ""
				}
			};
		},
		methods: {
			async uploadImage() {
				const imageUploader = document.getElementById('imageUploader');
				console.log(imageUploader);
				const formData = new FormData();

				formData.append('file', imageUploader.files[0]);
				this.isLoading = true;
				this.canPressUpload = false;
				axios.post(this.$getAPIUrl() + 'image/upload',
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					}
				)
					.then((response) => {
						this.form.image = response.data.token;
						this.canCreatePost = true;
					})
					.catch((err) => {
						this.canPressUpload = true;
					});
				this.isLoading = false;
			},
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

				// construct url
				let url = this.$getAPIUrl() + this.board;
				if (this.mode === 'post') {
					url += '/thread/' + this.threadId;
				}

				var postId = 0;
				var postingFailed = false;

				// send the post form
				await axios.post(url, this.form)
					.then((response) => {
						postId = response.data.id;
					})
					.catch((err) => {
						this.errorMessage = err;
						postingFailed = true;
					});
				this.isPostingLoading = false;

				if (postingFailed) {
					return;
				}

				this.errorMessage = 'Posted successfully - you will be redirected soon.';
				await this.$sleep(1500);

				// if it's a thread response, update posts in thread
				if (this.mode === 'post') {
					await this.$parent.updateThread(null);
					this.errorMessage = '';					
					document.getElementById('post-' + postId).scrollIntoView();

					// clear form
					this.canPressUpload = true;
					this.$refs['imageUploader'].lazyValue = undefined;
					for (var prop in this.form) {
						if (this.form.hasOwnProperty(prop)) {
							if (this.form[prop] === this.form.captchaCode) {
								// don't remove the captcha code
								continue;
							}
							this.form[prop] = { string: '', boolean: false }[typeof this.form[prop]];
						}
					}
				// if it's a thread, navigate to it
				} else {
					router.push({ name: 'thread', params: { threadId: postId } });
					router.go({ name: 'thread', params: { threadId: postId } });
				}
			}
		}
	};
</script>