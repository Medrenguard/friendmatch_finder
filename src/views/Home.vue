<template>
  <div>
    <input type="number" v-model="desiredId"/>
    <button @click="addById">Найти</button>
    <div class="cardList">
      <user-card
        v-for="user in users"
        :id="user.id"
        :first_name="user.first_name"
        :last_name="user.last_name"
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
      desiredId: 0,
      access_token: localStorage.access_token
    }
  },
  methods: {
    addById () {
      axios.post('https://api.vk.com/method/users.get?user_id=' + this.desiredId + '&v=5.131&access_token=' + this.access_token)
        .then(res => {
          if (this.users.findIndex(user => user.id === parseInt(this.desiredId)) === -1) {
            this.users.push(
              {
                id: res.data.response[0].id,
                first_name: res.data.response[0].first_name,
                last_name: res.data.response[0].last_name
              }
            )
          }
        })
        .catch(error => {
          console.log('Ошибка получения данных: ', error)
        }
        )
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
</style>
