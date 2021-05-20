<template>
  <div class="user-content">
    <div class="content-button">
      操作人：
      <Input v-model.trim="createOpr" style="width:150px; marginRight:20px;" placeholder="操作人" />
      接口名：
      <Input v-model.trim="methodName" style="width:150px; marginRight:20px;" placeholder="接口名" />
      请求路径：
      <Input v-model.trim="requestPath" style="width:150px; marginRight:20px;" placeholder="请求路径" />
      时间选择：
      <DatePicker v-model="operatingTime" type="datetimerange" placeholder="时间选择" style="width: 300px"
        format="yyyy-MM-dd HH:mm:ss" @on-change="handleChange" :editable=false></DatePicker>
      <Button type="primary" icon="md-search" @click="search()">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="exceptionlogData" style="margin-top: 5px">
      <template slot-scope="{ row, index }" slot="action">
          <Button type="info" size="small" style="margin-right: 5px" @click="checkLog(index)">查看</Button>
          <Button type="success" size="small" style="margin-right: 5px" @click="handleSubmit(index)" :disabled="row.isProcessed === '1'">确认处理</Button>
      </template>
    </Table>
    <Page @on-change="changePage" @on-page-size-change="ageSizeChange" :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
    <!-- 表单区 -->
    <Modal v-model="isDisplay" width="60%" height="40%"  :mask-closable="false" :closable="true" v-bind:title="detailTitle" footer-hide>
      <Form :model="formInline"  inline>
        <FormItem  label="操作人：" style="width:200px;" >
          {{formInline.createOpr}}
        </FormItem>
        <FormItem label="操作时间：" style="width:250px;">
          {{formInline.dateCreate}}
        </FormItem>
        <FormItem label="源地址IP：" style="width:200px;" >
          {{formInline.srcIp}}
        </FormItem>
        <FormItem label="目标服务器地址IP：" style="width:300px;" >
          {{formInline.targetIp}}
        </FormItem>
          <FormItem label="模块类型：" style="width:200px;" >
          {{formInline.moduleType}}
          </FormItem>
        <FormItem label="请求类型："  style="width:200px;" >
          {{formInline.requestType}}
        </FormItem><br>
        <FormItem label="错误类型：" style="width:100%;">
          {{formInline.errorType}}
        </FormItem>
        <FormItem label="请求路径：" style="width:100%;">
          {{formInline.requestPath}}
        </FormItem>
        <FormItem label="发生异常class：" style="width:100%;">
          {{formInline.errorJavaClass}}
        </FormItem>
        <FormItem label="异常方法：" style="width:100%;">
          {{formInline.methodName}}
        </FormItem>
        <FormItem label="请求头：" style="width:100%;">
          <Input v-model="formInline.requestHead" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width:100%" />
        </FormItem>
        <FormItem label="请求入参：" style="width:100%;">
          <Input v-model="formInline.requestPara" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  style="width:100%"/>
        </FormItem>
        <FormItem label="异常详细堆栈信息：" style="width:100%;">
          <Input v-model="formInline.errorStack" type="textarea" :autosize="{minRows: 2,maxRows: 20}" style="width:100%" />
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model.trim="modalDelete" width="450" title="异常日志处理提示">
      <div >
        <p>确定已经处理该异常日志吗？</p>
      </div>
      <div slot="footer">
          <Button type="text" @click="cancelSubmit" size="large">取消</Button>
          <Button type="primary" @click="handleSubmitOK" size="large" >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { logExceptionPageList, logException } from '@/api/data'
