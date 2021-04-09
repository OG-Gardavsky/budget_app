<template>
    <div>
        <Header />

        <h1>Stats</h1>

        <md-card >
            <md-content>
                <md-field >
                    <label>type</label>
                    <md-select v-model="transactionType" @change="getStatsByCategory" style="margin: 10px">
                        <md-option value="income">income</md-option>
                        <md-option value="expense">expense</md-option>
                    </md-select>
                </md-field>
            </md-content>
        </md-card>


        <md-card id="totalSum">
            <md-card-content>
                <div class="md-title" v-if="totalSum !== null">Total {{transactionType}}: {{totalSum}}</div>
            </md-card-content>
        </md-card>

        <md-card id="chartCard" style="margin-bottom: 150px">
            <mdb-doughnut-chart id="chart" v-if="doughnutChartData.labels !== null"
                                :data="doughnutChartData"
                                :options="doughnutChartOptions"
            ></mdb-doughnut-chart>
        </md-card>



        <CustomMenu />
    </div>
</template>

<script>
import Header from "@/components/Header";
import CustomMenu from "@/components/CustomMenu";
import { mdbDoughnutChart, mdbContainer } from "mdbvue";

export default {
    name: "Stats",
    components: {
        CustomMenu,
        Header,
        mdbDoughnutChart,
        mdbContainer
    },
    data() {
        return {
            transactionType: null,
            statDataByCategory: null,
            currentMonth : null,
            totalSum: null,

            doughnutChartData: {
                labels: null,
                datasets: [
                    {
                        data: null,
                        backgroundColor: [
                            "#F7464A",
                            "#46BFBD",
                            "#FDB45C",
                            "#949FB1",
                            "#4D5360"
                        ],
                        hoverBackgroundColor: [
                            "#FF5A5E",
                            "#5AD3D1",
                            "#FFC870",
                            "#A8B3C5",
                            "#616774"
                        ]
                    }
                ]
            },
            doughnutChartOptions: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    watch: {
        transactionType : function () {
            this.doughnutChartData.labels = null;
            this.doughnutChartData.datasets[0].data = null;

            this.getTotalSum();
            this.getStatsByCategory();
        }
    },
    methods: {
        async getStatsByCategory() {
            const res = await fetch('api/stats/type:' + this.transactionType + '?month=' + this.currentMonth, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
            });

            if (res.status !== 200) {
                return this.displayCustomError('Error during loading statistics');
            }

            const data = await res.json();
            this.statDataByCategory = data;

            this.doughnutChartData.labels = data.map(category => category.categoryName);
            this.doughnutChartData.datasets[0].data = data.map(category => category.sum);
        },
        async getTotalSum() {
            const res = await fetch('api/stats/total/type:' + this.transactionType + '?month=' + this.currentMonth, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
            });

            if (res.status !== 200) {
                return this.displayCustomError('Error during loading statistics');
            }

            const sumObject = await res.json();
            this.totalSum = sumObject[0].sum;
        }
    },
    async created() {
        await this.checkCredentials();

        this.currentMonth = new Date().getMonth() + 1;
        this.transactionType = 'expense';

        // await this.getStatsByCategory();
        //
        // console.log(this.doughnutChartData.labels)

        // this.doughnutChartData.labels = this.statDataByCategory.map(category => category.categoryName);
        // console.log(this.doughnutChartData.labels)
        //
        // this.doughnutChartData.datasets.data = this.statDataByCategory.map(category => category.sum);


    }
}
</script>

<style scoped lang="scss">
.md-card{
    margin: 10px;
    max-width: 60%;
    margin: 10px auto;

    @media screen and (max-width: 560px) {
        max-width: 95%;
    }
}

#chart {
    padding: 10px;
}

#transactionType {
    padding: 0px 20px;
}
</style>
