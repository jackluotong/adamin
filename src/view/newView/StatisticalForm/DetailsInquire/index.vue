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

<template>
    <div class="user-content">
        <h1 style="margin:10px 10px 10px 10px">应用系统管理-明细查询</h1>
        <div style="display:flex">
            <span style="padding:10px">应用名称</span>
            <Input v-model.trim="applicationName"  style="width:150px; margin-right:20px;"/>
            <span style="padding:10px">应用简称</span>
            <Input v-model.trim="applicationCode" style="width:150px; margin-right:20px;" />
            <span style="padding:10px 10px 10px 10px ">厂商名称</span>
            <Select label="" v-model.trim="manufactureSelected" style="width:150px; margin-right:20px;" >
                <Option v-for="(item,id) of manufacturerOption" :key="id" :value="item.manufacturerCode">{{item.manufacturerName}}</Option>
            </Select>
             </div>
             <div style="display:flex">
            <span style="padding:10px 10px 10px 10px ">服务模块</span>
            <Select label="" v-model.trim="serviceModuleSelected" style="width:150px; margin-right:20px;" @on-change='selectedModuleClick'>
                <Option v-for="(item,id) in serviceModuleOption" :key="id" :value="item.serviceModuleCode">{{item.serviceModule}}</Option>
            </Select>
                <span style="padding:10px 10px 10px 10px ">服务类型</span>
                <Select label="" v-model.trim="serviceTypeSelected" style="width:150px;margin-right:20px">
                    <Option v-for="(item,id) in serviceTypeOption" :key="id" :value="item.serviceTypeCode">{{item.serviceType}}</Option>
                </Select>

                <span style="padding:10px 10px 10px 10px">请求时间</span>
                <Row>
                <Col span="12">
                    <Date-picker type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 150px" @on-change='selectTime' v-model="selectedDate"></Date-picker>
                </Col>
                </Row>
            </div>

        <div style="">
            <Button type="primary" icon="md-search" @click="search()" style="margin:10px">查询</Button>
                  <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
            <Button type="primary" icon="md-refresh" @click="exportExel()" style="margin:10px" :loading="exportLoading"
                v-show="permission.includes('statistic:detail:export')"
            >按条件导出</Button>

        </div>

        <Table highlight-row="highlight-row" stripe="stripe" :columns="columns" :data="confData" style="margin-top: 5px" >
            <template slot-scope="{index }" slot="action">
                <div>
                    <Button type="info" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
                </div>
            </template>
        </Table>
        <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer="show-sizer" style="text-align: center;margin-top: 5px"
         @on-change='changePage'
         @on-page-size-change='onpagesizechange'/>

    </div>
</template>

