<template>
    <div id="mainContent">
        <h1>Please register.</h1>
        <sign-up-page @on-signup="onSignUp" />
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

            if (res.status === 201) {
                const data = await res.json();

                localStorage.setItem('userToken', data.token);

                await router.push('home');

            } else {
                this.displayCustomError('unable to login');
            }

        }
    }
}
</script>

<style scoped>

</style>
