<template>
	<v-row>
		<v-col cols="12" class="thread">
			<div v-for="thread in boardData.threads" :key="thread.id" class="thread">
				<div class="op">
					<div class="image">
						<img :id="'img-' + thread.id" :src="thread.image">
					</div>
					<div class="text">
						<p class="heading">
							<span class="subject">
								{{ thread.subject }}
							</span>
							<span class="name">
								{{ thread.name }}
							</span>
							<span class="date">
								{{ prettyDate(thread.postedOn) }}
							</span>
							<span class="postlink">
								No.
							</span>
							<span class="id">
								{{ thread.id }}
							</span>
							<v-btn icon x-small active-class="">
								<v-icon>mdi-exclamation-thick</v-icon>
							</v-btn>
						</p>
						<p class="content">
							<template v-for="line in cleanup(thread.content)">
								<template v-if="line.startsWith('>')">
									<span class="quote">{{line}}</span>
								</template>
								<template v-if="line.startsWith('>>')">
									<span class="reply">{{line}}</span>
								</template>
								<template v-else>
									{{line}}
								</template>
								<br>
							</template>
						</p>
					</div>
				</div>

				<div v-if="thread.responses !== null">
					<div v-for="response in thread.responses" :key="response.id" class="response">

						<div class="image">
							<img :id="'img-' + response.id" :src="response.image">
						</div>
						<div class="text">
							<p class="heading">
								<span class="subject">
									{{ response.subject }}
								</span>
								<span class="name">
									{{ response.name }}
								</span>
								<span class="date">
									{{ prettyDate(response.postedOn) }}
								</span>
								<span class="postlink">
									No.
								</span>
								<span class="id">
									{{ response.id }}
								</span>
								<v-btn icon x-small>
									<v-icon>mdi-exclamation-thick</v-icon>
								</v-btn>
							</p>
							<p class="content" style="white-space:pre-line">
								<template v-for="line in cleanup(response.content)">
									<template v-if="line.startsWith('>>>')">
										<span class="board-link">{{line}}</span>
									</template>
									<template v-else-if="line.startsWith('>>')">
										<span class="reply">{{line}}</span>
									</template>
									<template v-else-if="line.startsWith('>')">
										<span class="quote">{{line}}</span>
									</template>
									<template v-else>
										{{line}}
									</template>
									<br>
								</template>
							</p>
						</div>
					</div>
				</div>
				<hr />
			</div>
		</v-col>
	</v-row>
</template>

<script>
	import moment from 'moment';

	export default {
		name: 'BoardDefaultView',
		props: ['boardData'],
		methods: {
			prettyDate: (date) => {
				const providedDate = moment.utc(date);
				const formattedDate = moment(providedDate).local();
				return formattedDate.format('D/M/YYYY (ddd) HH:mm:ss') + ' (' + moment(formattedDate).fromNow() + ')';
			},
			cleanup: (str) => {
				if (str.length > 255) {
					str = str + '\nContent too long. <a href="#">Click here</a> to load full post.';
				}
				return str.replace(/(\r\n|\r|\n){2,}/g, '$1\n').split('\n');
			}
		}
	};
</script>

