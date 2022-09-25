<template>
    <div class="user-card" :style="calcColor" @click="passToProfile(id)">
      <div class="user-card__photo">
       <img :src="photo_url" alt="Фото">
      </div>
      <div class="user-card__main">
        <div class="name">
          {{ fullname }}
        </div>
      <div class="user-card__id">
        {{ id }}
      </div>
      <div>
        Совпадений: {{ matches.length }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'friendCard',
  props: {
    id: Number,
    fullname: String,
    photo_url: String,
    matches: Array
  },
  methods: {
    passToProfile (idProfile) {
      this.$store.dispatch('passToProfile', idProfile)
    }
  },
  computed: {
    calcColor () {
      let res = this.$store.getters.FRIENDS.find(el => el.id === this.id).matches.length / this.$store.getters.MARKED_USERS.length
      return 'background: linear-gradient(to bottom right, rgba(255, 0, 246, ' + res + ' ), rgba(0, 0, 0, 0))'
    }
  }
}
</script>

<style scoped>
.user-card {
  cursor: pointer;
}
.user-card__id {
  color: black;
  text-align: inherit;
}
</style>
