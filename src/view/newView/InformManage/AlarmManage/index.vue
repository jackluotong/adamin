<template>
    <div class="user-content">
        <h1 style="margin:10px 10px 10px 10px">通知管理-告警管理</h1>
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
        />
    </div>
</template>

<script>
import { getInfoWarning } from '@/api/informManage'

export default {
  data () {
    return {
      permission: sessionStorage.getItem('permission'),
      deleteId: '',
      total: 0,
      pageNum: 1,
      pageSize: 30,
      modalEdit: false,
      detailTitle: '',
      modalDelete: false,
      formInline: {
        applicationName: '',
        applicationCode: '',
        contactPhone: '',
        contactEmails: ''
      },
      confData: [],
      columns: [
        {
          title: '应用名称',
          key: 'applicationName',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '应用简称',
          key: 'applicationCode',
          width: 300,
          align: 'center'
        },
        {
          title: '服务模块',
          key: 'serviceModule',
          width: 300,
          align: 'center'
        },
        {
          title: '联系人邮箱',
          key: 'contactMail',
          width: 300,
          align: 'center'
        },
        {
          title: '联系人电话',
          key: 'contactMobile',
          width: 300,
          align: 'center'
        },
        {
          title: '内容',
          key: 'content',
          width: 300,
          align: 'center'
        },
        {
          title: '厂商code',
          key: 'manufacturerCode',
          width: 300,
          align: 'center'
        },
        {
          title: '厂商名称',
          key: 'manufacturerName',
          width: 300,
          align: 'center'
        },
        {
          title: '通知类型',
          key: 'noticeType',
          width: 300,
          align: 'center'
        },
        {
          title: '场景类型',
          key: 'sceneType',
          width: 300,
          align: 'center'
        },
        {
          title: '发送状态',
          key: 'sendStatus',
          width: 300,
          align: 'center'
        },
        {
          title: '服务类型',
          key: 'serviceType',
          width: 300,
          align: 'center'
        },
        {
          title: '服务类型code',
          key: 'serviceTypeCode',
          width: 300,
          align: 'center'
        },
        {
          title: '切换类型',
          key: 'triggerType',
          width: 300,
          align: 'center'
        }
      /*   {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 100
        } */
      ]
    }
  },
  methods: {
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    getInfo () {
      const info = {
        currentPage: this.pageNum,
        pageSize: this.pageSize
      }
      getInfoWarning(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      }).catch(error => {
        console.log(error)
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
