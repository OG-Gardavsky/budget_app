<template>
    <md-dialog :md-active.sync="showDialog">

        <md-dialog-alert
            :md-active.sync="displayError"
            :md-content="errorMessage"
            md-confirm-text="ok" />

        <div id="dialogContent">

            <md-dialog-title>Update of transacation: <span v-if="transactionSubtype">{{transactionSubtype}}</span></md-dialog-title>

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
                        <md-option  v-for="account in listOfBasicAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <label>Enter amount of transaction</label>
                    <md-input type="number" v-model="amount" placeholder="Amount" required />
                </md-field>

<!--                <md-field>-->
<!--                    <label>Currency (optional)</label>-->
<!--                    <md-select v-model="currency">-->
<!--                        <md-option value="CZK">CZK</md-option>-->
<!--                        <md-option value="USD">USD</md-option>-->
<!--                        <md-option value="EUR">EUR</md-option>-->
<!--                    </md-select>-->
<!--                </md-field>-->

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
                        <md-option  v-for="account in listOfBasicAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <label>To Account:</label>
                    <md-select v-model="receivingAccountId" required >
                        <md-option  v-for="account in listOfBasicAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
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

            <div v-if="transactionType === 'debt'">



                <md-field>
                    <label>Enter amount of transaction</label>
                    <md-input type="number" v-model="amount" placeholder="Amount" required />
                </md-field>

                <md-field>
                    <label v-if="transactionSubtype === null ">Basic account</label>
                    <label v-if="transactionSubtype === 'borrow' " >Geting money to Account: </label>
                    <label v-if="transactionSubtype === 'lend' " >Lending money from Account: </label>
                    <md-select v-model="basicAccountId" required >
                        <md-option  v-for="account in listOfBasicAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <label v-if="transactionSubtype === null ">Debt account</label>
                    <label v-if="transactionSubtype === 'borrow' " >I will owe to: </label>
                    <label v-if="transactionSubtype === 'lend' " >Will owe me: </label>
                    <md-select v-model="debtAccountId" required >
                        <md-option  v-for="account in listOfBasicAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
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


            <div v-if="transactionType === 'invests'">

                <md-field>
                    <label> Type</label>
                    <md-select v-model="transactionSubtype" required>
                        <md-option value="deposit">I invest</md-option>
                        <md-option value="withdrawal">I withdraw</md-option>
                    </md-select>
                </md-field>

                <md-field required>
                    <label >Enter amount of transaction</label>
                    <md-input type="number" v-model="amount" placeholder="Amount" required />
                </md-field>

                <md-field>
                    <label v-if="transactionSubtype === null ">Basic account</label>
                    <label v-if="transactionSubtype === 'deposit' " >Getting money from Account: </label>
                    <label v-if="transactionSubtype === 'withdrawal' " >Putting money to Account: </label>
                    <md-select v-model="basicAccountId" required >
                        <md-option  v-for="account in listOfBasicAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
                    </md-select>
                </md-field>

                <md-field>
                    <label v-if="transactionSubtype === null ">Debt account</label>
                    <label v-if="transactionSubtype === 'deposit' " >Putting money to Account: </label>
                    <label v-if="transactionSubtype === 'withdrawal' " >Getting money from Account: </label>
                    <md-select v-model="investAccountId" required >
                        <md-option  v-for="account in listOfInvestAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
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
            listOfBasicAccounts: null,
            listOfDebtAccounts: null,
            listOfInvestAccounts: null,


            transactionType: null,
            transactionId: null,
            transactionSubtype: null,
            transactionName: null,
            accountingDate: null,
            // currency: null,

            amount: null,
            accountId: null,
            categoryId: null,

            givingAccountId: null,
            receivingAccountId: null,
            transferDetails: null,

            debtDetails: null,
            basicAccountId: null,
            debtAccountId: null,

            investDetails: null,
            investAccountId: null
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
            // this.currency = null;
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
                    await this.updateBasicTransaction();
                    break;
                case 'transfer':
                    await this.updateTransfer();
                    break
                case 'debt':
                    await this.updateDebt();
                    break
                case 'invests':
                    await this.updateinvest();
                    break
            }
        },
        async updateinvest(){
            const body = {
                amount: this.amount,
                basicAccountId: this.basicAccountId,
                investAccountId: this.investAccountId,
                accountingDate: this.accountingDate
            }
            if (this.transactionName !== null) {
                body.name = this.transactionName;
            }

            body.accountingDate = this.parseDateBeforeSave(body.accountingDate);

            await this.updateTransaction(body, 'invests', 'sharedId', this.transactionToUpdate.sharedId);
        },
        async updateDebt(){
            const body = {
                amount: this.amount,
                basicAccountId: this.basicAccountId,
                debtAccountId: this.debtAccountId,
                accountingDate: this.accountingDate
            }
            if (this.transactionName !== null) {
                body.name = this.transactionName;
            }

            body.accountingDate = this.parseDateBeforeSave(body.accountingDate);

            await this.updateTransaction(body, 'debt', 'sharedId', this.transactionToUpdate.sharedId);
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

            body.accountingDate = this.parseDateBeforeSave(body.accountingDate);

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
            // if (this.currency !== null) {
            //     body.currency = this.currency;
            // }

            body.accountingDate = this.parseDateBeforeSave(body.accountingDate);

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
        },
        async getDebtInfo(sharedId) {
            const res = await fetch('api/transactions/debt/sharedId:' + sharedId, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
            });

            if (res.status !== 200){
                return  this.displayCustomError('Error during retrieving debt data');
            }
            this.debtDetails = await res.json();
        },
        async getInvestInfo(sharedId) {
            const res = await fetch('api/transactions/invests/sharedId:' + sharedId, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
            });

            if (res.status !== 200){
                return  this.displayCustomError('Error during retrieving invest data');
            }
            this.investDetails = await res.json();
        }
    },
    async created() {
        this.transactionType = this.transactionToUpdate.type;



        if (this.transactionType === 'basic') {
            this.listOfBasicAccounts = await this.getListOfSpecificAccounts('basic');
            await this.getListOfCategories();

            this.transactionId = this.transactionToUpdate._id;
            this.transactionSubtype = this.transactionToUpdate.subtype;
            // this.currency = this.transactionToUpdate.currency;
            this.transactionSubtype = this.transactionToUpdate.subtype;
            this.categoryId = this.transactionToUpdate.categoryId;
            this.accountId = this.transactionToUpdate.accountId;
            this.amount = Math.abs(this.transactionToUpdate.amount);

            this.transactionName = this.transactionToUpdate.name;


        } else if (this.transactionType === 'transfer') {
            await this.getTransferInfo(this.transactionToUpdate.sharedId);
            this.listOfBasicAccounts = await this.getListOfSpecificAccounts('basic');

            this.givingAccountId = this.transferDetails.givingAccountId;
            this.receivingAccountId = this.transferDetails.receivingAccountId;

            this.amount = this.transferDetails.amount
            this.transactionName = this.transferDetails.name;



        } else if (this.transactionType === 'debt') {
            await this.getDebtInfo(this.transactionToUpdate.sharedId);
            this.listOfBasicAccounts = await this.getListOfSpecificAccounts('basic');
            this.listOfDebtAccounts = await this.getListOfSpecificAccounts('debt');

            this.transactionSubtype = this.debtDetails.subtype;

            this.basicAccountId = this.debtDetails.basicAccountId;
            this.debtAccountId = this.debtDetails.debtAccountId;

            this.amount = this.debtDetails.amount
            this.transactionName = this.debtDetails.name;



        } else if (this.transactionType === 'invests') {
            await this.getInvestInfo(this.transactionToUpdate.sharedId);
            this.listOfBasicAccounts = await this.getListOfSpecificAccounts('basic');
            this.listOfInvestAccounts = await this.getListOfSpecificAccounts('invest');

            this.transactionSubtype = this.investDetails.subtype;
            this.basicAccountId = this.investDetails.basicAccountId;

            this.investAccountId = this.investDetails.investAccountId;
            this.amount = this.investDetails.amount

            this.transactionName = this.investDetails.name;
        }


        this.accountingDate =  new Date(this.transactionToUpdate.accountingDate);
    }
}
</script>

<style scoped>

</style>
