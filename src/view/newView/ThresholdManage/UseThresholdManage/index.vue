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
        <h1 style="margin:10px 10px 10px 10px">阈值管理-应用阈值管理</h1>
        <div class="content-button">
            <span style="padding:10px">应用名称</span>
            <Input v-model.trim="applicationName" />
            <span style="padding:10px">应用简称</span>
            <Input v-model.trim="applicationCode" />
            <Button
                type="primary"
                icon="md-search"
                @click="search()"
                style="margin:0 10px 0 20px"
                >查询</Button
            >
            <Button type="primary" icon="md-add" @click="addSetting()"
                v-show="permission.includes('threshold:application:add')"
                >新增阈值</Button
            >
             <Button
                type="primary"
                icon="md-reset"
                @click="reset()"
                style="margin:0 10px 0 20px"
                >重置</Button
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
                                        v-show="permission.includes('threshold:application:edit')"

                        >编辑</Button
                    >
                    <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="deleteThreshold(index)"
                                        v-show="permission.includes('threshold:application:delete')"

                        >删除</Button
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
        <FormItem label="服务类型" style="width:300px;" >
            <Select label="" v-model.trim="formInline.serviceTypeCode" style="width:150px;margin-right:20px" clearable>
                   <Option v-for="(item,id) of typeOption" :key="id" :value="item.serviceTypeCode">{{item.serviceType}}</Option>
            </Select>
        </FormItem><br>
         <FormItem label="应用名称" style="width:300px;" >
            <Select label="" v-model.trim="formInline.applicationCode" style="width:150px;margin-right:20px" clearable>
                   <Option v-for="(item,index) of appOption" :key="index" :value="item.applicationCode">{{item.applicationName}}</Option>
            </Select>
        </FormItem><br>
         <FormItem label="应用简称" style="width:300px;" >
            <Select label="" v-model.trim="formInline.applicationCode" style="width:150px;margin-right:20px" clearable>
                   <Option v-for="(item,index) of appOption" :key="index" :value="item.applicationCode">{{item.applicationCode}}</Option>
            </Select>
        </FormItem><br>

                <FormItem
                    label="次数阈值（每分钟）"
                    prop="timesThreshold"
                    style="width:270px;"
                >
                     <Input v-model.number="formInline.timesThreshold"/>
                </FormItem>
                 <FormItem
                    label="次数阈值（每小时）"
                    prop="hoursThreshold"
                    style="width:270px;"
                >
                <Input v-model.number="formInline.hoursThreshold"/>
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
         <Modal v-model.trim="modalDelete" width="450" title="删除参数配置提示">
            <div>
                <p>确定删除该参数配置吗？</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelDelete" size="large">取消</Button>
                <Button type="primary" @click="handleSubmitDelete" size="large">确定</Button>
            </div>
        </Modal>
         <Modal v-model.trim="modalFusing" width="450" title="删除参数配置提示">
            <div>
                <p>确定熔断该配置吗？</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelFusing" size="large">取消</Button>
                <Button type="primary" @click="handleSubmitFusng" size="large">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getAllApp, getUseThreShold, editUseThreShold, addUseThreShold, deleteUseThreShold, cancelUseThreShold } from '@/api/thresholdManage'
