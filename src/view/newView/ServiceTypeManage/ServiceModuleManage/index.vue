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
    <h1 style="margin:10px 10px 10px 10px">服务类型管理-服务模块管理</h1>
    <div class="content-button" >
      <span style="padding:10px" >模块名称</span>
      <Input v-model.trim="serviceModule" @on-enter="enter"/>
      <Button type="primary" icon="md-search" @click="search()" style="margin:0 10px 0 20px">查询</Button>
      <Button type="primary" icon="md-add" @click="addSetting()"
                  v-show="permission.includes('serviceType:serviceModule:add')"
>新增</Button>
                  <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)"
                              v-show="permission.includes('serviceType:serviceModule:edit')"
>编辑</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="del(index)"
                              v-show="permission.includes('serviceType:serviceModule:delete')"
>删除</Button>
          </div>
        </template>
     </Table>
     <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"
      @on-change='changePage'
     @on-page-size-change='onpagesizechange'/>
     <Modal
     v-model.trim="modalAddOrUpdate"
     width="600"
     height="1000"
     :mask-closable='false'
     v-bind:title="detailTitle"
     class-name="vertical-center-modal">
      <Form ref="formInline" :model="formInline"  inline>
        <FormItem label="服务模块" prop="serviceModule" style="width:270px;">
          <Input v-model.trim="formInline.serviceModule"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
      </div>
     </Modal>
    <Modal v-model.trim="modalDelete" width="450" title="删除参数配置提示">
      <div >
        <p>确定删除该参数配置吗？</p>
      </div>
      <div slot="footer">
          <Button type="text" @click="cancelDelete" size="large">取消</Button>
          <Button type="primary" @click="handleSubmitDelete" size="large" >确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import { editServiceModule, inquireServiceModule, deletModule } from '@/api/data'
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
    const validateserviceModule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入模块名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    return {
      permission: sessionStorage.getItem('permission'),
      serviceModuleCode: '',
      readOnly: false,
      saveRoleId: [],
      selectedValue: [],
      treeData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      serviceModule: '',
      roleCode: '',
      modalAddOrUpdate: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        serviceModule: '',
        serviceModuleCode: ''
      },
      ruleInline: {
        serviceModule: [
          { required: true, validator: validateserviceModule, trigger: 'blur' }
        ]
      },
      confData: [],
      columns: [
        {
          type: 'index',
          width: 60,
          aligin: 'center'
        },
        {
          title: '服务模块',
          key: 'serviceModule',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '服务模块Code',
          key: 'serviceModuleCode',
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
      this.pageSize = e
      const info = {
        pageSize: e,
        currentPage: this.pageNum,
        serviceModule: this.serviceModule
      }
      inquireServiceModule(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e,
        serviceModule: this.serviceModule
      }
      inquireServiceModule(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    reset () {
      this.serviceModule = null
      this.roleCode = null
    },
    enter () {
      this.getInfo()
    },
    search () {
      const data = {
        serviceModule: this.serviceModule,
        currentPage: this.pageNum,
        pageSize: this.pageSize
      }
      inquireServiceModule(data).then(res => {
        this.renderPage(res.data.data.records, res.data.data.records.length)
      }).catch(err => console.log(err))
    },
    addSetting () {
      this.showType = 'add'
      this.detailTitle = '新增全局配置信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) {
      this.$refs[index].validate((valid) => {
        if (valid) {
          if (this.showType === 'edit') {
            const info = {
              serviceModuleCode: this.formInline.serviceModuleCode,
              serviceModule: this.formInline.serviceModule
            }
            console.log(info)
            editServiceModule(info).then(res => {
              this.getInfo()
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalAddOrUpdate = false
              this.$refs[index].resetFields()
            }).catch(err => console.log(err))
          } else if (this.showType === 'add') {
            const info = {
              serviceModule: this.formInline.serviceModule
            }
            editServiceModule(info).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalAddOrUpdate = false
              this.getInfo()
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          this.$Message.error('请检查参数配置！')
        }
      })
    },
    cancelAddOrUpdate (name) {
      this.$refs[name].resetFields()
      this.modalAddOrUpdate = false
    },
    edit (index) {
      this.saveRoleId = this.confData[index].roleId
      this.showType = 'edit'
      this.id = this.confData[index].id
      this.formInline.serviceModule = this.confData[index].serviceModule
      this.formInline.serviceModuleCode = this.confData[index].serviceModuleCode
      this.detailTitle = '修改全局配置信息'
      this.modalAddOrUpdate = true
      this.defaultSelected = ''
    },
    del (index) {
      this.modalDelete = true
      this.serviceModuleCode = this.confData[index].serviceModuleCode
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      console.log(this.serviceModuleCode)
      deletModule(this.serviceModuleCode).then(res => {
        this.$Message.success({
          content: res.data.message
        })
        this.getInfo()
      }).catch(err => console.log(err))
      this.modalDelete = false
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    getInfo () {
      const data = {
        currentPage: this.pageNum,
        pageSize: this.pageSize
      }
      inquireServiceModule(data).then(res => {
        console.log(res)
        const data = res.data.data.records
        const total = res.data.data.total
        this.renderPage(data, total)
      })
    }
  },
  created () {
    this.getInfo()
  },
  mounted () {
  }
}
</script>
