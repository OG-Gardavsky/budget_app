<template>
    <div>
        <Header />


        <md-card id="totalBalanceCard" v-if="selectedAccount === null">
            <md-content>
                <md-card-header>
                    <div class="md-title">Total debts: <span v-if="totalDebtsSum !== null">{{totalDebtsSum}}</span> </div>
                </md-card-header>

            </md-content>
        </md-card>



        <div :key="account.accountId" v-for="account in accountsBalance"
             v-if="selectedAccount === null"
             @click="selectedAccount = account ; selectedAccount.balance = account.balance; showTransactionsOfSpecificAccount(account) "
        >
            <md-card
                class="debtAccount" md-with-hover
            >
                <md-content>

                    <md-card-header>
                        <div class="md-title">
                            <span>{{account.name}}</span>
                            <span> <span v-if="account.balance > 0">+ </span> {{account.balance}} {{account.currency}}</span>
                        </div>
                    </md-card-header>
                </md-content>
            </md-card>
        </div>




        <div v-if="selectedAccount !== null" id="accountDetails">

            <md-card id="accountCard">
                <md-content >
                    <md-button class="md-icon-button  md-primary"  @click="selectedAccount = null ; selectedAccountTransactions = null" >
                        <md-icon>arrow_back_ios</md-icon>
                    </md-button>
                    <div class="md-title">{{selectedAccount.name}}</div>
                    <div class="md-title">{{selectedAccount.balance}} {{selectedAccount.currency}}</div>
                </md-content>
            </md-card>


            <md-button class="md-button md-primary md-raised" @click="deleteAccount">delete account</md-button>
            <md-button class="md-button md-primary md-raised" @click="showUpdateAccountDialog = true">edit account</md-button>

            <UpdateAccount v-if="showUpdateAccountDialog === true"
                           :show-update-account-dialog="showUpdateAccountDialog"
                           :account-to-update="selectedAccount"
                           @on-save="refresh" @on-closeModal="showUpdateAccountDialog = false"
            />





            <md-card :key="transaction._id" v-for="transaction in selectedAccountTransactions" md-with-hover>

                <md-content class="transactionContent">

                    <div class="baseInfo">
                        <div class="md-title">{{transaction.subtype}}</div>
                        <div class="md-title">{{transaction.amount}} {{transaction.currency}}</div>
                    </div>

                    <div class="md-subhead">neco</div>

                </md-content>

            </md-card>


        </div>






        <CustomMenu  :refresh="refresh" />
    </div>
</template>

<script>
import Header from "@/components/Header";
import CustomMenu from "@/components/CustomMenu";
import UpdateAccount from "@/components/UpdateAccount";
export default {
name: "Debts",
    components: {UpdateAccount, CustomMenu, Header},
    data() {
        return {
            confirmationDialog: true,

            showUpdateAccountDialog: false,

            accountsBalance: null,
            totalDebtsSum: null,

            selectedAccount: null,
            selectedAccountTransactions: null
        }
    },
    methods: {
        async refresh() {
            this.accountsBalance = this.showBalanceOfAccounts('debt');
            this.totalDebtsSum = await this.getTotalBalanceByAccType('debt');


        },
        async showTransactionsOfSpecificAccount(account) {
            const res = await fetch('api/accounts/id:' + account._id.toString() + '/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.selectedAccountTransactions = await res.json();
        },
        async deleteAccount(){
            const answer = window.confirm('Are you sure you want to delete account: ' + this.selectedAccount.name + '? Include all transactions');

            if (!answer) {
                return;
            }

            const res = await fetch('api/accounts/id:' + this.selectedAccount._id, {
                method: 'Delete',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });

            if (res.status !== 200){
                return this.displayCustomError('Error during deleting of ' + this.selectedAccount.name);
            }

            this.selectedAccount = null;
            await this.refresh();
        },
    },
    created() {
        this.refresh();
    }
}
</script>

<style scoped lang="scss">

#accountDetails {
    max-width: 60%;
    margin: 20px auto;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }
    .md-card {
        padding: 10px;
        margin: 10px 0;
    }

    #accountCard {

        .md-content {
            padding: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
    }

    .transactionContent {
        .baseInfo {
            padding: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
    }


}

#totalBalanceCard {
    align-items: center;
    max-width: 60%;
    margin: 20px auto;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }
}

.debtAccount {
    align-items: center;
    max-width: 60%;
    margin: 5px auto;
    padding: 10px 0px;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }

    .md-title {
        display: flex;
        justify-content: space-between;
    }
}
</style>
