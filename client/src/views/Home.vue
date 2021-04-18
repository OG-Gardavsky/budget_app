<template>
    <div>
        <Header />

        <md-card id="totalBalanceCard" >
            <md-content>
                <md-card-header>
                    <div class="md-title">Total balance:  <span v-if="totalMoney > 0">+ </span> {{totalMoney}} {{userInfo.primarCurrency}}</div>
                </md-card-header>

            </md-content>
        </md-card>

        <md-content class="md-scrollbar" id="accounts">
            <div :key="account.accountId" v-for="account in accountsBalance"
                 @click=" currentAccount = account ;  currentLimitOfTransactions = defaultLimitOfTransactions" >

                <md-card md-with-hover class="accountCard">
                    <md-card-header>
<!--                        <div class="md-title"><span v-if="account.balance > 0">+</span> {{account.balance}} {{account.currency}}</div>-->
<!--                        <div v-if="account.limit">limit: {{account.limit}} {{account.currency}}</div>-->

                        <div class="md-title"><span v-if="account.balance > 0">+</span> {{account.balance}} {{userInfo.primarCurrency}}</div>
                        <div v-if="account.limit">limit: {{account.limit}} {{userInfo.primarCurrency}}</div>
                        <div class="md-subhead">{{account.name}}</div>
                    </md-card-header>
                </md-card>
            </div>

            <md-card md-with-hover style="max-height: 100px">
                <md-card-content>
                    <md-button class="md-button md-primary" @click="showAddAccount">add <br/> account</md-button>
                </md-card-content>
            </md-card>
            <add-account :account-type="'basic'" :show-add-account-dialog="showAddAccountDialog" @on-closeModal="closeAddAccount" @on-save="refresh" />
        </md-content>

        <div v-if="currentAccount !== null">
            <md-button class="md-button md-primary md-raised" @click="deleteAccount">delete account</md-button>
            <md-button class="md-button md-primary md-raised" @click="showUpdateAccountDialog = true">edit account</md-button>

            <UpdateAccount v-if="showUpdateAccountDialog === true"
                :show-update-account-dialog="showUpdateAccountDialog"
                :account-to-update="currentAccount"
                @on-save="refresh" @on-closeModal="showUpdateAccountDialog = false"
            />
        </div>





        <div id="transactions">
            <md-card md-with-hover class="" :key="transaction._id" v-for="transaction in transactions" >
                <md-card-header>
                    <div class="md-title" style="display: flex; justify-content: space-between">

                        <div>
                            <span v-if="transaction.type === 'basic'">{{pairCategoryTransaction(transaction)}} -</span>
                            <span v-if="transaction.type === 'transfer'">{{transaction.type}}</span>
                            {{transaction.subtype}}
                        </div>


                        <div> <span v-if="transaction.amount > 0">+</span> {{transaction.amount}} {{transaction.currency}}</div>

                    </div>

                    <div style="display: flex; justify-content: space-between">
                        <div class="md-subhead" > {{transaction.name}}</div>
                        <div class="md-subhead"> {{  parseDate(transaction.accountingDate) }}    </div>
                    </div>


                </md-card-header>
                <md-card-actions>
                    <md-button class="md-raised" @click="deleteTransaction(transaction)">delete</md-button>
                    <md-button class="md-raised"
                           @click="showUpdateBasicTransactionDialog = true; currentTransaction = transaction"
                    >
                        edit
                    </md-button>

                </md-card-actions>




            </md-card>

            <md-button v-if="transactions.length % defaultLimitOfTransactions === 0 && transactions.length === currentLimitOfTransactions" class="md-raised"
                       @click="currentLimitOfTransactions += defaultLimitOfTransactions"

                >Show {{defaultLimitOfTransactions}} more</md-button>

        </div>

        <UpdateOfTransaction v-if="showUpdateBasicTransactionDialog === true"
            :show-dialog="showUpdateBasicTransactionDialog"
            @on-closeModal="showUpdateBasicTransactionDialog = false"
            :transaction-to-update="currentTransaction"
            @on-save="refresh"
        />





        <CustomMenu :refresh="refresh" />



    </div>

</template>

<script>
// @ is an alias to /src
import router from "@/router";
import Header from "@/components/Header";
import CustomButton from "@/components/customButton";
import AddTransaction from "@/components/AddTransaction";
import LoadingSpinner from "@/components/loadingSpinner";
import CustomMenu from "@/components/CustomMenu";
import AddAccount from "@/components/AddAccount";
import UpdateOfTransaction from "@/components/UpdateOfTransaction";
import UpdateAccount from "@/components/UpdateAccount";


