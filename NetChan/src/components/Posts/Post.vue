a<template>
	<div>
		<div class="filename">
			<template v-if="post.image != null">
				<template v-if="$route.name !== 'thread'">
					<v-icon v-if="mode === 'op' && hidden === false" v-on:click="hideThread(post.id)" small dense>mdi-close-thick</v-icon>
					<v-icon v-if="mode === 'op' && hidden === true" v-on:click="hideThread(post.id)" small dense>mdi-hospital</v-icon>
					<span v-if="mode === 'op'">&nbsp;|&nbsp;</span>
				</template>
				<a v-if="hidden === false" target="_blank" rel="noopener noreferrer" :href="post.image" :title="getFilename(post.image)">{{ getFilename(post.image) | truncate(16) }}</a>
			</template>
			<template v-if="hidden === false && replies.length > 0">
				<template v-if="post.image != null"> | </template>
				<template v-if="replies != null">Replies: </template>
				<span v-for="(x, index) in replies" :key="x">
					<a v-on:mouseleave="linkLeave(x.toString())" v-on:mouseover="linkHover(x.toString())" v-on:click="navigateToPost(x.toString())">>>{{x}}</a>
					<template v-if="index < replies.length - 1">, </template>
				</span>
			</template>
		</div>
		<figure class="image" v-if="post.image != null && hidden === false">
			<img onerror="this.onerror=null; this.src='/img/notfound.png'" v-if="post.spoilerImage === true" v-on:click="function(e){openImage(e, '/img/spoiler.png', post.image)}" :id="'img-' + post.id" src="/img/spoiler.png">
			<img onerror="this.onerror=null; this.src='/img/notfound.png'" v-else :id="'img-' + post.id" v-on:click="function(e){openImage(e, getThumbnailUri(post.image), post.image)}" :src="getThumbnailUri(post.image)">
		</figure>
		<div class="text">
			<p class="heading">
				<span v-if="post.thread === post.id || post.thread == null" class="subject">
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
					<v-icon v-if="post.sticky" title="Sticky" small dense>mdi-pin</v-icon>
					<v-icon v-if="isPastLimits" title="Past board limits" small dense>mdi-lock</v-icon>
					<v-icon v-if="post.archived" title="Archived" small dense>mdi-archive</v-icon>
					<v-icon v-on:click="openReportForm(post.id)" title="Report this post" small dense>mdi-exclamation-thick</v-icon>
				</span>
			</p>
			<span class="content">
				<div class="content" v-for="(line, index) in cleanup(post.content)" :key="index">
					<template v-if="line.includes('>>')">
						<span v-for="(x, index) in regexReply(line)" :key="index">
							<a v-if="x.startsWith('>>>')" class="reply" v-on:click="navigateToBoard(x)">
								{{x}}
							</a>
							<a v-else-if="x.startsWith('>>')" class="reply" v-on:mouseleave="linkLeave(x)" v-on:mouseover="linkHover(x)" v-on:click="navigateToPost(x)">
								{{x}}
							</a>

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
				</div>
			</span>
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
		mixins: [ postFinder ],
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
				if (shortenedText.length < fileName.length) {
					shortenedText += '(...)';
				}

				shortenedText += ext;

				return shortenedText;
        	}
		},
		computed: {
			isPastLimits() {
				if (this.$parent.threadData != null) {
					if (this.$parent.threadData.data.pastLimits != 0) {
						return true;
					} else {
						return false
					}
				} else {
					return false;
				}
			}
		},
		methods: {
			openReportForm(id) {
				const url = '/' + this.board + '/report?id=' + id;
				const windowName = '/' + this.board + '/ - Report post'
				const shit = window.open(url, windowName, "height=470,width=340");
			},
			prettyDate: (date) => {
				const providedDate = moment.utc(date);
				const formattedDate = moment(providedDate).local();
				return formattedDate.format('D/M/YYYY (ddd) HH:mm:ss') + ' (' + moment(formattedDate).fromNow() + ')';
			},
			cleanup: (str) => {
				return str.replace(/(\r\n|\r|\n){2,}/g, '$1\n').split('\n');
			},
			getThumbnailUri: (uri) => {
				if (uri == null) {
					return '';
				}

				const splitUri = uri.split('.');
				splitUri[splitUri.length - 2] += 's';
				splitUri[splitUri.length - 1] = 'jpg';
				return splitUri.join('.');
			},
			openImage: (event, thumbUrl, fullUrl) => {
				const img = event.target;
				if (img.src.includes('img/notfound.png')) {
					return;
				}

				let cleanImgSrc = img.src.replace(window.location.origin, '').replaceAll('/', '\\');
				if (cleanImgSrc === fullUrl) {
					img.src = thumbUrl;
				} else {
					img.src = fullUrl;
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

				// create unique data entries (so only one preview opens instead of all of them)

				// add this reply to the post in question ('replies' data member)
				const postInQuestion = result.find(x => x.startsWith('>>'));
				this.addReplies(postInQuestion.replace( /\D+/g, ''), this.post.id);

				// return an array 
				return result;
			},			
			isInViewport(element) {
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
			async linkHover(id) {
				id = id.replace( /\D+/g, '');
				const desiredPost = document.getElementById('post-' + id);

				if (desiredPost == null) {
					return; // it's probably external link
				}

				if (this.isInViewport(desiredPost) && desiredPost.classList.contains('op') === false) {
					desiredPost.classList.add('highlighted');
				}
			},
			linkLeave(id) {
				id = id.replace( /\D+/g, '');
				this.removeHighlights(id);
			},
			scrollToPost(id) {
				id = id.replace( /\D+/g, '');
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
			async lookupThread(postId, board = null) {
				if (board == null) {
					board = this.board;
				}
				console.log(postId);
				console.log(board);
				const result = await axios
					.get(this.$getAPIUrl() + board + '/post/' + postId + '/thread')
					.then((response) => {
						return response.data.threadId;
					})
					.catch(() => {
						return false;
					});

				return result;
			},
			async navigateToPost(postId) {
				postId = postId.replace( /\D+/g, '');
				const post = document.getElementById('post-' + postId);

				// if post is not present on this page move to it's thread
				if (post === null) {
					const postThread = await this.lookupThread(postId);
					if (postThread !== false) {
						router.push({ name: 'thread', params: { threadId: postThread }, hash: '#post-' + postId });
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
			async navigateToBoard(postId) {
				const board = postId.replace( /\W+/g, '').replace( /\d+/g, '');
				var post = '0';
				try {
					post = /\d+/g.exec(postId).find(o => true);
				} catch {}
				
				if (post !== '0') {
					const postThread = await this.lookupThread(post, board);
					if (postThread !== false) {
						router.push({ name: 'thread', params: { board: board, threadId: postThread }, hash: '#post-' + post });
						return;
					}
				} else {
					router.push({ name: 'board', params: { board: board } });
				}
			},
			getFilename(path) {
				var pathSplit = path.split('\\');
				// windows splits path differently than linux
				if (pathSplit.length === 1) {
					pathSplit = path.split('/');
				}
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

				// if thread wasn't hidden automatically, ignore localStorage
				if (autoHide) {
					return;
				}

				// remember hidden threads between visits
				this.$updateLocalStorageJson(this.board + '_hiddenThreads', threadId);
			},
		}
	};
</script>

