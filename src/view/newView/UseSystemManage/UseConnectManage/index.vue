<template>
    <div class="user-content">
        <h1 style="margin:10px 10px 10px 10px">应用系统管理-应用系统管理</h1>
        <div class="content-button">
            <span style="padding:10px">应用名称</span>
            <Input v-model.trim="applicationName" />
            <span style="padding:10px">应用简称</span>
            <Input v-model.trim="applicationCode" />
            <span style="padding:10px">服务模块</span>
            <Select v-model.trim="formInline" style="width:200px">
                <Option selected>{{ formInline.serviceModuleCode }}</Option>
            </Select>
            <Button
                type="primary"
                icon="md-search"
                @click="search()"
                style="margin:0 10px 0 20px"
                >查询</Button
            >
            <Button type="primary" icon="md-add" @click="addSetting()"
                >服务关联</Button
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

        <Modal
            v-model.trim="modalEdit"
            width="600"
            :mask-closable="false"
            :closable="false"
            v-bind:title="detailTitle"
        >
            <Form ref="formInline" :model="formInline">
                <div style="display:inline-table">
                    <FormItem
                        label="应用名称"
                        prop="applicationName"
                        style="width:270px;"
                    >
                         <Select v-model.trim="selectedName" style="width:200px">
                            <Option v-for="(item,id) in appData" :key="id" >{{ appData.applicationName}}</Option>
                         </Select>
                    </FormItem>
                </div>
                <FormItem
                    label="应用简称"
                    prop="applicationCode"
                    style="width:270px;"
                >
                    <Select v-model.trim="formInline" style="width:200px">
                            <Option selected>{{ formInline.applicationCode }}</Option>
                    </Select>
                </FormItem>
                <FormItem
                    label="服务模块"
                    prop="serviceModuleCode"
                    style="width:270px;"
                >
                    <Select v-model.trim="formInline" style="width:200px">
                            <Option selected>{{ formInline.serviceModuleCode }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button
                    type="primary"
                    ghost
                    size="large"
                    @click="cancelAddOrUpdateType('formInline')"
                    >查询</Button
                >
                <Button
                    type="primary"
                    size="large"
                    @click="handleSubmitAddOrUpdate('formInline')"
                    >新增</Button
                >
            </div>
        </Modal>
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
import { confPageList, confDelete, conf } from '@/api/data'
import { getInfoConnect, getInfo } from '@/api/useSystem' // addConnect, cancelConnect,

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
      out_arr: '',
      inarr: '',
      total: 0,
      pageNum: 1,
      pageSize: 30,
      applicationName: '',
      applicationCode: '',
      contactPhone: '',
      contactEmails: '',
      modalEdit: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        applicationName: '',
        applicationCode: '',
        contactPhone: '',
        contactEmails: ''
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
    search () {
      console.log(this.formInline, 'formInline')
      // 点击查询按钮
      const date = {
        applicationName: this.applicationName,
        applicationCode: this.applicationCode,
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
      this.applicationName = null
      this.applicationCode = null
      this.contactPhone = null
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
              applicationName: this.formInline.applicationName,
              applicationCode: this.formInline.applicationCode,
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
              applicationName: this.formInline.applicationName,
              applicationCode: this.formInline.applicationCode,
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
      this.formInline.applicationName = this.confData[index].applicationName
      this.formInline.applicationCode = this.confData[index].applicationCode
      this.formInline.serviceModuleCode = this.confData[index].serviceModuleCode
      this.showType = 'edit'
      this.detailTitle = '编辑模块'
      this.modalEdit = true
    },
    cancelDelete () {
      // 取消删除
      this.modalDelete = false
    },
    handleSubmitDelete () {
      // 确认删除
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
      // 根据条件分页查询全部配置
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
        applicationCode: '',
        applicationName: '',
        currentPage: this.pageNum,
        pageSize: this.pageSize,
        serviceModuleCode: ''
      }
      getInfoConnect(info).then(res => {
        console.log(res)
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
      console.log(res)
    })
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
