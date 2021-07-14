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
        <h1 style="margin:10px 10px 10px 10px">阈值管理-应用阈值管理</h1>
        <div style="display:flex">
            <span style="padding:10px 10px 10px 10px">应用名称</span>
            <Input v-model.trim="applicationName" style="width:150px; margin-right:20px;"/>
            <span style="padding:10px 10px 10px 10px">应用简称</span>
            <Input v-model.trim="applicationCode" style="width:150px; margin-right:20px;"/>
        </div>
        <Button
                type="primary"
                icon="md-search"
                @click="search()"
                style="margin:10px"
                >查询</Button
            >
         <Button type="primary" icon="md-add" @click="addSetting()"
                v-show="permission.includes('threshold:application:add')"
                >新增阈值</Button
            >
             <Button
                type="primary"
                icon="md-search"
                @click="reset()"
                style="margin:10px"
                >重置</Button
            >
        <Table
            highlight-row
            stripe
            :columns="columns"
            :data="confData"
            style="margin-top: 5px"
        >
            <template slot-scope="{ index }" slot="action">
                <div>
                    <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="edit(index)"
                                        v-show="permission.includes('threshold:application:edit')"

                        >编辑</Button
                    >
                    <Button
                        type="error"
                        size="small"
                        style="margin-right: 5px"
                        @click="deleteThreshold(index)"
                                        v-show="permission.includes('threshold:application:delete')"

                        >删除</Button
                    >
                </div>
            </template>
        </Table>
        <Page
            :current="current"
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
    <Form ref="formInline" :model="formInline">
         <FormItem label="应用名称" style="width:300px;" >
            <Select label="" v-model.trim="formInline.applicationCode" style="width:150px;margin-right:20px" clearable filterable
            @on-change='searchType'
            :disabled="showType==='edit'?true:false"
            >
                   <Option v-for="(item,index) of appOption" :key="index" :value="item.applicationCode">{{item.applicationName}}</Option>
            </Select>
        </FormItem><br>
         <FormItem label="应用简称" style="width:300px;" >
            <Select label="" v-model.trim="formInline.applicationCode" style="width:150px;margin-right:20px" clearable filterable
                        :disabled="showType==='edit'?true:false">
                   <Option v-for="(item,index) of appOption" :key="index" :value="item.applicationCode">{{item.applicationCode}}</Option>
            </Select>
        </FormItem><br>
 <FormItem label="服务类型" style="width:300px;" >
     <Input style="width:150px;margin-right:20px"   v-show="showType==='edit'?true:false" v-model.trim="formInline.serviceType"
     disabled/>
            <Select label="" v-model.trim="formInline.serviceTypeCode" style="width:150px;margin-right:20px"
             clearable filterable
                v-show="showType==='add'?true:false">
                   <Option v-for="(item,id) of typeOption" :key="id" :value="item.serviceTypeCode">{{item.serviceType}}</Option>
            </Select>
        </FormItem><br>
                <FormItem
                    label="次数阈值（每分钟）"
                    prop="timesThreshold"
                    style="width:300px;"
                >
                     <Input v-model.number="formInline.timesThreshold" style="width:150px;margin-right:20px"/>
                </FormItem>
                 <FormItem
                    label="次数阈值（每小时）"
                    prop="hoursThreshold"
                    style="width:300px;"
                >
                <Input v-model.number="formInline.hoursThreshold" style="width:150px;margin-right:20px"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button
                    type="primary"
                    ghost
                    size="large"
                    @click="cancelAddOrUpdateType('formInline')"
                    >返回</Button
                >
                <Button
                    type="primary"
                    size="large"
                    @click="handleSubmitAddOrUpdate('formInline')"
                    >保存</Button
                >
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
         <Modal v-model.trim="modalFusing" width="450" title="阈值熔断提示">
            <div>
                <p>确定熔断该配置吗？</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelFusing" size="large">取消</Button>
                <Button type="primary" @click="handleSubmitFusng" size="large">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getAllApp, getUseThreShold, editUseThreShold, addUseThreShold, deleteUseThreShold, searchByApp, cancelUseThreShold } from '@/api/thresholdManage'

