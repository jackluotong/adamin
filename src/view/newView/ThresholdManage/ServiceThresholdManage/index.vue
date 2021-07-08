<style lang="less" scoped>
.user-content{
  .content-button {
    padding: 5px;
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
</style>
<template>
  <div class="user-content">
      <h1 style="margin:10px 10px 10px 10px">阈值管理-服务阈值管理</h1>
    <div style="display:flex">
<span style="padding:10px 10px 10px 10px ">厂商名称</span>
<Select label="" v-model.trim="manufacturerName" style="width:150px; margin-right:20px;" clearable >
        <Option v-for="(item,id) in manufacturerOption" :key="id" :value="item.manufacturerCode">{{item.manufacturerName}}</Option>
      </Select>
<span style="padding:10px 10px 10px 10px ">服务模块</span>
 <Select label="" v-model.trim="serviceModule" style="width:150px; margin-right:20px;" clearable >
        <Option v-for="(item,id) in moduleOption" :key="id" :value="item.serviceModuleCode">{{item.serviceModule}}</Option>
      </Select>
<span style="padding:10px 10px 10px 10px ">服务类型</span>
      <Select label="" v-model.trim="serviceType" style="width:150px;margin-right:20px" clearable >
        <Option v-for="(item,id) of typeOption" :key="id" :value="item.serviceTypeCode">{{item.serviceType}}</Option>
      </Select>
</div>
<div style="">
      <Button type="primary" icon="md-search" @click="search()" style="margin:10px">查询</Button>
      <Button type="primary" icon="md-refresh" @click="addNew()" style="margin:10px"
      v-show="permission.includes('threshold:service:add')"
>新增阈值</Button>

</div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{ index }" slot="action">
          <div>
            <Button type="info"
            size="small"
             style="margin-right: 5px"
             @click="edit(index)"
                      v-show="permission.includes('threshold:service:edit')"
             >编辑</Button>
              <Button type="error"
            size="small"
             style="margin-right: 5px"
             @click="deleteClick(index)"
                      v-show="permission.includes('threshold:service:del')"
             >删除</Button>
          </div>
        </template>
    </Table>
    <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"
            @on-change='changePage'
            @on-page-size-change='onpagesizechange'/>
    <Modal v-model="modalCheck" width="30%" height="40%"  :mask-closable="false" :closable="true" title="详情" >
      <Form :model="formInline"  inline>
          <div v-if="isShow">
        <FormItem  label="厂商名称" style="width:300px;" >
            <Select label="" v-model.trim="formInline.manufacturerCode" style="width:150px; margin-right:20px;" clearable
            @on-change='selectedModuleClick'>
              <Option v-for="(item,id) in manufacturerOption" :key="id" :value="item.manufacturerCode">{{item.manufacturerName}}</Option>
            </Select>
        </FormItem><br>
        <!-- <FormItem label="服务模块" style="width:300px;" >
           <Select label="" v-model.trim="formInline.serviceModuleCode" style="width:150px; margin-right:20px;"  @on-change='selectedModuleClick' clearable >
        <Option v-for="(item,id) in moduleOption" :key="id" :value="item.serviceModuleCode">{{item.serviceModule}}</Option>
         </Select>
           </FormItem> -->
        <FormItem label="服务类型" style="width:300px;" >
            <Select label="" v-model.trim="formInline.serviceTypeCode" style="width:150px;margin-right:20px" clearable >
        <Option v-for="(item,id) of typeOptionConnect" :key="id" :value="item.serviceTypeCode">{{item.serviceType}}</Option>
             </Select>
            </FormItem><br>
        </div>
        <FormItem label="超时阈值" style="width:100%;" >
        <Input  v-model.number="formInline.timeoutThreshold" style="width:auto"/>
      </FormItem><br>
       <FormItem label="超时次数阈值（每小时）" style="width:100%;" >
        <Input  v-model.number="formInline.timeoutTimesThreshold" style="width:auto"/>
      </FormItem><br>
       <FormItem label="异常次数阈值（每小时）" style="width:100%;" >
        <Input  v-model.number="formInline.abnormalTimesThreshold" style="width:auto"/>
      </FormItem><br>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancel('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
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
import { getServiceTypeInfo, inquireServiceModule } from '@/api/data'
import { getServiceThreShold, addServiceThreShold, editServiceThreShold, searchByCode, deleteServiceThreShold } from '@/api/thresholdManage'
import { getManufacture } from '@/api/thirdPart'
export default {
  data () {
    return {
      permission: sessionStorage.getItem('permission'),
      ishow: false,
      isShow: false,
      deleteServiceTypeCode: '',
      deleteId: '',
      modalDelete: false,
      showType: '',
      total: 0,
      pageNum: 1,
      pageSize: 10,
      manufacturerName: '',
      serviceModule: '',
      serviceType: '',
      showDetailModal: false,
      showDetailContent: '',
      modalCheck: false,
      formInline: {
        abnormalTimesThreshold: '',
        timeoutThreshold: '',
        manufacturerCode: '',
        serviceTypeCode: '',
        serviceModuleCode: '',
        manufacturerUrl: '',
        timeoutTimesThreshold: '',
        id: ''
      },
      manufacturerOption: [ ],
      moduleOption: [ ],
      typeOption: [ ],
      typeOptionConnect: [ ],
      confData: [ ],
      columns: [
        {
          type: 'index',
          width: 60,
          aligin: 'center'
        },
        {
          title: '厂商名称',
          key: 'manufacturerName',
          tooltip: true,
          width: 150,
          align: 'center'
        },
        {
          title: '服务模块',
          key: 'serviceModule',
          width: 150,
          align: 'center'
        },
        {
          title: '服务类型',
          key: 'serviceType',
          width: 150,
          align: 'center'
        },
        {
          title: '服务状态',
          key: 'serviceStatus',
          width: 200,
          align: 'center',
          render (h, params) {
            switch (params.row.serviceStatus) {
              case 0:
                return h('span', '生效')
              case 1:
                return h('span', '失效')
              default:
                break
            }
          }
        },
        {
          title: '统一对外服务地址',
          key: 'serviceUrl',
          width: 150,
          align: 'center'
        },
        {
          title: '厂商接口地址',
          key: 'manufacturerUrl',
          width: 150,
          align: 'center'
        },
        {
          title: '超时阈值（单位秒）',
          key: 'timeoutThreshold',
          width: 150,
          align: 'center'
        },
        {
          title: '超时次数阈值（每小时）',
          key: 'timeoutTimesThreshold',
          width: 150,
          align: 'center'
        },
        {
          title: '异常次数阈值（每小时）',
          key: 'abnormalTimesThreshold',
          width: 150,
          align: 'center'
        },
        {
          title: '编辑',
          slot: 'action',
          align: 'center',
          width: 300
        }
      ],
      buttonOption: ['编辑', '删除']
    }
  },
  methods: {
    selectedModuleClick (e) {
      searchByCode(e).then(res => {
        this.typeOptionConnect = res.data.data
      }).catch(err)
    },
    onpagesizechange (e) {
      this.pageSize = e
      const info = {
        pageSize: e,
        currentPage: this.pageNum,
        manufacturerCode: this.manufacturerName,
        serviceTypeCode: this.serviceType,
        serviceModuleCode: this.serviceModule
      }
      getServiceThreShold(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e,
        manufacturerCode: this.manufacturerName,
        serviceTypeCode: this.serviceType,
        serviceModuleCode: this.serviceModule
      }
      getServiceThreShold(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    search () {
      this.getServiceThreShold(this.manufacturerName, this.serviceType, this.serviceModule)
    },
    reset () {
      for (let key in this.formInline) {
        delete this.formInline[key]
      }
    },
    edit (index) {
      this.formInline.id = this.confData[index].id
      this.formInline.abnormalTimesThreshold = this.confData[index].abnormalTimesThreshold
      this.formInline.timeoutThreshold = this.confData[index].timeoutThreshold
      this.formInline.timeoutTimesThreshold = this.confData[index].timeoutTimesThreshold
      this.modalCheck = true
      this.showType = 'edit'
      this.isShow = false
    },
    addNew () {
      this.isShow = true
      this.modalCheck = true
      this.showType = 'add'
      for (let key in this.formInline) {
        this.formInline[key] = ''
      }
    },
    cancel () {
      this.modalCheck = false
    },
    deleteClick (index) {
      this.deleteId = this.confData[index].id
      this.deleteServiceTypeCode = this.confData[index].serviceTypeCode
      this.modalDelete = true
    },
    handleSubmitDelete () {
      deleteServiceThreShold(this.deleteId).then(res => {
        this.getServiceThreShold()
        this.$Message.success({
          content: res.data.message
        })
      }).catch()
      this.modalDelete = false
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitAddOrUpdate (index) {
      const infoEdit = {
        id: this.formInline.id,
        timeoutThreshold: this.formInline.timeoutThreshold,
        timeoutTimesThreshold: this.formInline.timeoutTimesThreshold,
        abnormalTimesThreshold: this.formInline.abnormalTimesThreshold
      }
      switch (this.showType) {
        case 'add':
          addServiceThreShold(this.formInline).then(res => {
            this.$Message.info({
              content: res.data.message
            })
            this.getServiceThreShold()
            this.modalCheck = false
            this.reset()
          }).catch()
          break
        case 'edit':
          editServiceThreShold(infoEdit).then(res => {
            this.$Message.success({
              content: res.data.message
            })
            this.getServiceThreShold()
            this.modalCheck = false
          }).catch()
          break
        default:
          this.$Message.error('请检查类型！')
          break
      }
    },
    getServiceThreShold (manufacturerCode, serviceTypeCode, serviceModuleCode) {
      const info = {
        currentPage: this.pageNum,
        pageSize: this.pageSize,
        manufacturerCode: manufacturerCode,
        serviceTypeCode: serviceTypeCode,
        serviceModuleCode: serviceModuleCode
      }
      console.log(info)
      getServiceThreShold(info).then(res => {
        console.log(res)
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    }
  },
  created () {
    this.getServiceThreShold()
    const info = {
      pageSize: 100000000,
      currentPage: this.pageNum
    }
    getManufacture(info).then(res => {
      this.manufacturerOption = res.data.data.records
    }).catch()
    inquireServiceModule(info).then(res => {
      this.moduleOption = res.data.data.records
    })
    getServiceTypeInfo(info).then(res => {
      this.typeOption = res.data.data.records
    })
  }
}
</script>
