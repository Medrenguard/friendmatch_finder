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
        v-for="user in userMatches"
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
      <template v-else-if="this.banned">Пользовател заблокирован, стена недоступна</template>
      <template v-else-if="this.IS_EMPTY_TOKEN">Необходимо произвести вход</template>
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
import { mapState, mapGetters } from 'vuex'
import { jsonp } from 'vue-jsonp'
import postRequestFunctionsMixin from '../mixins/postRequestFunctionsMixin.js'

export default {
  name: 'Friend',
  mixins: [postRequestFunctionsMixin],
  methods: {
    passToHome () {
      this.$store.dispatch('passToHome')
    }
  },
  filters: {
    viewOnlyText (val) {
      return val || 'Запись без текста'
    }
  },
  data () {
    return {
      friendObject: {},
      userMatches: [],
      posts: [],
      private: null,
      banned: null
    }
  },
  computed: {
    ...mapState([
      'users',
      'friendsPull',
      'currentFriendId',
      'access_token'
    ]),
    ...mapGetters([
      'IS_EMPTY_TOKEN'
    ])
  },
  mounted () {
    this.friendObject = this.friendsPull.find(el => el.id === this.currentFriendId)
    this.friendObject.matches.forEach(idOfUser => {
      this.userMatches.push(this.users.find(el => el.id === idOfUser))
    })
    if (!this.IS_EMPTY_TOKEN) {
      jsonp('https://api.vk.com/method/wall.get',
        {
          owner_id: this.currentFriendId,
          access_token: this.access_token,
          v: '5.131'
        }).then(res => {
        if ('error' in res) {
          if (res.error.error_code === 30) {
            this.private = true
          } else if (res.error.error_code === 18) {
            this.banned = true
          } else { throw (res.error) }
        } else { this.posts = res.response.items }
      }).catch(error => {
        this.processBasicErrors(error, 'Ошибка при выгрузке данных со стены')
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
