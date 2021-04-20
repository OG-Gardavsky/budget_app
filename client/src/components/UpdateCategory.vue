<template>
    <md-dialog :md-active.sync="showDialog">

        <md-dialog-alert
            :md-active.sync="displayError"
            :md-content="errorMessage"
            md-confirm-text="ok" />

        <md-dialog-content>

            <md-dialog-title>Update of category</md-dialog-title>

            <md-field>
                <label>Enter Name for Account</label>
                <md-input type="text" v-model="name" placeholder="Name" required />
            </md-field>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog">Close</md-button>
                <md-button class="md-primary" @click="updateCategory">update category</md-button>
            </md-dialog-actions>

        </md-dialog-content>

    </md-dialog >
</template>

<script>
export default {
    name: "UpdateCategory",
    props: {
        showDialog: Boolean,
        categoryToUpdate: Object
    },
    data() {
        return {
            name: null,
            categoryId: null
        }
    },
    methods: {
        closeDialog() {
            this.$emit('on-closeModal');
        },
        clearVariables() {
            this.name = null;
        },
        async updateCategory(){
            const res = await fetch('api/categories/id:' + this.categoryId, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
                body: JSON.stringify({name: this.name})
            });

            if (res.status === 200){
                this.$emit('on-save');
                this.$emit('on-closeModal');
                this.clearVariables();
            } else {
                this.displayCustomError('Error during update');
            }
        },
    },
    created() {
        this.name = this.categoryToUpdate.name;
        this.categoryId = this.categoryToUpdate._id;
    }
}
</script>

<style scoped>

</style>
