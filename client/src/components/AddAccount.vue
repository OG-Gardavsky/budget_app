<template>
    <md-dialog :md-active.sync="showAddAccountDialog" class="md-scrollbar" style="padding-bottom: 50px">

        <md-dialog-alert
            :md-active.sync="displayError"
            :md-content="errorMessage"
            md-confirm-text="ok" />

        <md-dialog-content>

            <md-dialog-title>Add Account</md-dialog-title>


            <md-field v-if="accountType === 'basic'">
                <label>choose Account type</label>
                <md-select v-model="type" required>
                    <md-option value="debit">debit</md-option>
                    <md-option value="credit">credit</md-option>
                    <md-option value="cash">cash</md-option>
                </md-select>
            </md-field>

<!--            <md-field v-if="accountType === 'invest'">-->
<!--                <label>choose Account type</label>-->
<!--                <md-select v-model="investMoneyType" required>-->
<!--                    <md-option value="fiat">fiat money</md-option>-->
<!--                    <md-option value="crypto">crypto money-->
<!--                    </md-option>-->
<!--                </md-select>-->
<!--            </md-field>-->

            <md-field>
                <label>Enter Name for Account</label>
                <md-input type="text" v-model="name" placeholder="Name" required />
            </md-field>

            <md-field>
                <label>Enter initial balance of Account</label>
                <md-input type="number" v-model="initialBalance" placeholder="Initial Balance" required />
            </md-field>

            <md-field v-if="type === 'credit'">
                <label>Enter limit of your credit account</label>
                <md-input type="number" v-model="creditLimit" placeholder="Credit limit" required />
            </md-field>

<!--            <md-field>-->
<!--                <label>Currency </label>-->
<!--                <md-select v-model="currency" required>-->
<!--                    <md-option value="CZK">CZK</md-option>-->
<!--                    <md-option value="USD">USD</md-option>-->
<!--                    <md-option value="EUR">EUR</md-option>-->
<!--                    <md-option value="BTC">BTC</md-option>-->
<!--                </md-select>-->
<!--            </md-field>-->

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog">Close</md-button>
                <md-button class="md-primary" @click="addAccount">add account</md-button>
            </md-dialog-actions>

        </md-dialog-content>


    </md-dialog >
</template>

<script>
export default {
    name: "AddAccount",
    data() {
        return {
            type: null,
            name: null,
            currency: null,
            initialBalance: null,
            creditLimit: null,
            investMoneyType: null
        }
    },
    props: {
        showAddAccountDialog: Boolean,
        accountType: String,
    },
    methods: {
        closeDialog(){
            this.$emit('on-closeModal');
        },
        clearVariables(){
            this.type = null;
            this.name = null;
            this.currency = null;
            this.initialBalance = null;
        },
        async addAccount(){

            if (this.accountType !== 'basic') {
                this.type = this.accountType;
            }

            if (this.type === null || this.name === null ) {
                return this.displayCustomError('Please fill all fields');
            }

            if (this.type === 'credit' && this.creditLimit === null) {
                return this.displayCustomError('Please fill credit limit ');
            }

            if (this.type === 'credit' && this.creditLimit < 0) {
                return this.displayCustomError('credit limit nedds to be more than 0.');
            }

            if (this.type === 'credit' && this.initialBalance > 0) {
                return this.displayCustomError('initialBalance nedds to be less than 0.');
            }

            // if (this.type === 'invest' && this.investMoneyType === null) {
            //     return this.displayCustomError('fill field ');
            // }


            const body = {
                type: this.type,
                name: this.name,
                // currency: this.currency,
                initialBalance: this.initialBalance
            }

            if (this.type === 'credit') {
                body.limit = this.creditLimit;
            }

            // if (this.type === 'invest') {
            //     body.moneyType = this.investMoneyType;
            // }

            const res = await fetch('api/accounts', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
                body: JSON.stringify(body)
            });

            const responseBody = await res.json();

            if (res.status === 201){
                this.$emit('on-save');
                this.$emit('on-closeModal');
                this.clearVariables();
            } else if (responseBody.error) {
                this.displayCustomError(responseBody.error);
            }else {
                this.displayCustomError('Error during saving');
            }
        },

    }
}
</script>

<style scoped>

</style>
