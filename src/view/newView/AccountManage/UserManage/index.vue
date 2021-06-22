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
      <Input v-model.trim="userCode"/>
      <Button type="primary" icon="md-search" @click="search()" style="margin:0 10px 0 20px">查询</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)"
                              v-show="permission.includes('account:user:roleConnect')"
>角色关联</Button>
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
                v-model="checkData"
                @on-change="selected"
            >
                <Checkbox
                    v-for="(item, index) in checkList"
                    :key="index"
                    :label="item"
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
      pageSize: 30,
      userCode: '',
      modalAddOrUpdate: false,
      detailTitle: '',
      showType: '', // 表单展示类型（edit、add）
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
    selected (data) {
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
        'userCode': this.userCode
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
        'roles': this.selectOptions
      }
      roleConnect(info).then(res => {
        this.$Message.success('操作成功')
        this.modalAddOrUpdate = false
        this.$router.go(0)
        this.$nextTick(() => {
        })
      }).catch(error => console.log(error))
    },
    cancelAddOrUpdate (name) { // 取消新增
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
            roleName = roleName + ',' + i.roleName
          })
        }
        array.push({
          userCode: item.userCode,
          roleName
        })
      })
      return array
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
    const info = {
      userCode: this.userCode,
      pageSize: this.pageSize,
      currentPage: this.pageNum
    }
    getInfoUser(info).then(res => {
      const data = res.data.data.records
      const total = res.data.data.total
      this.translate(data)
      this.confData = this.translate(data)
      this.total = total
    }).catch(err => { console.log(err) })
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
