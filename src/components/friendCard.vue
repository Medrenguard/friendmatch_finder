<template>
    <div>
        {{ id }}
        {{ fullname }}
    </div>
</template>

<script>

export default {
  name: 'friendCard',
  props: {
    id: Number,
    fullname: String,
    photo_url: String
  }
}
</script>