export default {
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      createOpr: '', // 操作人
      methodName: '', // 接口名
      requestPath: '', // 请求路径
      operatingTime: [], // 时间选择
      startDate: '', // 开始时间
      endDate: '', // 结束时间
      isDisplay: false, // 是否展示表单
      detailTitle: '异常日志详情', // 日志详情
      modalDelete: false, // 异常处理提示
      formInline: { // 实体
        createOpr: '', // 操作人
        dateCreate: '', // 操作时间
        srcIp: '', // 源地址IP
        targetIp: '', // 目标服务器地址IP
        moduleType: '', // 模块类型
        requestType: '', // 请求类型
        errorType: '', // 错误类型
        requestPath: '', // 请求路径
        errorJavaClass: '', // 发生异常class
        methodName: '', // 异常方法
        requestHead: '', // 请求头
        requestPara: '', // 请求入参
        errorStack: '' // 异常详细堆栈信息
      },
      exceptionlogData: [], // 异常日志数据
      columns: [
        {
          title: '操作人',
          key: 'createOpr',
          tooltip: true,
          align: 'center',
          width: 150
        },
        {
          title: '操作时间',
          key: 'dateCreate',
          width: 160,
          align: 'center'
        },
        {
          title: '源地址IP',
          key: 'srcIp',
          align: 'center',
          width: 100
        },
        {
          title: '请求类型',
          key: 'requestType',
          align: 'center',
          width: 100
        },
        {
          title: '模块类型',
          key: 'moduleType',
          align: 'center',
          width: 100
        },
        {
          title: '请求全路径',
          key: 'requestPath',
          tooltip: true,
          align: 'center',
          width: 350
        },
        {
          title: '发生异常class',
          key: 'errorJavaClass',
          tooltip: true,
          align: 'center',
          width: 200
        },
        {
          title: '发生异常method',
          key: 'methodName',
          tooltip: true,
          align: 'center',
          width: 140
        },
        {
          title: '处理状态',
          key: 'isProcessed',
          align: 'center',
          width: 100,
          render (h, params) {
            const colorObj = {
              '1': '#19be6b',
              '0': '#ed4014'
            }
            const textObj = {
              '1': '已处理',
              '0': '未处理'
            }
            const color = colorObj[params.row.isProcessed]
            const text = textObj[params.row.isProcessed]
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  'background-color': color,
                  marginRight: '5px'
                }
              }, ''),
              h('span', {
                style: {
                  color: color
                }
              }, text)
            ])
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
    reset () { // 点击重置按钮
      this.createOpr = ''
      this.methodName = ''
      this.requestPath = ''
      this.operatingTime = []
      this.startDate = ''
      this.endDate = ''
      this.logExceptionPageList()
    },
    checkLog (index) { // 点击查看异常日志数据表单
      this.formInline.id = this.exceptionlogData[index].id
      this.formInline.createOpr = this.exceptionlogData[index].createOpr
      this.formInline.srcIp = this.exceptionlogData[index].srcIp
      this.formInline.targetIp = this.exceptionlogData[index].targetIp
      this.formInline.moduleType = this.exceptionlogData[index].moduleType
      this.formInline.dateCreate = this.exceptionlogData[index].dateCreate
      this.formInline.requestType = this.exceptionlogData[index].requestType
      this.formInline.errorType = this.exceptionlogData[index].errorType
      this.formInline.errorJavaClass = this.exceptionlogData[index].errorJavaClass
      this.formInline.methodName = this.exceptionlogData[index].methodName
      this.formInline.requestPath = this.exceptionlogData[index].requestPath
      this.formInline.requestHead = this.exceptionlogData[index].requestHead
      this.formInline.requestPara = this.exceptionlogData[index].requestPara
      this.formInline.errorStack = this.exceptionlogData[index].errorStack
      this.isDisplay = true
    },
    handleChange (date) {
      this.startDate = date[0]
      this.endDate = date[1]
    },
    logExceptionPageList () { // 按条件按分页查询全部异常日志数据
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize,
        'createOpr': this.createOpr,
        'methodName': this.methodName,
        'requestPath': this.requestPath,
        'startDate': this.startDate,
        'endDate': this.endDate
      }
      logExceptionPageList(date).then(res => {
        this.exceptionlogData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    handleSubmit (index) { // 点击确认处理按钮
      this.modalDelete = true
      this.formInline.id = this.exceptionlogData[index].id
    },
    cancelSubmit () { // 点击取消确认处理
      this.modalDelete = false
    },
    handleSubmitOK () { // 点击提交确认处理
      this.formInline.isProcessed = '1'
      const date = {
        'id': this.formInline.id,
        'isProcessed': this.formInline.isProcessed
      }
      logException(date).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.code = res.data.code
        console.log(this.code)
        this.modalDelete = false
        if (this.code === '000') { // 控制请求顺序
          this.logExceptionPageList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    search () {
      this.logExceptionPageList()
    },
    changePage (date) {
      this.pageNum = date
      this.logExceptionPageList()
    },
    ageSizeChange (date) {
      this.pageNum = 1
      this.pageSize = date
      this.logExceptionPageList()
    }
  },
  created () {
    this.logExceptionPageList()
  }
}
</script>
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
