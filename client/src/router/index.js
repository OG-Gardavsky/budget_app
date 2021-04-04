import Vue from 'vue';
import VueRouter from 'vue-router';
import login from "@/views/Login";
import Home from "@/views/Home";
import SignUp from "@/views/SignUp";
import Categories from "@/views/Categories";
import More from "@/views/More";
import BlankPage from "@/views/BlankPage";
import Profile from "@/views/Profile";

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
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile
    },
    {
        path: '/categories',
        name: 'categories',
        component: Categories
    },
    {
        path: '/more',
        name: 'more',
        component: More
    },
    {
        path: '/blank',
        name: 'blank',
        component: BlankPage
    }
]

const router = new VueRouter({
    routes
});

export default router;
