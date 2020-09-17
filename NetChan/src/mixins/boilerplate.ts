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
		sleep(ms: number) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
		updateLocalStorageJson(key: string, newItem: any) {
			var oldArray: Array<any> = JSON.parse(localStorage.getItem(key) || '[]');

			// if the key is present
			if (oldArray != null) {
				// if this item is already present in json, remove it
				if (oldArray.includes(newItem)) {
					oldArray = oldArray.filter(x => x !== newItem);
					localStorage.setItem(key, JSON.stringify(oldArray));
					return;
				}
				// otherwise just add it
				oldArray.push(newItem);
				localStorage.setItem(key, JSON.stringify(oldArray));
			// otherwise create new key with provided item
			} else {
				const newArray: Array<any> = [newItem];
				localStorage.setItem(key, JSON.stringify(newArray));
			}
		}
	}
};
