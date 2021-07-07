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

<template>
  <div class="user-content">
    <h1 style="margin:10px 10px 10px 10px">账户管理-用户管理</h1>
    <div class="content-button" >
      <span style="padding:10px">用户code</span>
      <Input v-model.trim="userCode" @on-enter="enter"/>
      <Button type="primary" icon="md-search" @click="search()" style="margin:0 10px 0 20px">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
      <Button type="primary" icon="md-refresh" @click="addUser()" v-show="permission.includes('account:user:add')">新增用户</Button>

    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{ index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)"
                        v-show="permission.includes('account:user:roleConnect')"
>角色关联</Button>
          </div>
        </template>
     </Table>
     <Page :total='total'
     :page-size='pageSize'
     :show-total="true"
     show-sizer
     style="text-align: center;margin-top: 5px"
     @on-change='changePage'
     @on-page-size-change='onpagesizechange'
      />
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="true" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline"  inline>
        <FormItem label="用户code:" style="width:270px;">
            <span style=" font-size: 30px;
      font-weight: 400;
      color: black;" >{{formInline.userCode}}</span>
        </FormItem>

      </Form>
         <div>
            <Checkbox-group
                v-model="checkData"
                @on-change="selected"
            >
                <Checkbox
                    v-for="(item, index) in checkList"
                    :key="index"
                    :label="item.roleCode"
                    :value="item.roleName"
                    :label-in-value="true"
                    size="large"
                    ref="checkBox"
                    >{{ item.roleName }}</Checkbox
                >
            </Checkbox-group>
        </div>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
      </div>
     </Modal>

     <Modal v-model.trim="modalAddUser" width="600" :mask-closable="false" :closable="true" title="新增用户">
         <span>
             姓名
         </span>
         <Input type="text"  v-model.trim="userName"/>
         <span>
             电话号码
         </span>
        <Input type="text" v-model.trim=" phone"/>
         <div>
        </div>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelUser()">返回</Button>
        <Button type="primary" size="large" @click="submitUser()">保存</Button>
      </div>
     </Modal>
  </div>
</template>

<script>
import { getInfoUser, getInfoRole, roleConnect, userAdd } from '@/api/data'
export default {
  data () {
    return {
      userName: '',
      phone: '',
      modalAddUser: false,
      permission: sessionStorage.getItem('permission'),
      getCheckBox: [],
      checkData: [],
      value: [],
      checkList: [],
      selectOptions: [],
      checked: true,
      roleName: '',
      total: 0,
      pageNum: 1,
      pageSize: 10,
      userCode: '',
      modalAddOrUpdate: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        userCode: '',
        checkList: '',
        roleName: ''
      },
      confData: [ ],
      columns: [
        {
          type: 'index',
          width: 60,
          aligin: 'center'
        },
        {
          title: '用户名',
          key: 'userName',
          width: 300,
          align: 'center'
        },
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
    addUser () {
      this.modalAddUser = true
    },
    submitUser () {
      if (this.phone) {
        let rule = /1[3,4,5,7,8][0-9]{9}$/
        if (rule.test(this.phone) === true & this.userName !== '') {
          const info = {
            userName: this.userName,
            phone: this.phone
          }
          userAdd(info).then(res => {
            console.log(res)
            this.$Message.info({
              content: res.data.message
            })
            this.getInfoUser()
            this.modalAddUser = false
          })
        } else {
          this.$Message.info('输入正确的手机号码')
        }
      } else {
        this.$Message.info('请输入正确的信息')
      }
      this.userName = null
      this.phone = null
    },
    cancelUser () {
      this.modalAddUser = false
      this.userName = null
      this.phone = null
    },
    selected (e) {
      let array = []
      for (let i = 0; i < this.checkData.length; i++) {
        if (this.checkData[i] !== '') {
          array.push(this.checkData[i])
        }
      }
      console.log(array)
    },
    onpagesizechange (e) {
      this.pageSize = e
      const info = {
        pageSize: e,
        currentPage: this.pageNum,
        userCode: this.userCode

      }
      getInfoUser(info).then(res => {
        const data = res.data.data.records
        const total = res.data.data.total
        this.renderPage(this.translate(data), total)
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e,
        userCode: this.userCode

      }
      getInfoUser(info).then(res => {
        const data = res.data.data.records
        const total = res.data.data.total
        this.renderPage(this.translate(data), total)
      })
    },
    reset () {
      this.userCode = null
    },
    enter (e) {
      this.getInfoUser()
    },

    search () {
      const info = {
        userCode: this.userCode,
        pageSize: this.pageSize,
        currentPage: this.pageNum
      }
      getInfoUser(info).then(res => {
        const data = res.data.data.records
        const total = res.data.data.total
        this.renderPage(this.translate(data), total)
      }).catch(err => {
        console.log(err)
      })
    },
    handleSubmitAddOrUpdate (index) {
      let array = []
      for (let i = 0; i < this.checkData.length; i++) {
        if (this.checkData[i] !== '') {
          array.push(this.checkData[i])
        }
      }
      const info = {
        userCode: this.formInline.userCode,
        roles: array
      }
      console.log(info)
      roleConnect(info).then(res => {
        this.modalAddOrUpdate = false
        this.getInfoUser()
        this.$Message.success('操作成功')
      }).catch(error => console.log(error))
    },
    cancelAddOrUpdate (name) {
      this.checked = false
      this.$refs[name].resetFields()
      this.modalAddOrUpdate = false
    },
    edit (index) {
      this.checkData = this.confData[index].roleCode.split(',')
      this.id = this.confData[index].id
      this.formInline.userCode = this.confData[index].userCode
      this.detailTitle = '账户管理-用户管理'
      this.modalAddOrUpdate = true
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    translate (arr) {
      let array = []
      console.log(arr)
      arr.map((item) => {
        let roleName = ''
        let roleCode = ''
        if (item.roles.length !== 0) {
          item.roles.map((i, t) => {
            roleName = i.roleName + ',' + roleName
            roleCode = i.roleCode + ',' + roleCode
          })
          array.push({
            userCode: item.userCode,
            userName: item.userName,
            roleName,
            roleCode

          })
        } else {
          array.push({
            userCode: item.userCode,
            roleName,
            roleCode,
            userName: item.userName
          })
        }
      })
      console.log(array)
      return array
    },
    getInfoUser () {
      const info = {
        userCode: this.userCode,
        pageSize: this.pageSize,
        currentPage: this.pageNum
      }
      getInfoUser(info).then(res => {
        const data = res.data.data.records
        const total = res.data.data.total
        this.confData = this.translate(data)
        this.total = total
        console.log(data)
      }).catch(err => { console.log(err) })
    }

  },
  mounted () {
    const data = {
      roleName: this.roleName,
      roleCode: this.roleCode
    }
    getInfoRole(data).then(res => {
      const data = res.data.data
      this.checkList = data
    })
  },
  created () {
    this.getInfoUser()
  },
  watch: {
    userCode: {
      handler: function (val, old) {
        if (val === '') {
        }
      }
    }
  }
}
</script>
