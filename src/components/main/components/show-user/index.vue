<style scoped>
p{
    color: rgb(224, 218, 230);
}
span{
    font-weight: 900;
    color: rgb(250, 249, 249);
}
</style>
<template>
    <div>
        <p>欢迎登录：<span>{{user}}</span></p>
    </div>
</template>
<script>
export default {
  name: 'ShowUser',
  props: {
    user: {
      type: String,
      default: 'xxxx'
    }
  }
}
</script>
