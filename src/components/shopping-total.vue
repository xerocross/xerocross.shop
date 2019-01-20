<template>
    <div class="shopping-total">
        <div>
            <form @submit.prevent = "addNewItem">
                <label>
                    Name/Description
                </label>

                <input 
                    v-model = "newItemName"
                    type = "text"
                    class = "form-control"
                    name = "name"
                />
                <label>Quantity</label>
                <select 
                    v-model = "newItemQuantity" 
                    class="form-control">
                    <option 
                        v-for = "i in [1,2,3,4,5,6,7,8,9,10]" 
                        :key = "i" 
                        :value = "i"
                    >
                        {{ i }}
                    </option>
                </select>
                <label>
                    Price
                </label>
                <num-enter 
                    :num-accepted = "numAccepted"
                    class = "num-enter"
                    @event_number = "updateNum"/>
                
                <div class="button-group">
                    <input 
                        :disabled = "!isInputValid"
                        type = "submit"
                        class = "btn btn-primary"
                        value = "add" />
                </div>
            </form>
        </div>
        <div class="total">Total (before tax): <span 
            ref = "total-num" 
            class="total-num">{{ runningTotal }}</span></div>
        <div class="item-list-outer panel panel-primary">
            <div class="panel-heading">Stuff in Cart</div>
            <div class="panel-body">
                <ul class="list-group">
                    <li 
                        v-for = "item in itemsArray"
                        :key = "item.key"
                        class="list-group-item item-display"
                    >

                        <div 
                            :class = "item.isCounted ? '' : 'preview-without'"
                            class="item-name"
                        >
                            {{ item.name }}<br> 
                            {{ item.price.toFixed(2) }}
                            <span>&times;</span>
                            <span>
                                <select 
                                    v-model = "item.quantity"
                                    class="form-control"
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
                            class="item-price"
                        >
                            {{ (item.price*item.quantity).toFixed(2) }}
                        </div>
                        <div class="end">
                            <button 
                                :class = "item.isCounted ? 'btn-info' : 'btn-success'"
                                class="btn"
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
            <a href="https://github.com/xerocross/xerocross.shop">https://github.com/xerocross/xerocross.shop</a>
        </div>
    </div>
</template>
<script>
import {sum} from "../helpers/sum.js";
import StoreLocal from "../helpers/store-local.js";
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
        }
    },
    mounted () {
        this.storeLocal = StoreLocal.build("shopping-total");
        this.buildFromStorage();
    },
    methods : {
        updateNum (newNum) {
            this.newItemPrice = newNum;
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
        },
        clear () {
            this.newItemName = "";
            this.newItemPrice = "";
            this.newItemQuantity = 1;
        },
        removeItem (key) {
            this.$delete(this.listItems, key);
            this.storeLocal.removeItem(key);
        },
        togglePreviewWithout (key) {
            this.listItems[key].isCounted = !this.listItems[key].isCounted;
        },
        buildFromStorage () {
            let list = this.storeLocal.getAll();
            for (let i = 0; i < list.length; i++) {
                let item = JSON.parse(list[i]);
                if (!item.quantity) {
                    item.quantity = 1;
                }
                this.$set(this.listItems, item.key, item);
            }
        },
        changeQuantity(key, qty) {
            this.listItems[key].quantity = qty;
        }
    }
}
</script>
<style lang = "scss">
.shopping-total {
    font-size: 16pt;
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