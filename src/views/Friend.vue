<template>
  <div class="friend-view-wrap">
    <button @click="passToHome">
      Назад
    </button>
    <div>
      <div class="friend-name">
        Имя друга: {{ friendObject.fullname }}
      </div>
      Добавлен в друзья пользователями:
      <div class="userList">
        <div
        class="user-card"
        v-for="user in users"
        :key="user.id"
        >
          <div class="user-card__photo">
            <img :src="user.photo_url" alt="Фото">
          </div>
          <div class="user-card__main">
            <div class="name">
              {{ user.fullname }}
            </div>
            <div class="user-card__id">
              {{ user.id }}
            </div>
          </div>
        </div>
      </div>
    </div>
  <div>
    <br/>
      <template v-if="this.private">Стена скрыта</template>
      <template v-else-if="this.$store.getters.IS_EMPTY_TOKEN">Необходимо произвести вход</template>
      <template v-else>
        Последние 20 постов пользователя:
        <div class="posts-wrap">
          <div
            v-for="post in posts"
            class="post"
            :key="post.id"
            >
            {{ post.text | viewOnlyText }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { jsonp } from 'vue-jsonp'

export default {
  name: 'Friend',
  methods: {
    passToHome () {
      this.$store.dispatch('passToHome')
    },
    deleteCookie () {
      document.cookie = `access_token=''; max-age=-1`
    },
    clearTokens () {
      this.deleteCookie()
      location.hash = ''
      this.$store.commit('clearToken')
    }
  },
  filters: {
    viewOnlyText (val) {
      return val || 'Запись без текста'
    }
  },
  data () {
    return {
      friendObject: this.$store.getters.FRIENDS.find(el => el.id === this.$store.getters.ID),
      users: [],
      posts: [],
      private: null
    }
  },
  mounted () {
    this.friendObject.matches.forEach(idOfUser => {
      this.users.push(this.$store.getters.USERS.find(el => el.id === idOfUser))
    })
    if (!this.$store.getters.IS_EMPTY_TOKEN) {
      jsonp('https://api.vk.com/method/wall.get',
        {
          owner_id: this.$store.getters.ID,
          access_token: this.$store.getters.TOKEN,
          v: '5.131'
        }).then(res => {
        if ('error' in res) {
          if (res.error.error_code === 30) {
            this.private = true
          } else { throw (res.error) }
        } else { this.posts = res.response.items }
      }).catch(error => {
        if ('request_params' in error) {
          if (error.error_code === 5) {
            this.clearTokens()
            this.$toast.error(`Ошибка при выгрузке данных со стены.
Необходимо произвести вход`, {id: 'AuthError'})
          } else {
            this.$toast.error(`Ошибка при выгрузке данных со стены:
ID: ${error.request_params.find(p => p.key === 'owner_id').value} - ${error.error_msg}`)
          }
        } else if (error.error_code === undefined) {
          this.$toast.error(`Превышено время ожидания запроса`, {id: 'TimeoutError'})
        } else {
          this.$toast.error(`Неизвестная ошибка.
Code: ${error.error_code} - ${error.error_msg}`)
        }
      })
    }
  }
}

</script>

<style scoped>
.friend-view-wrap {
  margin: 10px;
}
.friend-name{
  font-weight: bold;
}
.user-card {
  width: 50%;
  cursor: default;
  position: relative;
}
.posts-wrap {
  width: 50%;
}
.post {
  border: 1px solid;
  padding: 10px;
  margin: 10px;
  word-break: break-all;
}
</style>
