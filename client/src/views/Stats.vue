<template>
    <div>
        <Header />

        <h1>stats</h1>

        <div id="transactionType">
            <md-field >
                <label>type</label>
                <md-select v-model="transactionType" @change="showStats">
                    <md-option value="income">income</md-option>
                    <md-option value="expense">expense</md-option>
                </md-select>
            </md-field>
        </div>

        <div  v-for="category in statData" >
            {{category.categoryName}} {{category.sum}}
        </div>



        <CustomMenu />
    </div>
</template>

<script>
import Header from "@/components/Header";
import CustomMenu from "@/components/CustomMenu";
export default {
    name: "Stats",
    components: {CustomMenu, Header},
    data() {
        return {
            transactionType: null,
            statData: null,
            currentMonth : null
        }
    },
    watch: {
        transactionType : function () {
            this.showStats();
        }
    },
    methods: {
        async showStats() {
            const res = await fetch('api/stats/type:' + this.transactionType + '?month=' + this.currentMonth, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
            });

            if (res.status !== 200) {
                return this.displayCustomError('Error during loading statistics');
            }

            this.statData = await res.json();
        }
    },
    async created() {
        this.currentMonth = new Date().getMonth() + 1;
        this.transactionType = 'expense';
    }
}
</script>

<style scoped>
    #transactionType {
        padding: 0px 20px;
    }
</style>
