<template>
    <button @click="logOut">logout</button>
</template>

<script>
import router from "@/router";

export default {
    name: "Header",
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

                if (res.status === 200) {
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