<script>
import { getInfoDetails } from '@/api/detailsInquire'
import { getManufacture } from '@/api/thirdPart'
import { inquireServiceModule, serarchTypeByModule } from '@/api/data'
export default {
  data () {
    return {
      permission: sessionStorage.getItem('permission'),
      time: [],
      selectedDate: '',
      applicationName: '',
      reqDate: '',
      applicationCode: '',
      exportLoading: false,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      manufactureSelected: '',
      serviceModuleSelected: '',
      serviceTypeSelected: '',
      showDetailModal: false,
      showDetailContent: '',
      modalCheck: false,
      manufacturerOption: [],
      serviceModuleOption: [],
      serviceTypeOption: [],
      confData: [],
      operatingTime: [],
      columns: [
        {
          type: 'index',
          width: 60,
          aligin: 'center'
        },
        {
          title: '应用名称',
          key: 'applicationName',
          width: 100,
          tooltip: true,
          align: 'center'
        },
        {
          title: '应用简称',
          key: 'applicationCode',
          width: 100,
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
          align: 'center',
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
          title: '请求参数',
          key: 'reqParam',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Tooltip', {
                props: {
                  placement: 'top',
                  transfer: true
                },
                style: {
                  display: 'inline-block',
                  width: params.column._width * 0.9 + 'px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              }, [params.row.reqParam, h('span', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }
              }, params.row.reqParam)
              ])
            ])
          }
        },
        {
          title: '请求时间',
          key: 'reqDate',
          width: 150,
          align: 'center'
        },
        {
          title: '返回参数',
          key: 'resParam',
          width: 150,
          align: 'center',
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
              }, [params.row.resParam, h('span', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }
              }, params.row.resParam)
              ])
            ])
          }
        },
        {
          title: '返回时间',
          key: 'resDate',
          width: 150,
          align: 'center'
        },
        {
          title: '请求厂商参数',
          key: 'reqManufacParam',
          width: 150,
          align: 'center',
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
              }, [params.row.reqManufacParam, h('span', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }
              }, params.row.reqManufacParam)
              ])
            ])
          }
        },
        {
          title: '请求厂商时间',
          key: 'reqManufacDate',
          width: 150,
          align: 'center'
        },
        {
          title: '厂商返回参数',
          key: 'resManufacParam',
          width: 150,
          align: 'center',
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
              }, [params.row.resManufacParam, h('span', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }
              }, params.row.resManufacParam)
              ])
            ])
          }
        },
        {
          title: '厂商返回时间',
          key: 'resManufacDate',
          width: 150,
          align: 'center'
        }
      ]
    }
  },
  methods: {
    selectedModuleClick (e) {
      serarchTypeByModule(e).then(res => {
        if (res.data.data.length !== 0) {
          this.serviceTypeOption = res.data.data
        } else {
          this.serviceTypeOption = []
          this.serviceTypeSelected = ''
        }
      }).catch()
    },
    onpagesizechange (e) {
      this.pageSize = e
      const info = {
        pageSize: e,
        currentPage: this.pageNum,
        applicationCode: this.applicationCode,
        serviceTypeCode: this.serviceTypeSelected,
        manufacturerCode: this.manufactureSelected,
        applicationName: this.applicationName,
        serviceModuleCode: this.serviceModuleSelected,
        startTime: this.time === null ? '' : this.time[0],
        endTime: this.time === null ? '' : this.time[1]
      }
      getInfoDetails(info).then(res => {
        this.confData = res.data.data.records
        this.total = res.data.data.total
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e,
        applicationCode: this.applicationCode,
        serviceTypeCode: this.serviceTypeSelected,
        manufacturerCode: this.manufactureSelected,
        applicationName: this.applicationName,
        serviceModuleCode: this.serviceModuleSelected,
        startTime: this.time === null ? '' : this.time[0],
        endTime: this.time === null ? '' : this.time[1]
      }
      getInfoDetails(info).then(res => {
        this.confData = res.data.data.records
        this.total = res.data.data.total
      })
    },
    selectTime (e) {
      this.time = e
    },
    search () {
      const info =
       {
         currentPage: 1,
         pageSize: 10,
         applicationCode: this.applicationCode,
         serviceTypeCode: this.serviceTypeSelected,
         manufacturerCode: this.manufactureSelected,
         applicationName: this.applicationName,
         serviceModuleCode: this.serviceModuleSelected,
         startTime: this.time === null ? '' : this.time[0],
         endTime: this.time === null ? '' : this.time[1]
       }
      console.log(info)
      getInfoDetails(info).then(res => {
        console.log(res)
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    handleChange (date) {
      this.startDate = date[0]
      this.endDate = date[1]
    },
    reset () {
      this.applicationCode = null
      this.serviceTypeSelected = null
      this.applicationName = null
      this.serviceModuleSelected = null
      this.manufactureSelected = null
    },
    exportExel () {
      if (this.confData.length) {
        this.exportLoading = true
        const info = {
          applicationCode: this.applicationCode,
          serviceTypeCode: this.serviceTypeSelected,
          manufacturerCode: this.manufactureSelected,
          applicationName: this.applicationName,
          serviceModuleCode: this.serviceModuleSelected,
          startTime: this.time === null ? '' : this.time[0],
          endTime: this.time === null ? '' : this.time[1]
        }
        let a = encodeURI(JSON.stringify(info))
        window.open(`https://wxcs.internal.manulife-sinochem.com/dev/giq/dadmin/requestRecord/export?requestJson=${a}`)
        this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
        this.exportLoading = false
      }
    },
    cancel () {
      this.modalCheck = false
    },
    getInfo () {
      const info = {
        currentPage: this.pageNum,
        pageSize: this.pageSize
      }
      getInfoDetails(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      }).catch(error => {
        this.$Message.error({
          content: error
        })
      })
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    }
  },
  created () {
    const info = {
      currentPage: 1,
      pageSize: 10000
    }
    this.getInfo()
    getManufacture(info).then(res => {
      this.manufacturerOption = res.data.data.records
    })
    inquireServiceModule(info).then(res => {
      this.serviceModuleOption = res.data.data.records
    })
  }
}
</script>
