<template>
    <div class="user-content">
        <h1 style="margin:10px 10px 10px 10px">应用系统管理-应用关联服务管理</h1>
        <div style="display:flex">
            <span style="padding:10px">应用名称</span>
            <Input v-model.trim="applicationName" style="width:150px; margin-right:20px;"/>
            <span style="padding:10px">应用简称</span>
            <Input v-model.trim="applicationCode" style="width:150px; margin-right:20px;"/>
            <span style="padding:10px">服务模块</span>
            <Select v-model.trim="selectedModule" style="width:150px; margin-right:20px;" >
                <Option v-for="(item,index) in moduleOptions"
                :key="index"
                :value="item.serviceModuleCode">{{ item.serviceModule}}</Option>
            </Select>
            </div>
            <div style="display:flex">
 <Button
                type="primary"
                icon="md-search"
                @click="search()"
                style="margin:0 10px 0 20px"
                >查询</Button
            >
            <Button type="primary" icon="md-refresh" @click="reset()"  style="margin:0 10px 0 20px">重置</Button>
            <Button
            style="margin:0 10px 0 20px"
            type="primary"
            icon="md-add"
            @click="addSetting()"
            v-show="permission.includes('application:service:connect')"
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
                        v-show="permission.includes('application:service:cancel')"
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
            <Form ref="formInline" :model="formInline" >
                <div style="display:inline-table">
                    <FormItem
                        label="应用名称"
                        style="width:270px;"
                        prop="applicationName"
                    >
                         <Select v-model.trim="selectedAppName" style="width:200px" @on-change='selectedAppNameClick'>
                            <Option v-for="(item,id) in appData" :key="id" :value="item.applicationCode">
                                {{ item.applicationName}}
                            </Option>
                         </Select>
                    </FormItem>
                </div>
                <FormItem
                    label="应用简称"
                    style="width:270px;"
                    prop="applicationCode"
                >
                    <Select v-model.trim="selectedAppName" style="width:200px" @on-change='selectedAppNameClick'>
                            <Option v-for="(item,id) in appData" :key="id" :value="item.applicationCode">
                                {{ item.applicationCode}}
                            </Option>
                         </Select>
                </FormItem>
                <FormItem
                    label="服务模块"
                    style="width:270px;"
                    prop="applicationCode"
                >
            <Select v-model.trim="selectedModule" style="width:200px" @on-change='selectedModuleClick'>
                <Option v-for="(item,index) in moduleOptions"
                :key="index"
                :value="item.serviceModuleCode">{{ item.serviceModule}}</Option>
            </Select>
                </FormItem>
                <FormItem
                    label="服务类型"
                    style="width:270px;"
                    prop="serviceType"
                >
             <Select v-model.trim="selectedType" style="width:200px" >
                <Option v-for="(item,index) in typeOption"
                :key="index"
                :value="item.serviceTypeCode">{{ item.serviceType}}</Option>
            </Select>
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
import { serarchTypeByModule, inquireServiceModule } from '@/api/data'
import { getInfoConnect, getInfo, addConnect, cancelConnect } from '@/api/useSystem'

export default {
  data () {
    /*  function getByteLen (val) {
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
    } */
    /* const validateapplicationName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入参数名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    } */
    /* const validateapplicationCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参数键名'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    } */
    /* const validateConfValue = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参数键名'))
      } else {
        callback()
      }
    } */

    return {
      permission: sessionStorage.getItem('permission'),
      deleteId: '',
      selectedAppName: '',
      selectedModule: '',
      selectedType: '',
      moduleOptions: [],
      typeOption: [],
      appData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
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
        serviceType: [
          {
            required: true,
            message: '请输入选择类型',
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
          title: '服务类型',
          key: 'serviceType',
          width: 300,
          align: 'center'
        },
        {
          title: '操作',
          width: 300,
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    onpagesizechange (e) {
      this.pageSize = e

      const info = {// this.applicationCode, this.applicationName, this.selectedModule
        pageSize: e,
        currentPage: this.pageNum,
        applicationCode: this.applicationCode,
        applicationName: this.applicationName,
        serviceModuleCode: this.selectedModule
      }
      getInfoConnect(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e,
        applicationCode: this.applicationCode,
        applicationName: this.applicationName,
        serviceModuleCode: this.selectedModule
      }
      console.log(e)
      getInfoConnect(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    selectedAppNameClick (e) { },
    selectedModuleClick (e) {
      serarchTypeByModule(e).then(res => {
        this.typeOption = res.data.data
      }).catch(err => this.$Message.info(err))
    },
    search () {
      this.getInfo(this.applicationCode, this.applicationName, this.selectedModule)
    },
    reset () {
      this.applicationName = null
      this.applicationCode = null
      this.selectedModule = null
    },
    addSetting () {
      this.reset()
      this.showType = 'add'
      this.detailTitle = '新增服务关联'
      this.modalEdit = true
    },
    handleSubmitAddOrUpdate (index) {
      // 点击提交新增按钮
      this.$refs[index].validate(valid => {
        if (valid) {
          const info = {
            applicationCode: this.selectedAppName,
            serviceModuleCode: this.selectedModule,
            serviceTypeCode: this.selectedType
          }
          addConnect(info)
            .then(res => {
              this.getInfo()
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalEdit = false
              this.selectedAppName = null
              this.selectedModule = null
              this.selectedType = null
            })
            .catch(err => {
              console.log(err)
            })
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
    getInfo (code, name, serviceModuleCode) {
      const info = {
        applicationCode: code,
        applicationName: name,
        currentPage: this.pageNum,
        pageSize: this.pageSize,
        serviceModuleCode: serviceModuleCode
      }
      getInfoConnect(info).then(res => {
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
    })
    inquireServiceModule(info).then(res => {
      this.moduleOptions = res.data.data.records
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
