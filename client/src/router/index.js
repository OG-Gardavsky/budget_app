import Vue from 'vue';
import VueRouter from 'vue-router';
import login from "@/views/Login";
import Home from "@/views/Home";
import SignUp from "@/views/SignUp";
import Categories from "@/views/Categories";
import More from "@/views/More";
import BlankPage from "@/views/BlankPage";
import Profile from "@/views/Profile";
import Stats from "@/views/Stats";
import Debts from "@/views/Debts";
import Invests from "@/views/Invests";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'login',
        component: login
    },
    {
        path: '/signup',
        name: 'signUp',
        component: SignUp
    },
    {
        path: '/home',
        name: 'home',
        component: Home
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
        path: '/stats',
        name: 'stats',
        component: Stats
    },
    {
        path: '/debts',
        name: 'debts',
        component: Debts
    },
    {
        path: '/invests',
        name: 'invests',
        component: Invests
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
