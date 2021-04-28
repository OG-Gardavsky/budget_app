<template>
    <div>
        <md-dialog-alert
            :md-active.sync="displayError"
            :md-content="errorMessage"
            md-confirm-text="ok" />

        <Header />
        <md-empty-state
            md-icon="cloud_off"
            md-label="There is nothing yet"
            md-description="this funkcionality will be added">
        </md-empty-state>
        <CustomMenu />
    </div>
</template>

<script>
import Header from "@/components/Header";
import CustomMenu from "@/components/CustomMenu";
export default {
    name: "BlankPage",
    components: {CustomMenu, Header},
    created() {
        this.checkCredentials();
    }
}
</script>

<style scoped>

</style>
