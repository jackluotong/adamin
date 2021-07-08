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
      <Button type="primary" icon="md-search" @click="reset()" style="margin:0 10px 0 20px">重置</Button>

    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
      <template slot-scope="{ index }" slot="action">
        <div>
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="edit(index)"
            v-show="permission.includes('application:manage:edit')"
          >编辑</Button>
           <Button
            type="error"
            size="small"
            style="margin-right: 5px"
            @click="deleteClcik(index)"
            v-show="permission.includes('application:manage:del')"
          >删除</Button>
         <Button
            type="info"
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
      @on-change='changePage'
      @on-page-size-change='onpagesizechange'
    />

    <Modal
      v-model.trim="modalEdit"
      width="600"
      :mask-closable="false"
      :closable="false"
      v-bind:title="detailTitle"
    >
      <Form ref="formInline" :model="formInline" >
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
          <Input v-model.trim="formInline.aeskey" readonly/>
        </FormItem>
        <FormItem label="AESLV" prop="aesiv" >
          <Input v-model.trim="formInline.aesiv"  readonly/>
        </FormItem>
        </div>

      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdateType('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')" v-show="!isHavaShow">保存</Button>
      </div>
    </Modal>
     <Modal v-model.trim="modalDelete" width="450" title="删除参数配置提示">
            <div>
                <p>确定删除该参数配置吗？</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelDelete" size="large">取消</Button>
                <Button type="primary" @click="handleSubmitDelete" size="large">确定</Button>
            </div>
        </Modal>
  </div>
</template>

<script>
import { editInfo, getInfo, deleteSystem } from '@/api/useSystem'
export default {
  data () {
    return {
      id: '',
      code: '',
      current: 1,
      permission: sessionStorage.getItem('permission'),
      isHavaShow: false,
      isHaveKey: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
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
      confData: [
      ],
      columns: [
        {
          type: 'index',
          width: 60,
          aligin: 'center'
        },
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
    deleteClcik (index) {
      console.log(this.confData[index])
      this.id = this.confData[index].id
      this.code = this.confData[index].applicationCode
      this.modalDelete = true
    },
    onpagesizechange (e) {
      this.pageSize = e
      const info = {
        pageSize: e,
        currentPage: this.pageNum,
        applicationCode: this.applicationCode,
        applicationName: this.applicationName
      }
      getInfo(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e,
        applicationCode: this.applicationCode,
        applicationName: this.applicationName
      }
      getInfo(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
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
      this.applicationCode = null
      this.applicationName = null
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
            editInfo('/dadmin/application/create', info)
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
            editInfo('/dadmin/application/update', info)
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
      this.$refs[name].resetFields()
      this.modalEdit = false
    },
    cancelAddOrUpdateType () {
      this.modalEdit = false
    },
    edit (index) {
      this.isHavaShow = false
      this.isHaveKey = true
      this.formInline.id = this.confData[index].id
      this.formInline.applicationName = this.confData[index].applicationName
      this.formInline.applicationCode = this.confData[index].applicationCode
      this.formInline.contactMobile = this.confData[index].contactMobile
      this.formInline.contactMail = this.confData[index].contactMail
      this.formInline.aesiv = this.confData[index].aesiv
      this.formInline.aeskey = this.confData[index].aeskey
      this.showType = 'edit'
      this.detailTitle = '编辑系统'
      this.modalEdit = true
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      deleteSystem(this.id, this.code)
        .then(res => {
          this.$Message['success']({
            background: true,
            content: res.data.message
          })
          this.modalDelete = false
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
        pageSize: this.pageSize,
        currentPage: this.pageNum
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
