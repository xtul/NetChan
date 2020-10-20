import axios from 'axios';

export const postFinder = {
	methods: {
		async postExists(postId: any, board: string): Promise<boolean> {
			postId = postId.replaceAll('>', '').replaceAll('&gt;', '').replaceAll(' (OP)', '');
			// @ts-ignore
			const url = this.$getAPIUrl() + board + '/post/' + postId;

			const result = await axios
				.get(url)
				.then(() => {
					return true;
				})
				.catch(() => {
					return false;
				});

			return result;
		},
		findOpClass(array: DOMTokenList): boolean {
			if (array.length !== 0) {
				for (const x of array) {
					if (x === 'op') {
						return true;
					}
				}
			}

			return false;
		},
		isOp(postId: string): boolean {
			const postInQuestion = document.getElementById('post-' + postId);
			if (postInQuestion == null) {
				return false;
			}
			const op = this.findOpClass(postInQuestion.classList);
			if (op == true) { // ie. is a thread
				return true;
			}
			return false;
		}
	}
};
