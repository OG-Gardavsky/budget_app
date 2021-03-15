<template>
      <div class="home">
          <Header />
          <HomePage msg="Welcome to budget app"/>
          <p>{{userInfo.name}}</p>
          <custom-button @on-click="refresh" text-of-button="refresh" />
      </div>

    <div id="accounts">
        <div :key="account.accountId" v-for="account in accountsBalance">
            <p>{{account.accountName}}</p>
            <p>{{account.balance}} {{account.currency}}</p>
        </div>
    </div>

  <div id="transactions">
      <div :key="transaction._id" v-for="transaction in transactions">
          <p> {{transaction.name}} - {{transaction.type}} : {{transaction.amount}} {{transaction.currency}}</p>
      </div>
  </div>



</template>

<script>
// @ is an alias to /src
import HomePage from "@/components/HomePage";
import router from "@/router";
import Header from "@/components/Header";
import CustomButton from "@/components/customButton";


export default {
    name: 'Home',
    components: {
        CustomButton,
        Header,
        HomePage
    },
    data() {
        return {
            accountsBalance: [],
            transactions: [],
            userInfo: {}
        }
    },
    methods: {
        async refresh (){
            const result = await this.checkCredentials();
            if (result !== 0){
                return;
            }
            this.displayInfo();
        },
        displayInfo(){
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
        this.displayInfo();
    }
}
</script>

<style lang="scss">



#accounts {

    //margin: 0 50px;

    display: flex;
    flex-direction: row;
    align-items: center;

    div {
        margin: 10px;
        border: 1px solid black;
        padding: 10px 10px;
        flex-direction: column;
    }

}

#transactions {
    align-items: center;

    div {
        margin: 10px;
        border: 1px solid black;
        flex-direction: column;
    }

}
</style>
