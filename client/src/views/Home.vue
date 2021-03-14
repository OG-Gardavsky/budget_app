<template>
  <div class="home">
      <Header />
      <!--    <img alt="Vue logo" src="../assets/logo.png">-->
      <HomePage msg="Welcome to budget app"/>


  </div>


  <div id="accounts">
      <div :key="account.accountId" v-for="account in accountsBalance">
          <p>{{account.accountName}}</p>
          <p>{{account.balance}} {{account.currency}}</p>
      </div>
  </div>

</template>

<script>
// @ is an alias to /src
import HomePage from "@/components/HomePage";
import router from "@/router";
import Header from "@/components/Header";


export default {
    name: 'Home',
    components: {
        Header,
        HomePage
    },
    data() {
        return {
            accountsBalance: []
        }
    },
    methods: {
        async showBalanceOfAccounts() {

            const res = await fetch('api/accounts/balance', {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });

            this.accountsBalance = await res.json();
        }

    },
    async created() {
        if (localStorage.getItem('userToken') === null) {
            alert('You are not authenticated, please logged in');
            return await router.push('/');
        }

        await this.showBalanceOfAccounts();


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
</style>
