<template>
  <div id="mainContent">
      <md-dialog-alert
          :md-active.sync="displayError"
          :md-content="errorMessage"
          md-confirm-text="ok" />


      <h1 >Log in, please.</h1>
      <LoginPage @on-login="onLogin"/>

      <router-link to="passwordResetRequest">
          <md-button style="margin-top: 10px">Forgot password?</md-button>
      </router-link>


      <p>Do not have an account?</p>
      <router-link :to="'signUp'">
          <md-button class="md-raised">Sign up</md-button>
      </router-link>

  </div>

</template>

<script>
import LoginPage from "@/components/LoginPage";
import router from "@/router";

export default {
    name: 'login',
    components: {
      LoginPage
    },
    data() {
        return {
            userInfo: {}
        }
    },
    methods: {
        async onLogin(credentials) {

            const res = await fetch('api/users/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (res.status === 200) {
                const data = await res.json();

                localStorage.setItem('userToken', data.token);

                await router.push('home');

            } else {
                this.displayCustomError('unable to login');
            }

        }
    },
    async created() {
        if (localStorage.getItem('userToken')) {
            await this.getUserInfo();

            if (!this.userInfo.hasOwnProperty('error')){
                await router.push('home');
            }
        }
    }

}
</script>

<style lang="scss">

</style>
