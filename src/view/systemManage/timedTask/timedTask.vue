<template>
  <div>
    <Button type="primary" @click="refresh()" style="margin-right: 5px">刷新</Button>
    <Table stripe :columns="columns" :data="jobData" style="margin-top: 5px">
      <template slot-scope="{ row, index }" slot="cronExpression">
        <Input type="text" v-model="editCronExpression" v-if="editIndex === index" />
        <span v-else>{{ row.cronExpression }}</span>
      </template>
       <template slot-scope="{ row, index }" slot="action">
          <div v-if="editIndex === index">
            <Button type="success" @click="handleSave(index)" style="margin-right: 5px">保存</Button>
            <Button @click="editIndex = -1">取消</Button>
          </div>
          <div v-else>
            <Button type="info" size="small" style="margin-right: 5px" @click="start(index)">启动</Button>
            <Button type="warning" size="small" style="margin-right: 5px" @click="pasue(index)">暂停</Button>
            <Button type="success" size="small" style="margin-right: 5px" @click="trigger(index)">立即执行</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">修改</Button>
          </div>
        </template>

     </Table>
     <Page @on-change="changePage" @on-page-size-change="ageSizeChange" :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
  </div>
</template>

<script>
import { confJobPageList, confJobStart, confJobPasue, confJobTrigger, confJobDelete, confJob } from '@/api/data'
export default {
  name: 'timedTask',
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      editIndex: -1, // 当前聚焦的输入框的行数
      editCronExpression: '', // cron表达式
      jobData: [ // NONE NORMAL PAUSED COMPLETE ERROR BLOCKED
        // {
        //   id: '03241e18d9004443a442187fbb80d4d0',
        //   jobName: '定时新增消息数据',
        //   cronExpression: '0 0/10 * * * ? *',
        //   beanClass: 'com.msl.mafa.job.TestAddMessageJob',
        //   status: 'PAUSED',
        //   jobGroup: 'system',
        //   jobDataMap: ''
        // },
        // {
        //   id: '828141a8ff304a1f92a4447642cf082a',
        //   jobName: '定时同步消息数据与推送消息数据',
        //   cronExpression: '0/30 * * * * ? *',
        //   beanClass: 'com.msl.mafa.job.SyncAndPushMessageJob',
        //   status: 'NORMAL',
        //   jobGroup: 'system',
        //   jobDataMap: ''
        // }
      ],
      columns: [
        {
          title: '主键',
          key: 'id',
          tooltip: true,
          width: 100
        },
        {
          title: '名称',
          key: 'jobName',
          width: 230,
          align: 'center'
        },
        {
          title: 'cron表达式',
          slot: 'cronExpression',
          width: 150,
          align: 'center'
        },
        {
          title: '执行类',
          key: 'beanClass',
          width: 300,
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 80,
          render: (h, params) => {
            if (params.row.status === 'NONE') {
              return h('span', {
                style: {
                  color: '#2db7f5'
                }
              }, '未启动')
            }
            if (params.row.status === 'NORMAL') {
              return h('span', {
                style: {
                  color: '#19be6b'
                }
              }, '正常')
            }
            if (params.row.status === 'PAUSED') {
              return h('span', {
                style: {
                  color: '#515a6e'
                }
              }, '暂停')
            }
            if (params.row.status === 'COMPLETE') {
              return h('span', {
                style: {
                  color: '#2b85e4'
                }
              }, '完成')
            }
            if (params.row.status === 'ERROR') {
              return h('span', {
                style: {
                  color: '#ed4014'
                }
              }, '异常')
            }
            if (params.row.status === 'BLOCKED') {
              return h('span', {
                style: {
                  color: '#ff9900'
                }
              }, '锁定')
            }
            return h('span', {
              style: {
                color: '#ed4014'
              }
            }, '未知')
          }
        },
        {
          title: '分组',
          key: 'jobGroup',
          align: 'center',
          width: 100
        },
        {
          title: '参数',
          key: 'jobDataMap',
          align: 'center',
          width: 100
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
    refresh () {
      this.confJobPageList()
    },
    edit (index) {
      this.editIndex = index
      this.editCronExpression = this.jobData[index].cronExpression
      console.log(this.editCronExpression)
    },
    handleSave (index) {
      let parser = require('cron-parser')
      try {
        let interval = parser.parseExpression(this.editCronExpression)
        console.log('cronDate:', interval.next().toDate())
      } catch (error) {
        this.$Message['error']({
          background: true,
          content: '非Cron表达式格式，请检查-->' + error.message
        })
        return
      }
      const date = {
        'id': this.jobData[index].id,
        'cronExpression': this.editCronExpression
      }
      confJob(date).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.data
        })
        this.confJobPageList()
      }).catch(err => {
        console.log(err)
      })
      this.editIndex = -1
      this.editCronExpression = ''
    },
    start (index) {
      const status = this.jobData[index].status
      if (status === 'NONE' || status === 'PAUSED' || status === 'ERROR' || status === 'BLOCKED') {
        const date = {
          'id': this.jobData[index].id
        }
        confJobStart(date).then(res => {
          this.$Message['success']({
            background: true,
            content: res.data.data
          })
          this.confJobPageList()
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$Message['error']({
          background: true,
          content: '当前状态不可启动!'
        })
        this.confJobPageList()
      }
    },
    pasue (index) {
      const status = this.jobData[index].status
      if (status === 'NORMAL') {
        const date = {
          'id': this.jobData[index].id
        }
        confJobPasue(date).then(res => {
          this.$Message['success']({
            background: true,
            content: res.data.data
          })
          this.confJobPageList()
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$Message['error']({
          background: true,
          content: '当前状态不可暂停!'
        })
        this.confJobPageList()
      }
    },
    trigger (index) {
      const status = this.jobData[index].status
      if (status === 'NORMAL' || status === 'PAUSED' || status === 'COMPLETE') {
        const date = {
          'id': this.jobData[index].id
        }
        confJobTrigger(date).then(res => {
          this.$Message['success']({
            background: true,
            content: res.data.data
          })
          this.confJobPageList()
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$Message['error']({
          background: true,
          content: '当前状态不可立即执行!'
        })
        this.confJobPageList()
      }
    },
    del (index) {
      // const status = this.jobData[index].status
      confJobDelete(this.jobData[index].id).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.data
        })
        this.confJobPageList()
      }).catch(err => {
        console.log(err)
      })
    },
    confJobPageList () {
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      confJobPageList(date).then(res => {
        this.jobData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    changePage (date) {
      this.pageNum = date
      this.confJobPageList()
    },
    ageSizeChange (date) {
      this.pageNum = 1
      this.pageSize = date
      this.logSysComPageList()
    }
  },
  created () {
    this.confJobPageList()
  }
}
</script>
<style>

</style>
