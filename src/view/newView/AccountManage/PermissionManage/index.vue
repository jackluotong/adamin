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
      <Button type="primary" icon="md-add" @click="addSetting()"
            v-show="permission.includes('account:auth:addFather')"
                >添加一级菜单</Button>
    </div>
   <div class="block">
            <el-tree
                :data="treeData"
                show-checkbox
                node-key="id"
                :default-expand-all="false"
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
                            v-show="permission.includes('account:auth:addSon')"

                        >
                            新增子级菜单
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-delete-solid"
                            @click="() => remove(node, data)"
                            v-show="permission.includes('account:auth:delete')"

                        >
                            删除
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-s-tools"
                            @click="() => editNode(node, data)"
                            v-show="permission.includes('account:auth:edit')"

                        >
                            编辑
                        </el-button>
                    </span>
                </span>
            </el-tree>
        </div>
     <Modal
     v-model.trim="modalAddOrUpdate"
     width="600"
     :mask-closable="false"
     :closable="false"
     v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline"  inline>
        <div v-show="showType==='edit'?false:true">
        <FormItem label="权限编码" prop="AuthCode" style="width:270px;">
          <Input v-model.trim="formInline.AuthCode"/>
        </FormItem>
        <FormItem label="权限顺序" prop="AuthSeq" style="width:270px;">
          <Input  v-model.number="formInline.AuthSeq"/>
        </FormItem>
        <FormItem label="权限等级" prop="AuthLevel" style="width:270px;">
          <Input  v-model.trim="formInline.AuthLevel"/>
        </FormItem>
         </div>
          <FormItem label="权限名称" prop="AuthName" style="width:270px;">
          <Input  v-model.trim="formInline.AuthName"/>
        </FormItem>
        <FormItem label="地址" prop="Url" style="width:270px;">
          <Input  v-model.trim="formInline.Url"/>
        </FormItem>
        <FormItem label="控制中心" prop="Controller" style="width:270px;">
          <Input  v-model.trim="formInline.Controller"/>
        </FormItem>
        <FormItem label="方法" prop="Method" style="width:270px;">
          <Input  v-model.trim="formInline.Method"/>
        </FormItem>
        <FormItem label="AuthParentCode" prop="AuthParentCode" style="width:270px;" v-show="false">
          <Input  v-model.trim="formInline.AuthParentCode" />
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
    return {
      mail: '',
      permission: sessionStorage.getItem('permission'),
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
          { required: true, message: '请输入权限编码' }
        ],
        AuthName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        AuthSeq: [
          { required: true, trigger: 'blur', type: 'number', message: '请以数字形式输入权限序号' }
        ],
        AuthLevel: [
          { required: true, trigger: 'blur', type: 'number', message: '请以数字形式输入权限等级（1,2,3）' }
        ]
        /*  AuthParentCode: [
          { required: true, validator: AuthParentCode, trigger: 'blur' }
        ] */
      }
    }
  },
  methods: {
    editSave () {
    },
    handleNodeClick (e) {
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
      this.claer(this.formInline)
      this.showType = 'add son'
      if (data.authLevel === 3) {
        this.$Message.error('最多可以添加三级！')
        this.modalAddOrUpdate = false
      } else {
        this.modalAddOrUpdate = true
      }
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
    },
    claer (obj) {
      for (let key in obj) {
        delete obj[key]
      }
    },
    addSetting () {
      this.claer(this.formInline)
      this.showType = 'add'
      this.detailTitle = '新增全局配置信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) {
      this.$refs[index].validate((valid) => {
        if (valid) {
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
            editPermission(info).then(res => {
              this.getAuthTree()
              this.$Message.success({
                content: res.data.message
              })
              this.modalAddOrUpdate = false
            })
          }
        } else {
          this.$Message.info('请输入正确的参数！')
        }
      })
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
        this.treeData = JSON.parse(JSON.stringify(res.data.data))
      })
    }
  },
  created () {
    this.getAuthTree()
  }
}
</script>
