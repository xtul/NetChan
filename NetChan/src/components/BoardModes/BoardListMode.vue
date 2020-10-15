<template>
	<v-row no-gutters>
		<PostForm ref="postForm" />
		<v-col cols="12">
			<v-data-table
				fixed-header
				disable-pagination
				disable-sort
				class="thread-list"
				:headers="headers"
				:items="boardData.threads"
				:hide-default-footer="true"
				no-data-text="This board has no threads."
				no-results-text="Thread not found."
				v-on:click:row="navigateToThread"
			>
			<template v-slot:[`item.attributes`]="{ item }">
				<v-icon v-if="item.sticky" title="Sticky" small dense>mdi-pin</v-icon>
				<v-icon v-if="item.pastLimits" title="Past board limits" small dense>mdi-lock</v-icon>
				<v-icon v-if="item.archived" title="Archived" small dense>mdi-archive</v-icon>
			</template>
			<template v-slot:[`item.subject`]="{ item }">
				<div class="subject-primary">{{ getSubject(item) }}</div>
			</template>
			<template v-slot:[`item.lastPostDate`]="{ item }">
				{{ prettyDate(item.lastPostDate, true) }}
			</template>
			<template v-slot:[`item.postedOn`]="{ item }">
				{{ prettyDate(item.postedOn) }}
			</template>
			<template v-slot:[`item.name`]="{ item }">
				<div :class="{ anon: item.posterLevel === 0, admin: item.posterLevel > 0 }">{{item.name}}</div>
			</template>
			</v-data-table>
		</v-col>
	</v-row>
</template>

<script>
	import PostForm from '@/components/Forms/PostForm.vue';
	import router from '../../router';
	import moment from 'moment';

	export default {
		name: 'BoardListMode',
		props: ['boardData'],
		components: {
			PostForm
		},
		data () {
			return {
				headers: [
					{ text: '', value: 'attributes', sortable: false, align: 'end' },
					{ text: 'ID', value: 'id', align: 'end' },
					{ text: 'Subject', value: 'subject' },
					{ text: 'Replies', value: 'responseCount', align: 'end' },
					{ text: 'Images', value: 'imageCount', align: 'end' },
					{ text: 'Last post', value: 'lastPostDate' },
					{ text: 'Date', value: 'postedOn' },
					{ text: 'Name', value: 'name' },
				]
			}
		},
		beforeMount() {
			this.$nextTick(() => {
      			// hide all threads that are in localStorage
				const hiddenList = JSON.parse(localStorage.getItem(this.boardData.pageData.board + '_hiddenThreads'));
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
			getSubject(thread) {
				if (thread.subject != null) {
					return thread.subject;
				} else {
					var excerpt = thread.content.substring(0, 64);
					if (thread.content.length > 64) {
						excerpt += '...';
					}
					return excerpt;
				}
			},
			prettyDate(date, includeAgo = false) {
				const providedDate = moment.utc(date);
				const formattedDate = moment(providedDate).local();
				var toReturn = formattedDate.format('D MMM YYYY');
				if (includeAgo) {
					toReturn += ' (' + moment(formattedDate).fromNow() + ')'
				}
				return toReturn;
			},
			navigateToThread(thread) {
				router.push({ name: 'thread', params: { threadId: thread.id } });
			}
		}
	};
</script>
