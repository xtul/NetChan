<template>
	<v-row>
		<v-col cols="12" class="box-container">
			<div class="box">
				<span v-if="$route.params.page === 'archive'">
					<a class="misclink-nopad" v-on:click="$router.go(-1)">Return</a>
				</span>	
				<span v-else-if="pageCount != null">
					<span v-for="page in pageCount" :key="page">
						[<span v-if="page === currentPage" class="current">{{page}}</span>					
						<a v-else :href="'/' + currentBoard + '/' + page">{{page}}</a>]
					</span>
					<span v-for="n in 10 - pageCount" :key="n">
						<span class="unavailable">[{{n + pageCount}}]</span>
					</span>
					<router-link v-if="$route.name === 'board-list'" class="misclink" :to="{ name: 'board' }">Default</router-link>
					<router-link v-if="$route.name === 'board'" class="misclink" :to="{ name: 'board-list' }">List</router-link>
					<router-link class="misclink" :to="{ name: 'board-archive' }">Archive</router-link>
				</span>
				<span v-else>
					<router-link v-if="$route.name === 'board-list'" class="misclink-mode" :to="{ name: 'board' }">Default</router-link>
					<router-link v-if="$route.name === 'board'" class="misclink-mode" :to="{ name: 'board-list' }">List</router-link>
					<router-link class="misclink-archive" :to="{ name: 'board-archive' }">Archive</router-link>
				</span>				
			</div>
		</v-col>
	</v-row>
</template>

<script>
	export default {
		name: 'BoardPages',
		props: ['pageCount', 'currentPage', 'threadsPerPage', 'currentBoard'],
		updated() {
			console.log(pageCount);
		}
	};
</script>

<style scoped>
	.box-container {
		margin-bottom: 1rem;
	}

	.box {
		background: #eefaff;
		padding: 1rem;
		margin: 1rem;
		display: inline;
		border-bottom: 1px solid #b0d9e8;
		border-right: 1px solid #bce6f5;
	}

	.misclink, .misclink-mode, .misclink-archive, .misclink-nopad {
		display:inline-block;
		height:100%;
	}

	.misclink {		
		padding-left: 1rem;
		border-left: 1px solid #b0d9e8;
		margin-left: 1rem;
	}

	.misclink-mode {
		padding-right: 1rem;
		border-right: 1px solid #b0d9e8;		
	}

	.misclink-archive {
		padding-left: 1rem;	
	}

	.unavailable {
		margin-left: 0.2rem;
		color: rgba(0, 0, 0, 0.5)
	}

	.current {
		font-weight: 700;
	}
</style>
