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
      <Button type="primary" icon="md-add" @click="addSettingType()"
            v-show="permission.includes('serviceType:serviceType:add')"
>新增服务类型</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{ index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="editType(index)"
                  v-show="permission.includes('serviceType:serviceType:edit')"
                >编辑</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="delType(index)"
                  v-show="permission.includes('serviceType:serviceType:delete')"
                >删除</Button>
          </div>
        </template>
     </Table>
     <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"
     @on-change='changePage'
     @on-page-size-change='onpagesizechange'
     />
     <!-- 新增服务类型 -->
     <Modal v-model.trim="addNewServiceType" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form  :model="formInline"   ref="formInline" >
        <div style="display:inline-table">
        <FormItem label="服务模块"  style="width:270px;">
        <Select v-model.trim="selectedModuleAdd"  @on-change='selectedModuleAddClick' clearable >
            <Option v-for="(item,id) in allModulesOption"
            :key="id"
            :value="item.serviceModuleCode"
            >{{item.serviceModule}}</Option>
        </Select>
          </FormItem>
       </div>
        <FormItem label="服务类型" style="width:270px;">
            <Input v-model.trim="addServiceType.serviceType"/>
        </FormItem>
         <FormItem label="服务类型Code" style="width:270px;">
            <Input v-model.trim="addServiceType.serviceTypeCode"/>
        </FormItem>
        <FormItem label="服务地址"  style="width:270px;">
                  <Input v-model.trim="addServiceType.url"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddNewService('formInline')">返回</Button>
        <Button type="primary" size="large" @click="addNewServiceTypeClick()">保存</Button>
      </div>
     </Modal>
<!-- 编辑 -->
    <Modal v-model.trim="modalAddOrUpdateType" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline"  >
        <div style="display:inline-table">
        <FormItem label="服务模块"  style="width:270px;">
        <Select v-model.trim="selectValue"
         @on-change='selectModule'
         clearable >
            <Option v-for="(item,id) in allModulesOption"
            :key="id"
            :value="item.serviceModuleCode"
            >{{item.serviceModule}}</Option>
        </Select>
        </FormItem>
       </div>
           <FormItem label="服务类型"  style="width:270px;">
            <Input v-model.trim="formInline.serviceType"/>
          </FormItem>
          <FormItem label="服务类型Code"  style="width:270px;">
            <Input v-model.trim="formInline.serviceCode"/>
          </FormItem>
        <FormItem label="服务地址"  style="width:270px;">
                  <Input v-model.trim="formInline.serviceAddress"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdateType('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitType('formInline')">保存</Button>
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
import { getServiceTypeInfo, editServiceType, inquireServiceModule, deletModule, deleteType, serarchTypeByModule } from '@/api/data'

export default {
  data () {
    return {
      selectedT: '',
      selectedType: '',
      allType: '',
      permission: sessionStorage.getItem('permission'),
      selectedModuleAdd: '',
      serviceTypeAdd: '',
      serviceType: '',
      serviceModule: '',
      selectValue: [],
      allServiceType: [],
      addServiceType: {
        serviceModuleCode: '',
        serviceTypeCode: '',
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
      total: 0,
      pageNum: 1,
      pageSize: 10,
      modalAddOrUpdate: false,
      modalAddOrUpdateType: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        serviceModule: '',
        serviceType: '',
        serviceAddress: '',
        serviceCode: '',
        editId: ''
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
          title: '服务类型',
          key: 'serviceType',
          width: 300,
          align: 'center'
        },
        {
          title: '服务类型Code',
          key: 'serviceTypeCode',
          tooltip: true,
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
          align: 'center',
          width: 300
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
        serviceType: this.serviceType,
        serviceModule: this.serviceModule
      }
      getServiceTypeInfo(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e,
        serviceType: this.serviceType,
        serviceModule: this.serviceModule
      }
      getServiceTypeInfo(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    selectedModuleAddClick (e) {
      /*  serarchTypeByModule(e).then(res => {
        this.allServiceType = res.data.data
      }).catch(err => this.$Message.info(err)) */
    },
    selectModule (e) {
      serarchTypeByModule(e).then(res => {
        this.allServiceType = res.data.data
      }).catch(err => this.$Message.info(err))
    },
    selectedTypeEdit (e) {
      this.formInline.serviceCode = e.value
      this.formInline.serviceType = e.label
      console.log(e)
    },
    selectedTypeAdd (e) {
      this.addServiceType.serviceTypeCode = e.value
      this.addServiceType.serviceType = e.label
    },
    search () {
      const info = {
        serviceModule: this.serviceModule,
        serviceType: this.serviceType,
        currentPage: this.pageNum,
        pageSize: this.pageSize
      }
      getServiceTypeInfo(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    reset () {
      this.serviceModule = null
      this.serviceType = null
      this.serviceAddress = null
    },
    addSetting () {
      this.addServiceModule = null
      this.detailTitle = '新增模块'
      this.addNewModuleMoal = true
    },

    addSettingType () {
      this.detailTitle = '新增服务类型'
      this.addNewServiceType = true
    },
    handleSubmitType () {
      console.log(this.selectValue)
      const info = {
        serviceModuleCode: this.selectValue,
        serviceType: this.formInline.serviceType,
        serviceTypeCode: this.formInline.serviceCode,
        serviceUrl: this.formInline.serviceAddress,
        id: this.formInline.editId
      }
      editServiceType('/dadmin/type/update/type', info).then(res => {
        this.$Message.success({
          content: res.data.message
        })
        this.getServiceTypeInfo()
        this.addServiceType.url = null
        this.selectedModuleAdd = null
        this.modalAddOrUpdateType = false
      }).catch(error => console.log(error))
    },
    cancelAddNewService () {
      this.addNewServiceType = false
    },
    addNewServiceTypeClick () {
      const info = {
        serviceModuleCode: this.selectedModuleAdd,
        serviceTypeCode: this.addServiceType.serviceTypeCode,
        serviceUrl: this.addServiceType.url,
        serviceType: this.addServiceType.serviceType
      }
      editServiceType('/dadmin/type/create/type', info).then(res => {
        this.$Message.success({
          content: res.data.message
        })
        this.getServiceTypeInfo()
        this.addNewServiceType = false
        for (let key in this.addServiceType) {
          delete this.addServiceType[key]
        }
        this.selectedModuleAdd = null
      }).catch((err) => {
        for (let key in this.addServiceType) {
          delete this.addServiceType[key]
        }
        this.selectedModuleAdd = null
        console.log(err)
      })
    },
    cancelAddOrUpdate (name) {
      this.$refs[name].resetFields()
      this.modalAddOrUpdate = false
    },
    cancelAddOrUpdateType () {
      this.modalAddOrUpdateType = false
    },
    editType (index) {
      this.selectedType = this.confData[index].serviceTypeCode
      this.selectValue = this.confData[index].serviceModuleCode
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
          this.$Message.success({
            content: res.data.message
          })
          this.getServiceTypeInfo()
          this.modalDelete = false
        }).catch(error => console.log(error))
        this.modalDelete = false
      } else if (this.judgedeleteType === 'type') {
        const code = this.deleteServiceTypeCode
        const id = this.deleteTypeId
        deleteType(id, code).then(res => {
          this.$Message.success({
            content: res.data.message
          })
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
        console.log(res)
        this.allType = res.data.data.records
        this.renderPage(res.data.data.records, res.data.data.total)
      }).catch(err => this.$Message.info(err))
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    async getAllModuleOptions () {
      const info = {
        pageSize: 10000,
        currentPage: 1
      }
      inquireServiceModule(info).then(res => {
        console.log(res)
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
