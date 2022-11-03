<template>
  <div>
    <div class="managePanel">
      <input ref="focusInput" type="text" v-model="desiredId" placeholder="Введите ID"/>
      <button @click="addById" :disabled="IS_EMPTY_TOKEN">Найти</button>
      <button @click="build" :disabled="!canStartBuild || IS_EMPTY_TOKEN">Построить</button>
      <div class="managePanel__other-container">
        <img v-show="loadingProfile" class="preloader" src="../assets/loading.svg">
        <div v-show="!loadingProfile" style="display: inherit">
          <template v-if="IS_EMPTY_TOKEN">
            <a :href="href">
              Войти
            </a>
          </template>
          <template v-else>
            <img class="avatar" :src="currentUser.photo_url">
          </template>
        </div>
      </div>
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
          <div class="info" v-show="!friendsPull.length">
            <div v-show="loadingProfile">
              <img class="preloader" src="../assets/loading.svg">
            </div>
            <div v-show="!loadingProfile">
              <div v-if="IS_EMPTY_TOKEN">
                Пройдите авторизацию
              </div>
              <div v-else>
                <div v-show="!brokenBuild">
                  <div v-show="!addedMoreThanOneUser">
                    Добавьте хотя бы 2 пользователей
                  </div>
                  <div v-show="addedMoreThanOneUser && !canStartBuild">
                    Выберите более 1 пользователя
                  </div>
                  <div v-show="!loadingFriends && canStartBuild && !buildCompleted">
                    Запустите постройку
                  </div>
                  <div v-show="!loadingFriends && canStartBuild && buildCompleted">
                    Общие друзья не найдены
                  </div>
                  <div v-show="loadingFriends">
                    Загрузка...
                    <br/>
                    {{ MARKED_USERS_COUNT - counter }}/{{ MARKED_USERS_COUNT }}
                  </div>
                </div>
              </div>
              <div v-show="brokenBuild">
                Произошла ошибка при построении. Пожалуйста, попробуйте снова
              </div>
            </div>
          </div>
          <friend-card
            v-for="friend in friendsPull"
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
import { mapState, mapGetters } from 'vuex'
import UserCard from '../components/UserCard.vue'
import friendCard from '../components/friendCard.vue'
import { jsonp } from 'vue-jsonp'
import postRequestFunctionsMixin from '../mixins/postRequestFunctionsMixin.js'

export default {
  components: { UserCard, friendCard },
  name: 'Home',
  mixins: [postRequestFunctionsMixin],
  data () {
    return {
      href: 'https://oauth.vk.com/authorize?client_id=51455801&display=page&redirect_uri=' + location.origin + '&scope=friends&response_type=token&v=5.131',
      desiredId: undefined,
      counter: this.MARKED_USERS_COUNT,
      friends: [],
      loadingFriends: false,
      loadingProfile: false
    }
  },
  methods: {
    injectToken () {
      // Сперва проверяем токен из url - если он есть, то используем его и записываем его в куки на 24 часа и стираем из url
      let tokenPair = location.hash.substr(1).split('&').find(el => el.indexOf('access_token=') === 0)
      if (tokenPair !== undefined) {
        let date = new Date(Date.now() + 86400e3)
        date = date.toUTCString()
        document.cookie = `${tokenPair}; expires=` + date
        location.hash = ''
      } else {
        // Если токена в url нет - проверяем и используем токен из куков
        tokenPair = document.cookie.split('; ').find(el => el.indexOf('access_token=') === 0)
        // Если и там нет токена - прерываем функцию
        if (tokenPair === undefined) { return 'fail' }
      }
      this.$store.commit('injectToken', tokenPair.substr(13))
      return 'success'
    },
    focusOnInput () {
      this.$refs.focusInput.focus()
    },
    getAccountInfo () {
      this.loadingProfile = true
      jsonp('https://api.vk.com/method/users.get',
        {
          access_token: this.access_token,
          v: '5.131',
          fields: 'photo_50'
        })
        .then(res => {
          if ('error' in res) { throw (res.error) }
          this.$store.commit('injectUser',
            {
              // id: res.response[0].id,
              // name: res.response[0].first_name,
              photo_url: res.response[0].photo_50
            }
          )
          this.loadingProfile = false
        })
        .catch(error => {
          this.processBasicErrors(error, 'Ошибка при авторизации')
          this.loadingProfile = false
        })
    },
    addById () {
      this.focusOnInput()
      if (this.desiredId === undefined) { return this.$toast.error(`Указан некорректный ID для поиска`) }
      jsonp('https://api.vk.com/method/users.get',
        {
          user_id: this.desiredId,
          access_token: this.access_token,
          v: '5.131',
          fields: 'sex,photo_50,counters,bdate'
        })
        .then(res => {
          if ('error' in res) { throw (res.error) }
          if (res.response.length === 0) { return this.$toast.error(`Пользователя с ID ${this.desiredId} не существует`) }
          if ('deactivated' in res.response[0]) { return this.$toast(`Профиль с ID ${this.desiredId} заблокирован или удален.`) }
          if (this.users.findIndex(user => user.id === parseInt(res.response[0].id)) !== -1) { return this.$toast(`Пользователь с ID ${this.desiredId} уже добавлен в список.`) }
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
          this.processBasicErrors(error, 'Ошибка при добавлении пользователя')
        })
    },
    build () {
      this.$store.dispatch('startBuild')
      this.loadingFriends = true
      this.friends = []
      this.counter = this.MARKED_USERS_COUNT
      this.markedUsers.forEach((user, i) => {
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
            access_token: this.access_token,
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
              this.loadingFriends = false
            }
          })
          .catch(error => {
            this.$store.dispatch('breakBuild')
            this.loadingFriends = false
            this.processBasicErrors(error, 'Ошибка при построении списка друзей')
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
    ...mapState([
      'currentUser',
      'users',
      'markedUsers',
      'friendsPull',
      'loading',
      'buildCompleted',
      'brokenBuild',
      'access_token'
    ]),
    ...mapGetters([
      'MARKED_USERS_COUNT',
      'IS_EMPTY_TOKEN'
    ]),
    sortedUsers () {
      let res = Array.from(this.users)
      res.sort(function (a, b) {
        return a.fullname < b.fullname ? -1 : 1
      })
      return res
    },
    addedMoreThanOneUser () {
      return this.users.length > 1
    },
    canStartBuild () {
      return this.MARKED_USERS_COUNT > 1
    }
  },
  mounted () {
    if (this.injectToken() === 'success') {
      this.getAccountInfo()
      this.focusOnInput()
    }
  }
}
</script>

<style scoped>
.managePanel{
  position: fixed;
  width: calc(100% + 2px);
  height: 43px;
  box-sizing: border-box;
  border: 1px solid;
  padding: 0 6px;
  background: white;
  margin: -42px -1px 0;
  z-index: 1;
  display: flex;
}
.managePanel > :nth-child(n) {
  margin-left: 4px;
  align-self: center;
}
.managePanel__other-container {
  flex-grow: 1;
  display: flex;
  flex-direction: row-reverse;
  padding-right: 4px;
}
.preloader {
  height: 45px;
}
.managePanel__other-container .preloader {
  height: 29px;
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
.avatar {
  height: 29px;
  border-radius: 15px;
  margin: 0 2px;
}
@media screen and (max-width: 480px) {
  .info {
    font-size: 4vw;
  }
}
</style>
