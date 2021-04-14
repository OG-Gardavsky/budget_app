<template>
    <div>
        <Header />

        <div id="menuItems">

            <router-link to="categories">
                <md-card md-with-hover>
                    <md-card-header>
                        <div class="md-title">Category management</div>
                    </md-card-header>
                </md-card>
            </router-link>


            <router-link to="blank" >
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
</style>
