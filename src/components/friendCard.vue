<template>
  <div class="user-card" :style="calcColor" @click="passToProfile(id)">
    <div class="user-card__photo">
      <img :src="photo_url" alt="Фото">
    </div>
    <div class="user-card__main">
      <div class="name">
        {{ fullname }}
      </div>
      <div class="other">
        <div class="user-card__id">
          {{ id }}
        </div>
        <div>
          Совпадений: {{ matches.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
    ...mapGetters([
      'MARKED_USERS_COUNT'
    ]),
    calcColor () {
      let res = this.matches.length / this.MARKED_USERS_COUNT
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
.user-card__main{
  position: relative;
}
</style>
