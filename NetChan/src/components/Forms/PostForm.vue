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
						<span class="exit">[</span>X<span class="exit">]</span>
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

					<v-col v-if="mode === 'thread'" cols="12">
						<v-text-field :counter="64"
									placeholder="<empty>"
									v-model="form.subject"
									label="Subject" dense></v-text-field>
					</v-col>

					<v-col cols="12">
						<v-checkbox v-model="form.spoilerImage" label="Spoiler"></v-checkbox>
					</v-col>

					<v-col cols="12">
						<v-textarea label="Content"
									counter="4000"
									v-model="form.content"
									autofocus
									dense></v-textarea>
					</v-col>

					<v-col cols="5">
						<v-file-input accept="image/png, image/jpeg, image/gif"
									show-size
									label="Image" id="imageUploader"
									:loading="isLoading"
									:disabled="isLoading || !canPressUpload" dense></v-file-input>
					</v-col>

					<v-col cols="12">
						<vue-hcaptcha sitekey="d041474a-cb4d-4a32-a789-0965db939327"></vue-hcaptcha>
					</v-col>

					<v-col>
						<v-btn depressed tile block height="100%" :disabled="!canPressUpload" v-on:click="uploadImage" >Upload<br />image</v-btn>
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
				if (this.mode === 'post') {
					const refArr = Object.keys(this.$parent.$refs).filter(x => x.startsWith('post-'));
					const latestRef = refArr[refArr.length - 1];
					// return only the post id
					return latestRef.replace( /\D+/g, '');
				}
				return null;
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
					spoilerImage: false
				}
			};
		},
		methods: {
			async uploadImage() {
				const imageUploader = document.getElementById('imageUploader');
				const formData = new FormData();

				formData.append('file', imageUploader.files[0]);
				this.isLoading = true;
				this.canPressUpload = false;
				axios.post(this.getAPIUrl() + 'image/upload',
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
			async submitForm() {
				this.isPostingLoading = true;

				// construct url
				let url = this.getAPIUrl() + this.board;
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
				await this.sleep(2000);

				// if it's a thread response, update posts in thread
				if (this.mode === 'post') {
					await axios.get(url + '/' + this.latestPostId)
						.then((response) => {
							const newPosts = response.data;
							console.log(newPosts);
							const oldPosts = this.$parent.threadData.posts;
							console.log(oldPosts);

							for (const post of newPosts) {
								oldPosts.push(post);
							}
						})
						.catch();
					this.errorMessage = '';					
					document.getElementById('post-' + postId).scrollIntoView();

					// clear form
					for (var prop in this.form) {
						if (this.form.hasOwnProperty(prop)) {
							this.form[prop] = { string: '', boolean: false }[typeof this.form[prop]];
						}
					}

					// also mark this post as yours
					this.updateLocalStorageJson('userPosts', postId);
				// if it's a thread, navigate to it
				} else {
					router.push({ name: 'thread', params: { threadId: postId } });
					router.go({ name: 'thread', params: { threadId: postId } });
				}
			}
		}
	};
</script>
