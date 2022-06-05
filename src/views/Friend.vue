<template>
    <div>
      <button @click="passToHome">
        Назад
      </button>
        hello, {{ this.$store.getters.ID }}!
    </div>
</template>

<script>
// import axios from 'axios'

export default {
  name: 'Friend',
  methods: {
    passToHome () {
      this.$store.dispatch('passToHome')
    }
  }
}

</script>
