export const boilerplate = {
	methods: {
		$isDevelopment() {
			if (process.env.NODE_ENV !== 'production' &&
				process.env.NODE_ENV !== 'test' &&
				typeof console !== 'undefined'
			) {
				return true;
			}
			return false;
		},
		$getAPIUrl() {
			if (this.$isDevelopment()) {
				return 'http://localhost:5934/api/';
			} else {
				return location.origin + '/api/';
			}
		},
		$sleep(ms: number) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
		$updateLocalStorageJson(key: string, newItem: any, keepIfExists: boolean = false) {
			var oldArray: Array<any> = JSON.parse(localStorage.getItem(key) || '[]');

			// if the key is present
			if (oldArray != null) {
				// if this item already exists...
				if (oldArray.includes(newItem)) {
					// don't remove it if we're told so
					if (keepIfExists === true) {
						return;
					}
					// otherwise remove this key
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
		},
		$getElementInsideElement(baseElement: any, wantedElementName: any): any {
			var elementToReturn;
			for (var i = 0; i < baseElement.childNodes.length; i++) {
				elementToReturn = baseElement.childNodes[i];
				if (elementToReturn.name == wantedElementName) {
					return elementToReturn;
				} else {
					return this.$getElementInsideElement(elementToReturn, wantedElementName);
				}
			}
		}
	}
};
