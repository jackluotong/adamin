<template>
  <div class="user-content">
    <h1 style="margin:10px 10px 10px 10px">账户管理-用户管理</h1>
    <div class="content-button" >
      <span style="padding:10px">用户code</span>
      <Input v-model.trim="userCode" @blur="blur"/>
      <Button type="primary" icon="md-search" @click="search()" style="margin:0 10px 0 20px">查询</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">角色关联</Button>
          </div>
        </template>
     </Table>
     <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem label="用户code" prop="userCode" style="width:270px;">
            <span>{{formInline.userCode}}</span>
        </FormItem>
        <FormItem>
        <Checkbox-group v-model="social">
        <Checkbox label="管理员" @on-change='select()'>
            <Icon type="social-twitter"></Icon>
            <span>管理员</span>
        </Checkbox>
        <Checkbox label="查询员">
            <Icon type="social-facebook"></Icon>
            <span>查询员</span>
        </Checkbox>
        <Checkbox label="服务管理员">
            <Icon type="social-github"></Icon>
            <span>服务管理员</span>
        </Checkbox>
       </Checkbox-group>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
      </div>
     </Modal>
  </div>
</template>

<script>
import { confPageList, conf, getInfoUser } from '@/api/data'
export default {
  data () {
    function getByteLen (val) {
      var len = 0
      for (var i = 0, len1 = val.length; i < len1; i++) {
        var length = val.charCodeAt(i)
        if (length >= 0 && length <= 128) {
          len += 1
        } else {
          len += 3
        }
      }
      return len
    }

    const validateuserCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参数键名'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }

    return {
      social: ['管理员', '查询员', '服务管理员'],
      total: 0,
      pageNum: 1,
      pageSize: 30,
      confName: '',
      userCode: '',
      modalAddOrUpdate: false, // 是否显示新增弹窗
      detailTitle: '', // 表单标题
      showType: '', // 表单展示类型（edit、add）
      modalDelete: false, // 是否显示删除提示弹窗
      formInline: { // 实体
        confName: '', // 参数名称
        userCode: '', // 参数键名
        confValue: '', // 参数键值
        confDescribtion: '' // 配置描述
      },
      ruleInline: {
        userCode: [
          { required: true, validator: validateuserCode, trigger: 'blur' }
        ]
      },
      confData: [ ], // {key:value,[{key:value},{}]}...
      columns: [
        {
          title: '用户code',
          key: 'userCode',
          width: 300,
          align: 'center'
        },
        {
          title: '已有角色',
          key: 'roleName',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ]

    }
  },
  methods: {
    blur () {
      console.log(blur)
    },
    search () {
      const info = {
        'userCode': this.userCode
      }
      getInfoUser(info).then(res => {
        const data = res.data.data.records
        const total = res.data.data.total
        this.showPage(data, total)
      }).catch(err => {
        console.log(err)
      })
    },
    addSetting () {
      this.showType = 'add'
      this.detailTitle = '新增全局配置信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) {
      console.log(index)
      this.$refs[index].validate((valid) => {
        console.log(valid)
        if (valid) {
          if (this.showType === 'add') {
            const date = {
              'confName': this.formInline.confName,
              'userCode': this.formInline.userCode,
              'confValue': this.formInline.confValue,
              'confDescribtion': this.formInline.confDescribtion
            }
            conf(date).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalAddOrUpdate = false
              this.confPageList()
              this.$refs[index].resetFields()
            }).catch(err => {
              console.log(err)
            })
          } else if (this.showType === 'edit') {
            const date = {
              'id': this.id,
              'confName': this.formInline.confName,
              'userCode': this.formInline.userCode,
              'confValue': this.formInline.confValue,
              'confDescribtion': this.formInline.confDescribtion
            }
            conf(date).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.$refs['formInline'].resetFields()
              this.modalAddOrUpdate = false
              this.confPageList()
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          this.$Message.error('请检查参数是否有误!')
        }
      })
    },
    cancelAddOrUpdate (name) { // 取消新增
      this.$refs[name].resetFields()
      this.modalAddOrUpdate = false
    },
    edit (index) {
      this.id = this.confData[index].id
      this.formInline.userCode = this.confData[index].userCode
      this.showType = 'edit'
      this.detailTitle = '账户管理-用户管理'
      this.modalAddOrUpdate = true
    },
    confPageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      confPageList(date).then(res => {
        this.confData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    showPage (data, total) {
      this.confData = data
      this.total = total
    },
    translate (data) {

    },
    getRoleName (data) {

    }
  },
  created () {
    console.log(this.social[0])
    const info = {
      userCode: this.userCode,
      pageSize: this.pageSize,
      currentPage: this.pageNum
    }
    getInfoUser(info).then(res => {
      const data = res.data.data.records
      const total = res.data.data.total
      this.showPage(data, total)
      console.log(data)// data[3].roles[0].roleName
      const userCode = data.map((item) => {
        return item.userCode
      })

      function getRoleName () {
        const roleNameArray = []
        const userCode = []
        const obj = {} // [{},{}]
        for (let i = 0; i < data.length; i++) {
          if (data[i].roles.length === 0) {
            userCode.push(data[i].userCode)
            obj.userCode = data[i].userCode
            obj.roleName = ' '
          }
          for (let j = 0; j < data[i].roles.length; j++) {
            roleNameArray.push(data[i].roles[j].roleName)
            userCode.push(data[i].userCode)
            obj.userCode = [...obj.userCode, data[i].userCode]
            obj.roleName = [...obj.roleName, data[i].roles[j].roleName]
          }
        }
        return roleNameArray
      }
      console.log(res)
      console.log(userCode, getRoleName())
    }).catch(err => { console.log(err) })
  },
  watch: {
    userCode: {
      handler: function (val, old) {
        console.log(val, old)
        if (val === '') {
          /*
                to do
            */
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.user-content{
  .content-button {
    padding: 5px;
    display: inline;
    .ivu-select-single {
      width: 150px;
    }
    .ivu-input-type {
      width: 150px;
      margin-left: 10px;
    }
    .ivu-btn{
      margin-left: 10px;
    }
    .ivu-btn-info{
      background: #2d8cf0;
      border-color: #2d8cf0;
    }
  }
}
.ivu-modal-confirm-body {
  padding-left: 42px;
  font-size: 14px;
  color: #515a6e;
  position: relative;
  word-break: break-all;
}
</style>
