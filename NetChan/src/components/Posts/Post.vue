<template>
	<div :id="''">
		<div class="filename">
			<template v-if="post.image != null">
				<template v-if="$route.name !== 'thread'">
					<a v-if="mode === 'op' && hidden === false" v-on:click="hideThread(post.id)">[x]&nbsp;</a>
					<a v-if="mode === 'op' && hidden === true" v-on:click="hideThread(post.id)">[+]&nbsp;</a>
				</template>
				<a v-if="hidden === false" target="_blank" rel="noopener noreferrer" :href="post.image">{{ getFilename(post.image) | truncate(32) }}</a>
			</template>
			<template v-if="hidden === false && replies.length > 0">
				<template v-if="post.image != null"> | </template>
				<span v-for="(x, index) in replies" :key="x">
					<a v-on:mouseleave="linkLeave(x.toString())" v-on:mouseover="linkHover(x.toString())" v-on:click="navigateToPost(x.toString())">>>{{x}}</a>
					<template v-if="index < replies.length - 1">, </template>
				</span>
			</template>
		</div>
		<figure class="image" v-if="post.image != null && hidden === false">
			<img onerror="this.onerror=null; this.src='/img/notfound.png'" v-if="post.spoilerImage === true" v-on:click="function(e){openImage(e, post.image)}" :id="'img-' + post.id" src="/img/spoiler.png">
			<img onerror="this.onerror=null; this.src='/img/notfound.png'" v-else :id="'img-' + post.id" v-on:click="openImage" :src="getThumbnailUri(post.image)">
		</figure>
		<div class="text">
			<p class="heading">
				<span v-if="post.thread == null" class="subject">
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
							<a v-if="x.startsWith('>>')" class="reply" v-on:mouseleave="linkLeave(x)" v-on:mouseover="linkHover(x)" v-on:click="navigateToPost(x)">{{x}}</a>
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
		data() {
			return {
				hidden: false,
				replies: []
			};
		},
        filters: {
        	truncate: function (text, length) {
				const textSplit = text.split('.');
				const fileName = textSplit.splice(0, textSplit.length - 1).join('.');
				const ext = '.' + textSplit[textSplit.length - 1];
				// shorten only the last 
				var shortenedText = fileName.substring(0, length);
				if (shortenedText.length !== text.length) {
					shortenedText += '(...)';
				}

				shortenedText += ext;

				return shortenedText;
        	}
    	},
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
					let cleanImgSrc = img.src.replace(window.location.origin, '').replaceAll('/', '\\');
					if (cleanImgSrc === spoilerUrl) {
						img.src = '/img/spoiler.png';
					} else {
						img.src = spoilerUrl;
					}
				}

				// stretch the image so everything appears on the bottom rather on the right
				img.classList.toggle('stretched-img');
			},
			addReplies(id, responderId) {
				const post = this.$parent.$refs['post-' + id];
				// ignore posts outside view
				if (post == undefined) {
					return;
				}

				// ignore duplicates
				if (post[0].replies.includes(responderId)) {
					return
				}

				post[0].replies.push(responderId);
			},
			regexReply(line) {
				// split the string by elements like ">>131", ">>235" and return the array
				const result = line.replace(/(>>\d+)/g, '<split>$1').replace(/(>>\d+)/g, '$1<split>').split(/<split>/);

				// add this reply to the post in question ('replies' data member)
				const postInQuestion = result.find(x => x.startsWith('>>'));
				this.addReplies(postInQuestion.replace('>>', ''), this.post.id);

				// return an array 
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
			removeHighlights(id = 0) {
				if (id === 0) {
					const highlighted = document.getElementsByClassName('highlighted');
					for (const x of highlighted) {
						x.classList.remove('highlighted');
					}
				} else {
					const post = document.getElementById('post-' + id);
					if (post != null) {
						post.classList.remove('highlighted');
					}
				}
			},
			linkHover(id) {
				id = id.replace('>>', '').replace('&gt;&gt;', '').replace(' (OP)', '');
				this.removeHighlights(id);
				const desiredPost = document.getElementById('post-' + id);

				if (desiredPost == null) {
					return; // it's probably external link
				}

				if (this.isInViewport(desiredPost) && desiredPost.classList.contains('op') === false) {
					desiredPost.classList.add('highlighted');
				} else {
					// display preview...
				}
			},
			linkLeave(id) {
				id = id.replace('>>', '').replace('&gt;&gt;', '').replace(' (OP)', '');
				this.removeHighlights(id);
			},
			scrollToPost(id) {
				id = id.replace('>>', '').replace('&gt;&gt;', '').replace(' (OP)', '');
				const desiredPost = document.getElementById('post-' + id);

				// clear all highlights
				this.removeHighlights();

				// highlight this post
				if (desiredPost.classList.contains('op') === false) {
					desiredPost.classList.add('highlighted');
				}

				// scroll to the post if it's out of view
				if (this.isInViewport(desiredPost) === false) {
					desiredPost.scrollIntoView();
				}

				// add hash at the end of link
				// window.location.hash = '#post-' + id;
				router.push({ hash: '#post-' + id });
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
			async navigateToPost(postId,) {
				postId = postId.replaceAll('>', '').replaceAll('&gt;', '').replaceAll(' (OP)', '');
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
			getFilename(path) {
				const pathSplit = path.split('\\');
				return pathSplit[pathSplit.length - 1]
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
			},
			hideThread(threadId, autoHide = false) {
				const thread = this.$parent.$refs['thread-'+threadId];
				const overlay = this.$parent.$refs['overlay-'+threadId];
				if (thread === undefined || overlay === undefined) {
					return;
				}

				// compress thread to ~100px and display an overlay
				thread[0].classList.toggle('hidden');
				if (overlay[0].style.gridArea === '1 / 1') {
					overlay[0].style.gridArea = null;
				} else {
					overlay[0].style.gridArea = '1 / 1';
				}

				this.hidden = !this.hidden;

				// remember hidden threads between visits
				var hiddenList = JSON.parse(localStorage.getItem('hiddenThreads'));

				// if thread wasn't hidden automatically, ignore localStorage
				if (autoHide) {
					return;
				}

				// if the list is present
				if (hiddenList != null) {
					// if this thread is already present on the list, remove it
					if (hiddenList.includes(threadId)) {
						hiddenList = hiddenList.filter(x => x !== threadId);
						localStorage.setItem('hiddenThreads', JSON.stringify(hiddenList));
						return;
					}
					// otherwise just add it
					hiddenList.push(threadId);
					localStorage.setItem('hiddenThreads', JSON.stringify(hiddenList));
				// otherwise create new list
				} else {
					const newList = [threadId]
					localStorage.setItem('hiddenThreads', JSON.stringify(newList));
				}
			}
		}
	};
</script>

