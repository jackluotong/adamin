<template>
  <div class="wrapper">
    <h1>
      短信验证码查询
    </h1>
    <div class="smsCode">
      <i-form ref="formInline" :model="formInline" :rules="ruleInline">
        <Form-item prop="phone">
          <Input v-model="formInline.phone" placeholder="请填写手机号码" style="width: 200px"/>
        </Form-item>
        <Form-item prop="smsCode">
          <Input v-model="formInline.smsCode" placeholder="验证码查询结果" style="width: 200px"/>
        </Form-item>
        <Form-item>
          <i-button type="success" @click.native="handleSubmit('formInline')" long>查询</i-button>
        </Form-item>
      </i-form>
      <div style="width:400px">
      <h3>操作步骤</h3><br>
      <Steps :current="3" size="small" direction="vertical">
        <Step title="步骤1" content="在 宏掌门＋APP端输入手机号，并点击‘发送验证码’按钮"></Step>
        <Step title="步骤2" content="在输入框1中填写上一步的手机号"></Step>
        <Step title="步骤3" content="点击‘查询’按钮，输入框2中即可显示该手机号对应的短信验证码"></Step>
      </Steps>
      </div>
    </div>
  </div>
</template>

<script>
import { querySmsCode } from '@/api/data'
export default {
  data () {
    return {
      formInline: { // 实体
        phone: '',
        smsCode: ''
      },
      ruleInline: {
        phone: [
          {
            required: true,
            message: '请填写手机号码',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 11,
            max: 11,
            message: '手机号码长度必须为11位',
            trigger: 'blur'
          }
        ]
      },
      smsCodeData: [ // 参数配置数据

      ]
    }
  },
  methods: {
    handleSubmit (index) {
      this.$refs[index].validate(valid => {
        if (valid) {
          this.$Loading.start()
          const date = {
            'phone': this.formInline.phone
          }
          querySmsCode(date).then((res) => {
            this.$Loading.finish()
            this.$Message['success']({
              background: true,
              content: res.data.message
            })
            this.smsCodeData = res.data.data
            this.formInline.smsCode = this.smsCodeData.smsCode
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  position: center;
  background-color: white;
  width: 100%;
  height: 100%;
  padding-top: 100px;
  padding-bottom: 30px;
}
.wrapper > h1 {
  text-align: center;
  vertical-align: middle;
  margin-top: 30px;
  margin-bottom: 20px;
  color: #000;
}
.smsCode {
  margin: 0 auto;
  padding: 200px auto;
  width: 200px;
  height: 100%;
}
</style>
