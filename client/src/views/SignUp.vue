<template>
    <div id="mainContent">
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

    </div>
</template>

<script>
import SignUpPage from "@/components/SignUpPage";
import router from "@/router";
export default {
    name: "SignUp",
    components: {
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

            const respBody = await res.json();

            if (res.status === 201) {
                // const data = await res.json();

                localStorage.setItem('userToken', respBody.token);

                await router.push('home');
            }
            else if (respBody.error){
                this.displayCustomError(respBody.error)
            }
            else {
                this.displayCustomError('unable to register');
            }

        }
    }
}
</script>

<style scoped>

</style>
