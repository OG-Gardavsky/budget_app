<template>
    <div>

        <md-dialog-alert
            :md-active.sync="displayError"
            :md-content="errorMessage"
            md-confirm-text="ok" />

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
                        <md-button class="md-raised"
                                   @click="showUpdateDialog = true; currentCategory = category"
                        >
                            edit
                        </md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </div>

        <update-category v-if="showUpdateDialog === true"
            :show-dialog="showUpdateDialog"
            :category-to-update="currentCategory"
            @on-closeModal="showUpdateDialog = false"
            @on-save="getListOfCategories"
        />

        <CustomMenu />
    </div>
</template>

<script>
import Header from "@/components/Header";
import CustomMenu from "@/components/CustomMenu";
import AddCategory from "@/components/AddCategory";
import UpdateCategory from "@/components/UpdateCategory";
export default {
    name: "Categories",
    components: {UpdateCategory, AddCategory, CustomMenu, Header},
    data(){
        return{
            listOfCategories: [],
            showAddDialog: false,
            showUpdateDialog: false,
            currentCategory: {}
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

            if (res.status === 200) {
                return this.refresh();
            }

            try {
                const responseBody = await res.json();
                if (responseBody.error) {
                    this.displayCustomError(responseBody.error);
                }
            } catch (e) {
                this.displayCustomError('Error during deleting of ' + category.name);
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


<style lang="scss" scoped>

#categories {
    padding-bottom: 60px;
}


.md-card {
    max-width: 60%;
    margin: 10px auto;

    @media screen and (max-width: 560px) {
        max-width: 90%;
    }
}


</style>
