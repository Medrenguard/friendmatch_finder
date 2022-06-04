<template>
  <div>
    <div class="managePanel">
      <input type="number" v-model="desiredId"/>
      <button @click="addById">Найти</button>
      <input type="number" v-model="removableId"/>
      <button @click="deleteById">Удалить</button>
      <button @click="build">Построить</button>
    </div>
    <perfect-scrollbar>
      <div class="column-two">
        <div class="userList">
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
        <div class="friendList">
          <friend-card
            v-for="friend in friendsPull"
            :id="friend.id"
            :fullname="friend.fullname"
            :photo_url="friend.photo_url"
            :markedCount="markedUsers.length"
            :matches="friend.match"
            :key="friend.id"/>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import axios from 'axios'
import UserCard from '../components/UserCard.vue'
import friendCard from '../components/friendCard.vue'

export default {
  components: { UserCard, friendCard },
  name: 'Home',
  data () {
    return {
      users: [],
      markedUsers: [],
      friendsPull: [],
      desiredId: 0,
      removableId: 0,
      access_token: localStorage.access_token
    }
  },
  methods: {
    addById () {
      axios.get('https://api.vk.com/method/users.get?user_id=' + this.desiredId + '&v=5.131&access_token=' + this.access_token + '&fields=sex,photo_50,counters,bdate')
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
      let markedIndex = this.markedUsers.indexOf(parseInt(this.removableId))
      if (index > -1) { this.$delete(this.users, index) } else { console.log('Пользователь для удаления не найден') }
      if (markedIndex > -1) { this.$delete(this.markedUsers, markedIndex) }
      this.friendsPull.length = 0
    },
    toggleUserCheckbox (userId) {
      if (!this.markedUsers.includes(userId)) {
        this.markedUsers.push(userId)
      } else {
        this.$delete(this.markedUsers, this.markedUsers.indexOf(userId))
      }
      this.friendsPull.length = 0
    },
    build () {
      this.friendsPull.length = 0
      this.markedUsers.forEach(el => {
        axios.get('https://api.vk.com/method/friends.get?user_id=' + el + '&v=5.131&access_token=' + this.access_token + '&fields=photo_50')
          .then(res => {
            res.data.response.items.forEach(el => {
              let index = this.friendsPull.findIndex(user => user.id === el.id)
              if (index === -1) {
                this.friendsPull.push(
                  {
                    id: el.id,
                    fullname: el.last_name + ' ' + el.first_name,
                    photo_url: el.photo_50,
                    match: 1
                  }
                )
              } else {
                this.friendsPull[index]['match']++
              }
            })
          }
          )
          .catch(error => {
            console.log('Ошибка получения данных: ', error)
          }
          )
      })
      console.log('build')
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
.managePanel{
  position: fixed;
  width: 100%;
  border: 1px solid;
  padding: 10px;
  background: white;
  margin-top: -42px;
  z-index: 1;
}
.ps {
  margin-top: 42px;
  height: calc(100vh - 42px);
}
.column-two {
  display: flex;
  flex-direction: row;
}
.column-two > div {
  width: 48%;
  margin: 0 0.5%;
}
</style>
