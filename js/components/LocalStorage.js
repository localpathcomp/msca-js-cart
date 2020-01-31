/** Class for Local Storage data assignment. */

export default class LocalStorage {

    /**
     * Convert data into a string.
     * @param {string} key - The string identifier for item in browser local storage.
     * @param {any} data object/array/string.
     */
    static set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Convert data into a string.
     * @param {string} key - The string identifier for item in browser local storage.
     * @return {any} data object/array/string.
     */
    static get(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}