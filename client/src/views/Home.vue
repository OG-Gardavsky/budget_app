<template>
  <div class="home">
      <!--    <img alt="Vue logo" src="../assets/logo.png">-->
      <HomePage msg="Welcome to budget app"/>


  </div>

  <div>
      <button @click="click">click na fetch</button>
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
        async click() {

            const res = await fetch('api/accounts/balance', {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDRjN2NjMTJkZGZmNTQ2YjRkZmZhNDEiLCJpYXQiOjE2MTU2MjU0MDl9.V3NXISLRi6KfUdtrSqYdkJbDZZsqa2nLi-OMJiWDN-U'}
            });

            this.accountsBalance = await res.json();
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
