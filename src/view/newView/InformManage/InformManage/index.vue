<template>
    <div class="user-content">
        <h1 style="margin:10px 10px 10px 10px">提醒通知管理-提醒通知管理</h1>
        <div class="content-button">
            <Button type="primary" icon="md-add" @click="addSetting()"
                >新增通知</Button
            >
        </div>
        <Table
            highlight-row
            stripe
            :columns="columns"
            :data="confData"
            style="margin-top: 5px"
        >
            <template slot-scope="{ row, index }" slot="action">
                <div>
                    <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="edit(index)"
                        >编辑</Button
                    >
                </div>
            </template>
        </Table>
        <Page
            :total="total"
            :page-size="pageSize"
            :show-total="true"
            show-sizer
            style="text-align: center;margin-top: 5px"
        />

        <Modal
            v-model.trim="modalEdit"
            width="600"
            :mask-closable="false"
            :closable="false"
            v-bind:title="detailTitle"
        >
            <Form ref="formInline" :model="formInline">
         <!--        <div style="width:200px height:20px">
                    <select name="21" id="21">
                        <option value="011">01</option>
                        <option value="012" selected>02</option>
                    </select>
                </div> -->
                    <FormItem
                        label="通知类型"
                        prop="noticeType"
                        style="width:270px;"
                    >
                <Select v-model.trim="noticeSelected" style="width:200px" @on-change='selectedType'>
                                  <Option v-for="(item,index) in allNotice" :key="index" :value="item.noticeType">{{item.noticeType}}</Option>
                         </Select>
                </FormItem>
                <FormItem
                    label="场景"
                    prop="sceneType"
                    style="width:270px;"
                >
                     <Input v-model.trim="formInline.sceneType"/>
                </FormItem>
                <FormItem
                    label="内容"
                    prop="content"
                    style="width:270px;"
                >
                     <Input v-model.trim="formInline.content"/>
                </FormItem>
                <FormItem
                    label="短信收件人"
                    prop="contactMobile"
                    style="width:270px;"
                >
                     <Input v-model.trim="formInline.contactMobile"/>
                </FormItem>
                <FormItem
                    label="邮件收件人"
                    prop="contactMail"
                    style="width:270px;"
                >
                     <Input v-model.trim="formInline.contactMail"/>
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
    </div>
</template>

<script>
import { confDelete, conf } from '@/api/data'
import { getInfoInform } from '@/api/informManage'

export default {
  data () {
    function getByteLen (val) {
      var len = 0
      for (var i = 0, len1 = val.length; i < len1; i++) {
        var length = val.charCodeAt(i)
        if (length >= 0 && length <= 128) {
          len += 1
        } else {
          len += 3
        }
      }
      return len
    }
    const validatenoticeType = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入参数名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validatesceneType = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参数键名'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    const validateConfValue = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参数键名'))
      } else {
        callback()
      }
    }

    return {
      noticeSelected: [],
      allNotice: [
        { noticeType: 1, value: '01' },
        { noticeType: 2, value: '02' }
      ],
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      noticeType: '',
      sceneType: '',
      content: '',
      thresholdType: '',
      modalEdit: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        noticeType: '',
        sceneType: '',
        contactMobile: '',
        content: '',
        contactMail: ''
      },
      ruleInline: {
        noticeType: [
          {
            required: true,
            validator: validatenoticeType,
            trigger: 'blur'
          }
        ],
        sceneType: [
          {
            required: true,
            validator: validatesceneType,
            trigger: 'blur'
          }
        ],
        confValue: [
          {
            required: true,
            validator: validateConfValue,
            trigger: 'blur'
          }
        ]
      },
      confData: [],
      columns: [
        {
          title: '通知类型',
          key: 'noticeType',
          tooltip: true,
          align: 'center'
        },
        {
          title: '场景',
          key: 'sceneType',
          align: 'center'
        },
        {
          title: '内容',
          key: 'content',
          align: 'center'
        },
        {
          title: '短信收件人',
          key: 'contactMobile',
          align: 'center'
        },
        {
          title: '邮件收件人',
          key: 'contactMail',
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
    selectedType (e) {
      console.log(e, this.noticeSelected)
    },
    search () {
      console.log(this.formInline, 'formInline')
      // 点击查询按钮
      const date = {
        noticeType: this.noticeType,
        sceneType: this.sceneType,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      confPageList(date)
        .then(res => {
          // this.$Message['success']({
          //   background: true,
          //   content: res.data.data
          // })
          this.confData = res.data.data.resultList
          this.total = res.data.data.totalAmount
        })
        .catch(err => {
          console.log(err)
        })
    },
    reset () {
      // 点击重置按钮
      this.noticeType = null
      this.sceneType = null
      this.content = null
    },
    addSetting () {
      // 点击新增按钮
      this.reset()
      this.showType = 'add'
      this.detailTitle = '新增模块'
      this.modalEdit = true
    },
    handleSubmitAddOrUpdate (index) {
      // 点击提交新增按钮
      console.log(index)
      this.$refs[index].validate(valid => {
        console.log(valid)
        if (valid) {
          if (this.showType === 'add') {
            const date = {
              noticeType: this.formInline.noticeType,
              sceneType: this.formInline.sceneType,
              confValue: this.formInline.confValue,
              confDescribtion: this.formInline.confDescribtion
            }
            conf(date)
              .then(res => {
                this.$Message['success']({
                  background: true,
                  content: res.data.message
                })
                this.modalEdit = false
                this.confPageList()
                this.$refs[index].resetFields()
              })
              .catch(err => {
                console.log(err)
              })
          } else if (this.showType === 'edit') {
            const date = {
              id: this.id,
              noticeType: this.formInline.noticeType,
              sceneType: this.formInline.sceneType,
              confValue: this.formInline.confValue,
              confDescribtion: this.formInline.confDescribtion
            }
            conf(date)
              .then(res => {
                this.$Message['success']({
                  background: true,
                  content: res.data.message
                })
                this.$refs['formInline'].resetFields()
                this.modalEdit = false
                this.confPageList()
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
      // 取消新增
      this.$refs[name].resetFields()
      this.modalEdit = false
    },
    cancelAddOrUpdateType () {
      this.modalEdit = false
    },
    edit (index) {
      // 点击修改按钮
      this.id = this.confData[index].id
      this.formInline.noticeType = this.confData[index].noticeType
      this.formInline.sceneType = this.confData[index].sceneType
      this.formInline.contactMobile = this.confData[index].contactMobile
      this.formInline.contactMail = this.confData[index].contactMail
      this.formInline.content = this.confData[index].content
      this.showType = 'edit'
      this.detailTitle = '编辑模块'
      this.modalEdit = true
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      confDelete(this.id)
        .then(res => {
          this.$Message['success']({
            background: true,
            content: res.data.message
          })
          this.modalDelete = false
          this.confPageList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    confPageList () {
      const date = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      confPageList(date)
        .then(res => {
          this.confData = res.data.data.resultList
          this.total = res.data.data.totalAmount
        })
        .catch(err => {
          console.log(err)
        })
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    getInfo () {
      const info = {
        'pageSize': this.pageSize,
        'currentPage': this.pageNum
      }
      getInfoInform(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
        // this.noticeSelected = res.data.data.records
      })
    }
  },
  created () {
    this.getInfo()
  }
}
</script>
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
