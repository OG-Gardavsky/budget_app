<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HomePage msg="Welcome to Budget App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomePage from "@/components/HomePage";

export default {
  name: 'Home',
  components: {
    HomePage
  }
}
</script>
