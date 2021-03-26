<template>
    <div>

        <md-menu md-direction="bottom-start">

            <md-button class="md-raised md-primary" @click="testMethod">statistics</md-button>
            <md-button class="md-raised md-primary md-active" @click="testMethod">invest</md-button>
            <md-button class="md-raised md-primary" @click="testMethod">add transaction</md-button>
            <md-button class="md-raised md-primary" @click="testMethod">categories</md-button>
            <md-button class="md-raised md-primary" @click="testMethod">debts</md-button>

        </md-menu>



    </div>
</template>

<script>
export default {
    name: "CustomMenu",
    methods: {
        testMethod(){
            this.displayCustomError('this will show something in future');
        }
    }
}
</script>

<style scoped>
    div {
        /*background-color: #9e9e9e;*/
        background-color: black;
        opacity: 100;
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1;
    }

    md-button {
        padding: 3px;
    }
</style>
