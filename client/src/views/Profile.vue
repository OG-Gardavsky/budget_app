<template>
    <div >
        <md-dialog-alert
            :md-active.sync="displayError"
            :md-content="errorMessage"
            md-confirm-text="ok" />

        <md-dialog-alert
            :md-active.sync="displayError"
            :md-content="errorMessage"
            md-confirm-text="ok" />

        <Header />

        <div>

            <md-card>
                <md-card-header>
                    <div class="md-title">name: {{userInfo.name}} </div>
                    <div class="md-title">email: {{userInfo.email}} </div>
                </md-card-header>
            </md-card>


            <md-card>
                <md-card-header>
                    <div class="md-headline">Default currency</div>
                    <div class="md-subhead">Change will not calculate to new currency, just changes label</div>
                    <md-autocomplete v-model="currencyName" :md-options="listOfCurrencyNames">
                        <label>Default currency</label>
                    </md-autocomplete>

                </md-card-header>
                <md-card-actions>
                    <md-button class="md-primary" @click="changePrimarCurrency">Change</md-button>
                </md-card-actions>
            </md-card>


            <md-card>
                <md-card-header>
                    <div class="md-title">Change password</div>
                    <div class="md-subhead">After changing password you are logged out from all devices.</div>

                    <md-field>
                        <label>Enter current password</label>
                        <md-input type="password" v-model="oldPassword" placeholder="Current password" />
                    </md-field>

                    <md-field>
                        <label>Enter new password - min. 10 characters</label>
                        <md-input type="password" v-model="newPassword" placeholder="New password" />
                    </md-field>

                </md-card-header>

                <md-card-actions>
                    <md-button class="md-primary" @click="changePassword">change password</md-button>
                </md-card-actions>
            </md-card>

        </div>




        <CustomMenu />
    </div>
</template>

<script>
import Header from "@/components/Header";
import CustomMenu from "@/components/CustomMenu";
import router from "@/router";
export default {
    name: "Profile",
        components: {CustomMenu, Header},
    data() {
        return {
            oldPassword: null,
            newPassword: null,

            listOfCurrencies: null,
            listOfCurrencyNames: null,
            currencyName: null,
        }
    },
    methods: {
        async changePassword(){


            const res = await fetch('api/users/password', {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
                body: JSON.stringify({
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword
                })
            });


            const resBody = await res.json();

            if (res.status === 200){
                this.displayCustomError('Password changed succesfully, log in again with new password');
                localStorage.removeItem('userToken');
                await router.push('/');
            } else if (resBody.error) {
                this.displayCustomError(resBody.error);
            } else {
                this.displayCustomError('Error during changing password');
            }
        },
        async changePrimarCurrency(){

            const primarCurrency = this.listOfCurrencies.find(currency => currency.currencyName === this.currencyName).id;


            const res = await fetch('api/users/currency', {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
                body: JSON.stringify({ primarCurrency })
            });

            const resBody = await res.json();

            if (res.status === 200){
                this.displayCustomError('currency changed succesfully')
            } else if (resBody.error) {
                this.displayCustomError(resBody.error);
            } else {
                this.displayCustomError('Error during changing password');
            }
        }
    },
    async created() {
        await this.checkCredentials();

        this.listOfCurrencies = await this.getListOfCurrencies();
        this.listOfCurrencyNames = this.listOfCurrencies.map(currencyObject => currencyObject.currencyName);
        this.currencyName = this.listOfCurrencies.find(currency => currency.id === this.userInfo.primarCurrency).currencyName;
    }
}
</script>
<style scoped lang="scss">

.md-card {
    align-items: center;
    max-width: 60%;
    margin: 5px auto;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }

}


</style>
