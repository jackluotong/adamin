<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录：能力服务平台管理端" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">请使用域账号及密码登陆</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.$Loading.start()
      this.handleLogin({ userName, password }).then(res => {
        this.$router.push({
          name: this.$config.homeName
        })
        setTimeout(() => {
          this.$router.go(0)
        }, 600)
        this.$Loading.finish()
      })
    }
  }
}
</script>

<style>

</style>
