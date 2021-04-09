<template>
    <md-dialog :md-active.sync="showDialog">

        <div id="dialogContent">

            <md-dialog-title>Update of transacation</md-dialog-title>

            <div v-if="transactionType === 'basic' ">

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
                    <md-label>Accounting date</md-label>
                    <md-datepicker v-model="accountingDate" aria-autocomplete="none" aria-required="true"/>
                </md-field>

                <md-field>
                    <label>Enter name of transaction (optional)</label>
                    <md-input type="text" v-model="transactionName" placeholder="Name(optional)"/>
                </md-field>

            </div>


            <div v-if="transactionType === 'transfer'">

                <md-field>
                    <label>Enter amount of transaction</label>
                    <md-input type="number" v-model="amount" placeholder="Amount" required />
                </md-field>

                <md-field>
                    <label>From Account:</label>
                    <md-select v-model="givingAccountId" required >
                        <md-option  v-for="account in listOfAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <label>To Account:</label>
                    <md-select v-model="receivingAccountId" required >
                        <md-option  v-for="account in listOfAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <md-label>Accounting date</md-label>
                    <md-datepicker v-model="accountingDate" aria-autocomplete="none" aria-required="true"/>
                </md-field>

                <md-field>
                    <label>Enter name of transaction (optional)</label>
                    <md-input type="text" v-model="transactionName" placeholder="Name(optional)" />
                </md-field>


            </div>


            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog">Close</md-button>
                <md-button class="md-primary" @click="updateTransactionRouter(transactionType)">update</md-button>
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
            transactionType: null,
            transactionId: null,
            transactionSubtype: null,
            transactionName: null,
            amount: null,
            currency: null,
            categoryId: null,
            accountId: null,
            givingAccountId: null,
            receivingAccountId: null,
            transferDetails: null,
            accountingDate: null
        }
    },
    methods: {
        closeDialog(){
            this.$emit('on-closeModal');
        },
        clearVariables(){
            this.transactionType = null,
            this.transactionSubtype = null;
            this.transactionName = null;
            this.amount = null;
            this.currency = null;
            this.categoryId = null;
            this.accountId = null;

            this.givingAccountId = null;
            this.receivingAccountId = null;
            this.transferDetails = null;
            this.accountingDate = null;
        },
        async updateTransactionRouter (type) {
            switch (this.transactionType){
                case 'basic':
                    await this.updateBasicTransaction(this.transactionType);
                    break;
                case 'transfer':
                    await this.updateTransfer(this.transactionType);
                    break
            }
        },
        async updateTransfer(){
            const body = {
                givingAccountId: this.givingAccountId,
                receivingAccountId: this.receivingAccountId,
                amount: this.amount,
                accountingDate: this.accountingDate
            }
            if (this.transactionName !== null) {
                body.name = this.transactionName;
            }

            await this.updateTransaction(body, 'transfer', 'sharedId', this.transactionToUpdate.sharedId);
        },
        async updateBasicTransaction(){
            const body = {
                subtype: this.transactionSubtype,
                amount: this.amount,
                categoryId: this.categoryId,
                accountId: this.accountId,
                accountingDate: this.accountingDate
            }
            if (this.transactionName !== null) {
                body.name = this.transactionName;
            }
            if (this.currency !== null) {
                body.currency = this.currency;
            }

            await this.updateTransaction(body, 'basic', 'id', this.transactionId);
        },
        async updateTransaction(body, type, idType, transactionId){
            const res = await fetch('api/transactions/' + type + '/' + idType + ':' + transactionId, {
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
        async getTransferInfo(sharedId) {
            const res = await fetch('api/transactions/transfer/sharedId:' + sharedId, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
            });

            if (res.status !== 200){
                return  this.displayCustomError('Error during retrieving transfer data');
            }
            this.transferDetails = await res.json();
        }

    },
    async created() {
        this.transactionType = this.transactionToUpdate.type;

        await this.getListOfAccounts();
        await this.getListOfCategories();



        if (this.transactionType === 'basic') {
            this.transactionId = this.transactionToUpdate._id;
            this.transactionSubtype = this.transactionToUpdate.subtype;
            this.currency = this.transactionToUpdate.currency;
            this.transactionSubtype = this.transactionToUpdate.subtype;
            this.categoryId = this.transactionToUpdate.categoryId;
            this.accountId = this.transactionToUpdate.accountId;
            this.amount = Math.abs(this.transactionToUpdate.amount);
            this.transactionName = this.transactionToUpdate.name;

        } else if (this.transactionType === 'transfer') {
            await this.getTransferInfo(this.transactionToUpdate.sharedId);

            this.givingAccountId = this.transferDetails.givingAccountId;
            this.receivingAccountId = this.transferDetails.receivingAccountId;

            this.amount = this.transferDetails.amount
            this.transactionName = this.transferDetails.name;

        }

        this.accountingDate =  new Date(this.transactionToUpdate.accountingDate);






    }
}
</script>

<style scoped>

</style>
