<template>
    <div class="shopping-total">
        <div>
            <form 
                class = "add-item-form" 
                @submit.prevent = "addNewItem">
                <label>
                    Name/Description
                </label>

                <input 
                    v-model = "newItemName"
                    type = "text"
                    class = "form-control new-item-name"
                    name = "name"
                />
                <label>Quantity</label>
                <select 
                    v-model = "newItemQuantity" 
                    class="form-control new-item-quantity">
                    <option 
                        v-for = "i in [1,2,3,4,5,6,7,8,9,10]" 
                        :key = "i" 
                        :value = "i"
                    >
                        {{ i }}
                    </option>
                </select>
                <label>
                    Price Per Each
                </label>
                <num-enter 
                    :num-accepted = "numAccepted"
                    class = "num-enter"
                    @event_number = "updateNum"/>
                
                <div class="button-group">
                    <input 
                        :disabled = "!isInputValid"
                        type = "submit"
                        class = "btn btn-primary submit-button"
                        value = "add" />
                </div>
            </form>
        </div>
        <div class="total">Total (before tax): <span 
            ref = "total-num" 
            class="total-num">{{ runningTotal }}</span>
        </div>
        <div class="item-list-outer panel panel-primary">
            <div class="panel-heading">Shopping Cart</div>
            <div class="panel-body">
                <ul class="list-group item-display-list">
                    <li 
                        v-for = "item in itemsArray"
                        :key = "item.key"
                        class="list-group-item item-display"
                    >

                        <div 
                            :class = "item.isCounted ? '' : 'preview-without'"
                            class="item-name"
                        >
                            <span class="item-name-text">{{ item.name }}</span><br> 
                            <span class="item-price-per-each">{{ item.price.toFixed(2) }}</span>
                            <span>&times;</span>
                            <span>
                                <select 
                                    v-model = "item.quantity"
                                    class="form-control item-quantity-view"
                                    style = "display: inline"
                                >
                                    <option 
                                        v-for = "i in [1,2,3,4,5,6,7,8,9,10]" 
                                        :key = "i" 
                                        :value = "i"
                                    >
                                        {{ i }}
                                    </option>
                                </select>
                            </span>
                        </div>
                        
                        <div 
                            :class = "item.isCounted ? '' : 'preview-without'"
                            class="item-price item-price-total"
                        >
                            {{ (item.price*item.quantity).toFixed(2) }}
                        </div>
                        <div class="end">
                            <button 
                                :class = "item.isCounted ? 'btn-info' : 'btn-success'"
                                class="btn maybe-not-button"
                                @click = "togglePreviewWithout(item.key)">
                                {{ item.isCounted ? "maybe not?" : "keep" }}
                            </button>
                            <button 
                                v-show = "!item.isCounted"
                                class="btn btn-danger remove-button"
                                @click = "removeItem(item.key)">
                                X
                            </button>
                        </div>

                    </li>
                </ul>
            </div>
        </div>
        <div>
            <h2>Backup and Recovery</h2>
            <a 
                ref = "download" 
                class="btn btn-default">
                download backup
            </a>
            <a 
                class="btn btn-default" 
                @click.prevent = "clickUpload">upload from backup</a>
            <input 
                ref = "fileInput"
                style = "display:none"
                type="file"
                name = "model" 
                @change = "startRead"
            />
        </div>
    </div>
</template>
<script>
import {sum} from "../helpers/sum.js";
import { StoreLocal } from "cross-js-base"
import NumEnter from "./num-enter.vue";

