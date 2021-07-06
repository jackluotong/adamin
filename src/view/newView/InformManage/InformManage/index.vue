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
        <h1 style="margin:10px 10px 10px 10px">提醒通知管理-提醒通知管理</h1>
        <div class="content-button">
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
                        v-show="permission.includes('notice:manage:edit')"
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
                  <!--   <FormItem
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
                </FormItem> -->
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
import { getInfoInform, editInfoInform } from '@/api/informManage'

export default {
  data () {
    return {
      permission: sessionStorage.getItem('permission').split(','),
      editId: '',
      isShow: true,
      noticeSelected: [],
      allNotice: [
        { noticeType: 1, value: '01' },
        { noticeType: 2, value: '02' }
      ],
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 10, // 每页几条数据
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
      showTypeId: '',
      confData: [],
      columns: [
        {
          type: 'index',
          width: 60,
          aligin: 'center'
        },
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
        /*  {
          title: '操作',
          slot: 'action',
          align: 'center'
        } */
        {
          title: '操作',
          key: 'noticeType',
          width: 100,
          render: (h, params) => {
            if (params.row.noticeType === '服务通知') {
              return h('Button', {
                on: {
                  click: () => {
                    this.modalEdit = true
                    this.editId = params.row.id
                    this.formInline.contactMobile = params.row.contactMobile
                    this.formInline.contactMail = params.row.contactMail
                  }
                }
              }, '编辑')
            } else {
              return h('span', {

              }, '')
            }
          }
        }

      ]
    }
  },
  methods: {
    onpagesizechange (e) {
      this.pageSize = e
      const info = {
        pageSize: e,
        currentPage: this.pageNum

      }
      getInfoInform(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e
      }
      getInfoInform(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    selectedType (e) {
    },
    handleSubmitAddOrUpdate (index) {
      const info = {
        id: this.editId,
        contactMail: this.formInline.contactMail,
        contactMobile: this.formInline.contactMobile
      }
      editInfoInform(info).then(res => {
        this.modalEdit = false
        this.$Message.success({
          content: res.data.message
        })
        this.getInfo()
      }).catch(() => {
      })
    },
    cancelAddOrUpdateType () {
      this.modalEdit = false
    },
    edit (index) {
      this.editId = this.confData[index].id
      this.showTypeId = this.confData[index].noticeType
      this.formInline.noticeType = this.confData[index].noticeType
      this.formInline.sceneType = this.confData[index].sceneType
      this.formInline.contactMobile = this.confData[index].contactMobile
      this.formInline.contactMail = this.confData[index].contactMail
      this.formInline.content = this.confData[index].content
      this.showType = 'edit'
      this.detailTitle = '编辑模块'
      this.modalEdit = true
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
      this.confData.map((item) => {
        item.noticeType === '1' ? item.noticeType = '应用通知' : item.noticeType = '服务通知'
        item.sceneType === '1' ? item.sceneType = '应用阈值触发' : item.sceneType = '服务阈值触发'
      })
    },
    getInfo () {
      const info = {
        'pageSize': this.pageSize,
        'currentPage': this.pageNum
      }
      getInfoInform(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    judgeShow () {
      if (this.showTypeId === 1) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    }
  },
  created () {
    this.getInfo()
  },
  mounted () {
    console.log(this.permission.includes('notice:manage:edit'))
  }
}
</script>
