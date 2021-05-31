<template>
    <div class="user-content">
        <div class="content-button">
            <span style="padding:10px">应用名称</span>
            <Input v-model.trim="useName" />
            <span style="padding:10px">应用简称</span>
            <Input v-model.trim="useCalled" />
            <span style="padding:10px 10px 10px 10px ">厂商名称</span>
            <Select label="" v-model.trim="manufacturerName" style="width:150px; margin-right:20px;" >
                <Option v-for="item of manufacturerEnum" :key="item.value" :value="item.code">{{item.label}}</Option>
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
                <span style="padding:10px">请求时间</span>
                 <Input v-model.trim="requestTime" />
            </div>
        </div>
        <div style="">
            <Button type="primary" icon="md-search" @click="search()" style="margin:10px">查询</Button>
                  <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
            <Button type="primary" icon="md-refresh" @click="exportExel()" style="margin:10px" :loading="exportLoading">按条件导出</Button>

        </div>

        <Table highlight-row="highlight-row" stripe="stripe" :columns="columns" :data="logEmailMessageData" style="margin-top: 5px" >
            <template slot-scope="{ row, index }" slot="action">
                <div>
                    <Button type="info" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
                </div>
            </template>
        </Table>
        <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer="show-sizer" style="text-align: center;margin-top: 5px"/>

    </div>
</template>

<script>
import { logEmailMessagePageList } from '@/api/data'
import excel from '@/libs/excel'
export default {
  data () {
    return {
      useName: '',
      requestTime: '',
      useCalled: '',
      exportLoading: false,
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
          'label': '交通',
          'code': 'transport'
        }, {
          'value': '2',
          'label': '中化',
          'code': 'china'
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
          title: '应用名称',
          key: 'useName',
          width: 100,
          tooltip: true,
          align: 'center'
        },
        {
          title: '应用简称',
          key: 'useCalled',
          width: 100,
          align: 'center'
        },
        {
          title: '服务模块',
          key: 'confName',

          align: 'center'
        },
        {
          title: '厂商名称',
          key: 'manufacturerName',
          width: 100,
          tooltip: true,
          align: 'center'
        },
        {
          title: '服务模块',
          key: 'serviceModule',
          width: 100,
          align: 'center'
        },
        {
          title: '服务类型',
          key: 'serviceType',
          width: 100,
          align: 'center'
        },
        {
          title: '请求参数',
          key: 'requestParams',
          width: 200,
          align: 'center'
        },
        {
          title: '请求时间',
          key: 'requestTime',
          width: 150,
          align: 'center'
        },
        {
          title: '返回参数',
          key: 'returnParams',
          width: 150,
          align: 'center'
        },
        {
          title: '返回时间',
          key: 'returnTime',
          width: 150,
          align: 'center'
        },
        {
          title: '请求厂商参数',
          key: 'requestManufacturerParams',
          width: 150,
          align: 'center'
        },
        {
          title: '请求厂商时间',
          key: 'requestManufacturerTime',
          width: 150,
          align: 'center'
        },
        {
          title: '厂商返回参数',
          key: 'returnManufacturerParams',
          width: 150,
          align: 'center'
        },
        {
          title: '厂商返回时间',
          key: 'returnManufacturerTime',
          width: 150,
          align: 'center'
        }
      ]
    }
  },
  methods: {
    search () {
      console.log(this.manufacturerName, this.formInline.manufacturerName)
      const date = {
        'manufacturerName': this.manufacturerName,
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
    exportExel () {
      const titleArr = []
      const keyArr = []
      if (this.columns.length) {
        for (let i = 0; i < this.columns.length; i++) {
          titleArr.push(this.columns[i].title)
          keyArr.push(this.columns[i].key)
        }
      } else {
        this.$Message('表格为空')
      }
      let newArr = this.columns.map((item, index) => { return Object.assign({}, { '': item.title }) })
      console.log(newArr, titleArr)
      if (this.logEmailMessageData.length) {
        this.exportLoading = true
        const params = {
          title: titleArr,
          key: keyArr,
          data: this.logEmailMessageData,
          autoWidth: true,
          filename: '分类列表'
        }
        excel.export_array_to_excel(params)
        this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    },
    cancel () {
      this.modalCheck = false
    },
    logEmailMessagePageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      logEmailMessagePageList(date).then(res => {
        this.logEmailMessageData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.logEmailMessagePageList()
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
