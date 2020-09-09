<template>
	<div>
		<div class="image" v-if="post.image != null">
			<img onerror="this.onerror=null; this.src='/img/notfound.png'" v-if="post.spoilerImage === true" v-on:click="openImage(post.image)" :id="'img-' + post.id" src="/img/spoiler.gif">
			<img onerror="this.onerror=null; this.src='/img/notfound.png'" v-else :id="'img-' + post.id" v-on:click="openImage" :src="getThumbnailUri(post.image)">
		</div>
		<div class="text">
			<p class="heading">
				<span class="subject">
					{{ post.subject }}
				</span>
				<span class="name">
					{{ post.name }}
				</span>
				<span class="date">
					{{ prettyDate(post.postedOn) }}
				</span>
				<span class="postlink">
					<router-link v-if="post.thread" :to="{ name: 'thread', params: { threadId: post.thread }, hash: '#post-' + post.id }">No.</router-link>
					<router-link v-else :to="{ name: 'thread', params: { threadId: post.id } }">No.</router-link>
				</span>
				<span class="id" v-on:click="reply(post.id)">
					{{ post.id }}
				</span>
				<span class="actions">
					[!]
				</span>
			</p>
			<p class="content">
				<template v-for="line in cleanup(post.content)">
					<template v-if="line.startsWith('>>>')">
						<span class="board-link">{{line}}</span>
					</template>
					<template v-else-if="line.includes('>>')">
						<span v-for="x in regexReply(line)">
							<a v-if="x.startsWith('>>')" class="reply" v-on:click="navigateToPost(x)">{{x}}</a>
							<span v-else>
								{{x}}
							</span>
						</span>
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
</template>

<script>
	import moment from 'moment';
	import axios from 'axios';
	import router from '../../router';
	import { postFinder } from '@/mixins/postFinder.ts';

	export default {
		name: 'Post',
		props: ['post', 'mode', 'board'],
		mixins: [postFinder],
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
			},
			getThumbnailUri: (uri) => {
				if (uri == null) {
					return '';
				}

				const splitUri = uri.split('.');
				splitUri[splitUri.length - 2] = splitUri[splitUri.length - 2] + 's';

				return splitUri.join('.');
			},
			openImage: (event, spoilerUrl) => {
				const img = event.target;
				if (img.src.includes('img/notfound.png')) {
					return;
				}

				// if image isn't a spoiler, add or remove 's' (signifies a thumbnail)
				if (spoilerUrl == undefined) {
					// split the filename into an array delimited by a dot
					const srcSplit = img.src.split('.');

					// since filename may contain dots anywhere, we're looking for the part just before extension
					const beforeExt = srcSplit[srcSplit.length - 2];

					// if 's' wasn't found at the end of filename, add it
					if (beforeExt.charAt(beforeExt.length - 1) !== 's') {
						srcSplit[srcSplit.length - 2] += 's';
					// otherwise remove it
					} else {
						srcSplit[srcSplit.length - 2] = beforeExt.substring(0, beforeExt.length - 1);
					}

					// finally, join the array into a single string and change image source
					img.src = srcSplit.join('.');
				
				// otherwise just set the url to the one provided
				} else {
					if (img.src === spoilerUrl) {
						img.src = '/img/spoiler.gif';
					} else {
						img.src = spoilerUrl;
					}
				}

				// stretch the image so everything appears on the bottom rather on the right
				img.classList.toggle('stretched-img');
			},
			regexReply: (line) => {
				// split the string by elements like ">>131", ">>235" and return the array
				const result = line.replace(/(>>\d+)/g, '<split>$1').replace(/(>>\d+)/g, '$1<split>').split(/<split>/);
				return result;
			},
			isInViewport: (element) => {
				const rect = element.getBoundingClientRect();
				return (
					rect.top >= 0 &&
					rect.left >= 0 &&
					rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
					rect.right <= (window.innerWidth || document.documentElement.clientWidth)
				);
			},
			scrollToPost(id) {
				id = id.replace('>>', '').replace('&gt;&gt;', '').replace(' (OP)', '');
				const highlighted = document.getElementsByClassName('highlighted');
				const desiredPost = document.getElementById('post-' + id);

				// clear all highlights
				for (const x of highlighted) {
					x.classList.remove('highlighted');
				}

				// highlight this post
				if (desiredPost.classList.contains('op') === false) {
					desiredPost.classList.add('highlighted');
				}

				// scroll to the post if it's out of view
				if (this.isInViewport(desiredPost) === false) {
					desiredPost.scrollIntoView();
				}

				// add hash at the end of link
				window.location.hash = '#post-' + id;
			},
			async lookupThread(postId) {
				const result = await axios
					.get('http://localhost:5934/api/' + this.board + '/post/' + postId + '/thread')
					.then((response) => {
						return response.data.threadId;
					})
					.catch(() => {
						return false;
					});

				return result;
			},
			async navigateToPost(postId) {
				postId = postId.replace('>>', '').replace('&gt;&gt;', '').replace(' (OP)', '');
				const post = document.getElementById('post-' + postId);

				// if post is not present on this page move to it's thread
				if (post === null) {
					const postThread = await this.lookupThread(postId);
					if (postThread !== false) {
						router.push({ name: 'thread', params: { threadId: postThread }, hash: '#post-' + postId });
						router.go({ name: 'thread', params: { threadId: postThread }, hash: '#post-' + postId });
						return;
					}
				}

				// ignore posts that weren't found (line-through links)
				if (post.classList.contains('notfound') === true) {
					return;
				}

				// if it's equal to thread ID or post is in current page, scroll to it
				if (postId == router.currentRoute.params.threadId) {
					this.scrollToPost(postId);
					return;
				}
				this.scrollToPost(postId);
			},
			reply(postId) {
				const postForm = this.$parent.$refs.postForm;
				const postFormData = postForm.$data.form;

				postForm.opened = true;
				if (postFormData.content === '') {
					postFormData.content += '>>' + postId + '\n';
				} else {
					postFormData.content += '\n>>' + postId;
				}
			}
		}
	};
</script>

