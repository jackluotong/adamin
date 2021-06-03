<template>
  <div class="user-content">
    <h1 style="margin:10px 10px 10px 10px">账户管理-用户管理</h1>
    <div class="content-button" >
      <span style="padding:10px">用户code</span>
      <Input v-model.trim="userCode"/>
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
            <span label="">{{formInline.userCode}}</span>
        </FormItem>

      </Form>
         <div>
            <Checkbox-group
                v-model="checkAllGroup1"
                @on-change="selected"
            >
                <Checkbox
                    v-for="(item, index) in checkedList"
                    :key="index"
                    :label="item"
                    v-model="getValue"
                    size="large"
                    ref="checkBox"
                    >{{ item.name }}</Checkbox
                >
            </Checkbox-group>
        </div>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
      </div>
     </Modal>
  </div>
</template>

<script>
import { confPageList, conf, getInfoUser, getInfoRole, roleConnect } from '@/api/data'
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
      value: [],
      checkedList: [],
      selectOptions: [],
      checked: true,
      roleName: '',
      total: 0,
      pageNum: 1,
      pageSize: 30,
      userCode: '',
      modalAddOrUpdate: false,
      detailTitle: '',
      showType: '', // 表单展示类型（edit、add）
      modalDelete: false,
      formInline: { // 实体
        userCode: '',
        checkedList: '',
        roleName: ''
      },
      ruleInline: {
        userCode: [
          { required: true, validator: validateuserCode, trigger: 'blur' }
        ]
      },
      confData: [ ],
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
    onChange (data) {
      console.log(data)
      this.selectOptions = data
    },
    select (data) {
      console.log(data)
    },
    search () {
      const info = {
        'userCode': this.userCode
      }
      getInfoUser(info).then(res => {
        const data = res.data.data.records
        const total = res.data.data.total
        this.renderPage(data, total)
      }).catch(err => {
        console.log(err)
      })
    },
    handleSubmitAddOrUpdate (index) {
      console.log(this.value, 'value')
      console.log(this.selectOptions)
      console.log(index)
      const info = {
        'userCode': this.formInline.userCode,
        'roles': [
          { 'roleCode': this.selectOptions }
        ]

      }
      console.log(info)
      roleConnect(info).then(res => { console.log(res) })
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
      this.checked = false
      this.$refs[name].resetFields()
      this.modalAddOrUpdate = false
    },
    edit (index) {
      this.id = this.confData[index].id
      console.log(this.confData[index])
      this.formInline.userCode = this.confData[index].userCode
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
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    translate (data) {
      let arr = []
      let result = {}
      for (const item of data) {
        let index = Object.keys(result).findIndex(
          (k) => k === item.userCode
        )
        let roleName = item.roles.map((r) => r.roleName).toString()
        if (index === -1) {
          result[item.userCode] = roleName
        } else {
          result[item.userCode] = `${
            result[item.userCode]
          }+${roleName}`
        }
        arr.push(result)
      }
      console.log(arr)
      console.log(result)
      return result
    }

  },
  mounted () {
    /*
            get all roleName
        */
    const data = {
      roleName: this.roleName,
      roleCode: this.roleCode
    }
    getInfoRole(data).then(res => {
      const data = res.data.data
      /*    let allRoleName = data.map((item) => {
        return item.roleName
      }) */
      this.checkedList = data
      console.log(data)
    //   this.plainOptions = allRoleName
      /*
         defalut  checkedList get from api
        */
    })
  },
  created () {
    const info = {
      userCode: this.userCode,
      pageSize: this.pageSize,
      currentPage: this.pageNum
    }
    getInfoUser(info).then(res => {
      const data = res.data.data.records
      const total = res.data.data.total
      this.translate(data)
      this.renderPage(data, total)
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
