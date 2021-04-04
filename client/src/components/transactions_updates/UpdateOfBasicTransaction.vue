<template>
    <md-dialog :md-active.sync="showDialog">

        <div id="dialogContent">

            <md-dialog-title>Update of transacation</md-dialog-title>


            <md-field>
                <label>Enter Name for Account</label>
                <md-input type="text"  placeholder="Name" required />
            </md-field>


            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog">Close</md-button>
                <md-button class="md-primary" @click="addCategory">update</md-button>
            </md-dialog-actions>

        </div>

    </md-dialog >
</template>

<script>
export default {
    name: "UpdateOfBasicTransaction",
    props: {
        showDialog: Boolean,
        transactionId: String,
        refresh: Object
    },
    data() {
        return {

        }
    },
    methods: {
        closeDialog(){
            this.$emit('on-closeModal');
        },
        clearVariables(){
            this.name = null;
        },
    }
}
</script>

<style scoped>

</style>
