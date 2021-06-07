<template>
  <div class="user-content">
    <h1 style="margin:10px 10px 10px 10px">服务类型管理-服务类型管理</h1>
    <div class="content-button" >
      <span style="padding:10px">服务模块</span>
      <Input v-model.trim="serviceModule" />
      <span style="padding:10px">服务类型</span>
      <Input v-model.trim="serviceType" />
      <Button type="primary" icon="md-search" @click="search()" style="margin:0 10px 0 20px">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
      <Button type="primary" icon="md-add" @click="addSetting()">新增模块</Button>
      <Button type="primary" icon="md-add" @click="addSettingType()">新增服务类型</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="editModule(index)">编辑模块</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="delModule(index)">删除模块</Button>
            <Button type="primary" size="small" style="margin-right: 5px" @click="editType(index)">编辑类型</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="delType(index)">删除类型</Button>
          </div>
        </template>
     </Table>
     <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem label="服务模块" prop="serviceModule" style="width:270px;">
          <Input v-model.trim="formInline.serviceModule"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitModule('formInline')">保存模块</Button>
      </div>
     </Modal>
     <!-- 新增模块 -->
      <Modal v-model.trim="addNewModuleMoal" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form :model="formInline" :rules="ruleInline" inline>
        <FormItem label="服务模块" style="width:270px;">
          <Input v-model.trim="addServiceModule"/>
        </FormItem>
        <FormItem label="模块code"  style="width:270px;" >
          <Input v-model.trim="serviceModuleCode"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddModule()">返回</Button>
        <Button type="primary" size="large" @click="addNewModule()">保存模块</Button>
      </div>
     </Modal>
     <!-- 新增服务类型 -->
     <Modal v-model.trim="addNewServiceType" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form  :model="formInline"  >
        <div style="display:inline-table">
        <FormItem label="服务模块" prop="serviceModule" style="width:270px;">
        <Select v-model.trim="formInline" style="width:200px" @on-change="selectModuleNew">
            <Option v-for="(item,id) in allModulesOption"
            :key="id"
            :value="item.serviceModuleCode"
            >{{item.serviceModule}}</Option>
        </Select>
          </FormItem>
       </div>
          <FormItem label="服务类型" prop="serviceType" style="width:270px;">
                  <Input v-model.trim="addServiceType.serviceType"/>
          </FormItem>
           <FormItem label="服务类型code" prop="serviceCode" style="width:270px;">
                  <Input v-model.trim="addServiceType.serviceCode"/>
          </FormItem>
        <FormItem label="服务地址"  style="width:270px;">
                  <Input v-model.trim="addServiceType.url"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddNewService('formInline')">返回</Button>
        <Button type="primary" size="large" @click="addNewServiceTypeClick()">新增类型</Button>
      </div>
     </Modal>

    <Modal v-model.trim="modalAddOrUpdateType" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline"  >
        <div style="display:inline-table">
        <FormItem label="服务模块" prop="serviceModule" style="width:270px;">
        <Select v-model.trim="selectValue" style="width:200px" @on-change="selectModule">
            <Option v-for="(item,id) in allModulesOption"
            :key="id"
            :value="item.serviceModuleCode"
            >{{item.serviceModule}}</Option>
        </Select>
          </FormItem>
       </div>
          <FormItem label="服务类型" prop="serviceType" style="width:270px;">
                  <Input v-model.trim="formInline.serviceType"/>
          </FormItem>
           <FormItem label="服务类型code" prop="serviceCode" style="width:270px;">
                  <Input v-model.trim="formInline.serviceCode"/>
          </FormItem>
        <FormItem label="服务地址" prop="serviceAddress" style="width:270px;">
                  <Input v-model.trim="formInline.serviceAddress"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdateType('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitType('formInline')">保存类型</Button>
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
import { getServiceTypeInfo, editServiceModule, editServiceType, inquireServiceModule, deletModule, deleteType } from '@/api/data'

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
    const validateserviceModule = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入参数名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateserviceType = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参数键名'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }

    /* const delay = (function () {
      let timer = 0
      return function (callback, ms) {
        clearTimeout(timer)
        timer = setTimeout(callback, ms)
      }
    })() */
    return {
      serviceType: '',
      serviceModule: '',
      selectValue: [],
      addServiceType: {
        serviceModuleCode: '',
        serviceCode: '',
        serviceType: '',
        url: ''
      },
      addNewServiceType: false,
      addServiceModule: '',
      addNewModuleMoal: false,
      serviceModuleCode: '',
      deleteServiceTypeCode: '',
      deleteTypeId: '',
      judgeEditType: '',
      allModulesOption: [],
      judgedeleteType: '',
      editModuleId: '',
      total: 0,
      pageNum: 1,
      pageSize: 10,
      modalAddOrUpdate: false,
      modalAddOrUpdateType: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        serviceModule: null,
        serviceType: '',
        serviceAddress: '',
        serviceCode: '',
        editId: ''

      },
      ruleInline: {
        serviceModule: [
          { required: true, validator: validateserviceModule, trigger: 'blur' }
        ],
        serviceType: [
          { required: true, validator: validateserviceType, trigger: 'blur' }
        ]

      },
      confData: [],
      columns: [
        {
          title: '服务模块',
          key: 'serviceModule',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '服务类型',
          key: 'serviceType',
          width: 300,
          align: 'center'
        },
        {
          title: '统一对外服务地址',
          key: 'serviceUrl',
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
    selectModuleNew (e) {
      console.log(e)
      this.addServiceType.serviceModuleCode = e
    },
    selectModule (e) {
      this.formInline.serviceModule = e
      console.log(this.formInline.serviceModule)
    },
    search () {
      const info = {
        'serviceModule': this.serviceModule,
        'serviceType': this.serviceType
      }
      getServiceTypeInfo(info).then(res => {
        console.log(res)
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    reset () {
      this.serviceModule = null
      this.serviceType = null
      this.serviceAddress = null
    },
    addSetting () {
      this.detailTitle = '新增模块'
      this.addNewModuleMoal = true
    },

    addSettingType () {
      this.detailTitle = '新增服务类型'
      this.addNewServiceType = true
    },
    addNewModule () {
      const info = {
        'serviceModule': this.addServiceModule,
        'serviceModuleCode': this.serviceModuleCode
      }
      editServiceModule(info).then(res => {
        console.log(res, '新增模块')
        this.getServiceTypeInfo()
      }).catch(error => console.log(error))
      this.addNewModuleMoal = false
    },
    cancelAddModule () {
      this.addNewModuleMoal = false
    },
    handleSubmitModule () {
      try {
        const info = {
          'serviceModule': this.formInline.serviceModule,
          'serviceModuleCode': this.editModuleId
        }
        editServiceModule(info).then(res => {
          console.log(res)
          this.getServiceTypeInfo()
        }).catch(error => console.log(error))
      } catch (error) {
        this.modalAddOrUpdate = false
      } finally {
        this.modalAddOrUpdate = false
      }
    },
    handleSubmitType () {
      try {
        const info = {
          'serviceModuleCode': this.formInline.serviceModule,
          'serviceType': this.formInline.serviceType,
          'serviceTypeCode': this.formInline.serviceCode,
          'serviceUrl': this.formInline.serviceAddress,
          'id': this.formInline.editId
        }
        console.log(info)
        editServiceModule(info).then(res => {
          console.log(res)
          this.getServiceTypeInfo()
        }).catch(error => console.log(error))
      } catch (error) {
        this.modalAddOrUpdateType = false
      } finally {
        this.modalAddOrUpdateType = false
      }
    },
    cancelAddNewService () {
      this.addNewServiceType = false
    },
    addNewServiceTypeClick () {
      const info = {
        'serviceModuleCode': this.addServiceType.serviceModuleCode,
        'serviceType': this.addServiceType.serviceType,
        'serviceTypeCode': this.addServiceType.serviceCode,
        'serviceUrl': this.addServiceType.url
      }
      console.log(info)
      editServiceType(info).then(res => {
        this.getServiceTypeInfo()
        this.addNewServiceType = false
      }).catch(() => {
        this.addNewServiceType = false
      })
    },
    cancelAddOrUpdate (name) {
      this.$refs[name].resetFields()
      this.modalAddOrUpdate = false
    },
    cancelAddOrUpdateType () {
      this.modalAddOrUpdateType = false
    },
    editModule (index) {
      this.editModuleId = this.confData[index].serviceModuleCode
      this.formInline.serviceModule = this.confData[index].serviceModule
      this.formInline.serviceType = this.confData[index].serviceType
      this.showType = 'edit'
      this.detailTitle = '编辑模块'
      this.modalAddOrUpdate = true
    },
    editType (index) {
      this.selectValue = this.confData[index].serviceModule
      this.id = this.confData[index].id
      this.formInline.serviceModule = this.confData[index].serviceModuleCode
      this.formInline.serviceType = this.confData[index].serviceType
      this.formInline.serviceAddress = this.confData[index].serviceUrl
      this.formInline.serviceCode = this.confData[index].serviceTypeCode
      this.formInline.editId = this.confData[index].id
      this.detailTitle = '编辑服务类型'
      this.judgeEditType = 'edit'
      this.modalAddOrUpdateType = true
    },
    delModule (index) {
      this.editModuleId = this.confData[index].serviceModuleCode
      this.modalDelete = true
      this.judgedeleteType = 'module'
    },
    delType (index) {
      this.deleteServiceTypeCode = this.confData[index].serviceTypeCode
      this.deleteTypeId = this.confData[index].id
      this.modalDelete = true
      this.judgedeleteType = 'type'
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      if (this.judgedeleteType === 'module') {
        const info = this.editModuleId
        deletModule(info).then(res => {
          console.log(res)
          this.getServiceTypeInfo()
          this.modalDelete = false
        }).catch(error => console.log(error))
        this.modalDelete = false
      } else if (this.judgedeleteType === 'type') {
        const code = this.deleteServiceTypeCode
        const id = this.deleteTypeId
        deleteType(id, code).then(res => {
          console.log(res, 'delete type')
          this.getServiceTypeInfo()
          this.modalDelete = false
        }).catch(error => {
          console.log(error)
          this.modalDelete = false
        })
      } else {
        this.$Message.info('操作无效')
      }
    },
    getServiceTypeInfo () {
      const info = {
        pageSize: this.pageSize,
        currentPage: this.pageNum
      }
      getServiceTypeInfo(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
        console.log(res)
      }).catch(err => this.$Message.info(err))
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    async fetchData () {

    },
    async getAllModuleOptions () {
      const info = {}
      inquireServiceModule(info).then(res => {
        this.allModulesOption = res.data.data.records
      })
    }
  },
  created () {
    this.getServiceTypeInfo()
    this.getAllModuleOptions()
  },
  mounted () {

  },
  watch: {
    /*  serviceModule () {
      delay(() => {
        this.fetchData()
      }, 300)
    } */
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
