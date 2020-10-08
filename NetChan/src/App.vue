<template>
	<v-app>
		<v-main>
			<router-view/>
		</v-main>
	</v-app>
</template>

<script>
export default {
	watch: {
		'$route' (to, from) {
			document.title = to.meta.title + ' - NetChan' || 'NetChan';	  
		},
		immediate: true
	}
}
</script>

