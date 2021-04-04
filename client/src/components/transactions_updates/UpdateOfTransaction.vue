<template>
    <md-dialog :md-active.sync="showDialog">

        <div id="dialogContent">

            <md-dialog-title>Update of transacation</md-dialog-title>

            <div v-if="transactionToUpdate.type === 'basic'">
                <h1>Basic transakce</h1>
                <md-field>
                    <label>Enter Name for Account</label>
                    <md-input type="text"  placeholder="Name" required />
                </md-field>
            </div>




            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog">Close</md-button>
                <md-button class="md-primary" @click="addCategory">update</md-button>
            </md-dialog-actions>

        </div>

    </md-dialog >
</template>

<script>
export default {
    name: "UpdateOfTransaction",
    props: {
        showDialog: Boolean,
        transactionId: String,
        refresh: Object,
        transactionToUpdate: Object
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
