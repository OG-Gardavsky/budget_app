import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from "@/views/Login";
import Home from "@/views/Home";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    }
]

const router = new VueRouter({
    routes
})

export default router
