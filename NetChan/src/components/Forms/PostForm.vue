<template>
	<v-snackbar
		v-model="opened"
		:top="true"
    	:right="true"
    	:multi-line="true"
    	:timeout="-1"
		:light="true">
		<v-form>
			<v-container fluid :disabled="isPostingLoading">
				<v-row dense>
					<v-col cols="12">
						<v-spacer></v-spacer>
						<span v-on:click="opened = false">X</span>
					</v-col>
					<v-col v-if="errorMessage !== ''" cols="12">
						<p class="error">{{ errorMessage }}</p>
					</v-col>
					<v-col cols="6">
						<v-text-field :counter="32"
									placeholder="Anonymous"
									v-model="form.name"
									label="Name" dense></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-text-field :counter="32"
									placeholder="sage"
									v-model="form.options"
									label="Options" dense></v-text-field>
					</v-col>

					<v-col cols="12">
						<v-text-field :counter="64"
									placeholder="<empty>"
									v-model="form.subject"
									label="Subject" dense></v-text-field>
					</v-col>

					<v-col cols="12">
						<v-textarea label="Content"
									counter="4000"
									v-model="form.content"
									autofocus
									dense></v-textarea>
					</v-col>

					<v-col cols="6">
						<v-file-input accept="image/png, image/jpeg, image/gif"
									show-size
									label="Image" id="imageUploader"
									:loading="isLoading"
									:disabled="isLoading || !canPressUpload" dense></v-file-input>
					</v-col>
					<v-col cols="2">
						<v-btn depressed tile block height="100%" :disabled="!canPressUpload" v-on:click="uploadImage" >Upload<br />image</v-btn>
					</v-col>

					<v-col cols="4">
						<v-btn v-if="mode === 'thread'" :disabled="!canCreatePost" depressed tile block height="100%" v-on:click="submitForm" id="submitBtn">Create {{mode}}</v-btn>
						<v-btn v-else :loading="isLoading" :disabled="isLoading" depressed tile block height="100%" v-on:click="submitForm" id="submitBtn">Create {{mode}}</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-form>
	</v-snackbar>
</template>

<script>
	import router from '../../router';
	import moment from 'moment';
	import axios from 'axios';
	import { boilerplate } from '@/mixins/boilerplate.ts';

	export default {
		name: 'PostForm',
		mixins: [boilerplate],
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
					return router.currentRoute.fullPath.split('/')[3];
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
					image: ''
				}
			};
		},
		mounted() {
			console.log(this.$parent.$parent);
		},
		methods: {
			uploadImage: async function() {
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
			submitForm: function() {
				this.isPostingLoading = true;
				let url = this.getAPIUrl() + this.board;
				if (this.mode === 'post') {
					url = url + '/thread/' + this.threadId;
				}

				axios.post(url, this.form)
					.then(() => {
					})
					.catch(() => {
					});
				this.isPostingLoading = false;

				let threadData = this.$parent.$data.threadData;

				axios
				.get('http://localhost:5934/api' + '/' + this.board + '/thread/' + this.threadId)
				.then((response) => {
					threadData = response.data;
				})
				.catch();
			}
		}
	};
</script>

<style scoped>
	.draggable-parent { /* dragging box, basically */
		height: 100vh;
		width: 100vw;
		position: fixed;
		pointer-events: none;
	}

	.draggable { /* actual component */
		pointer-events: all;
		top: 30px;
		right: 15px;
		z-index: 999;
		padding: 0.4rem;
		background-color: #eefaff;
		border-bottom: 1px solid #b0d9e8;
		border-right: 1px solid #bce6f5;
	}

	.lol {
		display:relative;
		bottom:15px;
	}
</style>