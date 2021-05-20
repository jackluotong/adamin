<template>
  <div>
    <Input v-model.trim="createOpr" size="large" placeholder="操作人" />
    <Input v-model.trim="methodName" size="large" placeholder="接口名" />
    <Input v-model.trim="requestPath" size="large" placeholder="请求路径" />
    <DatePicker v-model="operatingTime" type="datetimerange" placeholder="时间选择" style="width: 300px"
      format="yyyy-MM-dd HH:mm:ss" @on-change="handleChange" :editable=false></DatePicker>
    <Button type="success" style="margin-right: 5px" @click="search()">搜索</Button>
    <Button @click="reset()">重置</Button>
    <br style="margin-top: 40px">

    <Table stripe :columns="columns" :data="logData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <Button type="info" size="small" style="margin-right: 5px" @click="checkLog(row.id)">查看</Button>
        </template>
     </Table>
     <Page @on-change="changePage" @on-page-size-change="ageSizeChange" :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
     <!-- 表单区 -->
    <Modal v-model="isDisplay" width="80%" height="40%"  :mask-closable="false" :closable="true" v-bind:title="detailTitle">
      <Form :model="logSysCom"  inline>
        <FormItem  label="操作人  ：" style="width:200px;" >
          {{logSysCom.createOpr}}
        </FormItem>
        <FormItem label="源地址IP：" style="width:200px;" >
          {{logSysCom.srcIp}}
        </FormItem>
        <FormItem label="目标服务器地址IP：" style="width:200px;" >
          {{logSysCom.targetIp}}
        </FormItem>
        <FormItem label="执行耗时：" style="width:200px;" >
          {{logSysCom.timeElapsed}} ms
        </FormItem>
        <FormItem label="操作时间：" style="width:200px;">
          {{logSysCom.dateCreate}}
        </FormItem>
        <FormItem label="响应码："  style="width:200px;" >
          {{logSysCom.resultCode}}
        </FormItem>
        <FormItem label="请求模块类型：" style="width:200px;">
          {{logSysCom.moduleType}}
        </FormItem>
        <FormItem label="设备类型：" style="width:200px;">
          {{logSysCom.deviceType}}
        </FormItem>
        <FormItem label="请求方式：" style="width:200px;">
          {{logSysCom.requestType}}
        </FormItem>
        <FormItem label="请求路径：" style="width:500px;">
          {{logSysCom.requestPath}}
        </FormItem>
        <FormItem label="请求头：" style="width:100%;">
          <Input v-model="logSysCom.requestHead" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width:100%" ></Input>
        </FormItem>
        <FormItem label="请求报文：" style="width:100%;">
          <Input v-model="logSysCom.requestPara" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  style="width:100%"></Input>
        </FormItem>
        <FormItem label="响应报文：" style="width:100%;">
          <Input v-model="logSysCom.responsePara" type="textarea" :autosize="{minRows: 2,maxRows: 20}" style="width:100%"></Input>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align: center;">
        <Button type="primary" size="large" @click="confirm()" >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { logSysComPageList, queryLogById } from '@/api/data'
export default {
  name: 'timedTask',
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据

      createOpr: '', // 操作人
      methodName: '', // 接口名
      requestPath: '', // 请求路径
      operatingTime: [],
      startDate: '',
      endDate: '',

      isDisplay: false,
      detailTitle: '行为日志详情', // 日志详情

      logSysCom: {},

      logData: [],
      editIndex: -1, // 当前聚焦的输入框的行数
      editCronExpression: '', // cron表达式
      columns: [
        {
          title: '操作人',
          key: 'createOpr',
          tooltip: true,
          align: 'center',
          width: 120
        },
        {
          title: '操作时间',
          key: 'dateCreate',
          width: 200,
          align: 'center'
        },
        {
          title: '源地址IP',
          key: 'srcIp',
          align: 'center',
          width: 150
        },
        {
          title: '耗时',
          key: 'timeElapsed',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let texts = ''
            let colors = ''

            if (params.row.timeElapsed <= 1000) {
              texts = 'ios-bulb-outline'
              colors = '#02a859'
            } else if (params.row.timeElapsed >= 1000 && params.row.timeElapsed <= 3000) {
              texts = 'md-bulb'
              colors = '#ff950e'
            } else if (params.row.timeElapsed >= 3000) {
              texts = 'md-bulb'
              colors = 'red'
            }
            return h('div', [
              h('span', {
                props: {
                  type: texts
                },
                style: {
                  color: colors,
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.timeElapsed
                }
              }, params.row.timeElapsed)
            ])
          }
        },
        {
          title: '请求接口',
          key: 'requestPath',
          align: 'left',
          width: 500
        },
        {
          title: '请求结果',
          key: 'resultCode',
          align: 'center',
          width: 120,
          render: (h, params) => {
            if (params.row.resultCode === '200 OK') {
              return h('span', {
                style: {
                  color: '#19be6b'
                }
              }, '成功')
            }
            return h('span', {
              style: {
                color: '#ed4014'
              }
            }, '失败')
          }
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
    confirm () {
      this.logSysCom = []
      this.isDisplay = false
    },
    reset () {
      this.createOpr = '' // 操作人
      this.methodName = '' // 接口名
      this.requestPath = '' // 请求路径
      this.operatingTime = []
      this.startDate = ''
      this.endDate = ''
    },
    checkLog (id) {
      queryLogById(id).then(res => {
        this.logSysCom = res.data.data
        this.isDisplay = true
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange (date) {
      this.startDate = date[0]
      this.endDate = date[1]
    },
    logSysComPageList () {
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize,
        'createOpr': this.createOpr, // 操作人
        'methodName': this.methodName, // 接口名
        'requestPath': this.requestPath, // 请求路径
        'startDate': this.startDate,
        'endDate': this.endDate
      }
      logSysComPageList(date).then(res => {
        console.log(res.data.data.resultList)
        this.logData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    search () {
      this.logSysComPageList()
    },
    changePage (date) {
      this.pageNum = date
      this.logSysComPageList()
    },
    ageSizeChange (date) {
      this.pageNum = 1
      this.pageSize = date
      this.logSysComPageList()
    }
  },
  created () {
    this.logSysComPageList()
  }
}
</script>
<style lang="less">
  .ivu-input-wrapper{
     width: 280px;
  }
  .ivu-input-large{
    width: 270px;
    white-space: nowrap;
  }
</style>
