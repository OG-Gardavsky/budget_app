<template>
    <div>


        <!--        <md-bottom-bar md-sync-route>-->
        <!--            <md-bottom-bar-item to="home" exact md-label="Home" md-icon="home" />-->

        <!--            <md-bottom-bar-item to="" md-label="Categories" md-icon="category" />-->

        <!--            <md-bottom-bar-item to="categories" md-label="Stasts" md-icon="bar_chart" />-->

        <!--            <md-bottom-bar-item class="md-raised md-icon-button md-primary" md-icon="add" />-->



        <!--            <md-bottom-bar-item to="" md-label="debts" md-icon="compare_arrows" />-->

        <!--        </md-bottom-bar>-->



        <add-transaction :show-add-transaction-dialog="showAddTransactionDialog" @on-closeModal="closeAddTransaction" @on-save="refresh"  />

        <md-bottom-bar md-sync-route  >
            <md-bottom-bar-item to="home" exact md-label="Home" md-icon="home" />

            <md-bottom-bar-item to="blank" md-label="Stasts" md-icon="bar_chart" @click="displayCustomError('this will be added')" />

            <md-bottom-bar-item @click="showAddTranscaction" md-label="Transaction" class="md-raised md-primary" md-icon="add" />

            <md-bottom-bar-item to="more" md-label="more" md-icon="more_horiz" />


        </md-bottom-bar>




    </div>

</template>

<script>
import AddTransaction from "@/components/AddTransaction";
export default {
    name: "CustomMenu",
    components: {AddTransaction},
    props: {
        refresh: Object
    },
    data(){
        return{
            showAddTransactionDialog: false
        }
    },
    methods: {
        showAddTranscaction(){
            this.showAddTransactionDialog = true;
        },
        closeAddTransaction(){
            this.showAddTransactionDialog = false;
        },
    }
}
</script>

<style scoped>
    div {
        opacity: 100;
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 100;
    }
    md-bottom-bar{
       align-items: center;
    }
</style>
