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
          <h1 style="margin:10px 10px 10px 10px">第三方服务管理-第三方服务管理</h1>
    <div style="display:flex">
<span style="padding:10px 10px 10px 10px ">厂商名称</span>
<Select label="" v-model.trim="manufacturerName" style="width:150px; margin-right:20px;" clearable >
        <Option v-for="(item,id) in manufacturerOption" :key="id" :value="item.manufacturerCode">{{item.manufacturerName}}</Option>
      </Select>
      <span style="padding:10px 10px 10px 10px ">服务模块</span>
 <Select label="" v-model.trim="serviceModule" style="width:150px; margin-right:20px;"  clearable >
        <Option v-for="(item,id) in moduleOption" :key="id" :value="item.serviceModuleCode">{{item.serviceModule}}</Option>
      </Select>
<span style="padding:10px 10px 10px 0 ">服务类型</span>
      <Select label="" v-model.trim="serviceType" style="width:150px;margin-right:20px" clearable >
        <Option v-for="(item,id) of typeOption" :key="id" :value="item.serviceTypeCode">{{item.serviceType}}</Option>
      </Select>
</div>
<div style="">
      <Button type="primary" icon="md-search" @click="search()" style="margin:10px">查询</Button>
      <Button type="primary" icon="md-refresh" @click="addNew()" style="margin:10px"
        v-show="permission.includes('tripartite:service:add')"
>新增服务</Button>

</div>

    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
 <!--            <Button type="info" size="small" style="margin-right: 5px" @click="edit(index)"
            v-show="permission.includes('tripartite:service:edit')"
            :disabled='serviceStatus===0?true:false'
>编辑</Button> -->
            <Button type="error" size="small" style="margin-right: 5px" @click="deleteService(index)"
             v-show="permission.includes('tripartite:service:delete')"
>删除</Button>
          </div>
        </template>
    </Table>
    <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"
            @on-change='changePage'
            @on-page-size-change='onpagesizechange'/>
    <Modal v-model="modalCheck" width="30%" height="40%"
       v-bind:title="titleDetail"
       :mask-closable="false"
       :closable="false" >
      <Form :model="formInline"  inline>
        <FormItem  label="厂商名称" style="width:300px;" >
            <Select label="" v-model.trim="formInline.manufacturerCode" style="width:150px; margin-right:20px;" :disabled="showType==='edit'?true:false">
              <Option v-for="(item,id) in manufacturerOption" :key="id" :value="item.manufacturerCode">{{item.manufacturerName}}</Option>
            </Select>
        </FormItem><br>
        <FormItem label="服务模块" style="width:300px;" >
           <Select label="" v-model.trim="formInline.serviceModuleCode" @on-change='selectedModuleClick' style="width:150px; margin-right:20px;" :disabled="showType==='edit'?true:false">
        <Option v-for="(item,id) in moduleOption" :key="id" :value="item.serviceModuleCode">{{item.serviceModule}}</Option>
         </Select>
           </FormItem>
        <FormItem label="服务类型" style="width:300px;" >
            <Select  v-model.trim="formInline.serviceTypeCode" style="width:150px;margin-right:20px"
            not-found-text='暂无数据'
            v-if="showType==='add'?true:false">
        <Option v-for="(item,id) of typeOption" :key="id" :value="item.serviceTypeCode">{{item.serviceType}}</Option>
             </Select>
             <Input style="width:150px;margin-right:20px"  v-model.trim="formInline.serviceType" disabled v-if="showType==='edit'?true:false">
             </Input>
            </FormItem><br>
        <FormItem label="厂商接口地址" style="width:100%;" >
        <Input  v-model.trim="formInline.manufacturerUrl" style="width:auto"/>
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
import { getThirdService, getManufacture, toggle, addThirdService, deleteThirdService, editThirdService } from '@/api/thirdPart'
import { inquireServiceModule, serarchTypeByModule, getServiceTypeInfo } from '@/api/data'

