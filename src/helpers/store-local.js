let build = function (indexKey) {
    let storeLocal = {};
    let localIndex = [];

    storeLocal.addItem = function (key, value) {
        localStorage.setItem(key, value);
        localIndex.push(key);
        storeLocal.saveIndexToDisk();
    }
    storeLocal.getIndex = function() {
        let index = localStorage.getItem(indexKey);
        if (index == null || !index) {
            localStorage.setItem(indexKey, "[]");
            index = localStorage.getItem(indexKey);
        } 
        index = JSON.parse(index);
        localIndex = index;
        return index;
    }
    storeLocal.getAll = function() {
        storeLocal.getIndex();
        let allItems = [];
        for (let i = 0; i < localIndex.length; i++) {
            allItems.push(storeLocal.getItem(localIndex[i]))
        }
        return allItems;
    }
    storeLocal.removeItem = function(key) {
        localStorage.removeItem(key);
        let position = localIndex.indexOf(key);
        if (position > -1) {
            localIndex.splice(position, 1);
            storeLocal.saveIndexToDisk();
        }
    }
    storeLocal.getItem = function(key) {
        return localStorage.getItem(key);
    }
    storeLocal.saveIndexToDisk = function () {
        localStorage.setItem(indexKey, JSON.stringify(localIndex));
    }
    return storeLocal;
}

export default {
    build
}