export default {
    name: 'Home',
    components: {
        UpdateAccount,
        UpdateOfTransaction,
        AddAccount,
        CustomMenu,
        LoadingSpinner,
        AddTransaction,
        CustomButton,
        Header,
    },
    data() {
        return {
            sortTransactionsBy: 'desc',

            defaultLimitOfTransactions: 5,
            currentLimitOfTransactions: 5,

            totalMoney: null,

            accountsBalance: [],
            transactions: [],
            listOfCategories: [],
            userInfo: {},
            showAddAccountDialog: false,
            deleteAccountBtn: false,
            currentAccount: null,
            showUpdateBasicTransactionDialog: false,
            showUpdateAccountDialog: false,
            currentTransaction: {}
        }
    },
    watch: {
        currentLimitOfTransactions:  async function () {

            if (this.currentAccount === null){
                await this.showTransactionsOfAllAccounts();
            } else {
                await this.showTransactionsOfSpecificAccount(this.currentAccount);
            }
        },
        currentAccount: function() {
            this.showTransactionsOfSpecificAccount(this.currentAccount);
        }
    },
    methods: {
        showAddAccount(){
            this.showAddAccountDialog = true;
        },
        closeAddAccount(){
            this.showAddAccountDialog = false;
        },
        async showTransactionsOfSpecificAccount(account) {
            const res = await fetch('api/accounts/id:' + account._id.toString() + '/transactions?limit=' + this.currentLimitOfTransactions + '&sort=' + this.sortTransactionsBy, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.transactions = await res.json();
        },
        async deleteTransaction(transaction){
            const answer = window.confirm('Are you sure you want to delete transation with name ' + transaction.name);

            if (!answer) {
                return;
            }

            const res = await fetch('api/transactions/id:' + transaction._id, {
                method: 'Delete',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });

            if (res.status !== 200){
                return this.displayCustomError('Error during deleting of ' + transaction.name);
            }

            await this.refresh();
        },
        async deleteAccount(){
            const answer = window.confirm('Are you sure you want to delete account: ' + this.currentAccount.name + '? Include all transactions');

            if (!answer) {
                return;
            }

            const res = await fetch('api/accounts/id:' + this.currentAccount._id, {
                method: 'Delete',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });

            if (res.status !== 200){
                return this.displayCustomError('Error during deleting of ' + this.currentAccount.name);
            }

            await this.refresh();
        },
        async refresh (){
            const result = await this.checkCredentials();
            if (result !== 0){
                return;
            }

            this.totalMoney = await this.getTotalBalanceByAccType('all');
            await this.displayFinancialInfo();
        },
        displayFinancialInfo(){
            this.getListOfCategories();
            this.accountsBalance = this.showBalanceOfAccounts('basic');
            this.showTransactionsOfAllAccounts();
        },

        async showTransactionsOfAllAccounts() {
            const res = await fetch('api/transactions?type=basic&limit=' + this.currentLimitOfTransactions + '&sort=' + this.sortTransactionsBy, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.transactions = await res.json();
        },
        async getListOfCategories() {
            const res = await fetch('api/categories', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.listOfCategories = await res.json();
        },
        pairCategoryTransaction (transaction) {
            if (!transaction.categoryId){
                return null;
            }
            const match = this.listOfCategories.find(obj => obj._id.toString() === transaction.categoryId.toString());

            if (!match.name){
                return null;
            }
            return match.name;
        }
    },
    async created() {
        await this.checkCredentials();
        await this.refresh();
    },

}
</script>

<style lang="scss">

#totalBalanceCard {
    max-width: 60%;
    margin: 20px auto;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }
}

#accounts {

    max-width: 60%;
    margin: 5px auto;
    overflow: scroll;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media screen and (max-width: 560px) {
        max-width: 100%;
    }

    .md-title {
        font-size: 130%;
    }

    .accountCard {
        min-height: 100px;
        min-width: 120px;
        overflow:hidden;
    }

    >div{
        width: 140px;
        height: 130px;
        margin: 5px;
        flex-direction: column;
    }

}

#transactions {
    align-items: center;
    max-width: 60%;
    margin: 0px auto;

    padding-bottom: 60px;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }

    >div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 10px;
        //border: 1px solid black;
        flex-direction: column;

    }

}
</style>
