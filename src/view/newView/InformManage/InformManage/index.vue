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
                <div style="display:inline-table">
                    <FormItem
                        label="通知类型"
                        prop="informType"
                        style="width:270px;"
                    >
                        <Select v-model.trim="formInline" style="width:200px" >
                                  <Option selected>{{formInline.informType}}</Option>
                         </Select>
                    </FormItem>
                </div>
                <FormItem
                    label="场景"
                    prop="scene"
                    style="width:270px;"
                >
                     <Input v-model.trim="formInline.scene"/>
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
                    prop="messageReciver"
                    style="width:270px;"
                >
                     <Input v-model.trim="formInline.messageReciver"/>
                </FormItem>
                <FormItem
                    label="邮件收件人"
                    prop="emailReciver"
                    style="width:270px;"
                >
                     <Input v-model.trim="formInline.emailReciver"/>
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
import { confPageList, confDelete, conf } from '@/api/data'

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
    const validateinformType = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入参数名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validatescene = (rule, value, callback) => {
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
      modelThreshld: '',
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      informType: '',
      scene: '',
      content: '',
      thresholdType: '',
      modalEdit: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        informType: '',
        scene: '',
        confName: '',
        content: '',
        thresholdType: ''
      },
      ruleInline: {
        informType: [
          {
            required: true,
            validator: validateinformType,
            trigger: 'blur'
          }
        ],
        scene: [
          {
            required: true,
            validator: validatescene,
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
      confData: [
        // 参数配置数据
        { informType: 'OCR', scene: '29', confName: '1212321321321', content: 121, thresholdType: 'type1' },
        { informType: '人脸识别', scene: '30', confName: '983127321', content: 1121, thresholdType: 'type12' }
      ],
      columns: [
        {
          title: '应用名称',
          key: 'informType',
          tooltip: true,
          align: 'center'
        },
        {
          title: '应用简称',
          key: 'scene',
          align: 'center'
        },
        {
          title: '服务模块',
          key: 'confName',
          align: 'center'
        },
        {
          title: '次数阈值（每分钟）',
          key: 'content',
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
        }
      ]
    }
  },
  methods: {
    search () {
      console.log(this.formInline, 'formInline')
      // 点击查询按钮
      const date = {
        informType: this.informType,
        scene: this.scene,
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
      this.informType = null
      this.scene = null
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
              informType: this.formInline.informType,
              scene: this.formInline.scene,
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
              informType: this.formInline.informType,
              scene: this.formInline.scene,
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
      this.formInline.informType = this.confData[index].informType
      this.formInline.scene = this.confData[index].scene
      this.formInline.confName = this.confData[index].confName
      this.formInline.content = this.confData[index].content
      this.formInline.thresholdType = this.confData[index].thresholdType
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
    }
  },
  created () {
    this.confPageList()
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
