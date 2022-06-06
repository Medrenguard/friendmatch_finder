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
  computed: {
    currentView () {
      return this.$store.getters.CURRENT_VIEW
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
.user-card {
  border: 1px solid black;
  border-radius: 6px;
  padding: 8px;
  margin-top: 5px;
  background: linear-gradient(to bottom right, #ffdfff, #fefaff);
  display: flex;
  font-size: 11px;
}
.user-card__photo, .user-card__checkbox {
  display: flex;
}
.user-card__checkbox {
  padding-right: 6px;
}
.user-card__photo > img, .user-card__checkbox > input {
  align-self: center;
}
.user-card__main {
  flex-grow: 1;
  padding: 0 10px;
}
.user-card__main .name {
  font-size: 16px;
}
.user-card__id {
  color: gray;
}
</style>
