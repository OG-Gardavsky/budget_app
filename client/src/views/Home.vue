<template>
    <div>

        <div class="home">
            <Header />
            <h2 v-if="displayH2">Welcome to budget app, {{userInfo.name}}</h2>
        </div>

        <div id="accounts">
            <span :key="account.accountId" v-for="account in accountsBalance" @click="showTransactionsOfSpecificAccount(account)">
                <p>{{account.accountName}}</p>
                <p >{{account.balance}} {{account.currency}}</p>
            </span>

            <md-button class="md-button md-primary" @click="showAddAccount">add <br/> account</md-button>
            <add-account :show-add-account-dialog="showAddAccountDialog" @on-closeModal="closeAddAccount" @on-save="refresh" />

        </div>



        <md-button class="md-raised md-primary" @click="refresh">Refresh</md-button>
        <md-button class="md-raised md-primary" @click="showAddTranscaction">Add transaction</md-button>


        <add-transaction :show-add-transaction-dialog="showAddTransactionDialog" @on-closeModal="closeAddTransaction" @on-save="refresh"  />

        <div id="transactions">
            <div :key="transaction._id" v-for="transaction in transactions" @click="displayCustomError('clickls na to')">
                <p> {{transaction.name}} - {{transaction.subtype}} : {{transaction.amount}} {{transaction.currency}} </p>
                <md-button class="md-raised" @click="deleteTransaction(transaction)">del</md-button>
            </div>
        </div>


        <CustomMenu />

    </div>

</template>

<script>
// @ is an alias to /src
import router from "@/router";
import Header from "@/components/Header";
import CustomButton from "@/components/customButton";
import AddTransaction from "@/components/AddTransaction";
import LoadingSpinner from "@/components/loadingSpinner";
import CustomMenu from "@/components/CustomMenu";
import AddAccount from "@/components/AddAccount";


export default {
    name: 'Home',
    components: {
        AddAccount,
        CustomMenu,
        LoadingSpinner,
        AddTransaction,
        CustomButton,
        Header,
    },
    data() {
        return {
            accountsBalance: [],
            transactions: [],
            userInfo: {},
            displayH2: true,
            showAddTransactionDialog: false,
            showAddAccountDialog: false,
        }
    },
    methods: {
        showAddTranscaction(){
            this.showAddTransactionDialog = true;
        },
        closeAddTransaction(){
            this.showAddTransactionDialog = false;
        },
        showAddAccount(){
            this.showAddAccountDialog = true;
        },
        closeAddAccount(){
            this.showAddAccountDialog = false;
        },
        async showTransactionsOfSpecificAccount(account) {
            const res = await fetch('api/accounts/id:' + account.accountId.toString() + '/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.transactions = [];
            this.transactions = await res.json();
        },
        async deleteTransaction(transaction){

            const answer = window.confirm('Are you sure you want to delete transation with name ' + transaction.name);

            if (!answer) {
                return;
            }

            const res = await fetch('api/transactions/id:' + transaction._id, {
                method: 'Delete',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });

            await this.refresh()
        },
        async refresh (){
            this.displayH2 = false;
            const result = await this.checkCredentials();
            if (result !== 0){
                return;
            }
            this.displayFinancialInfo();
        },
        displayFinancialInfo(){
            this.showTransactionsOfAllAccounts();
            this.showBalanceOfAccounts();
        },
        async showBalanceOfAccounts() {
            const res = await fetch('api/accounts/balance', {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.accountsBalance = await res.json();
        },
        async showTransactionsOfAllAccounts() {
            const res = await fetch('api/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.transactions = await res.json();
        }
    },
    created() {
        this.checkCredentials();
        this.displayFinancialInfo();
    },

}
</script>

<style lang="scss">



#accounts {

    max-width: 60%;
    margin: 20px auto;
    overflow: scroll;
    //background-color: #6c6c6c;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    //align-items: ;

    @media screen and (max-width: 560px) {
        max-width: 100%;
    }

    span {
        min-width: 90px;
        max-width: 130px;
        margin: 10px;
        border: 1px solid black;
        padding: 0px 10px;
        flex-direction: column;
    }

}

#transactions {
    align-items: center;
    max-width: 60%;
    margin: 0px auto;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }

    >div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 10px;
        border: 1px solid black;
        flex-direction: column;
    }

}
</style>
