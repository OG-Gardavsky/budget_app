<template>
    <div>
        <div id="categories">
            <span :key="account.accountId" v-for="account in accountsBalance" @click="showTransactionsOfSpecificAccount(account)">
                <p>{{account.accountName}}</p>
                <p >{{account.balance}} {{account.currency}}</p>
            </span>

            <md-button class="md-button md-primary" @click="showAddAccount">add <br/> account</md-button>
            <add-account :show-add-account-dialog="showAddAccountDialog" @on-closeModal="closeAddAccount" @on-save="refresh" />

        </div>


    </div>
</template>

<script>
export default {
    name: "Categories",
    methods: {
        async displayCategories() {
            const res = await fetch('api/categories', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.accountsBalance = await res.json();
        },
    },
    created() {
        this.displayCategories();
    }
}
</script>

<style scoped>

</style>
