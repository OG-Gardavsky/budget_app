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
        </div>

        <md-button class="md-raised md-primary" @click="refresh">Refresh</md-button>
        <md-button class="md-raised md-primary" @click="showAddTranscaction">Add transaction</md-button>


        <modal-window :show-dialog="showDialog" @on-closeModal="closeAddTransaction" @on-save="refresh"  />

        <div id="transactions">
            <div :key="transaction._id" v-for="transaction in transactions">
                <p> {{transaction.name}} - {{transaction.type}} : {{transaction.amount}} {{transaction.currency}} </p>
                <md-button class="md-primary" @click="deleteTransaction(transaction)">del</md-button>
            </div>
        </div>




    </div>

</template>

<script>
// @ is an alias to /src
import router from "@/router";
import Header from "@/components/Header";
import CustomButton from "@/components/customButton";
import ModalWindow from "@/components/AddTransaction";


export default {
    name: 'Home',
    components: {
        ModalWindow,
        CustomButton,
        Header,
    },
    data() {
        return {
            accountsBalance: [],
            transactions: [],
            userInfo: {},
            displayH2: true,
            showDialog: false
        }
    },
    methods: {
        showAddTranscaction(){
            this.showDialog = true;
        },
        closeAddTransaction(){
            this.showDialog = false;
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
        },
        async getUserInfo() {
            const res = await fetch('api/users', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.userInfo = await res.json();
        },
        async checkCredentials() {
            //code checks if user is authenticated - return 0 if everything is fine
            if (localStorage.getItem('userToken') === null) {
                alert('You are not authenticated, please logged in');
                return router.push('/');
            }
            await this.getUserInfo();
            if (this.userInfo.hasOwnProperty('error')) {
                localStorage.removeItem('userToken');
                alert('You are not authenticated, please logged in');
                return router.push('/');
            }
            return 0;
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
