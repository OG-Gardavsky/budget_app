<template>
    <div>
        <Header />


        <md-card id="totalBalanceCard" v-if="selectedAccount === null">
            <md-content>
                <md-card-header>
                    <div class="md-title">Total debts: <span v-if="totalDebtsSum !== null">{{totalDebtsSum}}</span> </div>
                </md-card-header>

            </md-content>
        </md-card>



        <md-card
            :key="account.accountId" v-for="account in accountsBalance"
            class="debtAccount" md-with-hover
            v-if="selectedAccount === null"
            @click="selectedAccount = account"
        >
            <md-content>

                <md-card-header>
                    <div class="md-title">
                        <span>{{account.name}}</span>
                        <span> <span v-if="account.balance > 0">+ </span> {{account.balance}} {{account.currency}}</span>
                    </div>
                </md-card-header>
            </md-content>
        </md-card>




        <div v-if="selectedAccount !== null">
            <md-card >
                <md-content >

                    <md-button class="md-icon-button  md-primary" md-menu-trigger >
                        <md-icon>arrow_back_ios</md-icon>
                    </md-button>

                </md-content>
            </md-card>

            <h1>je to tu</h1>
        </div>






        <CustomMenu  :refresh="refresh" />
    </div>
</template>

<script>
import Header from "@/components/Header";
import CustomMenu from "@/components/CustomMenu";
export default {
name: "Debts",
    components: {CustomMenu, Header},
    data() {
        return {
            accountsBalance: null,
            totalDebtsSum: null,
            selectedAccount: null
        }
    },
    methods: {
        async refresh() {
            this.accountsBalance = this.showBalanceOfAccounts('debt');
            this.totalDebtsSum = await this.getTotalBalanceByAccType('debt');
        },

    },
    created() {
        this.refresh();
    }
}
</script>

<style scoped lang="scss">

#totalBalanceCard {
    align-items: center;
    max-width: 60%;
    margin: 20px auto;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }
}

.debtAccount {
    align-items: center;
    max-width: 60%;
    margin: 5px auto;
    padding: 10px 0px;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }

    .md-title {
        display: flex;
        justify-content: space-between;
    }
}
</style>
