<template>
	<v-row no-gutters>
		<PostForm ref="postForm" />
		<v-col cols="2" v-for="thread in boardData.threads" :key="thread.id" class="card">
			<div class="op">
				<div class="image">
					<img :src="getThumbnailUri(thread.image)">
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
		name: 'BoardCatalogView',
		props: ['boardData'],
		computed: {
			shortBoard: () => {
				return '/' + router.currentRoute.fullPath.split('/')[1] + '/';
			},
		},
		methods: {
			prettyDate: (date) => {
				const providedDate = moment.utc(date);
				const formattedDate = moment(providedDate).local();
				return formattedDate.format('D/M/YYYY (ddd) HH:mm:ss') + ' (' + moment(formattedDate).fromNow() + ')';
			},
			cleanup: (str) => {
				return str.replace(/(\r\n|\r|\n){2,}/g, '$1\n').split('\n');
			},
			getThumbnailUri: (uri) => {
				if (uri == null) {
					return '';
				}

				var splitUri = uri.split('.');
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