import { getServiceTypeInfo } from '@/api/data'

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
    const validateapplicationName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入参数名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateapplicationCode = (rule, value, callback) => {
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
      fusingId: '',
      permission: sessionStorage.getItem('permission'),
      applicationCodeSelected: [],
      appOption: [],
      modalFusing: false,
      typeOption: [],
      editId: '',
      modelThreshld: '',
      threlodList: [
        {
          value: 1,
          label: '应用通用阈值'
        },
        {
          value: 2,
          label: '应用定制阈值'
        }
      ],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      applicationName: '',
      applicationCode: '',
      timesThreshold: '',
      thresholdType: '',
      modalEdit: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        applicationName: '',
        applicationCode: '',
        hoursThreshold: '',
        timesThreshold: '',
        id: '',
        serviceTypeCode: ''
      },
      ruleInline: {
        applicationName: [
          {
            required: true,
            validator: validateapplicationName,
            trigger: 'blur'
          }
        ],
        applicationCode: [
          {
            required: true,
            validator: validateapplicationCode,
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
          title: '应用名称',
          key: 'applicationName',
          tooltip: true,
          align: 'center'
        },
        {
          title: '应用简称',
          key: 'applicationCode',
          align: 'center'
        },
        {
          title: '服务类型',
          key: 'serviceType',
          align: 'center'
        },
        {
          title: '次数阈值（每分钟）',
          key: 'timesThreshold',
          align: 'center'
        },
        {
          title: '次数阈值（每小时）',
          key: 'hoursThreshold',
          align: 'center'
        },
        {
          title: '阈值类型',
          key: 'thresholdType',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        },
        {
          title: '熔断',
          key: 'serviceStatus',
          width: 300,
          render: (h, params) => {
            if (this.permission.includes('threshold:application:cut')) {
              if (params.row.fused === 1) {
                return h('Button', {
                  on: {
                    click: () => {
                      this.modalFusing = true
                      this.fusingId = params.row.id
                    }
                  }
                }, '熔断')
              }
            }
          }
        }
      ]
    }
  },
  methods: {
    onpagesizechange (e) {
      const info = {
        pageSize: e,
        currentPage: this.pageNum,
        applicationName: this.applicationName,
        applicationCode: this.applicationCode
      }
      getUseThreShold(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e,
        applicationName: this.applicationName,
        applicationCode: this.applicationCode
      }
      getUseThreShold(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    deleteThreshold (index) {
      this.modalDelete = true
      this.editId = this.confData[index].id
    },
    search () {
      this.getUseThreShold(this.applicationCode, this.applicationName)
    },
    reset () {
      this.applicationName = null
      this.applicationCode = null
    },
    addSetting () {
      this.reset()
      this.showType = 'add'
      this.detailTitle = '新增阈值'
      this.modalEdit = true
    },
    handleSubmitAddOrUpdate (index) {
      this.$refs[index].validate(valid => {
        if (valid) {
          if (this.showType === 'add') {
            addUseThreShold(this.formInline)
              .then(res => {
                console.log(res)
                this.$Message['success']({
                  background: true,
                  content: res.data.message
                })
                this.modalEdit = false
                this.getUseThreShold()
                this.$refs[index].resetFields()
              })
              .catch(err => {
                console.log(err)
              })
          } else if (this.showType === 'edit') {
            const info = {
              applicationCode: this.formInline.applicationCode,
              timesThreshold: parseInt(this.formInline.timesThreshold),
              hoursThreshold: parseInt(this.formInline.hoursThreshold),
              serviceTypeCode: this.formInline.serviceTypeCode,
              id: this.editId
            }
            editUseThreShold(info)
              .then(res => {
                this.$Message['success']({
                  background: true,
                  content: res.data.message
                })
                this.$refs['formInline'].resetFields()
                this.modalEdit = false
                this.getUseThreShold()
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
      this.$refs[name].resetFields()
      this.modalEdit = false
    },
    cancelAddOrUpdateType () {
      this.modalEdit = false
    },
    edit (index) {
      console.log(this.confData[index])
      this.formInline.serviceTypeCode = this.confData[index].serviceTypeCode
      this.editId = this.confData[index].id
      this.formInline.id = this.confData[index].id
      this.formInline.applicationName = this.confData[index].applicationName
      this.formInline.applicationCode = this.confData[index].applicationCode
      this.formInline.hoursThreshold = this.confData[index].hoursThreshold
      this.formInline.timesThreshold = this.confData[index].timesThreshold
      this.showType = 'edit'
      this.detailTitle = '编辑阈值'
      this.modalEdit = true
    },
    handleSubmitFusng () {
      cancelUseThreShold(this.fusingId).then(res => {
        this.$Message.info({
          content: res.data.message
        })
        this.getUseThreShold()
        this.modalFusing = false
      }).catch(err => {
        console.log(err)
      })
    },
    cancelFusing () {
      this.modalFusing = false
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      deleteUseThreShold(this.editId)
        .then(res => {
          this.$Message['success']({
            background: true,
            content: res.data.message
          })
          this.modalDelete = false
          this.getUseThreShold()
        })
        .catch(err => {
          console.log(err)
          this.modalDelete = false
        })
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    getUseThreShold (code, name) {
      const info = {
        applicationName: name,
        applicationCode: code,
        pageSize: this.pageSize,
        currentPage: this.pageNum
      }
      console.log(info)
      getUseThreShold(info).then(res => {
        console.log(res)
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    }
  },
  created () {
    this.getUseThreShold()
    const info = {
      pageSize: this.pageSize,
      currentPage: this.pageNum
    }
    getServiceTypeInfo(info).then(res => {
      this.typeOption = res.data.data.records
    }).catch(error => {
      this.$Message.info(error)
    })
    getAllApp().then(res => {
      this.appOption = res.data.data
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>
