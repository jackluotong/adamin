<!--
 * @Author: william
 * @Date: 2021-05-26 16:51:38
 * @LastEditTime: 2021-07-28 13:51:21
 * @LastEditors: william
 * @Description: In User Settings Edit
 * @FilePath: \Admin\src\view\newView\AccountManage\UserManage\index.vue
-->
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
.showDiv{
    display: flex;
    height: 100%;
    flex-direction: column;
    width: 100%;
    span{
        margin-inline: 10px;
        margin: 10px 10px 10px 10px ;
    }
}
</style>

<template>
  <div class="user-content">
    <h1 style="margin:10px 10px 10px 10px">账户管理-用户管理</h1>
    <div class="content-button" >
      <span style="padding:10px">用户名</span>
      <Input v-model.trim="userCode" @on-enter="enter"/>
      <Button type="primary" icon="md-search" @click="search()" style="margin:0 10px 0 20px">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
      <Button type="primary" icon="md-refresh" @click="addUser()" v-show="permission.includes('account:user:add')">新增用户</Button>

    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 50px">
       <template slot-scope="{ index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)"
                v-show="permission.includes('account:user:roleConnect')"
            >角色关联</Button>
             <Button type="primary" size="small" style="margin-right: 5px" @click="editClick(index)"
                v-show="permission.includes('account:user:edit')"
            >编辑</Button>
             <Button type="error" size="small" style="margin-right: 5px" @click="deleteClick(index)"
                v-show="permission.includes('account:user:delete')"
            >删除</Button>
          </div>
        </template>
     </Table>
     <Page :total='total'
     :page-size='pageSize'
     :show-total="true"
     :current.sync='pageNum'
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
         <div  class="showDiv">
        <span>
             用户名
         </span>
         <Input type="text"  v-model.trim="userName" style="width:270px"/>
         <span>
             电话号码
         </span>
        <Input type="text" v-model.trim="phone" style="width:270px"/>
        <span>
            用户昵称
        </span>
        <Input type="text" v-model.trim="nickName" style="width:270px"/>
        </div>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelUser()">返回</Button>
        <Button type="primary" size="large" @click="submitUser()">保存</Button>
      </div>
     </Modal>
     <Modal v-model.trim="modalEdit" title="编辑用户" width='600' :mask-closable="false" :closable="true">
          <div  class="showDiv">
         <span>
             电话号码
         </span>
        <Input type="text" v-model.trim="editObj.phone" style="width:270px"/>
        <span>
            用户昵称
        </span>
        <Input type="text" v-model.trim="editObj.nickName" style="width:270px"/>
        </div>
         <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelEdit()">返回</Button>
        <Button type="primary" size="large" @click="submitEdit()">保存</Button>
      </div>
     </Modal>
       <Modal v-model.trim="modalDelete" width="450" title="删除用户">
            <div>
                <p>确定删除该用户嘛？</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelDelete" size="large"
                    >取消</Button
                >
                <Button type="primary" @click="handlerDelete" size="large"
                    >确定</Button
                >
            </div>
        </Modal>
  </div>
</template>

<script>
import { getInfoUser, getInfoRole, roleConnect, userAdd, userDelete, userEdit } from '@/api/data'
export default {
  data () {
    return {
      editObj: {
        nickName: '',
        phone: '',
        id: '',
        userCode: ''
      },
      modalEdit: false,
      nickName: '',
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
      confData: [],
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
          title: '用户昵称',
          key: 'nickName',
          width: 300,
          align: 'center'
        },
        {
          title: '电话号码',
          key: 'phone',
          width: 300,
          align: 'center'
        },
        {
          title: '已有角色',
          key: 'roleName',
          tooltip: true,
          width: 300,
          align: 'center',
          render: (h, params) => {
            return h('span', [
              h('Tooltip', {
                props: {
                  placement: 'top',
                  transfer: true
                },
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  borderColor: '1px',
                  borderWidth: 'red'
                }
              }, [params.row.roleName, h('span', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }
              }, params.row.roleName)
              ])
            ])
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: '300'
        }
      ]

    }
  },
  methods: {
    editClick (index) {
      console.log(this.confData[index])
      this.modalEdit = true
      this.editObj.nickName = this.confData[index].nickName
      this.editObj.phone = this.confData[index].phone
      this.editObj.id = this.confData[index].userId
      this.editObj.userCode = this.confData[index].userCode
    },
    submitEdit () {
      console.log(this.editObj, '--==----')
      let rule = /1[3,4,5,7,8][0-9]{9}$/
      if (rule.test(this.editObj.phone) === true && this.editObj.nickName !== '') {
        userEdit(this.editObj).then(res => {
          this.$Message.success({
            content: res.data.message
          })
          this.modalEdit = false
          this.getInfoUser()
        })
      } else {
        this.$Message.info('请输入正确的信息')
      }
    },
    cancelEdit () {
      this.modalEdit = false
    },
    deleteClick (index) {
      this.modalDelete = true
      this.editObj.userCode = this.confData[index].userCode
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handlerDelete () {
      userDelete(this.editObj.userCode).then(res => {
        this.$Message.success({
          content: res.data.message
        })
        this.modalDelete = false
        this.getInfoUser()
      })
    },
    addUser () {
      this.modalAddUser = true
    },
    submitUser () {
      if (this.phone) {
        let rule = /1[3,4,5,7,8][0-9]{9}$/
        if (rule.test(this.phone) === true & this.userName !== '') {
          const info = {
            userName: this.userName,
            phone: this.phone,
            nickName: this.nickName
          }
          userAdd(info).then(res => {
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
      this.nickName = null
    },
    cancelUser () {
      this.modalAddUser = false
      this.userName = null
      this.phone = null
      this.nickName = null
    },
    selected (e) {
      let array = []
      for (let i = 0; i < this.checkData.length; i++) {
        if (this.checkData[i] !== '') {
          array.push(this.checkData[i])
        }
      }
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
      console.log(e)
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
      this.pageNum = 1
      const info = {
        userName: this.userCode,
        pageSize: this.pageSize,
        currentPage: 1
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
      console.log(arr)
      let array = []
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
            roleCode,
            nickName: item.nickName,
            phone: item.phone,
            userId: item.userId

          })
        } else {
          array.push({
            userCode: item.userCode,
            roleName,
            roleCode,
            userName: item.userName,
            nickName: item.nickName,
            phone: item.phone,
            userId: item.userId

          })
        }
      })
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
      }).catch(err => { console.log(err) })
    }

  },
  mounted () {
    const data = {
      roleName: this.roleName,
      roleCode: this.roleCode
    }
    getInfoRole(data).then(res => {
      console.log(res)
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
