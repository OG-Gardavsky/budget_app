<template>
    <div>
        <Header />
        <section>

            <h1>Reset your password</h1>
            <form>
                <md-field>
                    <label>Enter your email</label>
                    <md-input type="email" v-model="email" placeholder="Email" />
                </md-field>

                <md-button type="submit" class="md-raised md-primary" @click="onPasswReset">send reset link</md-button>
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
    name: "ResetPasswordRequest",
    components: {Header},
    data() {
        return{
            email: null
        }
    },
    methods: {
        async onPasswReset() {

            if (this.email === null || this.email === '') {
                return this.displayCustomError('First fill email.')
            }

            const res = await fetch('api/users/passwordResetRequest', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({email: this.email}),
            });

            this.displayCustomError('Your request was processed. Look into your mailbox');

        }
    },
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
