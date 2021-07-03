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
        <h1 style="margin:10px 10px 10px 10px">第三方服务管理-第三方厂商管理</h1>
        <div class="content-button">
            <span style="padding:10px">厂商名称</span>
            <Input v-model.trim="manufacturerName" />
            <Button
                type="primary"
                icon="md-search"
                @click="search()"
                style="margin:0 10px 0 20px"
            >查询</Button>
            <Button type="primary" icon="md-refresh" @click="resetClick()">重置</Button>
            <Button type="primary" icon="md-add" @click="addSetting()"
                v-show="permission.includes('tripartite:provider:addProvider')"

            >新增厂商</Button>
        </div>
        <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
            <template slot-scope="{index }" slot="action">
                <div>
                    <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="editModule(index)"
                      v-show="permission.includes('tripartite:provider:edit')"

                    >编辑</Button>
                     <Button
                        type="error"
                        size="small"
                        style="margin-right: 5px"
                        @click="deleteClick(index)"
                       v-show="permission.includes('tripartite:provider:delete')"

                    >删除</Button>
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
            v-model.trim="modalAddOrUpdate"
            width="600"
            :mask-closable="false"
            :closable="false"
            v-bind:title="detailTitle"
        >
            <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                 <FormItem label="厂商名称" prop="manufacturerName" style="width:270px;">
                    <Input v-model.trim="formInline.manufacturerName" />
                </FormItem>
                 <FormItem label="联系人" prop="manufacturerContact" style="width:270px;">
                    <Input v-model.trim="formInline.manufacturerContact" />
                </FormItem>
                 <FormItem label="联系方式" prop="manufacturerContactType" style="width:270px;">
                    <Input v-model.trim="formInline.manufacturerContactType" />
                </FormItem>
            </Form>
            <div slot="footer">
                 <Button
                    type="primary"
                    ghost
                    size="large"
                    @click="cancelAddOrUpdate('formInline')"
                >返回</Button>
                <Button
                    type="primary"
                    size="large"
                    @click="handleSubmitAddOrUpdate('formInline')"
                >保存</Button>
            </div>
        </Modal>
        <Modal v-model.trim="modalDelete" width="450" title="删除参数配置提示">
            <div>
                <p>确定删除该参数配置吗？</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelDelete" size="large">取消</Button>
                <Button type="primary" @click="handleSubmitDelete" size="large">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getManufacture, addManufacture, editManufacture, deleteManufacture } from '@/api/thirdPart'
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
    const validatemanufacturerName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入厂商名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }

    return {
      permission: sessionStorage.getItem('permission'),
      deleteId: '',
      total: 0,
      pageNum: 1,
      pageSize: 10,
      manufacturerName: '',
      modalAddOrUpdate: false,
      modalAddOrUpdateType: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        manufacturerName: '',
        manufacturerContact: '',
        manufacturerContactType: '',
        id: ''
      },
      ruleInline: {
        manufacturerName: [
          {
            required: true,
            validator: validatemanufacturerName,
            trigger: 'blur'
          }
        ],
        manufacturerContactType: [
          {
            required: true,
            message: '请输入邮箱或者电话',
            trigger: 'blur'
          }
        ]
      },
      confData: [ ],
      columns: [
        {
          title: '厂商名称',
          key: 'manufacturerName',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '联系人',
          key: 'manufacturerContact',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '联系方式',
          key: 'manufacturerContactType',
          tooltip: true,
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
    onpagesizechange (e) {
      const info = {
        pageSize: e,
        currentPage: this.pageNum,
        manufacturerName: this.manufacturerName
      }
      getManufacture(info).then(res => {
        this.confData = res.data.data.records
        this.total = res.data.data.total
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e,
        manufacturerName: this.manufacturerName

      }
      getManufacture(info).then(res => {
        this.confData = res.data.data.records
        this.total = res.data.data.total
      })
    },
    resetClick () {
      this.manufacturerName = null
    },
    reset (obj) {
      obj.manufacturerName = ''
      obj.manufacturerContact = ''
      obj.manufacturerContactType = ''
    },
    search () {
      this.getManufacture(this.manufacturerName)
    },
    addSetting () {
      this.showType = 'add'
      this.detailTitle = '新增厂商'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) {
      this.$refs[index].validate((valid) => {
        if (valid) {
          switch (this.showType) {
            case 'add':
              const infoAdd = this.formInline
              addManufacture(infoAdd).then(res => {
                this.$Message.success({
                  content: res.data.message
                })
                this.getManufacture('')
                this.modalAddOrUpdate = false
                this.reset(this.formInline)
              }).catch(error => {
                this.$Message.info({
                  content: error
                })
              })
              break
            case 'edit':
              const info = this.formInline
              editManufacture(info).then(res => {
                this.$Message.success({
                  content: res.data.message
                })
                this.getManufacture('')
                this.modalAddOrUpdate = false
                this.reset(this.formInline)
              }).catch(error => {
                this.$Message.info({
                  content: error
                })
              })
              break
            default:
          }
        } else {
          this.$Message.error('请检查参数是否有误!')
        }
      })
    },
    cancelAddOrUpdate (name) {
      this.$refs[name].resetFields()
      this.modalAddOrUpdate = false
    },
    editModule (index) {
      this.formInline.id = this.confData[index].id
      this.formInline.manufacturerName = this.confData[index].manufacturerName
      this.formInline.manufacturerContact = this.confData[index].manufacturerContact
      this.formInline.manufacturerContactType = this.confData[index].manufacturerContactType
      this.showType = 'edit'
      this.detailTitle = '厂商编辑'
      this.modalAddOrUpdate = true
    },
    deleteClick (index) {
      this.deleteId = this.confData[index].manufacturerCode
      this.modalDelete = true
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      console.log(this.deleteId)
      deleteManufacture(this.deleteId)
        .then((res) => {
          this.$Message['success']({
            content: res.data.message
          })
          this.getManufacture('')
          this.modalDelete = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    rederPage (data, total) {
      this.confData = data
      this.total = total
    },
    getManufacture (name) {
      const info = {
        currentPage: this.pageNum,
        pageSize: this.pageSize,
        manufacturerName: name
      }
      getManufacture(info).then(res => {
        this.rederPage(res.data.data.records, res.data.data.total)
      })
    }
  },
  created () {
    this.getManufacture()
  }
}
</script>
