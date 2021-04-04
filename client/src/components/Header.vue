<template>
    <div>
        <h1>Budget app</h1>

        <md-button class="md-primary md-raised" @click="logOut">log out</md-button>
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

<style scoped>

    html, body{
        width:100%;
        height:100%;
        margin:0px;
        border-bottom: 1px solid #797979;
    }

    div {
        width:100%;
        height:100%;
        margin:0px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1px solid #797979;
        /*position: sticky;*/
        background-color: #9e9e9e;
    }


    button{
        background-color: #032d03;
        margin: 10px
    }

    h1 {
        margin: 10px
    }
    button:hover{
        background-color: #054e05;
    }

</style>
