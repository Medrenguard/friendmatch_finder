<template>
    <div class="user-card" :style="calcColor" @click="passToProfile">
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
    markedCount: Number,
    matches: Number
  },
  methods: {
    passToProfile () {
      this.$store.commit('changeView', 'Friend')
    }
  },
  computed: {
    calcColor () {
      let res = this.matches / this.markedCount
      return 'background: linear-gradient(to bottom right, rgba(255, 0, 246, ' + res + ' ), rgba(0, 0, 0, 0))'
    }
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
