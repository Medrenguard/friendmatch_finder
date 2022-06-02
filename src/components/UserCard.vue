<template>
    <div class="user-card">
      <div class="name">
        {{last_name + ' ' + first_name }}
      </div>
      <br>
      <div class="id">
        {{ id }}
      </div>
    </div>
</template>

<script>

export default {
  name: 'UserCard',
  props: {
    id: Number,
    first_name: String,
    last_name: String
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
.user-card {
  border: 1px solid black;
  border-radius: 6px;
  width: 45%;
  padding: 10px;
  margin-top: 5px;
  background: linear-gradient(to bottom right, #ffdfff, #fefaff);
}
.id {
  color: gray;
  font-size: 13px;
}
</style>
