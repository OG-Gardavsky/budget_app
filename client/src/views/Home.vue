<template>
    <div>
        <Header />

        <md-content class="md-scrollbar" id="accounts">
            <div :key="account.accountId" v-for="account in accountsBalance"
                 @click="showTransactionsOfSpecificAccount(account)" >

                <md-card md-with-hover class="accountCard">
                    <md-card-header>
                        <div class="md-title">{{account.accountName}}</div>
                        <div class="md-subhead">{{account.balance}} {{account.currency}}</div>
                    </md-card-header>
                </md-card>
            </div>

            <md-card md-with-hover style="max-height: 100px">
                <md-card-content>
                    <md-button class="md-button md-primary" @click="showAddAccount">add <br/> account</md-button>
                </md-card-content>
            </md-card>
            <add-account :show-add-account-dialog="showAddAccountDialog" @on-closeModal="closeAddAccount" @on-save="refresh" />
        </md-content>

<!--        ; currentAccount = account; deleteAccountBtn=true   -->
<!--        <md-button class="md-primary md-raised md-accent" v-if="deleteAccountBtn" @click="konzol">Delete account</md-button>-->


        <div id="transactions">
            <md-card md-with-hover class="" :key="transaction._id" v-for="transaction in transactions">
                <md-card-header>
                    <div class="md-title">
                        <span v-if="transaction.type === 'basic'">{{pairCategoryTransaction(transaction)}} -</span>
                        <span v-if="transaction.type === 'transfer'">{{transaction.type}}</span>
                        {{transaction.subtype}}
                    </div>
                    <div class="md-subhead" v-if="transaction.name"> {{transaction.name}}</div>
                    <div class="md-subhead" > {{transaction.amount}} {{transaction.currency}}</div>
                </md-card-header>
                <md-card-actions>
                    <md-button class="md-raised" @click="deleteTransaction(transaction)">del</md-button>
                </md-card-actions>

            </md-card>

        </div>


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


export default {
    name: 'Home',
    components: {
        AddAccount,
        CustomMenu,
        LoadingSpinner,
        AddTransaction,
        CustomButton,
        Header,
    },
    data() {
        return {
            accountsBalance: [],
            transactions: [],
            listOfCategories: [],
            userInfo: {},
            showAddAccountDialog: false,
            deleteAccountBtn: false,
            currentAccount: '',
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
            const res = await fetch('api/accounts/id:' + account.accountId.toString() + '/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.transactions = [];
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
        async refresh (){
            const result = await this.checkCredentials();
            if (result !== 0){
                return;
            }
            this.displayFinancialInfo();
        },
        displayFinancialInfo(){
            this.showTransactionsOfAllAccounts();
            this.showBalanceOfAccounts();
            this.getListOfCategories();
        },
        async showBalanceOfAccounts() {
            const res = await fetch('api/accounts/balance', {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.accountsBalance = await res.json();
        },
        async showTransactionsOfAllAccounts() {
            const res = await fetch('api/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.transactions = await res.json();
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
    created() {
        this.checkCredentials();
        this.displayFinancialInfo();
    },

}
</script>

<style lang="scss">



#accounts {

    max-width: 60%;
    margin: 20px auto;
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

    padding-bottom: 50px;

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
