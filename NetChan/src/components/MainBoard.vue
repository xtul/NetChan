<template>
	<v-container fluid no-gutters>
		<BoardHeader />
		<v-layout column align-center>
			<a href="/">
				<img src="../assets/logo.png" class="logo" />
			</a>
		</v-layout>
		<v-container no-gutters fluid v-if="boardExists === true">
			<v-row>
				<v-col cols="12" v-if="mode === 'catalog' || mode === 'archive'">
					<div class="nav">
						[<a :href="'/' + boardData.pageData.board">Return</a>]
					</div>
					<hr />
				</v-col>
				<v-col cols="12" v-if="mode === 'catalog'">
					<BoardCatalogMode :boardData="boardData" />
				</v-col>
				<v-col cols="12" v-else>
					<BoardDefaultMode :boardData="boardData" />
				</v-col>
			</v-row>
		</v-container>
		<v-container v-else column align-center>
			<v-row>
				<v-col cols="12">
					<v-card class="rounded-0">
						<v-card-title>404.</v-card-title>
						<v-card-text>
							<p>Board doesn't exist.</p>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<template v-if="mode !== 'catalog' && mode !== 'archive'">
			<BoardPages :pageCount="boardData.pageData.pageCount" :currentPage="boardData.pageData.currentPage" :currentBoard="params.board" />
		</template>
		<BoardHeader />
	</v-container>
</template>

<script>
	import BoardHeader from '@/components/Details/BoardHeader.vue';
	import BoardPages from '@/components/Details/BoardPages.vue';
	import BoardDefaultMode from '@/components/BoardModes/BoardDefaultMode.vue';
	import BoardCatalogMode from '@/components/BoardModes/BoardCatalogMode.vue';
	import router from '../router';
	import axios from 'axios';
	import moment from 'moment';

	export default {
		name: 'MainBoard',
		components: {
			BoardHeader,
			BoardPages,
			BoardDefaultMode,
			BoardCatalogMode
		},
		props: ['params', 'catalog', 'archive', 'boardName', 'boardExists', 'boardData'],
		computed: {
			shortBoard: () => {
				return '/' + router.currentRoute.fullPath.split('/')[1] + '/';
			},
			mode: () => {
				return router.currentRoute.fullPath.split('/')[2];
			}
		},
		methods: {
			initialWidth: () => {
				return window.innerWidth - 600 - 100;
			}
		}
	};
</script>
