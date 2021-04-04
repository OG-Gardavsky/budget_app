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
        }
    },
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