export default {
    components : {
        NumEnter
    },
    data () {
        return {
            listItems : {},
            newItemName : "",
            newItemPrice : "",
            storeLocal : {},
            numAccepted : 0,
            newItemQuantity : 1
        }
    },
    computed : {
        itemsArray () {
            let keys = Object.keys(this.listItems);
            let arr = [];
            for (let i = 0; i < keys.length; i++) {
                if (this.listItems[keys[i]]) {
                    arr.push(this.listItems[keys[i]]);
                }
            }
            return arr;
        },
        isPriceValid () {
            let reg = /^[0-9]+(\.[0-9]+)?$/
            return reg.test(this.newItemPrice);
        },
        isItemNameValid () {
            return this.newItemName.length > 0;
        },
        isInputValid () {
            return this.isPriceValid && this.isItemNameValid;
        },
        runningTotal () {
            return sum(this.itemsArray.map(function(item) {
                return item.isCounted ? item.price*item.quantity : 0;
            })).toFixed(2);
        }
    },
    watch : {
        runningTotal () {
            let self = this;
            this.$refs["total-num"].style.backgroundColor = "yellow";
            setTimeout(function(){
                self.$refs["total-num"].style.backgroundColor = "transparent";
            },2000);
        },

    },
    mounted () {
        this.storeLocal = StoreLocal.build("shopping-total");
        this.buildFromStorage();
    },
    methods : {
        updateNum (newNum) {
            this.newItemPrice = newNum;
        },
        clickUpload () {
            this.$refs.fileInput.click();
        },
        startRead (evt) {
            var file = this.$refs.fileInput.files[0];
            if (file) {
                this.getAsText(file);
            }
            evt.stopPropagation();
            evt.preventDefault();
        },
        getAsText(readFile) {
            var reader = new FileReader();
            reader.readAsText(readFile, "UTF-8");
            reader.onload = this.loaded;
        },
        loaded(evt) {
            let self = this;
            var fileString = evt.target.result;
            setTimeout(function(){
                self.uploadFromBackup(fileString);
            },0);
        },
        uploadFromBackup (fileString) {
            try {
                let dataArray = JSON.parse(fileString);
                for (let i = 0; i < dataArray.length; i++) {
                    let item = dataArray[i];
                    if (this.listItems[item.key] == undefined) {
                        this.addItemFromBackup({
                            key : item.key,
                            name : item.name,
                            price : item.price,
                            quantity : item.quantity,
                            isCounted : true
                        });
                    }
                }
                let ctrl = this.$refs.fileInput;
                try {
                    ctrl.value = null;
                } catch(ex) {
                    //do nothing
                }
                if (ctrl.value) {
                    ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
                }
            }
            catch (e) {
                alert(`Could not parse the file.  We can only accept files 
                formatted exactly as backup files generated from this app.`);
            }
        },
        updateDownload () {
            let filename = "myShoppingList.txt";
            let text = this.exportData();
            let downloadButton = this.$refs.download;
            downloadButton.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            downloadButton.setAttribute('download', filename);
        },
        exportData () {
            let items = this.itemsArray;
            let cleanJsonData = [];
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                cleanJsonData.push({
                    key : item.key,
                    name : item.name,
                    price : item.price,
                    quantity : item.quantity
                });
            }
            return JSON.stringify(cleanJsonData);
        },
        addItemFromBackup (item) {
            this.$set(this.listItems, item.key, item);
            this.storeLocal.addItem(item.key, JSON.stringify(item));
            this.numAccepted++;
            this.updateDownload();
        },
        addNewItem () {
            let newItem = {
                key : performance.now() + this.newItemName,
                name : this.newItemName,
                price : parseFloat(this.newItemPrice),
                quantity : this.newItemQuantity,
                isCounted : true
            }
            this.$set(this.listItems, newItem.key, newItem);
            this.storeLocal.addItem(newItem.key, JSON.stringify(newItem));
            this.numAccepted++;
            this.clear();
            this.updateDownload();
        },
        clear () {
            this.newItemName = "";
            this.newItemPrice = "";
            this.newItemQuantity = 1;
        },
        removeItem (key) {
            this.$delete(this.listItems, key);
            this.storeLocal.removeItem(key);
            this.updateDownload();
        },
        togglePreviewWithout (key) {
            this.listItems[key].isCounted = !this.listItems[key].isCounted;
        },
        buildFromStorage () {
            let list = this.storeLocal.getAll();
            for (let i = 0; i < list.length; i++) {
                try {
                    let item = JSON.parse(list[i]);
                    if (item) {
                        if (!item.quantity) {
                            item.quantity = 1;
                        }
                        this.$set(this.listItems, item.key, item);
                    }
                } catch (e) {
                    // most likely problem was JSON.parse, 
                    // possibly because of corrupted data.
                }
            }
            this.updateDownload();
        },
        changeQuantity(key, qty) {
            this.listItems[key].quantity = qty;
            this.updateDownload();
        }
    }
}
</script>
<style lang = "scss">
.shopping-total {
    font-size: 16pt;
    padding-bottom:2em;
    h1 {
        text-align: center;
        font-size: 19pt;
    }
    select, textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"] { font-size: 16px; }
    .panel-body {
        padding : 0px;
    }
    .list-group {
        margin: 0px;

    }
    .list-group-item {
        font-weight: bold;
        border-style: none;
        margin-left:0px;
        margin-right:0px;
    }
    .btn.btn-primary {
        margin-top:1em;
        padding:1em;
    }
    .btn {
        padding-left: 1em;
        padding-right: 1em;
    }
    .remove-button {
        vertical-align: center;
    }
    .item-display {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .total {
        text-align: center;
        font-weight: bold;
        
    }
    .item-name {
        width: 30%;
    }
    .preview-without {
        text-decoration : line-through;
    }
    .num-enter {
        width: 80%; 
        margin-left: auto; 
        margin-right: auto;
    }
    .total-num {
        background-color: transparent;
        transition: background-color 500ms;

    }
}
</style>