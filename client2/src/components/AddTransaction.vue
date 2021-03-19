<template>
    <div>
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Add transaction</md-dialog-title>

            <md-dialog-content>

<!--                <md-field>-->
<!--                    <label>Enter type of transaction</label>-->
<!--                    <md-input type="text" v-model="type" placeholder="Type" />-->
<!--                </md-field>-->

                <md-field>
                    <label>Transaction Type</label>
                    <md-select v-model="transactionType" required>
                        <md-option value="income">Income</md-option>
                        <md-option value="expense">Expense</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <label>Enter name of transaction</label>
                    <md-input type="text" v-model="transactionName" placeholder="Name" required  />
                </md-field>

                <md-field>
                    <label>Enter amount of transaction</label>
                    <md-input type="number" v-model="amount" placeholder="Amount" required />
                </md-field>


                <md-field>
                    <label>Currency</label>
                    <md-select v-model="currency" required>
                        <md-option value="CZK">CZK</md-option>
                        <md-option value="USD">USD</md-option>
                        <md-option value="EUR">EUR</md-option>
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





            </md-dialog-content>


            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog">Close</md-button>
                <md-button class="md-primary md-raised" @click="addTransaction">Add transaction</md-button>
            </md-dialog-actions>

        </md-dialog >
    </div>
</template>

<script>
export default {
    name: "ModalWindow",
    props: {
        showDialog: Boolean
    },
    data() {
        return {
            placeHolder: '',
            listOfCategories: [],
            listOfAccounts: [],
            transactionType: '',
            transactionName: '',
            amount: null,
            currency: null,
            categoryId: null,
            accountId: null,
        }
    },
    methods: {
        async addTransaction(){

            const res = await fetch('api/transactions', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
                body: JSON.stringify({
                    type: this.transactionType,
                    name: this.transactionName,
                    amount: this.amount,
                    currency: this.currency,
                    categoryId: this.categoryId,
                    accountId: this.accountId
                }),
            });

            if (res.status === 201){

                this.$emit('on-closeModal');
                this.clearVariables()
            }
        },
        clearVariables(){
            this.transactionType = null;
            this.transactionName = null;
            this.amount = null;
            this.currency = null;
            this.categoryId = null;
            this.accountId = null;
        },
        closeDialog(){
            this.$emit('on-closeModal');
        },
        async getListOfAccounts(account) {
            const res = await fetch('api/accounts', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.listOfAccounts = await res.json();
        },
        async getListOfCategories(account) {
            const res = await fetch('api/categories', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.listOfCategories = await res.json();
        },
    },
    async created() {
        await this.getListOfAccounts();
        await this.getListOfCategories();
    }
}
</script>

<style scoped>
</style>
