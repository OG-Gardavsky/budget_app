<template>
    <div>

        <Header />
        <md-button class="md-primary md-raised" @click="displayDialog">add category</md-button>
        <add-category  :show-dialog="showAddDialog" @on-closeModal="hideDialog" @on-save="getListOfCategories"/>

        <div id="categories">
            <div :key="category._id" v-for="category in listOfCategories" >
                <md-card md-with-hover class="categoryCard">
                    <md-card-header>
                        <div class="md-title">{{category.name}}</div>
                    </md-card-header>
                    <md-card-actions>
                        <md-button class="md-raised" @click="deleteCategory(category)">del</md-button>
                    </md-card-actions>
                </md-card>
            </div>
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
        refresh() {
            this.getListOfCategories();
        },
        displayDialog() {
            this.showAddDialog = true;
        },
        hideDialog() {
            this.showAddDialog = false;
        },
        async getListOfCategories(account) {
            const res = await fetch('api/categories', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            this.listOfCategories = await res.json();
        },
        async deleteCategory(category) {
            const answer = window.confirm('Are you sure you want to delete transation with name ' + category.name);

            if (!answer) {
                return;
            }

            const res = await fetch('api/categories/id:' + category._id, {
                method: 'Delete',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });


            if (res.status !== 200){
                return this.displayCustomError('Error during deleting of ' + category.name);
            }

            await this.refresh();
        }
    },
    created() {
        this.checkCredentials();
        this.getListOfCategories();
    }
}
</script>


<style lang="scss">

#categories {
    align-items: center;
    max-width: 60%;
    margin: 0px auto;

    padding-bottom: 60px;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }

    #categoryCard{
        display: flex;
    }
}


</style>
