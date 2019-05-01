<template>
    <div class="num-enter">
        <input 
            v-model = "numberString" 
            type="text" 
            class="num form-control">
        <div class = "num-row">
            <div class="num-item num-button">
                <span 
                    class="btn btn-default" 
                    @click = "pushNumber(7)">
                    7
                </span>
            </div>
            <div class="num-item num-button">
                <span 
                    class="btn btn-default" 
                    @click = "pushNumber(8)">8

                </span>
            </div>
            <div class="num-item num-button"><span 
                class="btn btn-default" 
                @click = "pushNumber(9)">9</span></div>
        </div>
        <div class = "num-row">
            <div class="num-item num-button"><span 
                class="btn btn-default" 
                @click = "pushNumber(4)">4</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-default" 
                @click = "pushNumber(5)">5</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-default" 
                @click = "pushNumber(4)">6</span></div>
        </div>
        <div class = "num-row">
            <div class="num-item num-button"><span 
                class="btn btn-default" 
                @click = "pushNumber(1)">1</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-default" 
                @click = "pushNumber(2)">2</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-default" 
                @click = "pushNumber(3)">3</span></div>
        </div>
        <div class = "num-row">
            <div class="num-item num-button"><span 
                class="btn btn-default" 
                @click = "pushNumber(0)">0</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-default" 
                @click = "addDecimal">.</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-default" 
                @click = "clear">C</span></div>
        </div>
    </div>
</template>
<script>
export default {
    props : {
        numAccepted : {
            type : Number,
            default : 0
        }
    },
    data () {
        return {
            numberString : "",
            isDecimal : false
        }
    },
    watch : {
        numberString () {
            this.$emit("event_number", this.numberString);
        },
        numAccepted () {
            this.clear();
        }
    },
    methods : {
        pushNumber (num) {
            this.numberString+= num;
        },
        clear () {
            this.numberString = "";
            this.isDecimal = false;
        },
        addDecimal () {
            if (!this.isDecimal) {
                this.numberString+= ".";
                this.isDecimal = true;
            }
        }
    },
}
</script>
<style lang="scss">
.num-enter {
    font-size: 14pt;
    font-weight: bold;
    min-width: 5em;
    .num-button {
        text-align: center;
    }
    .btn.btn-default {
        width: 100%;
        padding-left: 1em;
        padding-right: 1em;
        font-size: 20pt;
        font-weight: bold;
    }
    .num-row {
        display: flex;
        justify-content: space-between;
    }
    .num-item {
        flex-grow: 1;
        width: 2em;
    }
    .num {
        width: 100%;
        text-align: right;
        font-family: monospace, monospace;
        background-color : rgb(219, 219, 219);
        border-style: solid;
        border-width: 1px;
        border-color: darkgray;
    }
}
</style>