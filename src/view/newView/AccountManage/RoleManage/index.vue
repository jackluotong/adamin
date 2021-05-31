<template>
  <div class="user-content">
    <h1 style="margin:10px 10px 10px 10px">账户管理-角色管理</h1>
    <div class="content-button" >
      <span style="padding:10px">角色名称</span>
      <Input v-model.trim="confName" />
      <span style="padding:10px">角色code</span>
      <Input v-model.trim="confKey" />
      <Button type="primary" icon="md-search" @click="search()" style="margin:0 10px 0 20px">查询</Button>
      <!-- <Button type="primary" icon="md-refresh" @click="reset()">重置</Button> -->
      <Button type="primary" icon="md-add" @click="addSetting()">新增配置</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
          </div>
        </template>
     </Table>
     <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem label="角色名称" prop="confName" style="width:270px;">
          <Input v-model.trim="formInline.confName"/>
        </FormItem>
        <FormItem label="角色code" prop="confKey" style="width:270px;">
          <Input  v-model.trim="formInline.confKey"/>
        </FormItem>
        <FormItem>
<div style="width:300px">
   <a-tree-select
    v-model="value"
    style="width: 100%"
    :tree-data="treeData"
    tree-checkable
    :show-checked-strategy="SHOW_PARENT"
    search-placeholder="Please select"
  />
</div>

        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
      </div>
     </Modal>
    <Modal v-model.trim="modalDelete" width="450" title="删除参数配置提示">
      <div >
        <p>确定删除该参数配置吗？</p>
      </div>
      <div slot="footer">
          <Button type="text" @click="cancelDelete" size="large">取消</Button>
          <Button type="primary" @click="handleSubmitDelete" size="large" >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { confPageList, confDelete, conf } from '@/api/data'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
const treeData = [
  {
    title: '账号管理',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: '角色管理',
        value: '0-0-0',
        key: '0-0-0',
        children: [
          {
            title: '添加',
            value: '0-0-1',
            key: '0-0-1'
          },
          {
            title: '编辑',
            value: '0-0-2',
            key: '0-0-2'
          }
        ]
      },
      {
        title: '权限管理',
        value: '0-1-0',
        key: '0-1-0'
      }
    ]
  }

]
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
    const validateConfName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入角色名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateConfKey = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入角色code'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    return {
      value: ['0-0-1'],
      treeData,
      SHOW_PARENT,
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      confName: '', // 参数名称
      confKey: '', // 参数键名
      modalAddOrUpdate: false, // 是否显示新增弹窗
      detailTitle: '', // 表单标题
      showType: '', // 表单展示类型（edit、add）
      modalDelete: false, // 是否显示删除提示弹窗
      formInline: { // 实体
        confName: '', // 参数名称
        confKey: '', // 参数键名
        confValue: '', // 参数键值
        confDescribtion: '' // 配置描述
      },
      ruleInline: {
        confName: [
          { required: true, validator: validateConfName, trigger: 'blur' }
        ],
        confKey: [
          { required: true, validator: validateConfKey, trigger: 'blur' }
        ]
      },
      confData: [ // 参数配置数据
        { confName: 'jack', confKey: '29' }
      ],
      columns: [
        {
          title: '角色名称',
          key: 'confName',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '角色code',
          key: 'confKey',
          width: 300,
          align: 'center'
        },
        // {
        //   title: '参数键值',
        //   key: 'confValue',
        //   align: 'center',
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', {
        //         style: {
        //           display: 'inline-block',
        //           width: '100%',
        //           overflow: 'hidden',
        //           textOverflow: 'ellipsis',
        //           whiteSpace: 'nowrap'
        //         },
        //         domProps: {
        //           title: params.row.confValue
        //         },
        //         on: {
        //           click: () => {
        //             // 识别逗号换行
        //             var text = params.row.confValue
        //             var reg = /[,，]/g
        //             text = text.replace(reg, ',<br>')
        //             this.$Modal.info({
        //               title: '参数键值',
        //               content: text
        //             })
        //           }
        //         }
        //       }, params.row.confValue)
        //     ])
        //   }
        // },
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
        'confName': this.confName,
        'confKey': this.confKey,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      confPageList(date).then(res => {
        // this.$Message['success']({
        //   background: true,
        //   content: res.data.data
        // })
        this.confData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    reset () { // 点击重置按钮
      this.confName = ''
      this.confKey = ''
      this.confValue = ''
      this.confDescribtion = ''
      this.pageNum = 1
      this.confPageList()
    },
    addSetting () { // 点击新增按钮
      this.showType = 'add'
      this.detailTitle = '新增全局配置信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) { // 点击提交新增按钮
      console.log(index)
      this.$refs[index].validate((valid) => {
        console.log(valid)
        if (valid) {
          if (this.showType === 'add') {
            const date = {
              'confName': this.formInline.confName,
              'confKey': this.formInline.confKey,
              'confValue': this.formInline.confValue,
              'confDescribtion': this.formInline.confDescribtion
            }
            conf(date).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalAddOrUpdate = false
              this.confPageList()
              this.$refs[index].resetFields()
            }).catch(err => {
              console.log(err)
            })
          } else if (this.showType === 'edit') {
            const date = {
              'id': this.id,
              'confName': this.formInline.confName,
              'confKey': this.formInline.confKey,
              'confValue': this.formInline.confValue,
              'confDescribtion': this.formInline.confDescribtion
            }
            conf(date).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.$refs['formInline'].resetFields()
              this.modalAddOrUpdate = false
              this.confPageList()
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
      this.id = this.confData[index].id
      this.formInline.confName = this.confData[index].confName
      this.formInline.confKey = this.confData[index].confKey
      this.formInline.confValue = this.confData[index].confValue
      this.formInline.confDescribtion = this.confData[index].confDescribtion
      this.showType = 'edit'
      this.detailTitle = '修改全局配置信息'
      this.modalAddOrUpdate = true
    },
    del (index) { // 提交删除按钮
      this.modalDelete = true
      this.id = this.confData[index].id
    },
    cancelDelete () { // 取消删除
      this.modalDelete = false
    },
    handleSubmitDelete () { // 确认删除
      confDelete(this.id).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.modalDelete = false
        this.confPageList()
      }).catch(err => {
        console.log(err)
      })
    },
    confPageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      confPageList(date).then(res => {
        this.confData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
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
.user-content{
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
