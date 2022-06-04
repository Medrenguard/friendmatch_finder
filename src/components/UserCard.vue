<template>
    <div class="user-card">
      <div class="user-card__checkbox">
        <input type="checkbox" @click="toggleUserCheckbox">
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
      <div class="user-card__id">
        {{ id }}
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
      this.$emit('toggle-user-checkbox', this.id)
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
