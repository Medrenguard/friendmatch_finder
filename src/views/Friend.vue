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

export default {
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
  width: 50%;
  cursor: default;
}
</style>
