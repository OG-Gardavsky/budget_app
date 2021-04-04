<template>
    <md-dialog :md-active.sync="showDialog">

        <div id="dialogContent">

            <md-dialog-title>Update of transacation</md-dialog-title>

            <div v-if="transactionToUpdate.type === 'basic' ">

                <md-field>
                    <label>Transaction Type</label>
                    <md-select v-model="transactionSubtype" required :value="transactionToUpdate.subtype">
                        <md-option value="income">Income</md-option>
                        <md-option value="expense">Expense</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <label>Category</label>
                    <md-select v-model="categoryId" required >
                        <md-option  v-for="category in listOfCategories"  :value="category._id.toString()">{{ category.name }}</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <label>Account</label>
                    <md-select v-model="accountId" required >
                        <md-option  v-for="account in listOfAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <label>Enter amount of transaction</label>
                    <md-input type="number" v-model="amount" placeholder="Amount" required />
                </md-field>

                <md-field>
                    <label>Currency (optional)</label>
                    <md-select v-model="currency">
                        <md-option value="CZK">CZK</md-option>
                        <md-option value="USD">USD</md-option>
                        <md-option value="EUR">EUR</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <label>Enter name of transaction (optional)</label>
                    <md-input type="text" v-model="transactionName" placeholder="Name(optional)"/>
                </md-field>

            </div>



            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog">Close</md-button>
                <md-button class="md-primary" @click="updateBasicTransaction">update</md-button>
            </md-dialog-actions>

        </div>

    </md-dialog >
</template>

<script>
export default {
    name: "UpdateOfTransaction",
    props: {
        showDialog: Boolean,
        transactionId: String,
        refresh: Object,
        transactionToUpdate: Object
    },
    data() {
        return {
            listOfCategories: [],
            listOfAccounts: [],
            transactionId: null,
            transactionSubtype: null,
            transactionName: null,
            amount: null,
            currency: null,
            categoryId: null,
            accountId: null
        }
    },
    methods: {
        closeDialog(){
            this.$emit('on-closeModal');
        },
        clearVariables(){
            this.transactionSubtype = null;
            this.transactionName = null;
            this.amount = null;
            this.currency = null;
            this.categoryId = null;
            this.accountId = null;
        },
        async updateBasicTransaction(){
            const body = {
                subtype: this.transactionSubtype,
                amount: this.amount,
                categoryId: this.categoryId,
                accountId: this.accountId
            }
            if (this.transactionName !== null) {
                body.name = this.transactionName;
            }
            if (this.currency !== null) {
                body.currency = this.currency;
            }

            await this.updateTransaction(body, 'basic', this.transactionId);
        },
        async updateTransaction(body, type, transactionId){
            const res = await fetch('api/transactions/' + type + '/id:' + transactionId, {
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
                this.displayCustomError('Error during update');
            }
        },

    },
    async created() {
        await this.getListOfAccounts();
        await this.getListOfCategories();

        this.transactionId = this.transactionToUpdate._id;
        this.transactionSubtype = this.transactionToUpdate.subtype;
        this.transactionName = this.transactionToUpdate.name;
        this.amount = Math.abs(this.transactionToUpdate.amount);
        this.currency = this.transactionToUpdate.currency;
        this.transactionSubtype = this.transactionToUpdate.subtype;
        this.categoryId = this.transactionToUpdate.categoryId;
        this.accountId = this.transactionToUpdate.accountId;

    }
}
</script>

<style scoped>

</style>