export default {
  data () {
    return {
      current: 1,
      fusingId: '',
      permission: sessionStorage.getItem('permission'),
      applicationCodeSelected: [],
      appOption: [],
      modalFusing: false,
      typeOption: [],
      editId: '',
      modelThreshld: '',
      threlodList: [
        {
          value: 1,
          label: '应用通用阈值'
        },
        {
          value: 2,
          label: '应用定制阈值'
        }
      ],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      applicationName: '',
      applicationCode: '',
      timesThreshold: '',
      thresholdType: '',
      modalEdit: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        applicationName: '',
        applicationCode: '',
        hoursThreshold: '',
        timesThreshold: '',
        id: '',
        serviceTypeCode: '',
        serviceType: ''
      },
      confData: [],
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
          align: 'center',
          width: 300
        },
        {
          title: '应用简称',
          key: 'applicationCode',
          align: 'center',
          width: 300
        },
        {
          title: '服务类型',
          key: 'serviceType',
          align: 'center',
          width: 300,
          render: (h, params) => {
            return h('div', [
              h('Tooltip', {
                props: {
                  placement: 'top',
                  transfer: true
                },
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  borderColor: '1px',
                  borderWidth: 'red'
                }
              }, [params.row.serviceType, h('span', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }
              }, params.row.serviceType)
              ])
            ])
          }
        },
        {
          title: '次数阈值（每分钟）',
          key: 'timesThreshold',
          align: 'center',
          width: 300
        },
        {
          title: '次数阈值（每小时）',
          key: 'hoursThreshold',
          align: 'center',
          width: 300
        },
        {
          title: '阈值类型',
          key: 'thresholdType',
          align: 'center',
          width: 300
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 300
        },
        {
          title: '熔断',
          key: 'serviceStatus',
          width: 300,
          render: (h, params) => {
            if (this.permission.includes('threshold:application:cut')) {
              if (params.row.fused === 1) {
                return h('Button', {
                  on: {
                    click: () => {
                      this.modalFusing = true
                      this.fusingId = params.row.id
                    }
                  }
                }, '手动撤销熔断')
              }
            }
          }
        }
      ]
    }
  },
  methods: {
    searchType () {
      searchByApp(this.formInline.applicationCode).then(res => {
        if (res.data.data.length !== 0) {
          this.typeOption = res.data.data
        } else {
          this.formInline.serviceTypeCode = ''
          this.typeOption = []
        }
      })
    },
    onpagesizechange (e) {
      this.pageSize = e
      const info = {
        pageSize: e,
        currentPage: this.pageNum,
        applicationName: this.applicationName,
        applicationCode: this.applicationCode
      }
      getUseThreShold(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e,
        applicationName: this.applicationName,
        applicationCode: this.applicationCode
      }
      console.log(info)
      getUseThreShold(info).then(res => {
        console.log(res)
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    deleteThreshold (index) {
      this.modalDelete = true
      this.editId = this.confData[index].id
    },
    search () {
      this.current = 1
      this.getUseThreShold(this.applicationCode, this.applicationName)
    },
    reset (obj) {
      this.applicationName = null
      this.applicationCode = null
      for (let key in obj) {
        obj[key] = ''
      }
    },
    addSetting () {
      this.reset(this.formInline)

      this.showType = 'add'
      this.detailTitle = '新增阈值'
      this.modalEdit = true
    },
    handleSubmitAddOrUpdate (index) {
      this.$refs[index].validate(valid => {
        if (valid) {
          if (this.showType === 'add') {
            addUseThreShold(this.formInline)
              .then(res => {
                console.log(res)
                this.$Message['success']({
                  background: true,
                  content: res.data.message
                })
                this.modalEdit = false
                this.getUseThreShold()
                this.$refs[index].resetFields()
              })
              .catch(err => {
                console.log(err)
              })
          } else if (this.showType === 'edit') {
            const info = {
              applicationCode: this.formInline.applicationCode,
              timesThreshold: parseInt(this.formInline.timesThreshold),
              hoursThreshold: parseInt(this.formInline.hoursThreshold),
              serviceTypeCode: this.formInline.serviceTypeCode,
              id: this.editId
            }
            editUseThreShold(info)
              .then(res => {
                this.$Message['success']({
                  background: true,
                  content: res.data.message
                })
                this.$refs['formInline'].resetFields()
                this.modalEdit = false
                this.getUseThreShold()
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
      console.log(this.confData[index])
      this.formInline.serviceTypeCode = this.confData[index].serviceTypeCode
      this.editId = this.confData[index].id
      this.formInline.id = this.confData[index].id
      this.formInline.applicationName = this.confData[index].applicationName
      this.formInline.applicationCode = this.confData[index].applicationCode
      this.formInline.hoursThreshold = this.confData[index].hoursThreshold
      this.formInline.timesThreshold = this.confData[index].timesThreshold
      this.formInline.serviceType = this.confData[index].serviceType
      this.showType = 'edit'
      this.detailTitle = '编辑阈值'
      this.modalEdit = true
    },
    handleSubmitFusng () {
      cancelUseThreShold(this.fusingId).then(res => {
        this.$Message.info({
          content: res.data.message
        })
        this.getUseThreShold()
        this.modalFusing = false
      }).catch(err => {
        console.log(err)
      })
    },
    cancelFusing () {
      this.modalFusing = false
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      deleteUseThreShold(this.editId)
        .then(res => {
          this.$Message['success']({
            background: true,
            content: res.data.message
          })
          this.modalDelete = false
          this.getUseThreShold()
        })
        .catch(err => {
          console.log(err)
        })
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    getUseThreShold (code, name) {
      const info = {
        applicationName: name,
        applicationCode: code,
        pageSize: this.pageSize,
        currentPage: this.pageNum
      }
      getUseThreShold(info).then(res => {
        console.log(res)
        this.current = 1
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    }
  },
  created () {
    this.getUseThreShold()
    /*     const info = {
      pageSize: 1000000,
      currentPage: 1
    } */
    getAllApp().then(res => {
      this.appOption = res.data.data
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>
