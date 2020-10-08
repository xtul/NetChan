<template>
	<span>
		<div class="content" v-for="(line, index) in splitIntoLines(message)" :key="index">
			<template v-if="line.startsWith('>')">
				<span class="quote">{{line}}</span>
			</template>
			<template v-else>
				{{line}}
			</template>
			<br>
		</div>
	</span>
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
			fetch(this.$getAPIUrl() + 'frontpage/' + this.type)
				.then((response) => response.json())
				.then((data) => {
					this.message = data.message;
				});
		},
		methods: {
			splitIntoLines(message) {
				if (message == null) return;
				return message.replace(/(\r\n|\r|\n){2,}/g, '$1\n').split('\n');
			}
		}
	};
</script>
