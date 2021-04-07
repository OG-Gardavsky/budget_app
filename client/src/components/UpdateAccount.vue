<template>
    <md-dialog :md-active.sync="showUpdateAccountDialog">

        <md-dialog-title>Update Account</md-dialog-title>

        <md-tabs md-dynamic-height>

            <md-tab>

                <md-field>
                    <label>Enter Name for Account</label>
                    <md-input type="text" v-model="name" placeholder="Name" required />
                </md-field>

                <md-field>
                    <label>Enter initial balance of Account</label>
                    <md-input type="number" v-model="initialBalance" placeholder="Initial Balance" required />
                </md-field>

                <md-field>
                    <label>Currency </label>
                    <md-select v-model="currency" required>
                        <md-option value="CZK">CZK</md-option>
                        <md-option value="USD">USD</md-option>
                        <md-option value="EUR">EUR</md-option>
                    </md-select>
                </md-field>

                <md-dialog-actions>
                    <md-button class="md-primary" @click="closeDialog">Close</md-button>
                    <md-button class="md-primary" @click="updateAccount">update account</md-button>
                </md-dialog-actions>
            </md-tab>

        </md-tabs>
    </md-dialog >
</template>

<script>
export default {
    name: "UpdateAccount",
    data() {
        return {
            type: null,
            name: null,
            currency: null,
            initialBalance: null,
            accountId: null
        }
    },
    props: {
        showUpdateAccountDialog: Boolean,
        accountToUpdate: Object
    },
    methods: {
        closeDialog(){
            this.$emit('on-closeModal');
            this.clearVariables();
        },
        clearVariables(){
            this.name = null;
            this.currency = null;
            this.initialBalance = null;
            this.accountId = null;
        },
        async updateAccount(){

            if (this.name === null || this.currency === null || this.initialBalance === null || this.accountId === null) {
                return this.displayCustomError('Please fill all fields');
            }

            const body = {
                name: this.name,
                currency: this.currency,
                initialBalance: this.initialBalance
            }

            const res = await fetch('api/accounts/id:' + this.accountId, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
                body: JSON.stringify(body)
            });

            if (res.status === 200){
                this.$emit('on-save');
                this.$emit('on-closeModal');
                this.clearVariables();
            } else {
                this.displayCustomError('Error during saving');
            }
        }
    },
    created() {

        console.log(this.accountToUpdate)

        this.accountId = this.accountToUpdate._id;
        this.name = this.accountToUpdate.name;
        this.currency = this.accountToUpdate.currency;
        this.initialBalance = this.accountToUpdate.initialBalance;

    }
}
</script>

<style scoped>

</style>
