import {ShoppingTotal} from "./index.js";
import Vue from "vue";


Vue.config.errorHandler = function (err, vm, info)  {
    console.log('[Global Error Handler]: Error in ' + info + ': ' + err);
    console.log(err);
    console.log(vm);
    console.log(info);
};

new Vue({
    el : "#shopping-total",
    components : {
        ShoppingTotal
    },
    render : function (createElement) {
        return createElement(ShoppingTotal);
    }
});