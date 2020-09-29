"use strict";
exports.__esModule = true;
exports.boilerplate = void 0;
exports.boilerplate = {
    methods: {
        $isDevelopment: function () {
            if (process.env.NODE_ENV !== 'production' &&
                process.env.NODE_ENV !== 'test' &&
                typeof console !== 'undefined') {
                return true;
            }
            return false;
        },
        $getAPIUrl: function () {
            if (this.$isDevelopment()) {
                return 'http://localhost:5934/api/';
            }
            else {
                return location.origin.substring(0, location.origin.length - 6) + '/api/';
            }
        },
        $sleep: function (ms) {
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        },
        $updateLocalStorageJson: function (key, newItem, keepIfExists) {
            if (keepIfExists === void 0) { keepIfExists = false; }
            var oldArray = JSON.parse(localStorage.getItem(key) || '[]');
            // if the key is present
            if (oldArray != null) {
                // if this item already exists...
                if (oldArray.includes(newItem)) {
                    // don't remove it if we're told so
                    if (keepIfExists === true) {
                        return;
                    }
                    // otherwise remove this key
                    oldArray = oldArray.filter(function (x) { return x !== newItem; });
                    localStorage.setItem(key, JSON.stringify(oldArray));
                    return;
                }
                // otherwise just add it
                oldArray.push(newItem);
                localStorage.setItem(key, JSON.stringify(oldArray));
                // otherwise create new key with provided item
            }
            else {
                var newArray = [newItem];
                localStorage.setItem(key, JSON.stringify(newArray));
            }
        }
    }
};
