<template>
    <button v-on:click="onClick">{{textOfButton}}</button>
</template>

<script>
export default {
    name: 'customButton',
    props: {
        textOfButton: String
    },
    methods: {
        onClick() {
            this.$emit('on-click');
        }
    }
}
</script>

<style scoped>

    button{
        height:40px;
        padding: 5px 5px;
        margin: 10px 5px;
        font-weight:bold;
        background-color: #91c27f;
        border:none;
        color:#e0dada;
        cursor:pointer;
        font-size:16px;
    }

    button:hover{
        background-color: #58724a;
    }

</style>
