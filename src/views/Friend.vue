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
  <div>
    <br/>
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
      posts: []
    }
  },
  mounted () {
    this.friendObject.matches.forEach(idOfUser => {
      this.users.push(this.$store.getters.USERS.find(el => el.id === idOfUser))
    })
    jsonp('https://api.vk.com/method/wall.get',
      {
        owner_id: this.$store.getters.ID,
        access_token: this.$store.getters.TOKEN,
        v: '5.131'
      }).then(res => {
      if (res.error && res.error.error_code === 30) { console.log('Это приватный профиль') } else { this.posts = res.response.items }
    }).catch(error => {
      console.log(error)
    })
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
