<style lang="less" scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    // justify-content:flex-start;
    font-size: 14px;
    padding-left: 18px;
  }
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

<template>
  <div class="user-content">
    <h1 style="margin:10px 10px 10px 10px">账户管理-权限管理</h1>
    <div class="content-button" >
      <Button type="primary" icon="md-add" @click="addSetting()" >添加一级菜单</Button>
    </div>
   <div class="block">
            <el-tree
                :data="treeData"
                show-checkbox
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :props="defaultProps"
                @node-click="handleNodeClick"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                        <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-circle-plus"
                            @click="() => append(data)"
                        >
                            新增子级菜单
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-delete-solid"
                            @click="() => remove(node, data)"
                        >
                            删除
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-s-tools"
                            @click="() => editNode(node, data)"
                        >
                            编辑
                        </el-button>
                    </span>
                </span>
            </el-tree>
        </div>
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <div v-show="showType==='edit'?false:true">
        <FormItem label="AuthCode" prop="AuthCode" style="width:270px;">
          <Input v-model.trim="formInline.AuthCode"/>
        </FormItem>
        <FormItem label="AuthSeq" prop="AuthSeq" style="width:270px;">
          <Input  v-model.number="formInline.AuthSeq"/>
        </FormItem>
        <FormItem label="AuthLevel" prop="AuthLevel" style="width:270px;">
          <Input  v-model.number="formInline.AuthLevel"/>
        </FormItem>
         </div>
          <FormItem label="AuthName" prop="AuthName" style="width:270px;">
          <Input  v-model.trim="formInline.AuthName"/>
        </FormItem>
        <FormItem label="Url" prop="AuthLevel" style="width:270px;">
          <Input  v-model.number="formInline.Url"/>
        </FormItem>
        <FormItem label="Controller" prop="AuthLevel" style="width:270px;">
          <Input  v-model.number="formInline.Controller"/>
        </FormItem>
        <FormItem label="Method" prop="AuthLevel" style="width:270px;">
          <Input  v-model.number="formInline.Method"/>
        </FormItem>
        <FormItem label="AuthParentCode" prop="AuthParentCode" style="width:270px;" v-show="false">
          <Input  v-model.trim="formInline.AuthParentCode" />
        </FormItem>
        <FormItem>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="()=>{modalAddOrUpdate=false}">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
      </div>
     </Modal>
     <!-- delete -->
    <Modal v-model.trim="modalDelete" width="450" title="删除参数配置提示">
            <div>
                <p>确定删除该参数配置吗？</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="()=>{modalDelete=false}" size="large"
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
import { getAuthTree, createParent, deletePermission, editPermission } from '@/api/data'
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
    const validAuthCode = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入角色名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validAuthName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入角色code'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    const AuthSeq = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入角色code'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    const AuthParentCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入角色code'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    const AuthLevel = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入角色code'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    return {
      modalDelete: false,
      addNewModal: false,
      isShow: false,
      editInfoTitle: '',
      modalEdit: false,
      defaultProps: {
        label: 'authName'
      },
      treeData: [],
      AuthCode: '',
      AuthName: '',
      AuthSeq: '',
      AuthLevel: '',
      AuthParentCode: 0,
      modalAddOrUpdate: false,
      detailTitle: '',
      showType: '',
      formInline: {
        AuthCode: '',
        AuthName: '',
        AuthSeq: '',
        AuthLevel: '',
        AuthParentCode: '',
        Url: '',
        Controller: '',
        Method: '',
        id: ''
      },
      fatherCode: '',
      deleteId: '',
      ruleInline: {
        AuthCode: [
          { required: true, validator: validAuthCode, trigger: 'blur' }
        ],
        AuthName: [
          { required: true, validator: validAuthName, trigger: 'blur' }
        ],
        AuthSeq: [
          { required: true, validator: AuthSeq, trigger: 'blur' }
        ],
        AuthLevel: [
          { required: true, validator: AuthLevel, trigger: 'blur' }
        ],
        AuthParentCode: [
          { required: true, validator: AuthParentCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    editSave () {
      console.log()
    },
    handleNodeClick (e) {
      console.log(e)
      this.deleteId = e.authCode
      this.fatherCode = e.authCode
      this.formInline.AuthName = e.authName
      this.formInline.Controller = e.controller
      this.formInline.Url = e.url
      this.formInline.Method = e.method
      this.formInline.AuthCode = e.authCode
      this.formInline.AuthSeq = e.authSeq
      this.formInline.AuthLevel = e.authLevel
      this.formInline.id = e.id
    },
    toTree (data) {
      let treeData = []
      if (!Array.isArray(data)) return treeData

      data.forEach(item => {
        delete item.children
      })

      let map = {}
      data.forEach(item => {
        map[item.id] = item
      })

      data.forEach(item => {
        let parent = map[item.pid] // 判断item的pid是否是否存在map中
        if (parent) { // 如果存在则表示item不是最顶层的数据
          (parent.children || (parent.children = [])).push(item)
        } else {
          treeData.push(item) // 如果不存在 则是顶层数据
        }
      })
      return treeData
    },
    append (data) {
      this.modalAddOrUpdate = true
      this.showType = 'add son'
    },
    handleSubmitAdd () {

    },
    remove (node, data) {
      this.modalDelete = true
      /* const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1) */
    },
    editNode (node, data) {
      this.modalAddOrUpdate = true
      this.showType = 'edit'
      this.detailTitle = '编辑信息'
      console.log(node.childNodes.length, data.label)
    },
    addSetting () {
      this.showType = 'add'
      this.detailTitle = '新增全局配置信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate () {
      if (this.showType === 'add') {
        const info = {
          authCode: this.formInline.AuthCode,
          authName: this.formInline.AuthName,
          authSeq: this.formInline.AuthSeq,
          authLevel: this.formInline.AuthLevel,
          authParentCode: '0',
          url: this.formInline.Url,
          Controller: this.formInline.Controller,
          method: this.formInline.Method
        }
        createParent(info).then(res => {
          this.getAuthTree()
          this.$Message.success({
            content: res.data.message
          })
          this.modalAddOrUpdate = false
        })
      } else if (this.showType === 'add son') {
        const info = {
          authCode: this.formInline.AuthCode,
          authName: this.formInline.AuthName,
          authSeq: this.formInline.AuthSeq,
          authLevel: this.formInline.AuthLevel,
          authParentCode: this.fatherCode,
          url: this.formInline.Url,
          Controller: this.formInline.Controller,
          method: this.formInline.Method
        }
        console.log(info)
        createParent(info).then(res => {
          this.getAuthTree()
          this.$Message.success({
            content: res.data.message
          })
          this.modalAddOrUpdate = false
        })
      } else if (this.showType === 'edit') {
        const info = {
          id: this.formInline.id,
          authName: this.formInline.AuthName,
          url: this.formInline.Url,
          controller: this.formInline.Controller,
          method: this.formInline.Method
        }
        console.log(info, 'info')
        editPermission(info).then(res => {
          console.log(res)
          this.getAuthTree()
          this.$Message.success({
            content: res.data.message
          })
          this.modalAddOrUpdate = false
        })
      }
    },

    edit (index) {
      this.id = this.confData[index].id
      this.formInline.confName = this.confData[index].confName
      this.formInline.confKey = this.confData[index].confKey
      this.formInline.confValue = this.confData[index].confValue
      this.formInline.confDescribtion = this.confData[index].confDescribtion
      this.showType = 'edit'
      this.detailTitle = '修改全局配置信息'
      this.modalAddOrUpdate = true
    },
    del (index) {
      this.modalDelete = true
      this.id = this.confData[index].id
    },
    handleSubmitDelete () {
      console.log(this.deleteId)
      deletePermission(this.deleteId).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.modalDelete = false
        this.getAuthTree()
      }).catch(err => {
        console.log(err)
      })
    },
    getAuthTree () {
      getAuthTree().then(res => {
        console.log(res)
        this.treeData = JSON.parse(JSON.stringify(res.data.data))
      })
    }
  },
  created () {
    this.getAuthTree()
  }
}
</script>
