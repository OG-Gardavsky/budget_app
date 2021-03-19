<template>
    <div>
        <div class="home">
            <Header />
            <h2 v-if="displayH2">Welcome to budget app, {{userInfo.name}}</h2>
        </div>

        <div id="accounts">
        <span :key="account.accountId" v-for="account in accountsBalance">
            <p>{{account.accountName}}</p>
            <p>{{account.balance}} {{account.currency}}</p>
        </span>

        </div>
        <custom-button @on-click="refresh" text-of-button="refresh" />
        <custom-button @on-click="neco" text-of-button="add Transaction" />


        <div id="transactions">
            <div :key="transaction._id" v-for="transaction in transactions">
                <p> {{transaction.name}} - {{transaction.type}} : {{transaction.amount}} {{transaction.currency}}</p>
            </div>
        </div>


        <menu/>
    </div>



</template>

<script>
// @ is an alias to /src
import router from "@/router";
import Header from "@/components/Header";
import CustomButton from "@/components/customButton";


export default {
    name: 'Home',
    components: {
        menu,
        CustomButton,
        Header,
    },
    data() {
        return {
            accountsBalance: [],
            transactions: [],
            userInfo: {},
            displayH2: true
        }
    },
    methods: {
        neco(){
            alert('funguje to')
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
    }
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

    div {
        margin: 10px;
        border: 1px solid black;
        flex-direction: column;
    }

}
</style>
