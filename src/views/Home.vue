<template>
  <div>
    <div class="managePanel">
      <input type="number" v-model="desiredId"/>
      <button @click="addById">Найти</button>
      <button @click="build" :disabled="!canStartBuild">Построить</button>
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
            :can_access="user.can_access"
            :key="user.id"/>
        </div>
        <div class="friendList">
          <div class="info" v-show="!this.$store.getters.FRIENDS.length">
            <div v-show="!addedMoreThanOneUser">
              Добавьте хотя бы 2 пользователей
            </div>
            <div v-show="addedMoreThanOneUser && !canStartBuild">
              Выберите более 1 пользователя
            </div>
            <div v-show="!this.$store.getters.LOADING && canStartBuild && !this.$store.getters.BUILDCOMPLETED">
              Запустите постройку
            </div>
            <div v-show="!this.$store.getters.LOADING && canStartBuild && this.$store.getters.BUILDCOMPLETED">
              Общие друзья не найдены
            </div>
            <div v-show="this.$store.getters.LOADING">
              Загрузка...
            </div>
          </div>
          <friend-card
            v-for="friend in this.$store.getters.FRIENDS"
            :id="friend.id"
            :fullname="friend.fullname"
            :photo_url="friend.photo_url"
            :matches="friend.match"
            :key="friend.id"/>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import UserCard from '../components/UserCard.vue'
import friendCard from '../components/friendCard.vue'
import { jsonp } from 'vue-jsonp'

export default {
  components: { UserCard, friendCard },
  name: 'Home',
  data () {
    return {
      desiredId: 0
    }
  },
  methods: {
    addById () {
      jsonp('https://api.vk.com/method/users.get',
        {
          user_id: this.desiredId,
          access_token: this.$store.getters.TOKEN,
          v: '5.131',
          fields: 'sex,photo_50,counters,bdate'
        })
        .then(res => {
          if ('error' in res) { throw (res.error.error_msg) }
          if (!res.response[0].deactivated && this.$store.getters.USERS.findIndex(user => user.id === parseInt(this.desiredId)) === -1) {
            this.$store.commit('pushUser',
              {
                id: res.response[0].id,
                fullname: res.response[0].last_name + ' ' + res.response[0].first_name,
                sex: res.response[0].sex,
                bdate: res.response[0].bdate,
                photo_url: res.response[0].photo_50,
                friends_count: res.response[0].counters['friends'],
                can_access: res.response[0].can_access_closed
              }
            )
          }
        })
        .catch(error => {
          console.log('Ошибка при добавлении пользователя: ', error)
        }
        )
    },
    build () {
      this.$store.dispatch('startBuild')
      let friends = []
      let counter = this.$store.getters.MARKED_USERS.length
      this.$store.getters.MARKED_USERS.forEach(user => {
        jsonp('https://api.vk.com/method/friends.get',
          {
            user_id: user,
            access_token: this.$store.getters.TOKEN,
            v: '5.131',
            fields: 'photo_50'
          })
          .then(res => {
            if ('error' in res) { throw (res.error.error_msg) }
            res.response.items.forEach(friend => {
              let index = friends.findIndex(el => el.id === friend.id)
              if (index === -1) {
                friends.push(
                  {
                    id: friend.id,
                    fullname: friend.last_name + ' ' + friend.first_name,
                    photo_url: friend.photo_50,
                    matches: [user]
                  }
                )
              } else {
                friends[index]['matches'].push(user)
              }
            })
            counter--
            if (counter === 0) {
              this.$store.dispatch('finishBuild', this.processFriends(friends))
            }
          }
          )
          .catch(error => {
            console.log('Ошибка при построении списка друзей: ', error)
          }
          )
      })
    },
    processFriends (array) {
      let res = array.filter(el => el.matches.length > 1)
      res.sort(function (a, b) {
        return a.matches.length < b.matches.length ? 1 : -1
      })
      return res
    }
  },
  computed: {
    sortedUsers () {
      let res = Array.from(this.$store.getters.USERS)
      res.sort(function (a, b) {
        return a.fullname < b.fullname ? -1 : 1
      })
      return res
    },
    addedMoreThanOneUser () {
      return this.$store.getters.USERS.length > 1
    },
    canStartBuild () {
      return this.$store.getters.MARKED_USERS.length > 1
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
.info {
  margin: 9vh auto 1px auto;
  width: fit-content;
  color: #9f9f9f;
  font-weight: 700;
  font-size: 18px;
}
</style>
