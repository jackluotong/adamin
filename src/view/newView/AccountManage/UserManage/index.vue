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
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem label="用户code" style="width:270px;">
            <span>{{formInline.userCode}}</span>
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
  </div>
</template>

<script>
import { getInfoUser, getInfoRole, roleConnect } from '@/api/data'
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
      formInline: { // 实体
        userCode: '',
        checkList: '',
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
    onpagesizechange (e) {
      const info = {
        pageSize: e,
        currentPage: this.pageNum
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
        currentPage: e
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
      console.log(e)
      this.getInfoUser()
    },
    selected (data) {
      console.log(data, this.checkData)
      this.selectOptions = []
      for (let i = 0; i < data.length; i++) {
        this.selectOptions.push(data[i].roleCode)
      }
    },
    onChange (data) {
      this.selectOptions = data
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
      const info = {
        'userCode': this.formInline.userCode,
        'roles': this.checkData
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
      arr.map((item) => {
        let roleName = ''
        if (item.roles.length !== 0) {
          item.roles.map((i, t) => {
            roleName = i.roleName + ';' + roleName
          })
        }
        array.push({
          userCode: item.userCode,
          roleName
        })
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
    /*
            get all roleName
        */
    const data = {
      roleName: this.roleName,
      roleCode: this.roleCode
    }
    getInfoRole(data).then(res => {
      const data = res.data.data
      /*
        get info role set in checkList
      */
      this.checkList = data
      /*
         defalut  checkList get from api
        */
    })
  },
  created () {
    this.getInfoUser()
  },
  watch: {
    userCode: {
      handler: function (val, old) {
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
