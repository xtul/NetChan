<template>
	<v-row>
		<v-col cols="12" class="box-container">
			<div class="box">
				<template v-for="page in pageCount">
					[<span v-if="page === currentPage" class="current">{{page}}</span>					
					<a v-else :href="'/' + currentBoard + '/' + page">{{page}}</a>]
				</template>
				<template v-for="(n, index) in 10 - pageCount">
					<span class="unavailable">[{{n + pageCount}}]</span>
				</template>
				<a class="misclink" :href="'/' + currentBoard + '/catalog'">Catalog</a>
				<a class="misclink" :href="'/' + currentBoard + '/archive'">Archive</a>
			</div>
		</v-col>
	</v-row>
</template>

<script>
	export default {
		name: 'BoardPages',
		props: ['pageCount', 'currentPage', 'threadsPerPage', 'currentBoard']
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

	.misclink {
		display:inline-block;
		padding-left: 1rem;
		margin-left: 1rem;
		border-left: 1px solid #b0d9e8;
		height:100%;
	}

	.unavailable {
		margin-left: 0.2rem;
		color: rgba(0, 0, 0, 0.5)
	}

	.current {
		font-weight: 700;
	}
</style>
