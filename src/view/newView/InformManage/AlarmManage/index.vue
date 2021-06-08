<template>
    <div class="user-content">
        <h1 style="margin:10px 10px 10px 10px">应用系统管理-应用系统管理</h1>
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
                        >取消关联</Button
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
        <Modal v-model.trim="modalDelete" width="450" title="删除参数配置提示">
            <div>
                <p>确定删除该参数配置吗？</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelDelete" size="large"
                    >取消</Button
                >
                <Button type="primary" @click="handleSubmitDelete" size="large"
                    >确定</Button
                >
            </div>
        </Modal>
    </div>
</template>

<script>
import { getInfoConnect, getInfo, cancelConnect } from '@/api/useSystem' // ,

export default {
  data () {
    return {
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
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    edit (index) {
      this.deleteId = this.confData[index].id
      this.modalDelete = true
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      const info = this.deleteId
      cancelConnect(info).then(res => {
        this.$Message.success({
          content: res.data.message
        })
        this.modalDelete = false
        this.getInfo()
      }).catch(res => {
        this.$Message.error({
          content: res.data.message
        })
        this.modalDelete = false
      })
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    getInfo (code, name) {
      const info = {
        applicationCode: code,
        applicationName: name,
        currentPage: this.pageNum,
        pageSize: this.pageSize,
        serviceModuleCode: ''
      }
      getInfoConnect(info).then(res => {
        console.log(res, 'getInfoConnect')
        this.renderPage(res.data.data.records, res.data.data.total)
      }).catch(error => {
        console.log(error)
      })
    }
  },
  created () {
    const info = {
      pageSize: this.pageSize,
      currentPage: this.pageNum,
      applicationCode: this.applicationCode,
      applicationName: this.applicationName
    }
    this.getInfo()

    getInfo(info).then(res => {
      this.appData = res.data.data.records
      console.log(res, 'getInfo')
    })
    getServiceTypeInfo(info).then(res => {
      this.moduleOptions = res.data.data.records
      console.log(res, 'getServiceTypeInfo')
    }).catch(err => this.$Message.info(err))
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
