<template>
    <div class="user-card">
      <div class="user-card__checkbox">
        <input type="checkbox" @click="toggleUserCheckbox" :checked="isChecked">
      </div>
      <div class="user-card__photo">
       <img :src="photo_url" alt="Фото">
      </div>
      <div class="user-card__main">
        <div class="name">
          {{ fullname }}
        </div>
        <div>
          Пол: {{ sex | numToSex }}
        </div>
        <div>
          Возраст: {{ bdate | dateToAge }}
        </div>
        <div>
          Друзей: {{ friends_count }}
        </div>
      </div>
      <div class="user-card__tech">
        <div class="user-card__id">
          {{ id }}
        </div>
        <div class="rubbish-img" @click="deleteUser"></div>
      </div>
    </div>
</template>

<script>

export default {
  name: 'UserCard',
  props: {
    id: Number,
    fullname: String,
    sex: Number,
    bdate: String,
    photo_url: String,
    friends_count: Number
  },
  data () {
    return {
    }
  },
  filters: {
    numToSex (num) {
      let values = ['не указано', 'женский', 'мужской']
      return values[num]
    },
    dateToAge (value) {
      if (value !== undefined) {
        let d = value.split('.')
        if (d[2] !== undefined) {
          value = d[2] + '.' + d[1] + '.' + d[0]
          return ((new Date().getTime() - new Date(value)) / (24 * 3600 * 365.25 * 1000)) | 0
        }
      }
      return 'не указано'
    }
  },
  methods: {
    toggleUserCheckbox () {
      if (!this.$store.getters.MARKED_USERS.includes(this.id)) {
        this.$store.commit('pushMarkedUser', this.id)
      } else {
        this.$store.commit('deleteMarkedUser', this.id)
      }
      this.$store.dispatch('clearFriends')
    },
    deleteUser () {
      if (this.$store.getters.MARKED_USERS.includes(this.id)) {
        this.$store.commit('deleteMarkedUser', this.id)
        this.$store.dispatch('clearFriends')
      }
      this.$store.commit('deleteUser', this.id)
    }
  },
  computed: {
    isChecked () {
      return this.$store.getters.MARKED_USERS.includes(this.id)
    }
  }
}

</script>
