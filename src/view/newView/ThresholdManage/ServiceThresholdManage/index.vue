<template>
    <div class="user-content">
        <h1 style="margin:10px 10px 10px 10px">阈值管理-服务阈值管理</h1>
        <div class="content-button">
            <span style="padding:10px 10px 10px 10px ">厂商名称</span>
            <Select label="" v-model.trim="manufacturerName" style="width:150px; margin-right:20px;">
                <Option v-for="item of manufacturerEnum" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
            <span style="padding:10px 10px 10px 10px ">服务模块</span>
            <Select label="" v-model.trim="serviceModule" style="width:150px; margin-right:20px;">
                <Option v-for="item of serviceModuleEnum" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
            <div style="padding:10px 10px 10px 10px ">
                <span style="padding:10px 10px 10px 0 ">服务类型</span>
                <Select label="" v-model.trim="serviceType" style="width:150px;margin-right:20px">
                    <Option v-for="item of serviceTypeEnum" :key="item.value" :value="item.value">{{item.label}}</Option>
                </Select>
                <span style="padding:10px 10px 10px 10px ">服务状态</span>
                <Select label="" v-model.trim="serviceStatus" style="width:150px; margin-right:20px;">
                    <Option v-for="item of serviceStatusEnum" :key="item.value" :value="item.value">{{item.label}}</Option>
                </Select>
            </div>
        </div>
        <div style="">
            <Button type="primary" icon="md-search" @click="search()" style="margin:10px">查询</Button>
                  <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
            <Button type="primary" icon="md-refresh" @click="addNew()" style="margin:10px">新增服务</Button>

        </div>

        <Table highlight-row="highlight-row" stripe="stripe" :columns="columns" :data="logEmailMessageData" style="margin-top: 5px">
            <template slot-scope="{ row, index }" slot="action">
                <div>
                    <Button type="info" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
                </div>
            </template>
        </Table>
        <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer="show-sizer" style="text-align: center;margin-top: 5px"/>
        <Modal v-model="modalCheck" width="30%" height="40%" :mask-closable="false" :closable="true" title="详情">
            <Form :model="formInline" inline="inline">
                <FormItem label="厂商名称" style="width:300px;">
                     <Select label="" v-model.trim="manufacturerName" style="width:150px; margin-right:20px;">
                <Option v-for="item of manufacturerEnum" :key="item.value" :value="item.value">{{manufacturerName}}</Option>
            </Select>
                </FormItem>
                <br>
                    <FormItem label="服务模块" style="width:300px;">
                        <Select label="" v-model.trim="formInline" style="width:150px; margin-right:20px;">
                            <Option >{{formInline.serviceModule}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="服务类型" style="width:300px;">
                        <Select label="" v-model.trim="formInline" style="width:150px; margin-right:20px;">
                            <Option >{{formInline.serviceType}}</Option>
                        </Select>
                    </FormItem>
                    <br>
                        <FormItem label="服务状态" style="width:300px;">
                            <Select label="" v-model.trim="formInline" style="width:150px; margin-right:20px;">
                                <Option>{{serviceStatus}}</Option>
                            </Select>
                        </FormItem>
                        <br>
                            <FormItem label="超时阈值" style="width:100%;">
                                <Input v-model.trim="formInline.outThreshold" style="width:auto"/>
                            </FormItem>
                            <FormItem label="超时次数阈值（每小时）" style="width:100%;">
                                <Input v-model.trim="formInline.outCountThreshold" style="width:auto"/>
                            </FormItem>
                            <FormItem label="异常次数阈值（每小时）" style="width:100%;">
                                <Input v-model.trim="formInline.abnormalCountThreshold" style="width:auto"/>
                            </FormItem>
                            <br></Form>
                            <div slot="footer">
                                <Button type="primary" ghost="ghost" size="large" @click="cancel('formInline')">返回</Button>
                                <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
                            </div>
                        </Modal>
                    </div>
                </template>

<script>
import { logEmailMessagePageList } from '@/api/data'
import { getServiceThreShold, addServiceThreShold, editServiceThreShold, deleteServiceThreShold } from '@/api/thresholdManage'

export default {
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      manufacturerName: '',
      serviceModule: '',
      serviceType: ' ',
      serviceStatus: '',
      manufacturerAddress: '',
      outThreshold: '',
      outCountThreshold: '',
      abnormalCountThreshold: '',
      showDetailModal: false,
      showDetailContent: '',
      modalCheck: false,
      formInline: {
        manufacturerName: '',
        serviceModule: '',
        serviceType: '',
        serviceStatus: '',
        manufacturerAddress: '',
        outThreshold: '',
        outCountThreshold: '',
        abnormalCountThreshold: ''
      },
      manufacturerEnum: [
        {
          'value': '1',
          'label': '交通'
        }, {
          'value': '2',
          'label': '中化'
        }
      ],
      serviceModuleEnum: [
        {
          'value': '1',
          'label': 'OCR'
        }, {
          'value': '2',
          'label': '人脸识别'
        }
      ],
      serviceTypeEnum: [
        {
          'value': '1',
          'label': '身份证识别'
        }, {
          'value': '2',
          'label': '户口本识别'
        }
      ],
      serviceStatusEnum: [
        {
          'value': '1',
          'label': '生效'
        }, {
          'value': '2',
          'label': '失效'
        }
      ],
      logEmailMessageData: [
        {
          manufacturerName: 'jackl',
          serviceModule: 'jakcls',
          serviceType: 'orc',
          serviceStatus: 'ok',
          serviceAddress: 'www.baidu.com',
          manufacturerAddress: 'www.ok.com'
        }, {
          manufacturerName: 'jackl',
          serviceModule: 'jakcls1',
          serviceType: 'orc1',
          serviceStatus: 'no',
          serviceAddress: 'www.okoko.com',
          manufacturerAddress: 'www.ok1.com'
        }
      ], // 邮件日志数据
      operatingTime: [],
      columns: [
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
          align: 'center'
        }, {
          title: '统一对外服务地址',
          key: 'serviceAddress',
          width: 150,
          align: 'center'
        }, {
          title: '厂商接口地址',
          key: 'manufacturerAddress',
          width: 150,
          align: 'center'
        }, {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    search () { // 点击查询按钮
      const date = {
        'receiveEmail': this.receiveEmail,
        'emailType': this.emailType,
        'status': this.status,
        'pageNum': this.pageNum,
        'startDate': this.startDate,
        'endDate': this.endDate,
        'pageSize': this.pageSize
      }
      logEmailMessagePageList(date).then(res => {
        // this.$Message['success']({
        // background: true,
        // content: res.data.data
        // })
        this.logEmailMessageData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange (date) {
      this.startDate = date[0]
      this.endDate = date[1]
    },
    reset () {
      this.logEmailMessagePageList()
    },
    edit (index) {
      this.manufacturerName = this.logEmailMessageData[index].manufacturerName
      console.log(this.logEmailMessageData[index].manufacturerName, ' this.manufacturerName')
      this.formInline.serviceStatus = this.logEmailMessageData[index].serviceStatus
      this.formInline.manufacturerAddress = this.logEmailMessageData[index].manufacturerAddress
      //   this.formInline.manufacturerName = this.logEmailMessageData[index].manufacturerName
      this.formInline.serviceModule = this.logEmailMessageData[index].serviceModule
      this.formInline.serviceType = this.logEmailMessageData[index].serviceType

      this.modalCheck = true
    },
    addNew () {
      this.formInline.manufacturerAddress = ''
      this.modalCheck = true
    },
    cancel () {
      this.modalCheck = false
    },

    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    getServiceThreShold () {
      const info = {
        applicationCode: ''
      }
      getServiceThreShold(info).then(res => {
        console.log(res)
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    }
  },
  created () {
    this.getServiceThreShold()
    addServiceThreShold()
    editServiceThreShold()
    deleteServiceThreShold()
  }
}
</script>
<style lang="less" scoped="scoped">
                    .user-content {
                        .content-button {
                            padding: 5px;
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
                </style>