export default {
  data () {
    return {
      serviceStatus: '',
      titleDetail: '',
      permission: sessionStorage.getItem('permission'),
      deleteServiceTypeCode: '',
      deleteManufacturerCode: '',
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
        manufacturerCode: '',
        serviceTypeCode: '',
        serviceModuleCode: '',
        manufacturerUrl: '',
        id: '',
        serviceType: ''
      },
      manufacturerOption: [ ],
      moduleOption: [ ],
      typeOption: [ ],
      statusOption: [
        { code: 0, value: '生效' },
        { code: 1, value: '失效' }
      ],
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
          title: '编辑',
          align: 'center',
          width: 150,
          render: (h, params) => {
            if (params.row.serviceStatus === 0) {
              return h('Button',
                {
                  on: {
                    click: () => {
                      this.modalCheck = true
                      this.formInline.id = params.row.id
                      this.formInline.manufacturerCode = params.row.manufacturerCode
                      this.formInline.serviceTypeCode = params.row.serviceTypeCode
                      this.formInline.serviceModuleCode = params.row.serviceModuleCode
                      this.formInline.manufacturerUrl = params.row.manufacturerUrl
                      this.formInline.serviceType = params.row.serviceType
                      this.showType = 'edit'
                      this.titleDetail = '编辑第三方服务'
                    }
                  }
                }
                , '编辑')
            }
          }
        },
        {
          title: '删除',
          slot: 'action',
          aligin: 'center',
          width: 60
        },
        {
          title: '服务生效/失效',
          key: 'serviceStatus',
          width: 150,
          render: (h, params) => {
            if (params.row.serviceStatus === 0) {
              return h('Button',
                {
                  on: {
                    click: () => {
                      const info = {
                        id: params.row.id,
                        serviceTypeCode: params.row.serviceTypeCode,
                        status: 1,
                        manufacturerCode: params.row.manufacturerCode
                      }
                      toggle(info).then(res => {
                        this.getThirdService()
                        this.$Message.success({
                          content: res.data.message
                        })
                      }).catch(error => {
                        console.log(error)
                      })
                    }
                  }
                }, '服务失效')
            } else if (params.row.serviceStatus === 1) {
              return h('Button', {
                on: {
                  click: () => {
                    const info = {
                      id: params.row.id,
                      serviceTypeCode: params.row.serviceTypeCode,
                      status: 0,
                      manufacturerCode: params.row.manufacturerCode

                    }
                    toggle(info).then(res => {
                      this.getThirdService()
                      this.$Message.success({
                        content: res.data.message
                      })
                    }).catch(error => {
                      console.log(error)
                    })
                  }
                }
              }, '服务生效')
            }
          }
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
        manufacturerCode: this.manufacturerName,
        serviceTypeCode: this.serviceType,
        serviceModuleCode: this.serviceModule
      }
      getThirdService(info).then(res => {
        this.confData = res.data.data.records
        this.total = res.data.data.total
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
      getThirdService(info).then(res => {
        this.confData = res.data.data.records
        this.total = res.data.data.total
      })
    },
    search () {
      this.getThirdService(this.manufacturerName, this.serviceType, this.serviceModule)
    },
    reset () {
    },
    edit (index) {
      console.log(this.confData[index])
      this.serviceStatus = this.confData[index].serviceStatus
      this.formInline.id = this.confData[index].id
      this.formInline.manufacturerCode = this.confData[index].manufacturerCode
      this.formInline.serviceTypeCode = this.confData[index].serviceTypeCode
      this.formInline.serviceModuleCode = this.confData[index].serviceModuleCode
      this.formInline.manufacturerUrl = this.confData[index].manufacturerUrl
      this.formInline.serviceType = this.confData[index].serviceType
      this.modalCheck = true
      this.showType = 'edit'
      this.titleDetail = '编辑第三方服务'
    },
    addNew () {
      for (let key in this.formInline) {
        this.formInline[key] = ''
      }
      this.modalCheck = true
      this.showType = 'add'
      this.titleDetail = '新增第三方服务'
    },
    cancel () {
      this.modalCheck = false
    },
    deleteService (index) {
      this.deleteId = this.confData[index].id
      this.deleteServiceTypeCode = this.confData[index].serviceTypeCode
      this.deleteManufacturerCode = this.confData[index].manufacturerCode
      this.modalDelete = true
      console.log(this.confData[index])
    },
    handleSubmitDelete () {
      const info = {
        id: this.deleteId,
        serviceTypeCode: this.deleteServiceTypeCode,
        manufacturerCode: this.deleteManufacturerCode
      }
      deleteThirdService(info).then(res => {
        this.$Message.success({
          content: res.data.message
        })
        this.getThirdService()
      }).catch(error => {
        console.log(error)
      })
      this.modalDelete = false
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitAddOrUpdate (index) {
      switch (this.showType) {
        case 'add':
          addThirdService(this.formInline).then(res => {
            this.getThirdService()
            this.$Message.success({
              content: res.data.message
            })
            this.getThirdService()
            this.modalCheck = false
          }).catch(error => {
            console.log(error)
          })

          break
        case 'edit':
          console.log(this.formInline)
          editThirdService(this.formInline).then(res => {
            this.$Message.success({
              content: res.data.message
            })
            this.getThirdService()
            this.modalCheck = false
          }).catch((error) => {
            console.log(error)
          })
          break
        default:
          this.$Message.error('请检查类型！')
          break
      }
    },
    getThirdService (manufacturerCode, serviceTypeCode, serviceModuleCode) {
      const info = {
        manufacturerCode: manufacturerCode,
        serviceTypeCode: serviceTypeCode,
        serviceModuleCode: serviceModuleCode,
        currentPage: this.pageNum,
        pageSize: this.pageSize
      }
      getThirdService(info).then(res => {
        console.log(res)
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    selectedModuleClick (e) {
      serarchTypeByModule(e).then(res => {
        console.log(res)
        if (res.data.data.length !== 0) {
          this.typeOption = res.data.data
        } else {
          this.typeOption = []
          this.formInline.serviceTypeCode = ''
        }
      }).catch(err => console.log(err))
    }

  },
  created () {
    const info = {
      pageSize: 2 * 56,
      currentPage: 1
    }
    this.getThirdService()
    getManufacture(info).then(res => {
      this.manufacturerOption = res.data.data.records
    })
    inquireServiceModule(info).then(res => {
      this.moduleOption = res.data.data.records
    })
    getServiceTypeInfo(info).then(res => {
      this.typeOption = res.data.data.records
    })
  }
}
</script>
