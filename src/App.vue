<template>
  <div id="app">
    <component :is="currentView"></component>
  </div>
</template>

<script>
import Home from './views/Home.vue'
import Friend from './views/Friend.vue'

export default {
  name: 'App',
  components: {Home, Friend},
  data () {
    return {
      currentView: this.$store.getters.CURRENT_VIEW
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
