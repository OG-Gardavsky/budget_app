<template>
    <div id="rootDiv">
        <div style="display: flex; flex-direction: row;  margin: 10px">
                <md-icon style="color: #fcfcfc">account_balance_wallet</md-icon>
            <h1>Budget app</h1>
        </div>



        <span v-if="displayProfilePicture()">

            <md-menu >
                <md-button class="md-icon-button md-raised " md-menu-trigger>
                    <md-icon>account_circle</md-icon>
                </md-button>

                <md-menu-content md-sync-route>

                    <md-menu-item to="profile" >
                        <md-icon>account_circle</md-icon>
                        <span>Profile</span>
                    </md-menu-item>

                     <md-menu-item @click="logOut" >
                        <md-icon>logout</md-icon>
                        <span>Log out</span>
                    </md-menu-item>

                </md-menu-content>

            </md-menu>

        </span>


    </div>
</template>

<script>
import router from "@/router";
import CustomButton from "@/components/customButton";

export default {
    name: "Header",
    components: {CustomButton},
    methods: {
        async logOut() {
            const answer = window.confirm("Are you sure you want to log out?");

            if (!answer) {
                return;
            }

            const res = await fetch('api/users/logout', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });

            if (res.status === 200 || res.status === 401) {
                localStorage.removeItem('userToken');
                router.push('/');
            }
        }
    },
}
</script>

<style scoped lang="scss">

    html, body{
        width:100%;
        height:100%;
        margin:0px;
    }

    #rootDiv {
        width:100%;
        height:100%;
        margin:0px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: #448aff ;

        h1 {
            margin: 10px;
            color: #fcfcfc;
        }

        .md-button{
            margin: 10px;
        }
    }

</style>
