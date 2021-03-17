<template>
    <section>
        <form @submit="onLogin">
            <input  type="email" v-model="email" placeholder="Email" />
            <input type="password" v-model="password" placeholder="Password" />
            <custom-button text-of-button="Log in"/>
        </form>
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
                return alert('fill email and password');
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
    background-color: rgba(0, 0, 0, 0.72);
    width:30%;
    min-height:25%;
    display:flex;
    flex-direction:column;
    margin-left:auto;
    margin-right:auto;
}
form{
    display:flex;
    flex-direction:column;
    padding: 15px;
}


input{
    font-size: 120%;
    height:35px;
    padding: 5px 5px;
    margin: 10px 0px;
    background-color:#e0dada;
    border:none;
}


@media screen and (max-width: 780px) {
    section{
        width:95%;
    }
}

</style>
