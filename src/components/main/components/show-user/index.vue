<template>
    <div>
        <span :src='userName'></span>
    </div>
</template>
<script>
export default {
  name: 'ShowUser',
  props: {
    userName: {
      type: String,
      default: 'xxxx'
    }
  }
}
</script>
