<template>
    <div>
        <md-dialog :md-active.sync="showAddTransactionDialog">

            <md-dialog-title>Add transaction</md-dialog-title>

            <md-tabs md-dynamic-height>

                <md-tab md-label="basic" >

                    <md-field>
                        <label>Income/Expense</label>
                        <md-select v-model="transactionSubtype" required>
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
                        <md-datepicker v-model="accountingDate" aria-autocomplete="none" aria-required="true" />
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



                <md-tab md-label="transfer" >

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


                    <md-dialog-actions>
                        <md-button class="md-primary" @click="closeDialog">Close</md-button>
                        <md-button class="md-primary md-raised" @click="createTransfer">Add transaction</md-button>
                    </md-dialog-actions>

                </md-tab>


                <md-tab md-label="debt">


                    <md-field>
                        <label> Type</label>
                        <md-select v-model="transactionSubtype" required>
                            <md-option value="borrow">I borrow</md-option>
                            <md-option value="lend">I lend</md-option>
                        </md-select>
                    </md-field>

                    <md-field required>
                        <label >Enter amount of transaction</label>
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
                            <md-option  v-for="account in listOfDebtAccounts"  :value="account._id.toString()">{{ account.name }}</md-option>
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


                    <md-dialog-actions>
                        <md-button class="md-primary" @click="closeDialog">Close</md-button>
                        <md-button class="md-primary md-raised" @click="createDebt">Add transaction</md-button>
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

            listOfBasicAccounts: [],
            listOfDebtAccounts : [],
            listOfInvestAccounts : [],

            transactionSubtype: null,
            transactionName: null,
            amount: null,
            accountingDate: null,
            accountId: null,

            currency: null,
            categoryId: null,

            givingAccountId: null,
            receivingAccountId: null,

            basicAccountId: null,
            debtAccountId:null
        }
    },
    methods: {
        async createDebt(){
            const body = {
                amount: this.amount,
                subtype: this.transactionSubtype,
                basicAccountId: this.basicAccountId,
                debtAccountId: this.debtAccountId,
                accountingDate: this.accountingDate
            }
            if (this.transactionName !== null) {
                body.name = this.transactionName;
            }

            await this.createTransaction(body, 'debt');
        },

        async createTransfer(){
            const body = {
                amount: this.amount,
                name: this.transactionName,
                givingAccountId: this.givingAccountId,
                receivingAccountId: this.receivingAccountId,
                accountingDate: this.accountingDate
            }

            await this.createTransaction(body, 'transfer');
        },
        async createBasicTransaction(){
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
            this.transactionSubtype = null;
            this.transactionName = null;
            this.amount = null;
            this.currency = null;
            this.categoryId = null;
            this.accountId = null;
            this.givingAccountId = null;
            this.receivingAccountId = null;
            this.accountingDate = null;
        },
        closeDialog(){
            this.$emit('on-closeModal');
        },
        async getListOfSpecificAccounts(acountType) {
            const res = await fetch('api/accounts?type=' + acountType , {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            const respBody = await res.json()
            return respBody;
        },
    },
    async created() {

        this.accountingDate = new Date();

        this.listOfBasicAccounts = await this.getListOfSpecificAccounts('basic');
        await this.getListOfCategories();
        this.listOfDebtAccounts = await this.getListOfSpecificAccounts('debt');
        this.listOfInvestAccounts = await this.getListOfSpecificAccounts('invest');



    }
}
</script>

<style scoped>
</style>
