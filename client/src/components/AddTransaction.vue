<template>
    <div>
        <md-dialog :md-active.sync="showAddTransactionDialog">

            <md-dialog-title>Add transaction</md-dialog-title>

            <md-tabs md-dynamic-height>

                <md-tab md-label="basic">

                    <md-field>
                        <label>Transaction Type</label>
                        <md-select v-model="transcationSubtype" required>
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
                        <md-input type="text" v-model="transactionName" placeholder="Name(optional)" />
                    </md-field>


                    <md-dialog-actions>
                        <md-button class="md-primary" @click="closeDialog">Close</md-button>
                        <md-button class="md-primary md-raised" @click="createBasicTransaction">Add transaction</md-button>
                    </md-dialog-actions>

                </md-tab>



                <md-tab md-label="transfer">

                    <md-field>
                        <label>Enter amount of transaction</label>
                        <md-input type="number" v-model="amount" placeholder="Amount" required />
                    </md-field>

                    <md-field>
                        <label>From Account:</label>
                        <md-select v-model="givingAcountId" required >
                            <md-option  v-for="account in listOfAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
                        </md-select>
                    </md-field>

                    <md-field>
                        <label>To Account:</label>
                        <md-select v-model="receivingAcountId" required >
                            <md-option  v-for="account in listOfAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
                        </md-select>
                    </md-field>


                    <md-dialog-actions>
                        <md-button class="md-primary" @click="closeDialog">Close</md-button>
                        <md-button class="md-primary md-raised" @click="createTransfer">Add transaction</md-button>
                    </md-dialog-actions>

                </md-tab>

            </md-tabs>

        </md-dialog >
    </div>
</template>

<script>
export default {
    name: "AddTransaction",
    props: {
        showAddTransactionDialog: Boolean
    },
    data() {
        return {
            listOfCategories: [],
            listOfAccounts: [],
            transcationSubtype: null,
            transactionName: null,
            amount: null,
            currency: null,
            categoryId: null,
            accountId: null,
            givingAcountId: null,
            receivingAcountId: null
        }
    },
    methods: {
        async createTransfer(){
            const body = {
                amount: this.amount,
                givingAcountId: this.givingAcountId,
                receivingAcountId: this.receivingAcountId
            }

            await this.createTransaction(body, 'transfer');
        },
        async createBasicTransaction(){
            const body = {
                subtype: this.transcationSubtype,
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

            await this.createTransaction(body, 'basic');
        },
        async createTransaction(body, type){
            const res = await fetch('api/transactions/' + type, {
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
        clearVariables(){
            this.transcationSubtype = null;
            this.transactionName = null;
            this.amount = null;
            this.currency = null;
            this.categoryId = null;
            this.accountId = null;
            this.givingAcountId = null;
            this.receivingAcountId = null;
        },
        closeDialog(){
            this.$emit('on-closeModal');
        }
    },
    async created() {
        await this.getListOfAccounts();
        await this.getListOfCategories();
    }
}
</script>

<style scoped>
</style>
