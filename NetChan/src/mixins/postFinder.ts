import axios from 'axios';

export const postFinder = {
	methods: {
		async postExists(postId: number, board: string): Promise<boolean> {
			const url = 'http://localhost:5934/api/' + board + '/post/' + postId;

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
