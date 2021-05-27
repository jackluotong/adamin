<template>
    <div class="user-content">
        <h1 style="margin:10px 10px 10px 10px">应用系统管理-应用系统管理</h1>
        <div class="content-button">
            <span style="padding:10px">应用名称</span>
            <Input v-model.trim="useName" />
            <span style="padding:10px">应用简称</span>
            <Input v-model.trim="useCalled" />
            <span style="padding:10px">阈值类型</span>
            <Select v-model="modelThreshld" style="width:200px">
                  <Option v-for="item in threlodList" :value="item.value" :key="item">{{ item.label }}</Option>
            </Select>
            <Button
                type="primary"
                icon="md-search"
                @click="search()"
                style="margin:0 10px 0 20px"
                >查询</Button
            >
            <Button type="primary" icon="md-add" @click="addSetting()"
                >新增阈值</Button
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
                     <!--  <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="lookWeight(index)"
                        >查看异常权重</Button
                    > -->
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
                        prop="useName"
                        style="width:270px;"
                    >
                        <Input v-model.trim="formInline.useName"/>
                    </FormItem>
                </div>
                <FormItem
                    label="应用简称"
                    prop="useCalled"
                    style="width:270px;"
                >
                     <Input v-model.trim="formInline.useCalled"/>
                </FormItem>
                <FormItem
                    label="次数阈值（每分钟）"
                    prop="thresholdCount"
                    style="width:270px;"
                >
                     <Input v-model.trim="formInline.thresholdCount"/>
                </FormItem>
                 <FormItem
                    label="阈值类型"
                    prop="thresholdType"
                    style="width:270px;"
                >
                <Select v-model.trim="formInline" style="width:200px">
                        <Option selected>{{ formInline.thresholdType }}</Option>
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
    const validateuseName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入参数名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateuseCalled = (rule, value, callback) => {
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
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      useName: '',
      useCalled: '',
      thresholdCount: '',
      thresholdType: '',
      modalEdit: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        useName: '',
        useCalled: '',
        confName: '',
        thresholdCount: '',
        thresholdType: ''
      },
      ruleInline: {
        useName: [
          {
            required: true,
            validator: validateuseName,
            trigger: 'blur'
          }
        ],
        useCalled: [
          {
            required: true,
            validator: validateuseCalled,
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
        { useName: 'OCR', useCalled: '29', confName: '1212321321321', thresholdCount: 121, thresholdType: 'type1' },
        { useName: '人脸识别', useCalled: '30', confName: '983127321', thresholdCount: 1121, thresholdType: 'type12' }
      ],
      columns: [
        {
          title: '应用名称',
          key: 'useName',
          tooltip: true,
          align: 'center'
        },
        {
          title: '应用简称',
          key: 'useCalled',
          align: 'center'
        },
        {
          title: '服务模块',
          key: 'confName',
          align: 'center'
        },
        {
          title: '次数阈值（每分钟）',
          key: 'thresholdCount',
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
        useName: this.useName,
        useCalled: this.useCalled,
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
      this.useName = null
      this.useCalled = null
      this.thresholdCount = null
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
              useName: this.formInline.useName,
              useCalled: this.formInline.useCalled,
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
              useName: this.formInline.useName,
              useCalled: this.formInline.useCalled,
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
      this.formInline.useName = this.confData[index].useName
      this.formInline.useCalled = this.confData[index].useCalled
      this.formInline.confName = this.confData[index].confName
      this.formInline.thresholdCount = this.confData[index].thresholdCount
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
