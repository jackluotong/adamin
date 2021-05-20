<template>
  <div class="user-content">
    <div class="content-button">
      <Input v-model.trim="dictName" placeholder="数据字典名称"/>
      <Input v-model.trim="dictCode" placeholder="数据字典编码"/>
      <Button type="primary" icon="md-search" @click="search()">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
      <Button type="primary" icon="md-add" @click="addSetting()">新增数据字典</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="dictionaryMainData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">修改</Button>
            <Button type="info" size="small" style="margin-right: 5px" @click="checkLog(index)">查看明细</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
          </div>
        </template>
     </Table>
     <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem label="数据字典名称" prop="dictName" style="width:270px;">
          <Input placeholder="请输入数据字典名称" v-model.trim="formInline.dictName"/>
        </FormItem>
        <FormItem label="数据字典编码" prop="dictCode" style="width:270px;">
          <Input placeholder="请输入数据字典编码" v-model.trim="formInline.dictCode"/>
        </FormItem>
        <FormItem label="数据字典描述" prop="dictDescription" style="width:100%;">
          <Input v-model.trim="formInline.dictDescription" type="textarea" :rows="3" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入数据字典描述"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">取消</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">确定</Button>
      </div>
     </Modal>
    <Modal v-model.trim="modalDelete" width="450" title="删除数据字典提示">
      <div >
        <p>确定删除该数据字典吗？</p>
      </div>
      <div slot="footer">
          <Button type="text" @click="cancelDelete" size="large">取消</Button>
          <Button type="primary" @click="handleSubmitDelete" size="large" >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { dictionaryMainPageList, dictionaryMainDelete, dictionaryMain } from '@/api/data'
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
    const validateDictName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入数据字典名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateDictCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入数据字典编码'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    const validateDictDescription = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入数据字典描述'))
      } else if (getByteLen(value) > 256) {
        callback(new Error('字符串长度不能超过256'))
      } else {
        callback()
      }
    }
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      dictName: '', // 数据字典名称
      dictCode: '', // 数据字典编码
      modalAddOrUpdate: false, // 是否显示新增弹窗
      detailTitle: '', // 表单标题
      showType: '', // 表单展示类型（edit、add）
      modalDelete: false, // 是否显示删除提示弹窗
      formInline: { // 实体
        dictName: '', // 数据字典名称
        dictCode: '', // 数据字典编码
        dictDescription: '' // 描述
      },
      ruleInline: {
        dictName: [
          { required: true, validator: validateDictName, trigger: 'blur' }
        ],
        dictCode: [
          { required: true, validator: validateDictCode, trigger: 'blur' }
        ],
        dictDescription: [
          { required: true, validator: validateDictDescription, trigger: 'blur' }
        ]
      },
      dictionaryMainData: [], // 数据字典数据
      columns: [
        {
          title: 'id',
          key: 'id',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '字典编码',
          key: 'dictCode',
          width: 300,
          align: 'center'
        },
        {
          title: '字典名称',
          key: 'dictName',
          width: 300,
          align: 'center'
        },
        {
          title: '字典描述',
          key: 'dictDescription',
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
    search () { // 点击查询按钮
      const date = {
        'dictName': this.dictName,
        'dictCode': this.dictCode,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      dictionaryMainPageList(date).then(res => {
        this.dictionaryMainData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    reset () { // 点击重置按钮
      this.dictName = ''
      this.dictCode = ''
      this.dictDescription = ''
      this.pageNum = 1
      this.dictionaryMainPageList()
    },
    addSetting () { // 点击新增按钮
      this.showType = 'add'
      this.detailTitle = '新增数据字典信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) { // 点击提交新增按钮
      this.$refs[index].validate((valid) => {
        if (valid) {
          if (this.showType === 'add') {
            const date = {
              'dictName': this.formInline.dictName,
              'dictCode': this.formInline.dictCode,
              'dictDescription': this.formInline.dictDescription
            }
            dictionaryMain(date).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalAddOrUpdate = false
              this.dictionaryMainPageList()
              this.$refs[index].resetFields()
            }).catch(err => {
              console.log(err)
            })
          } else if (this.showType === 'edit') {
            const date = {
              'id': this.id,
              'dictName': this.formInline.dictName,
              'dictCode': this.formInline.dictCode,
              'dictDescription': this.formInline.dictDescription
            }
            dictionaryMain(date).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.$refs['formInline'].resetFields()
              this.modalAddOrUpdate = false
              this.dictionaryMainPageList()
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
      this.id = this.dictionaryMainData[index].id
      this.formInline.dictName = this.dictionaryMainData[index].dictName
      this.formInline.dictCode = this.dictionaryMainData[index].dictCode
      this.formInline.dictDescription = this.dictionaryMainData[index].dictDescription
      this.showType = 'edit'
      this.detailTitle = '修改数据字典信息'
      this.modalAddOrUpdate = true
    },
    checkLog (index) { // 查看明细
      this.$router.push({
        name: 'dictDetail',
        params: {
          belongDictNo: this.dictionaryMainData[index].id,
          dictName: this.dictionaryMainData[index].dictName
        }
      })
    },
    del (index) { // 提交删除按钮
      this.modalDelete = true
      this.id = this.dictionaryMainData[index].id
    },
    cancelDelete () { // 取消删除
      this.modalDelete = false
    },
    handleSubmitDelete () { // 确认删除
      dictionaryMainDelete(this.id).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.modalDelete = false
        this.dictionaryMainPageList()
      }).catch(err => {
        console.log(err)
      })
    },
    dictionaryMainPageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      dictionaryMainPageList(date).then(res => {
        this.dictionaryMainData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.dictionaryMainPageList()
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
