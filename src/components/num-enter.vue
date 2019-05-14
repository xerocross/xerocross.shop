<template>
    <div class="num-enter">
        <input 
            v-model = "numberString" 
            type="text" 
            class="num form-control num-enter-view">
        <div class = "num-row">
            <div class="num-item num-button">
                <span 
                    class="btn btn-secondary btn-7" 
                    @click = "pushNumber(7)">
                    7
                </span>
            </div>
            <div class="num-item num-button">
                <span 
                    class="btn btn-secondary btn-8" 
                    @click = "pushNumber(8)">8
                </span>
            </div>
            <div class="num-item num-button"><span 
                class="btn btn-secondary btn-9" 
                @click = "pushNumber(9)">9</span></div>
        </div>
        <div class = "num-row">
            <div class="num-item num-button"><span 
                class="btn btn-secondary btn-4" 
                @click = "pushNumber(4)">4</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-secondary btn-5" 
                @click = "pushNumber(5)">5</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-secondary btn-6" 
                @click = "pushNumber(6)">6</span></div>
        </div>
        <div class = "num-row">
            <div class="num-item num-button"><span 
                class="btn btn-secondary btn-1" 
                @click = "pushNumber(1)">1</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-secondary btn-2" 
                @click = "pushNumber(2)">2</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-secondary btn-3" 
                @click = "pushNumber(3)">3</span></div>
        </div>
        <div class = "num-row">
            <div class="num-item num-button"><span 
                class="btn btn-secondary btn-0" 
                @click = "pushNumber(0)">0</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-secondary btn-dec" 
                @click = "addDecimal">.</span></div>
            <div class="num-item num-button"><span 
                class="btn btn-secondary btn-c" 
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
        margin-right: 3px;
        margin-left: 3px;
        &:first-child {
            margin-left: 0px;
        }
        &:last-child {
            margin-right: 0px;
        }
    }
    .btn.btn-secondary {
        width: 100%;
        padding-left: 1em;
        padding-right: 1em;
        font-size: 20pt;
        font-weight: bold;
        margin-top: 1px;
        margin-right: 10px;
        border-style: solid;
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