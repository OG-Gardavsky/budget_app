<template>
    <md-dialog :md-active.sync="showDialog">

        <div id="dialogContent">

            <md-dialog-title>Add category</md-dialog-title>

            <md-field>
                <label>Enter Name for Account</label>
                <md-input type="text" v-model="name" placeholder="Name" required />
            </md-field>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog">Close</md-button>
                <md-button class="md-primary" @click="addCategory">add category</md-button>
            </md-dialog-actions>

        </div>

    </md-dialog >
</template>

<script>
export default {
    name: "AddCategory",
    data() {
        return {
            name: null
        }
    },
    props: {
        showDialog: Boolean,
    },
    methods: {
        async addCategory() {
            if (this.name === null) {
                return this.displayCustomError('Please fill name');
            }

            const body = {
                name: this.name
            }

            const res = await fetch('api/categories', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                },
                body: JSON.stringify(body)
            });

            if (res.status === 201){
                this.$emit('on-save');
                this.$emit('on-closeModal');
                this.clearVariables();
            } else {
                this.displayCustomError('Error during saving');
            }
        },
        closeDialog(){
            this.$emit('on-closeModal');
        },
        clearVariables(){
            this.name = null;
        },
    }
}
</script>

<style lang="scss">

#dialogContent{
    margin: 10px;
}

</style>
