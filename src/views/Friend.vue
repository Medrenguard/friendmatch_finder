<template>
    <div>
        hello, {{ this.$store.getters.ID }}!
    </div>
</template>

<script>
// import axios from 'axios'

export default {
  name: 'Friend',
  created () {
    console.log()
  }
}

</script>
