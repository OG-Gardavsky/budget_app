<template>
    <custom-button text-of-button="log out" @on-click="logOut"/>
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

            if (answer) {

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
        }

    },
}
</script>

<style scoped>

</style>
