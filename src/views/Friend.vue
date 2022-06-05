<template>
  <div>
    <button @click="passToHome">
      Назад
    </button>
    <br/>
    Добавлен в друзья пользователями:
    <div
    class="user-card"
    v-for="user in users"
    :key="user.id"
    >
      <div class="user-card__photo">
        <img :src="user.photo_url" alt="Фото">
      </div>
      <div class="user-card__main">
        <div class="name">
          {{ user.fullname }}
        </div>
        <div class="user-card__id">
          {{ user.id }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import friendCard from '../components/friendCard.vue'
// import axios from 'axios'

export default {
  components: { friendCard },
  name: 'Friend',
  methods: {
    passToHome () {
      this.$store.dispatch('passToHome')
    }
  },
  data () {
    return {
      IDMatches: this.$store.getters.FRIENDS.find(el => el.id === this.$store.getters.ID).matches,
      users: []
    }
  },
  mounted () {
    this.IDMatches.forEach(idOfUser => {
      this.users.push(this.$store.getters.USERS.find(el => el.id === idOfUser))
    })
  }
}

</script>

<style scoped>
.user-card {
  border: 1px solid black;
  border-radius: 6px;
  padding: 8px;
  margin-top: 5px;
  background: linear-gradient(to bottom right, rgba(255, 0, 246, 100), rgba(0, 0, 0, 0));
  display: flex;
  font-size: 11px;
  width: 50%;
  cursor: default;
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
</style>
