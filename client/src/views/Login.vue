<template>
  <div id="mainContent">
      <h1>Log in, please.</h1>
      <LoginPage @on-login="onLogin"/>
  </div>

</template>

<script>
import LoginPage from "@/components/LoginPage";
import router from "@/router";

export default {
    name: 'Login',
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
                alert('unable to login');
            }

        },
        async getUserInfo() {

            const res = await fetch('api/users', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });

            this.userInfo = await res.json();
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
