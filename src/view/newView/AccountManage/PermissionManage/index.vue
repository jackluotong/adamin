<template>
  <div class="user-content">
    <h1 style="margin:10px 10px 10px 10px">账户管理-权限管理</h1>
    <div class="content-button" >
      <Button type="primary" icon="md-add" @click="addSetting()">添加一级菜单</Button>
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
    <Modal v-model.trim="modalEdit" :closable="false" :title="editInfoTitle">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem label="AuthCode" prop="AuthCode" style="width:270px;">
          <Input v-model.trim="formInline.AuthCode"/>
        </FormItem>
    </Form>
    <div slot="footer">
        <Button type="primary" ghost size="large" @click="editCancel('formInline')">返回</Button>
        <Button type="primary" size="large" @click="editSave('formInline')">保存</Button>
      </div>
    </Modal>
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem label="AuthCode" prop="AuthCode" style="width:270px;">
          <Input v-model.trim="formInline.AuthCode"/>
        </FormItem>
        <FormItem label="AuthName" prop="AuthName" style="width:270px;">
          <Input  v-model.trim="formInline.AuthName"/>
        </FormItem>
        <FormItem label="AuthSeq" prop="AuthSeq" style="width:270px;">
          <Input  v-model.trim="formInline.AuthSeq"/>
        </FormItem>
        <FormItem label="AuthLevel" prop="AuthLevel" style="width:270px;">
          <Input  v-model.trim="formInline.AuthLevel"/>
        </FormItem>
        <FormItem label="AuthParentCode" prop="AuthParentCode" style="width:270px;">
          <Input  v-model.trim="formInline.AuthParentCode" readonly/>
        </FormItem>
        <FormItem>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
      </div>
     </Modal>
  </div>
</template>

<script>
import { confPageList, confDelete, conf, getAuthTree, createParent } from '@/api/data'
let id = 1000
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
      editInfoTitle: '',
      modalEdit: false,
      defaultProps: {
        label: 'authName'
      },
      treeData: [], //  JSON.parse(JSON.stringify(data)),
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
        AuthParentCode: 0
      },
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
    /*
        for edit modal functions
      */
    // #region
    editCancel () {
      this.modalEdit = false
    },
    editSave () {
      console.log()
    },
    handleNodeClick (e) {
      console.log(e)
    },
    toTree (data) {
      debugger
      let treeData = []
      if (!Array.isArray(data)) return treeData

      data.forEach(item => {
        delete item.children // 删除item下的children，以防多次调用
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
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
    },
    editNode (node, data) {
      this.modalEdit = true
      this.editInfoTitle = '编辑信息'
      console.log(node.childNodes.length, data.label)
    },
    // #endregion
    search () {
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
    reset () {
      this.confName = ''
      this.confKey = ''
      this.confValue = ''
      this.confDescribtion = ''
      this.pageNum = 1
      this.confPageList()
    },
    addSetting () {
      this.showType = 'add'
      this.detailTitle = '新增全局配置信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) {
      /*
            save add info for tree
        */
      const info = {
        'authCode': this.AuthCode,
        'authName': this.AuthName,
        'authSeq': this.AuthSeq,
        'authLevel': this.AuthLevel,
        'authParentCode': '0'
      }
      console.log(info)
      createParent(info).then(res => console.log(res))
      const data = [
        { AuthCode: this.formInline.AuthCode, AuthName: this.formInline.AuthName, AuthSeq: this.formInline.AuthSeq, AuthLevel: this.formInline.AuthLevel, AuthParentCode: this.formInline.AuthParentCode }
      ]
      console.log(this.toTree(data))
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
    cancelAddOrUpdate (name) {
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
    getAuthTree().then(res => {
      console.log(res)
      this.treeData = JSON.parse(JSON.stringify(res.data.data))
    })
  }
}
</script>
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
