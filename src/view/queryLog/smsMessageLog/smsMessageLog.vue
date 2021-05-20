<template>
  <div class="user-content">
    <div class="content-button">
      接收人手机号码：
      <Input v-model.trim="receivePhone" style="width:150px; marginRight:20px;" placeholder="接收人手机号码"/>
      短信内容：
      <Input v-model.trim="messageContent" style="width:150px; marginRight:20px;" placeholder="短信内容"/>
      发送状态：
      <Select label="" v-model.trim="status" style="width:150px; marginRight:20px;">
        <Option v-for="item of statusEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
      </Select>
      时间选择：
      <DatePicker v-model="operatingTime" type="datetimerange" placeholder="时间选择" style="width: 300px"
        format="yyyy-MM-dd HH:mm:ss" @on-change="handleChange" :editable=false></DatePicker>
      <Button type="primary" icon="md-search" @click="search()">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="logSmsMessageData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="info" size="small" style="margin-right: 5px" @click="checkLog(index)">查看</Button>
          </div>
        </template>
    </Table>
    <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
    <Modal v-model="showDetailModal" title="短信内容详情" footer-hide>
      <p>{{showDetailContent}}</p>
    </Modal>
    <Modal v-model="modalCheck" width="30%" height="40%"  :mask-closable="false" :closable="true" title="短信日志详情" footer-hide>
      <Form :model="formInline"  inline>
        <FormItem  label="日志id：" style="width:300px;" >
          {{formInline.id}}
        </FormItem><br>
        <FormItem label="接收人手机号码：" style="width:300px;" >
          {{formInline.receivePhone}}
        </FormItem><br>
        <FormItem label="短信内容：" style="width:100%;" >
          {{formInline.messageContent}}
        </FormItem><br>
        <FormItem label="发送状态：" style="width:200px;" >
          {{formInline.showStatus}}
        </FormItem><br>
        <FormItem label="状态信息："  style="width:100%;" >
          {{formInline.statusMessage}}
        </FormItem><br>
        <FormItem label="发送时间：" style="width:200px;">
          {{formInline.dateCreate}}
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { logSmsMessagePageList } from '@/api/data'
export default {
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      receivePhone: '', // 接收人手机号
      messageContent: '', // 短信内容
      status: '', // 短信发送状态
      startDate: '',
      endDate: '',
      showDetailModal: false, // 是否显示短信详情弹窗
      showDetailContent: '',
      modalCheck: false, // 是否显示短信日志详情弹窗
      formInline: { // 实体
        receivePhone: '', // 接收人手机号
        messageContent: '', // 短信内容
        status: '', // 短信发送状态
        showStatus: '', // 短信发送状态展示
        statusMessage: '', // 状态信息
        dateCreate: '' // 发送时间
      },
      statusEnumList: [ // 发送状态类型枚举
        {
          'value': '1',
          'label': '发送成功'
        },
        {
          'value': '2',
          'label': '发送失败'
        }
      ],
      logSmsMessageData: [], // 短信日志数据
      operatingTime: [],
      columns: [
        {
          title: 'id',
          key: 'id',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '接收人手机号码',
          key: 'receivePhone',
          width: 200,
          align: 'center'
        },
        {
          title: '短信内容',
          key: 'messageContent',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.messageContent
                },
                on: {
                  click: () => {
                    this.showDetailContent = params.row.messageContent.replace(/\n/g, '<br>')
                    this.showDetailModal = true
                  }
                }
              }, params.row.messageContent)
            ])
          }
        },
        {
          title: '发送状态:',
          key: 'status',
          width: 200,
          align: 'center',
          render (h, params) {
            const colorObj = {
              '1': '#19be6b',
              '2': '#ed4014'
            }
            const textObj = {
              '1': '发送成功',
              '2': '发送失败'
            }

            const color = colorObj[params.row.status]
            const text = textObj[params.row.status]
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
          title: '状态描述',
          key: 'statusMessage',
          width: 300,
          tooltip: true,
          align: 'center'
        },
        {
          title: '发送时间',
          key: 'dateCreate',
          width: 200,
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
    search () { // 点击查询按钮
      const date = {
        'receivePhone': this.receivePhone,
        'messageContent': this.messageContent,
        'status': this.status,
        'startDate': this.startDate,
        'endDate': this.endDate,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      logSmsMessagePageList(date).then(res => {
        // this.$Message['success']({
        //   background: true,
        //   content: res.data.data
        // })
        this.logSmsMessageData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    reset () { // 点击重置按钮
      this.receivePhone = ''
      this.messageContent = ''
      this.status = ''
      this.pageNum = 1
      this.operatingTime = []
      this.startDate = ''
      this.endDate = ''
      this.logSmsMessagePageList()
    },
    handleChange (date) {
      this.startDate = date[0]
      this.endDate = date[1]
    },
    checkLog (index) {
      this.formInline.id = this.logSmsMessageData[index].id
      this.formInline.receivePhone = this.logSmsMessageData[index].receivePhone
      this.formInline.messageContent = this.logSmsMessageData[index].messageContent
      this.formInline.status = this.logSmsMessageData[index].status
      this.formInline.statusMessage = this.logSmsMessageData[index].statusMessage
      this.formInline.dateCreate = this.logSmsMessageData[index].dateCreate
      this.modalCheck = true
      if (this.formInline.status === '1') {
        this.formInline.showStatus = '发送成功'
      } else {
        this.formInline.showStatus = '发送失败'
      }
    },
    logSmsMessagePageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      logSmsMessagePageList(date).then(res => {
        this.logSmsMessageData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.logSmsMessagePageList()
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
