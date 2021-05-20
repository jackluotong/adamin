<template>
  <div class="user-content">
    <div class="content-button">
      <Input v-model.trim="enumName" placeholder="枚举名"/>
      <Input v-model.trim="enumValue" placeholder="枚举值"/>
      <Button type="primary" icon="md-search" @click="search()">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
      <Button type="primary" icon="md-add" @click="addSetting()">新增枚举</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="dictionaryDetailData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="dictName">
          <div>
            {{dictName}}
          </div>
        </template>
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">修改</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
          </div>
        </template>
     </Table>
     <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem label="枚举名" prop="enumName" style="width:270px;">
          <Input placeholder="请输入枚举名" v-model.trim="formInline.enumName"/>
        </FormItem>
        <FormItem label="枚举值" prop="enumValue" style="width:270px;">
          <Input placeholder="请输入枚举值" v-model.trim="formInline.enumValue"/>
        </FormItem>
        <FormItem label="排序" prop="dictOrder" style="width:270px;">
          <Input v-model.trim="formInline.dictOrder" placeholder="请输入排序"/>
        </FormItem>
        <FormItem label="数据字典明细描述" prop="description" style="width:100%;">
          <Input v-model.trim="formInline.description" type="textarea" :rows="3" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入数据字典明细描述"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">取消</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">确定</Button>
      </div>
     </Modal>
    <Modal v-model.trim="modalDelete" width="450" title="删除数据字典明细提示">
      <div >
        <p>确定删除该数据字典明细吗？</p>
      </div>
      <div slot="footer">
          <Button type="text" @click="cancelDelete" size="large">取消</Button>
          <Button type="primary" @click="handleSubmitDelete" size="large" >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { dictionaryDetailPageList, dictionaryDetailDelete, dictionaryDetail } from '@/api/data'
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
    const validateEnumName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入枚举名'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateEnumValue = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入枚举值'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    const validateDictOrder = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入排序'))
      } else {
        callback()
      }
    }
    const validateDescription = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入字典明细描述'))
      } else if (getByteLen(value) > 256) {
        callback(new Error('字符串长度不能超过256'))
      } else {
        callback()
      }
    }
    return {
      belongDictNo: this.$route.params.belongDictNo, // 所属数据字典主表id
      dictName: this.$route.params.dictName, // 数据字典名称
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      enumName: '', // 枚举名
      enumValue: '', // 枚举值
      modalAddOrUpdate: false, // 是否显示新增弹窗
      detailTitle: '', // 表单标题
      showType: '', // 表单展示类型（edit、add）
      modalDelete: false, // 是否显示删除提示弹窗
      formInline: { // 实体
        enumName: '', // 枚举名
        enumValue: '', // 枚举值
        dictOrder: '', // 排序
        description: '' // 描述
      },
      startOrSuspendSession: {
        isDisplay: '',
        id: ''
      },
      ruleInline: {
        enumName: [
          { required: true, validator: validateEnumName, trigger: 'blur' }
        ],
        enumValue: [
          { required: true, validator: validateEnumValue, trigger: 'blur' }
        ],
        dictOrder: [
          { required: true, validator: validateDictOrder, trigger: 'blur' }
        ],
        description: [
          { required: true, validator: validateDescription, trigger: 'blur' }
        ]
      },
      dictionaryDetailData: [], // 数据字典明细数据
      columns: [
        {
          title: 'id',
          key: 'id',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '所属数据字典名称',
          width: 300,
          slot: 'dictName',
          align: 'center'
        },
        {
          title: '枚举名',
          key: 'enumName',
          width: 200,
          align: 'center'
        },
        {
          title: '枚举值',
          key: 'enumValue',
          width: 200,
          align: 'center'
        },
        {
          title: '描述',
          key: 'description',
          width: 200,
          align: 'center'
        },
        {
          title: '排序',
          key: 'dictOrder',
          width: 100,
          align: 'center'
        },
        {
          title: '展示状态(否/是)',
          key: 'isDisplay',
          align: 'center',
          width: 140,
          render: (h, params) => { // 重点
            return h('i-switch', { // 按钮的话是：button自行替换
              props: { // 这里可以设置它的属性
                value: params.row.isDisplay === '1' // 设置它的值比如：true或false
                // disabled: !params.row.online 设置是否可以操作，变灰
              },
              on: { // 操作事件
                'on-change': (value) => { // 触发事件是on-change,用双引号括起来，
                  if (value === true) {
                    this.startOrSuspendSession.isDisplay = '1'
                  } else {
                    this.startOrSuspendSession.isDisplay = '0'
                  }
                  this.startOrSuspendSession.id = params.row.id
                  this.switch()
                }
              }
            })
          }
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
    search () { // 点击查询按钮
      const date = {
        'enumName': this.enumName,
        'enumValue': this.enumValue,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      dictionaryDetailPageList(date).then(res => {
        this.dictionaryDetailData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    reset () { // 点击重置按钮
      this.enumName = ''
      this.enumValue = ''
      this.dictOrder = ''
      this.description = ''
      this.pageNum = 1
      this.dictionaryDetailPageList()
    },
    addSetting () { // 点击新增按钮
      this.showType = 'add'
      this.detailTitle = '新增数据字典明细'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) { // 点击提交新增按钮
      this.$refs[index].validate((valid) => {
        if (valid) {
          if (this.showType === 'add') {
            const date = {
              'enumName': this.formInline.enumName,
              'enumValue': this.formInline.enumValue,
              'belongDictNo': this.belongDictNo,
              'dictOrder': this.formInline.dictOrder,
              'description': this.formInline.description
            }
            dictionaryDetail(date).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalAddOrUpdate = false
              this.dictionaryDetailPageList()
              this.$refs[index].resetFields()
            }).catch(err => {
              console.log(err)
            })
          } else if (this.showType === 'edit') {
            const date = {
              'id': this.id,
              'enumName': this.formInline.enumName,
              'enumValue': this.formInline.enumValue,
              'dictOrder': this.formInline.dictOrder,
              'description': this.formInline.description
            }
            dictionaryDetail(date).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.$refs['formInline'].resetFields()
              this.modalAddOrUpdate = false
              this.dictionaryDetailPageList()
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          this.$Message.error('请检查参数是否有误!')
        }
      })
    },
    cancelAddOrUpdate (name) { // 取消新增
      this.$refs[name].resetFields()
      this.modalAddOrUpdate = false
    },
    edit (index) { // 点击修改按钮
      this.id = this.dictionaryDetailData[index].id
      this.formInline.enumName = this.dictionaryDetailData[index].enumName
      this.formInline.enumValue = this.dictionaryDetailData[index].enumValue
      this.formInline.dictOrder = this.dictionaryDetailData[index].dictOrder
      this.formInline.description = this.dictionaryDetailData[index].description
      this.showType = 'edit'
      this.detailTitle = '修改数据字典明细'
      this.modalAddOrUpdate = true
    },
    del (index) { // 提交删除按钮
      this.modalDelete = true
      this.id = this.dictionaryDetailData[index].id
    },
    cancelDelete () { // 取消删除
      this.modalDelete = false
    },
    handleSubmitDelete () { // 确认删除
      dictionaryDetailDelete(this.id).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.modalDelete = false
        this.dictionaryDetailPageList()
      }).catch(err => {
        console.log(err)
      })
    },
    dictionaryDetailPageList () { // 根据条件分页查询全部配置
      const date = {
        'belongDictNo': this.belongDictNo,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      dictionaryDetailPageList(date).then(res => {
        this.dictionaryDetailData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    switch () {
      const date = {
        'id': this.startOrSuspendSession.id,
        'isDisplay': this.startOrSuspendSession.isDisplay
      }
      dictionaryDetail(date).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.dictionaryDetailPageList()
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.dictionaryDetailPageList()
  }
}
</script>
<style lang="less" scoped>
.user-content{
  .content-button {
    padding: 5px;
    .ivu-select-single {
      width: 150px;
    }
    .ivu-input-type {
      width: 150px;
      margin-left: 10px;
    }
    .ivu-btn{
      margin-left: 10px;
    }
    .ivu-btn-info{
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
