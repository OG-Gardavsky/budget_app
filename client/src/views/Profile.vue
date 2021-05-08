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

        <div v-if="deleteAccountMode === false">

            <md-card>
                <md-card-header>
                    <div class="md-title">name: {{userInfo.name}} </div>
                    <div class="md-title">email: {{userInfo.email}} </div>
                </md-card-header>
            </md-card>


            <md-card v-if="listOfCurrencyNames !== null">
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


            <md-card >
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

                    <md-field>
                        <label>Re-Enter new password for check</label>
                        <md-input type="password" v-model="newPasswordCheck" placeholder="Re-Enter New password" />
                    </md-field>

                </md-card-header>

                <md-card-actions>
                    <md-button class="md-primary" @click="changePassword">change password</md-button>
                </md-card-actions>
            </md-card>

        </div>


        <div style="padding-bottom: 60px">
            <md-card>

                <md-card-content>

                    <div class="md-headline">Delete my data</div>
                    <div class="md-subhead">
                        This action will delete all your data
                        <span v-if="deleteAccountMode === true">, and you cannot restore them after this.</span>
                        <span v-if="deleteAccountMode === true">confirm your choice by entering your password</span>

                    </div>

                    <md-field v-if="deleteAccountMode === true" >
                        <label>Enter current password</label>
                        <md-input type="password" v-model="passwordConfirmDelete" placeholder="Password confirm" />
                    </md-field>

                </md-card-content>

                <md-card-actions style="display: flex; justify-content: space-between ">

                    <md-button class="md-primary" @click="deleteAccountMode = !deleteAccountMode">
                        <span v-if="deleteAccountMode === false">go to delete</span>
                        <span v-if="deleteAccountMode === true">back to profile</span>
                    </md-button>
                    <md-button v-if="deleteAccountMode === true" class="md-raised md-accent" @click="deleteUser">Delete</md-button>

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
            newPasswordCheck: null,

            listOfCurrencies: null,
            listOfCurrencyNames: null,
            currencyName: null,

            deleteAccountMode: false,

            passwordConfirmDelete: null,
        }
    },
    methods: {
        async changePassword(){

            if (this.newPassword !== this.newPasswordCheck) {
                return this.displayCustomError('New password do not match')
            }


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

            if (this.currencyName === '') {
                return this.displayCustomError('please fill your Default Currency')
            }

            const isPrimarCurrencyValid = this.listOfCurrencies.find(currency => currency.currencyName === this.currencyName);
            if (isPrimarCurrencyValid === undefined) {
                return this.displayCustomError('Currency must be chosen from list of currencies.')
            }
            const primarCurrency = isPrimarCurrencyValid.id;


            const res = await fetch('api/users/currency', {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
                body: JSON.stringify({ primarCurrency })
            });

            const resBody = await res.json();

            if (resBody.error) {
                return  this.displayCustomError(resBody.error);
            }
            if (res.status !== 200){
                return  this.displayCustomError('Error during changing primar Currency');
            }

        },
        async deleteUser() {

            if ([null, ''].includes(this.passwordConfirmDelete)){
                return this.displayCustomError('fill password to finish deleting.');
            }

            const res = await fetch('api/users/me', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
                body: JSON.stringify({ password: this.passwordConfirmDelete }),
            });

            if (res.status === 200){
                this.displayCustomError('Your account was deleted, goodbye')
                return await router.push('/');
            }

            try {
                const responseBody = await res.json();
                if (responseBody.error) {
                    this.displayCustomError(responseBody.error);
                }
            } catch (e) {
                this.displayCustomError('Error during deleting account');
            }

        },
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
