<template>
  <div id="app">
    <Home v-show="currentView === 'Home'"></Home>
    <Friend v-if="currentView === 'Friend'"></Friend>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Home from './views/Home.vue'
import Friend from './views/Friend.vue'

export default {
  name: 'App',
  components: {Home, Friend},
  computed: {
    ...mapState([
      'currentView'
    ])
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
  text-align: end;
}
.user-card__tech {
  min-width: 60px;
  position: relative;
}
.rubbish-img {
  background-image: url(assets/rubbish.png);
  background-size: contain;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 38%;
  left: 38%;
}
.rubbish-img:hover {
  background-image: url(assets/rubbish-hover.png);
  cursor: pointer;
}

@media screen and (min-width: 669px) and (max-width: 768px) {
  .user-card {
    padding: 6px;
  }
  .user-card__checkbox {
    padding-right: 4px;
  }
  .user-card__main {
    font-size: 1.4vw;
    padding: 0 7px;
  }
  .user-card__main .name {
    font-size: 2vw;
  }
}

@media screen and (min-width: 600px) and (max-width: 669px) {
  .user-card {
    padding: 6px;
  }
  .user-card__checkbox {
    padding-right: 4px;
  }
  .user-card__main {
    font-size: 1.5vw;
    padding: 0 7px;
  }
  .user-card__main .name {
    font-size: 2.2vw;
  }
  .user-card__tech {
    min-width: 10vw;
  }
}
@media screen and (min-width: 481px) and (max-width: 600px) {
  .user-card {
    padding: 6px;
  }
  .user-card__checkbox {
    padding-right: 4px;
  }
  .user-card__checkbox input {
    margin: 0
  }
  .user-card__main {
    font-size: 1.5vw;
    padding: 0 5px;
  }
  .user-card__main .name {
    font-size: 2.2vw;
  }
  .user-card__tech {
    min-width: 10vw;
  }
  .user-card__id {
    font-size: 2vw;
  }
}
@media screen and (max-width: 480px) {
  .managePanel input {
    width: 34%;
  }
  .user-card {
    display: flex;
    flex-direction: column;
    padding: 4px;
  }
  .user-card__main {
    order: 0;
    padding: 0;
  }
  .user-card__main .name {
    margin-bottom: 2px;
  }
  .user-card__main .other {
    position: absolute;
    left: 62px;
  }
  .user-card__photo {
    order: 1
  }
  .user-card__checkbox {
    order: 2;
    padding: 6px 15px 4px 15px;
    width: min-content;
  }
  .user-card__tech {
    order: 4;
    position: relative;
  }
  .userList .user-card__id {
    position: absolute;
    right: 10px;
    bottom: 10px;
    font-size: 10px;
  }
  .rubbish-img {
    right: 1vw;
    bottom: 43px;
    left: auto;
    top: auto;
  }
}
</style>
