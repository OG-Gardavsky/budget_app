<template>
  <div class="home">
      <!--    <img alt="Vue logo" src="../assets/logo.png">-->
      <HomePage msg="Welcome to budget app"/>


  </div>

  <div>
      <button @click="showBalanceOfAccounts">click na fetch</button>
  </div>


  <div id="accounts">
      <div :key="account.accountId" v-for="account in accountsBalance">
          <p>{{account.accountName}}</p>
          <p>{{account.balance}}</p>
      </div>
  </div>

</template>

<script>
// @ is an alias to /src
import HomePage from "@/components/HomePage";
import router from "@/router";

export default {
    name: 'Home',
    components: {
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
            await router.push('/');
        }

    }
}
</script>

<style lang="scss">

#accounts {

    margin: 0 50px;

    display: flex;
    flex-direction: row;

    div {
        border: 1px solid black;
        padding: 0 10px;
        flex-direction: column;
        display: flex;
        align-items: center;
    }

}
</style>
