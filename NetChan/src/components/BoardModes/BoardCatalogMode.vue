<template>
	<v-row no-gutters>
		<PostForm ref="postForm" />
		<v-col cols="2" v-for="thread in boardData.threads" :key="thread.id" class="card">
			<div :ref="'post-' + thread.id" class="op">
				<div class="image">
					<img :src="getThumbnailUri(thread.image)" width="125px">
				</div>
				<div class="text">
					<p class="heading">
						<span class="counters">
							R: <b>{{thread.responseCount}}</b> / I: <b>{{thread.imageCount}}</b>
						</span>
						<span v-if="thread.subject != null" class="subject">
							{{ thread.subject }}:
						</span>
						<span>
							{{cleanup(thread.content)[0]}}
						</span>
					</p>
				</div>
			</div>
		</v-col>
	</v-row>
</template>

<script>
	import moment from 'moment';

	export default {
		name: 'BoardCatalogMode',
		props: ['boardData'],
		beforeMount() {
			this.$nextTick(() => {
      			// hide all threads that are in localStorage
				const hiddenList = JSON.parse(localStorage.getItem('hiddenThreads'));
				for (const key of hiddenList) {
					const post = this.$refs['post-' + key];
					if (post == null) {
						return;
					}
					this.$refs['post-' + key][0].hideThread(key, true);
				}
    		});			
		},
		methods: {
			cleanup: (str) => {
				return str.replace(/(\r\n|\r|\n){2,}/g, '$1\n').split('\n');
			},
			getThumbnailUri: (uri) => {
				if (uri == null) {
					return '';
				}

				const splitUri = uri.split('.');
				splitUri[splitUri.length - 2] = splitUri[splitUri.length - 2] + 's';

				return splitUri.join('.');
			}
		}
	};
</script>

<style scoped>
	span {
		font-size:10pt;
		text-align:center;
		overflow-wrap:break-word;
	}

	.counters {
		display: block;
		width: 100%;
	}

	.heading {
		min-width:unset;
	}

	.image > img {
		float: unset;
		display: block;
		margin-left: auto;
		margin-right: auto;
		width:100%;
	}
</style>