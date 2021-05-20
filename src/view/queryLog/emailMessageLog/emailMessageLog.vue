<template>
  <div class="user-content">
    <div class="content-button">
      收件人：
      <Input v-model.trim="receiveEmail" style="width:150px; marginRight:20px;" placeholder="收件人"/>
      <!-- 邮件内容：
      <Input v-model.trim="messageContent" style="width:150px; marginRight:20px;" placeholder="邮件内容"/> -->
      发送状态：
      <Select label="" v-model.trim="status" style="width:150px; marginRight:20px;">
        <Option v-for="item of statusEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
      </Select>
      邮件类型：
      <Select label="" v-model.trim="emailType" style="width:150px; marginRight:20px;">
        <Option v-for="item of emailTypeEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
      </Select>
      时间选择：
      <DatePicker v-model="operatingTime" type="datetimerange" placeholder="时间选择" style="width: 300px"
        format="yyyy-MM-dd HH:mm:ss" @on-change="handleChange" :editable=false></DatePicker>
      <Button type="primary" icon="md-search" @click="search()">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="logEmailMessageData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="info" size="small" style="margin-right: 5px" @click="checkLog(index)">查看</Button>
          </div>
        </template>
    </Table>
    <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
    <Modal v-model="showDetailModal" title="邮件内容详情" footer-hide>
      <p>{{showDetailContent}}</p>
    </Modal>
    <Modal v-model="modalCheck" width="30%" height="40%"  :mask-closable="false" :closable="true" title="邮件日志详情" footer-hide>
      <Form :model="formInline"  inline>
        <FormItem  label="日志id：" style="width:300px;" >
          {{formInline.id}}
        </FormItem><br>
        <FormItem label="收件人：" style="width:300px;" >
          {{formInline.receiveEmail}}
        </FormItem>
        <FormItem label="抄送人：" style="width:300px;" >
          {{formInline.ccEmail}}
        </FormItem><br>
        <FormItem label="邮件主题：" style="width:300px;" >
          {{formInline.messageSubject}}
        </FormItem><br>
        <FormItem label="邮件内容：" style="width:100%;" >
          {{formInline.messageContent}}
        </FormItem><br>
        <FormItem label="邮件类型：" style="width:300px;" >
          {{formInline.showEmailType}}
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
import { logEmailMessagePageList } from '@/api/data'
export default {
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      receiveEmail: '', // 接收人手机号
      messageContent: '', // 邮件内容
      status: '', // 邮件发送状态
      emailType: '', // 邮件类型
      startDate: '',
      endDate: '',
      showDetailModal: false, // 是否显示邮件详情弹窗
      showDetailContent: '',
      modalCheck: false, // 是否显示邮件日志详情弹窗
      formInline: { // 实体
        receiveEmail: '', // 收件人
        ccEmail: '', // 抄送人
        messageSubject: '', // 邮件主题
        messageContent: '', // 邮件内容
        emailType: '', // 邮件类型
        showEmailType: '', // 邮件类型展示
        status: '', // 邮件发送状态
        showStatus: '', // 邮件发送状态展示
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
      emailTypeEnumList: [ // 邮件类型枚举
        {
          'value': '1',
          'label': '业务邮件'
        },
        {
          'value': '2',
          'label': '系统邮件'
        }
      ],
      logEmailMessageData: [], // 邮件日志数据
      operatingTime: [],
      columns: [
        {
          title: 'id',
          key: 'id',
          tooltip: true,
          width: 150,
          align: 'center'
        },
        {
          title: '收件人',
          key: 'receiveEmail',
          tooltip: true,
          width: 130,
          align: 'center'
        },
        {
          title: '抄送人',
          key: 'ccEmail',
          align: 'center',
          render: (h, params) => {
            let text = ''
            if (params.row.ccEmail) {
              text = params.row.ccEmail
            } else {
              text = '无'
            }
            return h('div', {
              props: {
              }
            }, text)
          }
        },
        {
          title: '邮件主题',
          key: 'messageSubject',
          width: 150,
          align: 'center'
        },
        {
          title: '邮件内容',
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
          title: '邮件类型',
          key: 'emailType',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let text
            switch (row.emailType) {
              case '1':
                text = '业务邮件'
                break
              case '2':
                text = '系统邮件'
                break
              default:
                text = '-'
                break
            }
            return h('Tag', text)
          }
        },
        {
          title: '发送状态:',
          key: 'status',
          width: 150,
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
          width: 200,
          tooltip: true,
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
                  title: params.row.statusMessage
                },
                on: {
                  click: () => {
                    this.showDetailContent = params.row.statusMessage.replace(/\n/g, '<br>')
                    this.showDetailModal = true
                  }
                }
              }, params.row.statusMessage)
            ])
          }
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
        //   background: true,
        //   content: res.data.data
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
    reset () { // 点击重置按钮
      this.receiveEmail = ''
      this.messageContent = ''
      this.status = ''
      this.pageNum = 1
      this.operatingTime = []
      this.startDate = ''
      this.endDate = ''
      this.logEmailMessagePageList()
    },
    checkLog (index) {
      this.formInline.id = this.logEmailMessageData[index].id
      this.formInline.receiveEmail = this.logEmailMessageData[index].receiveEmail
      this.formInline.ccEmail = this.logEmailMessageData[index].ccEmail
      this.formInline.messageSubject = this.logEmailMessageData[index].messageSubject
      this.formInline.messageContent = this.logEmailMessageData[index].messageContent
      this.formInline.emailType = this.logEmailMessageData[index].emailType
      this.formInline.status = this.logEmailMessageData[index].status
      this.formInline.statusMessage = this.logEmailMessageData[index].statusMessage
      this.formInline.dateCreate = this.logEmailMessageData[index].dateCreate
      this.modalCheck = true
      if (this.formInline.ccEmail === null) {
        this.formInline.ccEmail = '无'
      }
      if (this.formInline.status === '1') {
        this.formInline.showStatus = '发送成功'
      } else {
        this.formInline.showStatus = '发送失败'
      }
      if (this.formInline.emailType === '1') {
        this.formInline.showEmailType = '业务邮件'
      } else {
        this.formInline.showEmailType = '系统邮件'
      }
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
