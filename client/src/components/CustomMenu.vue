<template>
    <div>

        <md-menu md-direction="bottom-start">

            <router-link :to="'home'">
                <md-button class="md-raised md-primary">home</md-button>
            </router-link>

            <router-link :to="'categories'">
                <md-button class="md-raised md-primary">categories</md-button>
            </router-link>





            <router-link>
                <md-button class="md-raised md-primary" @click="testMethod">statistics</md-button>
            </router-link>

            <router-link>
                <md-button class="md-raised md-primary md-active" @click="testMethod">invest</md-button>
            </router-link>

            <router-link>
                <md-button class="md-raised md-primary">add transaction</md-button>
            </router-link>

            <router-link>
                <md-button class="md-raised md-primary" @click="testMethod">debts</md-button>
            </router-link>

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
        background-color: #9e9e9e;
        /*background-color: black;*/
        opacity: 100;
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 100;
    }

    md-button {
        padding: 3px;
    }
</style>
