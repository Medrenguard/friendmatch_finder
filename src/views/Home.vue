<template>
  <div>
    <input type="number" v-model="desiredId"/>
    <button @click="addById">Найти</button>
    <div class="cardList">
      <user-card
        v-for="user in users"
        :id="user.id"
        :fullname="user.fullname"
        :sex="user.sex"
        :bdate="user.bdate"
        :photo_url="user.photo_url"
        :friends_count="user.friends_count"
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
      axios.post('https://api.vk.com/method/users.get?user_id=' + this.desiredId + '&v=5.131&access_token=' + this.access_token + '&fields=sex,photo_50,counters,bdate')
        .then(res => {
          if (!res.data.response[0].deactivated && this.users.findIndex(user => user.id === parseInt(this.desiredId)) === -1) {
            this.users.push(
              {
                id: res.data.response[0].id,
                fullname: res.data.response[0].first_name + ' ' + res.data.response[0].last_name,
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
    }
  }
}
</script>

<style scoped>
</style>
