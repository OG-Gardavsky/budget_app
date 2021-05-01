<template>
    <div id="mainContent">
        <Header />

        <md-dialog-alert
            :md-active.sync="displayError"
            :md-content="errorMessage"
            md-confirm-text="ok" />

        <h1>Please register.</h1>
        <sign-up-page @on-signup="onSignUp" />

        <p>Wanna go back to</p>

        <router-link :to="'/'">
            <md-button class="md-raised">Log In</md-button>
        </router-link>


        <h1>Warning</h1>
        <p>
          <span>
          This serves as a demo of open-source project, by Ondřej Gardavský, //link for github.
          Please do not use it for you confidential data, we guarantee no safety of them.
        </span>
        </p>

    </div>
</template>

<script>
import SignUpPage from "@/components/SignUpPage";
import router from "@/router";
import Header from "@/components/Header";
export default {
    name: "SignUp",
    components: {
        Header,
        SignUpPage
    },
    methods: {
        async onSignUp(credentials) {

            const res = await fetch('api/users', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });


            if (res.status === 201){
                const data = await res.json();

                localStorage.setItem('userToken', data.token);

                return await router.push('home');
            }

            try {
                const responseBody = await res.json();
                if (responseBody.error) {
                    this.displayCustomError(responseBody.error);
                }
            } catch (e) {
                this.displayCustomError('Unexpected Error during registration.');
            }

        }
    }
}
</script>

<style scoped>

</style>
