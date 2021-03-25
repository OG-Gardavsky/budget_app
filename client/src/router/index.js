import Vue from 'vue';
import VueRouter from 'vue-router';
import login from "@/views/Login";
import Home from "@/views/Home";
import SignUp from "@/views/SignUp";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'login',
        component: login
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/signup',
        name: 'signUp',
        component: SignUp
    }
]

const router = new VueRouter({
    routes
});

export default router;
