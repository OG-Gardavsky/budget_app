<template>
    <Header/>
    <div class="about">
        <h1>This is an about page</h1>
    </div>
</template>


<script>
import router from "@/router";
import Header from "@/components/Header";

export default {
    name: 'About',
    components: {Header},
    async created() {
        if (localStorage.getItem('userToken') === null) {
            alert('You are not authenticated, please logged in');
            await router.push('/');
        }

    }
}
</script>
