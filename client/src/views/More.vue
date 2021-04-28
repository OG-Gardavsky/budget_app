<template>
    <div>
        <md-dialog-alert
            :md-active.sync="displayError"
            :md-content="errorMessage"
            md-confirm-text="ok" />

        <Header />

        <div id="menuItems" style="padding-bottom: 50px">

            <router-link to="categories">
                <md-card md-with-hover>
                    <md-card-header>
                        <div class="md-title">Category management</div>
                    </md-card-header>
                </md-card>
            </router-link>


            <router-link to="invests" >
                <md-card md-with-hover>
                        <md-card-header>
                            <div class="md-title">Investments</div>
                        </md-card-header>
                </md-card>
            </router-link>


            <router-link to="debts" >
                <md-card md-with-hover>
                    <md-card-header>
                        <div class="md-title">Debts</div>
                    </md-card-header>
                </md-card>
            </router-link>



        </div>

        <custom-menu />
    </div>
</template>

<script>
import Header from "@/components/Header";
import CustomMenu from "@/components/CustomMenu";
export default {
    name: "More",
    components: {CustomMenu, Header},
    created() {
        this.checkCredentials();
    }
}
</script>

<style lang="scss" scoped>
    router-link {
        margin: 5px;
    }

    .md-card {
        max-width: 60%;
        margin: 20px auto;

        @media screen and (max-width: 560px) {
            max-width: 90%;
        }

        .md-card {
            padding: 10px;
            margin: 10px 0;
        }
    }
</style>
