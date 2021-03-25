<template>
    <section>

        <md-field>
            <label>Enter your email</label>
            <md-input type="email" v-model="email" placeholder="Email" />
        </md-field>

        <md-field>
            <label>Enter your password</label>
            <md-input type="password" v-model="password" placeholder="Password" />
        </md-field>


        <md-button class="md-raised md-primary" @click="onLogin">Log in</md-button>

    </section>
</template>

<script>
import CustomButton from "@/components/customButton";

export default {
    name: "LoginPage",
    components: {
        CustomButton
    },
    data() {
        return {
            email: '',
            password: '',
        }
    },
    methods: {
        onLogin(e) {
            e.preventDefault();

            if (this.email === '' || this.password ===''){
                return this.displayCustomError('fill email and password');
            }

            const credentials = {
                email: this.email,
                password: this.password
            }

            this.$emit('on-login', credentials);
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
