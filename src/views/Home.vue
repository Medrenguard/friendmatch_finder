<template>
  <div>
    <div class="managePanel">
      <input type="text" v-model="desiredId" placeholder="Введите ID"/>
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
            <div v-show="!this.$store.getters.BROKENBUILD">
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
                <br/>
                {{ this.$store.getters.MARKED_USERS.length - this.counter }}/{{ this.$store.getters.MARKED_USERS.length }}
              </div>
            </div>
            <div v-show="this.$store.getters.BROKENBUILD">
              Произошла ошибка при построении. Пожалуйста, попробуйте снова
            </div>
          </div>
          <friend-card
            v-for="friend in this.$store.getters.FRIENDS"
            :id="friend.id"
            :fullname="friend.fullname"
            :photo_url="friend.photo_url"
            :matches="friend.matches"
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
      desiredId: undefined,
      counter: this.$store.getters.MARKED_USERS.length,
      friends: []
    }
  },
  methods: {
    addById () {
      if (this.desiredId === undefined) { return this.$toast.error(`Указан некорректный ID для поиска`) }
      jsonp('https://api.vk.com/method/users.get',
        {
          user_id: this.desiredId,
          access_token: this.$store.getters.TOKEN,
          v: '5.131',
          fields: 'sex,photo_50,counters,bdate'
        })
        .then(res => {
          if ('error' in res) { throw (res.error) }
          if (res.response.length === 0) { return this.$toast.error(`Пользователя с ID ${this.desiredId} не существует`) }
          if ('deactivated' in res.response[0]) { return this.$toast(`Профиль с ID ${this.desiredId} заблокирован или удален.`) }
          if (this.$store.getters.USERS.findIndex(user => user.id === parseInt(res.response[0].id)) !== -1) { return this.$toast(`Пользователь с ID ${this.desiredId} уже добавлен в список.`) }
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
        })
        .catch(error => {
          if ('request_params' in error) {
            this.$toast.error(`Ошибка при добавлении пользователя.
ID: ${error.request_params.find(p => p.key === 'user_id').value} - ${error.error_msg}`)
          } else if (error.error_code === undefined) {
            this.$toast.error(`Превышено время ожидания запроса`, {id: 'TimeoutError'})
          } else {
            this.$toast.error(`Неизвестная ошибка.
Code: ${error.error_code} - ${error.error_msg}`)
          }
        })
    },
    build () {
      this.$store.dispatch('startBuild')
      this.friends = []
      this.counter = this.$store.getters.MARKED_USERS.length
      this.counter = this.$store.getters.MARKED_USERS.length
      this.$store.getters.MARKED_USERS.forEach((user, i) => {
        // быстрый старт: первые 6 запросов отправляются сразу
        i < 6 ? this.getFriends(user, 'firstCall') : this.getFriends(user, 'secondCall', i)
      })
    },
    getFriends (user, call, order) {
      // Разрешенное кол-во запросов - 3 в секунду, поэтому delay должен быть 350 в идеале, но если снизить delay и сделать рекурсивный вызов в случае ошибки
      // Too many requests - это позволит сократить общее время выполнения, особенно для малого кол-во запросов
      let delay = call === 'firstCall' ? 0 : 100 * order
      setTimeout(() =>
        jsonp('https://api.vk.com/method/friends.get',
          {
            user_id: user,
            access_token: this.$store.getters.TOKEN,
            v: '5.131',
            fields: 'photo_50'
          }, 20000)
          .then(res => {
            if ('error' in res) {
              if (res.error.error_code === 6) { return this.getFriends(user, 'secondCall', 2.5) }
              throw (res.error)
            }
            res.response.items.forEach(friend => {
              let index = this.friends.findIndex(el => el.id === friend.id)
              if (index === -1) {
                this.friends.push(
                  {
                    id: friend.id,
                    fullname: friend.last_name + ' ' + friend.first_name,
                    photo_url: friend.photo_50,
                    matches: [user]
                  }
                )
              } else {
                this.friends[index]['matches'].push(user)
              }
            })
            this.counter--
            if (this.counter === 0) {
              this.$store.dispatch('finishBuild', this.processFriends(this.friends))
            }
          }
          )
          .catch(error => {
            this.$store.dispatch('breakBuild')
            if ('request_params' in error) {
              this.$toast.error(`Ошибка при построении списка друзей.
ID: ${error.request_params.find(p => p.key === 'user_id').value} - ${error.error_msg}`)
            } else if (error.error_code === undefined) {
              this.$toast.error(`Превышено время ожидания запроса`, {id: 'TimeoutError'})
            } else {
              this.$toast.error(`Неизвестная ошибка.
Code: ${error.error_code} - ${error.error_msg}`)
            }
          }), delay)
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
  text-align: center;
}
@media screen and (max-width: 480px) {
  .info {
    font-size: 4vw;
  }
}
</style>
