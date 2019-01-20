import {ShoppingTotal} from "./index.js";
import Vue from "vue";

new Vue({
    el : "#shopping-total",
    components : {
        ShoppingTotal
    },
    render : function (createElement) {
        return createElement(ShoppingTotal);
    }
});