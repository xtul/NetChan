export const boilerplate = {
	methods: {
		isDevelopment() {
			if (process.env.NODE_ENV !== 'production' &&
				process.env.NODE_ENV !== 'test' &&
				typeof console !== 'undefined'
			) {
				return true;
			}
			return false;
		},
		getAPIUrl() {
			if (this.isDevelopment()) {
				return 'http://localhost:5934/api/';
			} else {
				return location.origin.substring(0, location.origin.length - 6) + '/api/';
			}
		},
	}
};
