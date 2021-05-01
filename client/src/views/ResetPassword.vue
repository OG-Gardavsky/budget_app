<template>
    <div>
        <Header />

        <section>
            <h1>choose your new password.</h1>


            <form>

                <md-field>
                    <label>Enter your password - minimal 10 characters</label>
                    <md-input type="password" v-model="password" placeholder="Password" />
                </md-field>

                <md-field>
                    <label>Reenter you password</label>
                    <md-input type="password" v-model="passwordCheck" placeholder="Password" />
                </md-field>

                <md-button v-if="disableRessetButton === false" type="submit" class="md-raised md-primary" @click="resetPassword">Reset Password</md-button>
                <md-button v-if="disableRessetButton === true" disabled class="md-raised md-primary">Reset Password</md-button>
            </form>


            <p>Wanna go back to</p>
            <router-link :to="'/'">
                <md-button class="md-raised">Log In</md-button>
            </router-link>

        </section>

    </div>
</template>

<script>
import router from "@/router";
import Header from "@/components/Header";

export default {
    name: "ResetPassword",
    components: {Header},
    data() {
        return {
            requiredPasswLength: 10,
            disableRessetButton: false,
            resetToken: null,
            password: null,
            passwordCheck: null
        }
    },
    methods: {
        async isResetTokenValid(token) {

            const res = await fetch('api/users/isResetTokenValid/token:' + token, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });

            if (res.status === 200){
                return true
            }

            try {
                const responseBody = await res.json();
                if (responseBody.error) {
                    this.displayCustomError(responseBody.error);
                    return false;
                }
            } catch (e) {
                this.displayCustomError('reset link invalid, ask for new one');
                return false;
            }

        },
        async resetPassword(e) {
            e.preventDefault();

            if ([null, ''].includes(this.password) || [null, ''].includes(this.passwordCheck)){
                return this.displayCustomError('fill both password and password check');
            }
            if (this.password.length < this.requiredPasswLength){
                return this.displayCustomError('Password is too short, is missing ' +  (this.requiredPasswLength - this.password.length) + ' characters.');
            }
            if (this.passwordCheck !== this.password){
                return this.displayCustomError('Passwords do not match.');
            }


            const res = await fetch('api/users/passwordReset', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ token: this.resetToken, newPassword: this.password }),
            });

            if (res.status === 200){
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
                this.displayCustomError('problem during password reset');
            }

        },
    },
    async created() {
        if (this.$route.query.token){
            this.resetToken = this.$route.query.token;

            const isTokenValid = await this.isResetTokenValid(this.resetToken);
            if (!isTokenValid) { this.disableRessetButton = true };
        } else {
            this.displayCustomError('reset link invalid, ask for new one');
        }
    }
}
</script>

<style scoped>
html, body{
    width:100%;
    height:100%;
    margin:0px;
}

body{
    background-size: cover;
    display: flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    color: #797979;
}

section{
    width:30%;
    min-height:25%;
    display:flex;
    flex-direction:column;
    margin-left:auto;
    margin-right:auto;
}



@media screen and (max-width: 780px) {
    section{
        width:70%;
    }
}

@media screen and (max-width: 560px) {
    section{
        width:95%;
    }
}
</style>
