<template>
  <div class="home">
      <HomePage msg="Log in, please."/>
      <LoginPage @on-login="onLogin"/>
  </div>

</template>

<script>
import HomePage from "@/components/HomePage";
import LoginPage from "@/components/LoginPage";
import router from "@/router";

export default {
    name: 'Login',
    components: {
      LoginPage,
        HomePage
    },
    data() {
        return {

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





        }
    },
    async created() {
        if (localStorage.getItem('userToken') !== null) {
            await router.push('home');
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
