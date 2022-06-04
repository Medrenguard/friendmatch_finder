<template>
  <div>
    <input type="number" v-model="desiredId"/>
    <button @click="addById">Найти</button>
    <input type="number" v-model="removableId"/>
    <button @click="deleteById">Удалить</button>
    <div class="cardList">
      <user-card
        v-for="user in sortedUsers"
        :id="user.id"
        :fullname="user.fullname"
        :sex="user.sex"
        :bdate="user.bdate"
        :photo_url="user.photo_url"
        :friends_count="user.friends_count"
         @toggle-user-checkbox="toggleUserCheckbox"
        :key="user.id"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import UserCard from '../components/UserCard.vue'

export default {
  components: { UserCard },
  name: 'Home',
  data () {
    return {
      users: [],
      markedUsers: [],
      desiredId: 0,
      removableId: 0,
      access_token: localStorage.access_token
    }
  },
  methods: {
    addById () {
      axios.post('https://api.vk.com/method/users.get?user_id=' + this.desiredId + '&v=5.131&access_token=' + this.access_token + '&fields=sex,photo_50,counters,bdate')
        .then(res => {
          if (!res.data.response[0].deactivated && this.users.findIndex(user => user.id === parseInt(this.desiredId)) === -1) {
            this.users.push(
              {
                id: res.data.response[0].id,
                fullname: res.data.response[0].last_name + ' ' + res.data.response[0].first_name,
                sex: res.data.response[0].sex,
                bdate: res.data.response[0].bdate,
                photo_url: res.data.response[0].photo_50,
                friends_count: res.data.response[0].counters['friends']
              }
            )
          }
        })
        .catch(error => {
          console.log('Ошибка получения данных: ', error)
        }
        )
    },
    deleteById () {
      let index = this.users.findIndex(user => user.id === parseInt(this.removableId))
      return index > -1 ? this.$delete(this.users, index) : console.log('Пользователь дял удаления не найден')
    },
    toggleUserCheckbox (userId) {
      if (!this.markedUsers.includes(userId)) {
        this.markedUsers.push(userId)
      } else {
        this.$delete(this.markedUsers, this.markedUsers.indexOf(userId))
      }
    }
  },
  computed: {
    sortedUsers () {
      let res = Array.from(this.users)
      res.sort(function (a, b) {
        return a.fullname < b.fullname ? -1 : 1
      })
      return res
    }
  }
}
</script>

<style scoped>
</style>
