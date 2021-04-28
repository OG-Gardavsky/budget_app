<template>
    <section>

        <form>

            <md-dialog-alert
                :md-active.sync="displayError"
                :md-content="errorMessage"
                md-confirm-text="ok" />

            <md-field>
                <label>Enter your email - serves as login</label>
                <md-input type="email" v-model="email" placeholder="Email" />
            </md-field>

            <md-field>
                <label>Enter your(how you want to be called)</label>
                <md-input type="email" v-model="name" placeholder="Name" />
            </md-field>


            <md-autocomplete v-model="currencyName" :md-options="listOfCurrencyNames">
                <label>Default currency</label>
            </md-autocomplete>




            <md-field>
                <label>Enter your password - minimal 10 characters</label>
                <md-input type="password" v-model="password" placeholder="Password" />
            </md-field>

            <md-field>
                <label>Reenter you password</label>
                <md-input type="password" v-model="passwordCheck" placeholder="Password" />
            </md-field>

            <md-button type="submit" class="md-raised md-primary" @click="onSignUp">Sign up</md-button>
        </form>

    </section>
</template>

<script>
import router from "@/router";

export default {
    name: "SignUpPage",
    data() {
        return {
            requiredPasswLength: 10,
            email: '',
            name: '',
            password: '',
            passwordCheck: '',
            currencyName: null,
            listOfCurrencies: null,
            listOfCurrencyNames: null
        }
    },
    methods: {
        onSignUp(e) {
            e.preventDefault();

            if (this.email === '' || this.password === '' || this.name === '' || this.passwordCheck === '' || this.primarCurrency === null){
                return this.displayCustomError('Fill email, name, password, default currency and reenter password.');
            }

            if (!this.validateEmail(this.email)) {
                return  this.displayCustomError('Email is not valid');
            }

            if (this.password.length < this.requiredPasswLength){
                return this.displayCustomError('Password is too short, is missing ' +  (this.requiredPasswLength - this.password.length) + ' characters.');
            }

            if (this.passwordCheck !== this.password){
                return this.displayCustomError('Passwords do not match.');
            }

            const primarCurrency = this.listOfCurrencies.find(currency => currency.currencyName === this.currencyName).id;


            const credentials = {
                email: this.email,
                name: this.name,
                password: this.password,
                primarCurrency
            }

            this.$emit('on-signup', credentials);
        },
        validateEmail(email)
        {
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        },
    },
    async created() {
        this.listOfCurrencies = await this.getListOfCurrencies();
        this.listOfCurrencyNames = this.listOfCurrencies.map(currencyObject => currencyObject.currencyName);
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
