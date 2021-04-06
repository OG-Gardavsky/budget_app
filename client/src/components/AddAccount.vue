<template>
    <md-dialog :md-active.sync="showAddAccountDialog">

        <md-dialog-title>Add Account</md-dialog-title>

        <md-tabs md-dynamic-height>

            <md-tab md-label="basic">
                <md-field>
                    <label>choose Account type</label>
                    <md-select v-model="type" required>
                        <md-option value="debit">debit</md-option>
                        <md-option value="credit">credit</md-option>
                        <md-option value="cash">cash</md-option>
                    </md-select>
                </md-field>

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
                    <md-button class="md-primary" @click="addAccount">add account</md-button>
                </md-dialog-actions>
            </md-tab>

        </md-tabs>
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
            initialBalance: null
        }
    },
    props: {
        showAddAccountDialog: Boolean
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

            if (this.type === null || this.name === '' || this.currency === null) {
                return this.displayCustomError('Please fill all fields');
            }

            const body = {
                type: this.type,
                name: this.name,
                currency: this.currency,
                initialBalance: this.initialBalance
            }

            const res = await fetch('api/accounts', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
                body: JSON.stringify(body)
            });

            if (res.status === 201){
                this.$emit('on-save');
                this.$emit('on-closeModal');
                this.clearVariables();
            } else {
                this.displayCustomError('Error during saving');
            }
        },

    }
}
</script>

<style scoped>

</style>
