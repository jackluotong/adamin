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
            <Button type="primary" icon="md-add" @click="addSetting()">新增厂商</Button>
        </div>
        <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
            <template slot-scope="{ row, index }" slot="action">
                <div>
                    <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="editModule(index)"
                    >编辑模块</Button>
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
            v-model.trim="modalAddOrUpdate"
            width="600"
            :mask-closable="false"
            :closable="false"
            v-bind:title="detailTitle"
        >
            <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <FormItem label="服务模块" prop="manufacturerName" style="width:270px;">
                    <Input v-model.trim="formInline.manufacturerName" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button
                    type="primary"
                    size="large"
                    @click="handleSubmitAddOrUpdate('formInline')"
                >保存</Button>
                <Button
                    type="primary"
                    ghost
                    size="large"
                    @click="cancelAddOrUpdate('formInline')"
                >返回</Button>
            </div>
        </Modal>
        <Modal
            v-model.trim="modalAddOrUpdateType"
            width="600"
            :mask-closable="false"
            :closable="false"
            v-bind:title="detailTitle"
        >
            <Form ref="formInline" :model="formInline">
                <FormItem label="厂商名称" prop="manufacturerName" style="width:270px;">
                    <Input v-model.trim="formInline.confKey" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button
                    type="primary"
                    ghost
                    size="large"
                    @click="cancelAddOrUpdateType('formInline')"
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
    const validatemanufacturerName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入参数名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateConfKey = (rule, value, callback) => {
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
    const validateConfDescribtion = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入配置描述'))
      } else if (getByteLen(value) > 256) {
        callback(new Error('字符串长度不能超过256'))
      } else {
        callback()
      }
    }
    return {
      out_arr: '',
      inarr: '',
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      manufacturerName: '', // 参数名称
      confKey: '', // 参数键名
      confAddress: '', // 服务地址
      modalAddOrUpdate: false, // 是否显示新增弹窗
      modalAddOrUpdateType: false,
      detailTitle: '', // 表单标题
      showType: '', // 表单展示类型（edit、add）
      modalDelete: false, // 是否显示删除提示弹窗
      formInline: {
        manufacturerName: '',
        confKey: '',
        confAddress: ''
      },
      ruleInline: {
        manufacturerName: [
          {
            required: true,
            validator: validatemanufacturerName,
            trigger: 'blur'
          }
        ],
        confKey: [
          {
            required: true,
            validator: validateConfKey,
            trigger: 'blur'
          }
        ],
        confValue: [
          {
            required: true,
            validator: validateConfValue,
            trigger: 'blur'
          }
        ],
        confDescribtion: [
          {
            required: true,
            validator: validateConfDescribtion,
            trigger: 'blur'
          }
        ]
      },
      confData: [
        // 参数配置数据
        { manufacturerName: 'OCR', confKey: '29', confAddress: 'SHANGHAI' },
        { manufacturerName: '人脸识别', confKey: '30', confAddress: 'BEIJING' }
      ],
      columns: [
        {
          title: '厂商名称',
          key: 'manufacturerName',
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
    search () {
      // 点击查询按钮
      const date = {
        manufacturerName: this.manufacturerName,
        confKey: this.confKey,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      confPageList(date)
        .then((res) => {
          // this.$Message['success']({
          //   background: true,
          //   content: res.data.data
          // })
          this.confData = res.data.data.resultList
          this.total = res.data.data.totalAmount
        })
        .catch((err) => {
          console.log(err)
        })
    },
    reset () {
      // 点击重置按钮
      this.manufacturerName = null
      this.confKey = null
      this.confAddress = null
    },
    addSetting () {
      // 点击新增按钮
      this.reset()
      this.showType = 'add'
      this.detailTitle = '新增厂商'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) {
      // 点击提交新增按钮
      console.log(index)
      this.$refs[index].validate((valid) => {
        console.log(valid)
        if (valid) {
          if (this.showType === 'add') {
            const date = {
              manufacturerName: this.formInline.manufacturerName,
              confKey: this.formInline.confKey,
              confValue: this.formInline.confValue,
              confDescribtion: this.formInline.confDescribtion
            }
            conf(date)
              .then((res) => {
                this.$Message['success']({
                  background: true,
                  content: res.data.message
                })
                this.modalAddOrUpdate = false
                this.confPageList()
                this.$refs[index].resetFields()
              })
              .catch((err) => {
                console.log(err)
              })
          } else if (this.showType === 'edit') {
            const date = {
              id: this.id,
              manufacturerName: this.formInline.manufacturerName,
              confKey: this.formInline.confKey,
              confValue: this.formInline.confValue,
              confDescribtion: this.formInline.confDescribtion
            }
            conf(date)
              .then((res) => {
                this.$Message['success']({
                  background: true,
                  content: res.data.message
                })
                this.$refs['formInline'].resetFields()
                this.modalAddOrUpdate = false
                this.confPageList()
              })
              .catch((err) => {
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
      this.modalAddOrUpdate = false
    },
    cancelAddOrUpdateType () {
      this.modalAddOrUpdateType = false
    },
    editModule (index) {
      // 点击修改按钮
      this.id = this.confData[index].id
      this.formInline.manufacturerName = this.confData[index].manufacturerName
      this.showType = 'edit'
      this.detailTitle = '编辑模块'
      this.modalAddOrUpdate = true
    },
    cancelDelete () {
      // 取消删除
      this.modalDelete = false
    },
    handleSubmitDelete () {
      // 确认删除
      confDelete(this.id)
        .then((res) => {
          this.$Message['success']({
            background: true,
            content: res.data.message
          })
          this.modalDelete = false
          this.confPageList()
        })
        .catch((err) => {
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
        .then((res) => {
          this.confData = res.data.data.resultList
          this.total = res.data.data.totalAmount
        })
        .catch((err) => {
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
