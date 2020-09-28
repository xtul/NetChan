<template>	
	<p>
		{{ message }}
	</p>
</template>

<script>
	export default {
		name: 'FrontpageInfo',
		data() {
			return {
				message: null
			};
		},
		props: {
			type: String,
		},
		mounted() {
			fetch(this.getAPIUrl() + 'frontpage/' + this.type)
				.then((response) => response.json())
				.then((data) => {
					this.message = data.message;
				});
		},
	};
</script>
