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
					<div v-if="boardData.pageData" class="nav">
						[<a :href="'/' + boardData.pageData.board">Return</a>]
					</div>
					<hr />
				</v-col>
				<v-col cols="12" v-if="mode === 'catalog'">
					<BoardCatalogMode :boardData="boardData" :boardName="boardName" :shortBoard="shortBoard" />
				</v-col>
				<v-col cols="12" v-else>
					<BoardDefaultMode :boardData="boardData" :boardName="boardName" :shortBoard="shortBoard" />
				</v-col>
			</v-row>
		</v-container>
		<template v-if="mode !== 'catalog' && mode !== 'archive'">
			<BoardPages v-if="boardData.pageData" :pageCount="boardData.pageData.pageCount" :currentPage="boardData.pageData.currentPage" :currentBoard="params.board" />
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
