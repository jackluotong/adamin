<template>
  <div class="user-content">
    <h1 style="margin:10px 10px 10px 10px">应用系统管理-应用系统管理</h1>
    <div class="content-button">
      <span style="padding:10px">应用名称</span>
      <Input v-model.trim="applicationName" />
      <span style="padding:10px">应用简称</span>
      <Input v-model.trim="applicationCode" />
      <Button type="primary" icon="md-search" @click="search()" style="margin:0 10px 0 20px">查询</Button>
      <Button type="primary" icon="md-add" @click="addSetting()" v-show="permission.includes('application:manage:add')">应用注册</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
      <template slot-scope="{ row, index }" slot="action">
        <div>
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="edit(index)"
            v-show="permission.includes('application:manage:edit')"
          >编辑</Button>
         <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="lookConfig(index)"
            v-show="permission.includes('application:manage:look')"
          >查看配置</Button>
        </div>
      </template>
    </Table>
    <Page
      :total="total"
      :page-size="pageSize"
      :show-total="true"
      show-sizer
      style="text-align: center;margin-top: 5px"
    />

    <Modal
      v-model.trim="modalEdit"
      width="600"
      :mask-closable="false"
      :closable="false"
      v-bind:title="detailTitle"
    >
      <Form ref="formInline" :model="formInline">
        <div style="display:inline-table">
        <div v-show="isHaveKey">
          <FormItem label="应用名称" prop="applicationName" style="width:270px;">
              <Input v-model.trim="formInline.applicationName" style="width:auto"/>
          </FormItem>

        <FormItem label="应用简称" prop="applicationCode" style="width:270px;">
          <Input v-model.trim="formInline.applicationCode" style="width:auto"/>
        </FormItem>
        <FormItem label="联系人手机" prop="contactMobile" style="width:270px;">
          <Input v-model.trim="formInline.contactMobile" style="width:auto" />
        </FormItem>
        <FormItem label="联系人邮箱" prop="contactMail" style="width:270px;">
          <Input v-model.trim="formInline.contactMail" style="width:auto"/>
        </FormItem>
        </div>
        </div>
        <div v-show="isHavaShow">
            <FormItem label="AESKEY" prop="aeskey" >
          <Input v-model.trim="formInline.aeskey" />
        </FormItem>
        <FormItem label="AESLV" prop="aesiv" >
          <Input v-model.trim="formInline.aesiv"  />
        </FormItem>
        </div>

      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdateType('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { editInfo, getInfo } from '@/api/useSystem'
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
    const validateapplicationName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入参数名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateapplicationCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参数键名'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    const validateConfValue = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参数键名'))
      } else {
        callback()
      }
    }

    return {
      permission: sessionStorage.getItem('permission'),
      isHavaShow: false,
      isHaveKey: true,
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      applicationName: '',
      applicationCode: '',
      contactMobile: '',
      contactMail: '',
      modalEdit: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        applicationName: '',
        applicationCode: '',
        contactMobile: '',
        contactMail: '',
        aesiv: '',
        aeskey: '',
        id: ''
      },
      ruleInline: {
        applicationName: [
          { required: true, validator: validateapplicationName, trigger: 'blur' }
        ],
        applicationCode: [
          { required: true, validator: validateapplicationCode, trigger: 'blur' }
        ],
        confValue: [
          { required: true, validator: validateConfValue, trigger: 'blur' }
        ]
      },
      confData: [
      ],
      columns: [
        {
          title: '应用名称',
          key: 'applicationName',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '应用简称',
          key: 'applicationCode',
          width: 300,
          align: 'center'
        },
        {
          title: '联系人手机',
          key: 'contactMobile',
          width: 300,
          align: 'center'
        },
        {
          title: '联系人邮箱',
          key: 'contactMail',
          width: 300,
          align: 'center'
        },
        {
          title: '操作',
          width: 300,
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    search () {
      const info = {
        pageSize: this.pageSize,
        currentPage: this.pageNum,
        applicationCode: this.applicationCode,
        applicationName: this.applicationName
      }
      getInfo(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      }).catch(error => {
        console.log(error)
        this.$Message.info(error)
      })
    },
    reset () {
      this.formInline.applicationName = null
      this.formInline.applicationCode = null
      this.formInline.contactMobile = null
      this.formInline.contactMail = null
    },
    addSetting () {
      this.reset()
      this.isHavaShow = false
      this.showType = 'add'
      this.detailTitle = '应用注册'
      this.modalEdit = true
      this.isHaveKey = true
    },
    lookConfig (index) {
      this.isHavaShow = true
      this.detailTitle = '查看配置'
      this.modalEdit = true
      this.isHaveKey = false
      this.formInline.aesiv = this.confData[index].aesiv
      this.formInline.aeskey = this.confData[index].aeskey
    },
    handleSubmitAddOrUpdate (index) {
      this.$refs[index].validate(valid => {
        if (valid) {
          if (this.showType === 'add') {
            const info = {
              applicationName: this.formInline.applicationName,
              applicationCode: this.formInline.applicationCode,
              contactMobile: this.formInline.contactMobile,
              contactMail: this.formInline.contactMail
            }
            editInfo(info)
              .then(res => {
                this.$Message['success']({
                  background: true,
                  content: res.data.message
                })
                this.$refs['formInline'].resetFields()
                this.modalEdit = false
                this.getInfo()
              })
              .catch(err => {
                console.log(err)
              })
          } else if (this.showType === 'edit') {
            const info = {
              id: this.formInline.id,
              applicationName: this.formInline.applicationName,
              applicationCode: this.formInline.applicationCode,
              contactMobile: this.formInline.contactMobile,
              contactMail: this.formInline.contactMail
            }
            editInfo(info)
              .then(res => {
                this.$Message['success']({
                  background: true,
                  content: res.data.message
                })
                this.$refs['formInline'].resetFields()
                this.modalEdit = false
                this.getInfo()
              })
              .catch(err => {
                console.log(err)
              })
          }
        } else {
          this.$Message.error('请检查参数是否有误!')
        }
      })
    },
    cancelAddOrUpdate (name) {
      // 取消新增
      this.$refs[name].resetFields()
      this.modalEdit = false
    },
    cancelAddOrUpdateType () {
      this.modalEdit = false
    },
    edit (index) {
      this.isHavaShow = false
      this.formInline.id = this.confData[index].id
      this.formInline.applicationName = this.confData[index].applicationName
      this.formInline.applicationCode = this.confData[index].applicationCode
      this.formInline.contactMobile = this.confData[index].contactMobile
      this.formInline.contactMail = this.confData[index].contactMail
      this.formInline.aesiv = this.confData[index].aesiv
      this.formInline.aeskey = this.confData[index].aeskey
      this.showType = 'edit'
      this.detailTitle = '编辑模块'
      this.modalEdit = true
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      confDelete(this.id)
        .then(res => {
          this.$Message['success']({
            background: true,
            content: res.data.message
          })
          this.modalDelete = false
          this.confPageList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    getInfo () {
      const info = {
        'pageSize': this.pageSize,
        'currentPage': this.pageNum
      }
      getInfo(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      }).catch(error => {
        console.log(error)
        this.$Message.info(error)
      })
    }
  },
  created () {
    this.getInfo()
  }
}
</script>
<style lang="less" scoped>
.user-content {
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
    .ivu-btn {
      margin-left: 10px;
    }
    .ivu-btn-info {
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
