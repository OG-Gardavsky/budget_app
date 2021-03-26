<template>
    <div>
        <Header />

        <md-button class="md-primary md-raised" @click="displayDialog">add category</md-button>
        <add-category  :show-dialog="showAddDialog" @on-closeModal="hideDialog" @on-save="getListOfCategories"/>

        <div id="categories">
            <span :key="category._id" v-for="category in listOfCategories">
                <p>{{category.name}}</p>
            </span>
        </div>

        <CustomMenu />
    </div>
</template>

<script>
import Header from "@/components/Header";
import CustomMenu from "@/components/CustomMenu";
import AddCategory from "@/components/AddCategory";
export default {
    name: "Categories",
    components: {AddCategory, CustomMenu, Header},
    data(){
        return{
            listOfCategories: [],
            showAddDialog: false
        }
    },
    methods: {
        async getListOfCategories(account) {
            const res = await fetch('api/categories', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.listOfCategories = await res.json();
        },
        displayDialog() {
            this.showAddDialog = true;
        },
        hideDialog() {
            this.showAddDialog = false;
        }
    },
    created() {
        this.getListOfCategories();
    }
}
</script>


<style lang="scss">

#categories {
    align-items: center;
    max-width: 60%;
    margin: 0px auto;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }

    span {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 10px;
        border: 1px solid black;
        flex-direction: column;
    }

}


</style>
