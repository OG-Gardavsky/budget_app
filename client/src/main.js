import Vue from 'vue'
import App from './App.vue'
import router from './router'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial)

Vue.config.productionTip = false;

Vue.mixin({
    data() {
        return {
            spinnerDisplayed: true,
            userInfo: {}
        }
    },
    methods: {
        displayCustomError(errorMesage) {
            alert(errorMesage);
        },
        showSpinner() {
            this.spinnerDisplayed = true;
        },
        hideSpinner() {
            this.spinnerDisplayed = false
        },
        async getUserInfo() {
            const res = await fetch('api/users', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.userInfo = await res.json();
        },
        async checkCredentials() {
            //code checks if user is authenticated - return 0 if everything is fine
            if (localStorage.getItem('userToken') === null) {
                this.displayCustomError('You are not authenticated, please logged in');
                return router.push('/');
            }
            await this.getUserInfo();
            if (this.userInfo.hasOwnProperty('error')) {
                localStorage.removeItem('userToken');
                this.displayCustomError('You are not authenticated, please logged in');
                return router.push('/');
            }
            return 0;
        },
        async getListOfAccounts() {
            const res = await fetch('api/accounts', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.listOfAccounts = await res.json();
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
        async getListOfCategories() {
            const res = await fetch('api/categories', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.listOfCategories = await res.json();
        },
        async showBalanceOfAccounts(type) {
            const res = await fetch('api/accounts/balance?type=' + type, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.accountsBalance = await res.json();
        },
        async getTotalBalanceByAccType(accType) {
            const res = await fetch('api/stats/balance?type=' + accType, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
            });

            if (res.status !== 200) {
                return this.displayCustomError('Error during loading statistics');
            }

            const sumObject = await res.json();

            return sumObject.length === 0 ? 0 : sumObject.sum;
        },
        async getBalanceForAccount(accountId) {
            const res = await fetch('api/accounts/id:' + accountId + '/balance', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
            });

            if (res.status !== 200) {
                return this.displayCustomError('Error during loading account balance');
            }

            const sumObject = await res.json();

            return sumObject;
        }
    },
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
