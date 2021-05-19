<template>
<div class="fatherDiv">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" class="form">
        <div class="input">
            <Form-item prop="user">
            <Input type="text" v-model="formInline.user" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
        </Form-item>
        <Form-item prop="password">
            <Input type="password" v-model="formInline.password" placeholder="Password">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
        </Form-item>
       
         <Form-item>
            <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
        </Form-item>
         </div>
    </Form>

    </div>
</template>
<script>
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$router.push({name:'Home'})
                    } else {
                        this.$Message.error('登录失败!');
                    }
                })
            }
        }
    }
</script>
<style scoped>
.form{
   padding: 10px ;
   display: flex;
}
.input{
    height: 100px;
    width: 300px;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
}

</style>