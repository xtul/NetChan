<template>
	<v-container fluid no-gutters>
		<BoardHeader />
		<Logo />
		<v-container no-gutters fluid v-if="boardExists === true">
			<v-row>
				<v-col cols="12">
					<h1>/{{ this.params.board }}/ - {{ boardName }}</h1>
					<h2>[<a v-on:click="openPostingForm">Start a New Thread</a>]</h2>
					<p class="small" style="text-align:center;">All content posted by users is their responsibility.</p>
					<hr />
				</v-col>
				<template v-if="mode === 'archive'">
					<v-col cols="12">
						<div v-if="boardData.pageData" class="nav">
							[<router-link :to="{ name: 'board' }">Return</router-link>]
						</div>
					</v-col>
				</template>
				<template v-else>
					<BoardPages v-if="boardData.pageData" :pageCount="boardData.pageData.pageCount" :currentPage="boardData.pageData.currentPage" :currentBoard="params.board" />
				</template>
				<v-col cols="12">
					<hr style="margin:0;" />
				</v-col>
				<v-col cols="12" v-if="list === true">
					<BoardListMode ref="boardMode" :boardData="boardData" :boardName="boardName" :shortBoard="this.params.board" />
				</v-col>
				<v-col cols="12" v-else>
					<BoardDefaultMode ref="boardMode" :boardData="boardData" :boardName="boardName" :shortBoard="this.params.board" />
				</v-col>
			</v-row>
		</v-container>
		<BoardHeader />
	</v-container>
</template>

<script>
	import BoardPages from '@/components/Details/BoardPages.vue';
	import BoardDefaultMode from '@/components/BoardModes/BoardDefaultMode.vue';
	import BoardListMode from '@/components/BoardModes/BoardListMode.vue';
	import router from '../router';
	import axios from 'axios';
	import moment from 'moment';

	export default {
		name: 'MainBoard',
		components: {
			BoardPages,
			BoardDefaultMode,
			BoardListMode
		},
		props: ['params', 'list', 'archive', 'boardName', 'boardExists', 'boardData'],
		computed: {
			mode: () => {
				return router.currentRoute.fullPath.split('/')[2];
			}
		},
		methods: {
			initialWidth: () => {
				return window.innerWidth - 600 - 100;
			},
			openPostingForm() {
				const boardMode = this.$refs.boardMode;
				const postingForm = boardMode.$refs.postForm;

				postingForm.opened = true;
			}
		}
	};
</script>
