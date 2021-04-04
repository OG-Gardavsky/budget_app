<template>
    <div >
        <Header />

        <div>

            <md-card>
                <md-card-header>
                    <div class="md-title">name: {{userInfo.name}} </div>
                </md-card-header>
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


            <md-card>
                <md-card-header>
                    <div class="md-title">Primar currency</div>
                    <md-field>
                        <label>Currency</label>
                        <md-select v-model="necoNevalidniho">
                            <md-option value="CZK">CZK</md-option>
                            <md-option value="USD">USD</md-option>
                            <md-option value="EUR">EUR</md-option>
                        </md-select>
                    </md-field>
                </md-card-header>
                <md-card-actions>
                    <md-button class="md-primary" @click="displayCustomError('this does nothing so far')">Change</md-button>
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
            oldPassword: '',
            newPassword: ''
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
            }
        }
    },
    created() {
        this.checkCredentials()
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
