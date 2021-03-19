<template>
    <div>
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Add transaction</md-dialog-title>


            <md-field>
                <label>Enter name of transaction</label>
                <md-input type="" v-model="password" placeholder="Name" />
            </md-field>

            <md-field>
                <label>Enter name of transaction</label>
                <md-input type="" v-model="password" placeholder="AMount" />
            </md-field>



            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog">Close</md-button>
                <md-button class="md-primary" @click="">Save</md-button>
            </md-dialog-actions>

        </md-dialog >

<!--        <md-button class="md-primary md-raised" @click="showDialog = true">Show Dialog</md-button>-->
    </div>
</template>

<script>
export default {
    name: "ModalWindow",
    props: {
        showDialog: Boolean
    },
    methods: {
        closeDialog(){
            this.$emit('on-closeModal');
        }
    }

    // data() {
    //     return {
    //         showDialog: false
    //     }
    // },
}
</script>

<style scoped>

</style>
