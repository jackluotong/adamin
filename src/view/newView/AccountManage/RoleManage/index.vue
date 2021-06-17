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

<template>
  <div class="user-content">
    <h1 style="margin:10px 10px 10px 10px">账户管理-角色管理</h1>
    <div class="content-button" >
      <span style="padding:10px">角色名称</span>
      <Input v-model.trim="roleName" />
      <span style="padding:10px">角色code</span>
      <Input v-model.trim="roleCode" />
      <Button type="primary" icon="md-search" @click="search()" style="margin:0 10px 0 20px">查询</Button>
      <Button type="primary" icon="md-add" @click="addSetting()">新增</Button>
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
        <FormItem label="角色名称" prop="roleName" style="width:270px;">
          <Input v-model.trim="formInline.roleName"/>
        </FormItem>
        <FormItem label="角色code" prop="roleCode" style="display:none">
          <Input  v-model.trim="formInline.roleCode" :disabled='readOnly'/>
        </FormItem>
        <FormItem>
        <div style="width:400px">
        <a-tree-select
            v-model="selectedValue"
            style="width: 100%"
            :tree-data="treeData"
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            search-placeholder="Please select"
            :replaceFields='replaceFields'
            @select="selected"
            placeholder='请选择'
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
import { confPageList, getInfoRole, getAuthTree, editRole, deleteRole } from '@/api/data'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
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
    const validateroleName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入角色名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    return {
      saveRoleCode: '',
      readOnly: false,
      saveRoleId: [],
      selectedValue: [],
      treeData: [],
      SHOW_PARENT,
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      roleName: '', // 参数名称
      roleCode: '', // 参数键名
      modalAddOrUpdate: false, // 是否显示新增弹窗
      detailTitle: '', // 表单标题
      showType: '', // 表单展示类型（edit、add）
      modalDelete: false, // 是否显示删除提示弹窗
      formInline: { // 实体
        roleName: '', // 参数名称
        roleCode: '', // 参数键名
        confValue: '', // 参数键值
        confDescribtion: '' // 配置描述
      },
      ruleInline: {
        roleName: [
          { required: true, validator: validateroleName, trigger: 'blur' }
        ]
      },
      confData: [], // 参数配置数据

      columns: [
        {
          title: '角色名称',
          key: 'roleName',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '角色code',
          key: 'roleCode',
          width: 300,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      replaceFields: {
        children: 'children',
        title: 'authName',
        key: 'id',
        value: 'authCode' }

    }
  },
  methods: {
    renderPangeAgain () {
      const data = {
        roleName: this.roleName,
        roleCode: this.roleCode
      }
      getInfoRole(data).then(res => {
        const data = res.data.data.records
        this.$nextTick(
          function () {
            this.renderPage(data)
          })
      })
    },
    selected (e) {
      console.log(e, this.selectedValue)
    },
    search () {
      const data = {
        roleName: this.roleName,
        roleCode: this.roleCode
      }
      getInfoRole(data).then(res => {
        const data = res.data.data.records
        // const total = res.data.data.total
        this.$nextTick(() => {
          this.renderPage(data)
        })
        console.log(res)
      }).catch(err => console.log(err))
    },
    addSetting () {
      this.showType = 'add'
      this.detailTitle = '新增全局配置信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) {
      console.log(this.saveRoleId, 'saveRoleId')
      this.$refs[index].validate((valid) => {
        if (valid) {
          if (this.showType === 'edit') {
            const info = {
              'roleName': this.formInline.roleName,
              'roleCode': this.formInline.roleCode,
              'roleId': this.saveRoleId,
              'authCode': this.selectedValue
            }
            editRole(info).then(res => {
              this.$Message['success']({
                background: true
              })
              this.modalAddOrUpdate = false

              this.$refs[index].resetFields()
            }).catch(err => console.log(err))
          } else if (this.showType === 'add') {
            const info = {
              'roleName': this.formInline.roleName,
              'authCode': this.selectedValue
            }
            editRole(info).then(res => {
              this.modalAddOrUpdate = false
              this.renderPangeAgain()
            //   this.$refs[index].resetFields()
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          this.$Message.error('请检查参数配置！')
        }
      })
    },
    cancelAddOrUpdate (name) { // 取消新增
      this.$refs[name].resetFields()
      this.modalAddOrUpdate = false
    },
    edit (index) {
      this.saveRoleId = this.confData[index].roleId
      this.showType = 'edit'
      this.id = this.confData[index].id
      this.formInline.roleName = this.confData[index].roleName
      this.formInline.roleCode = this.confData[index].roleCode
      this.formInline.confValue = this.confData[index].confValue
      this.formInline.confDescribtion = this.confData[index].confDescribtion
      this.detailTitle = '修改全局配置信息'
      this.modalAddOrUpdate = true
    },
    del (index) {
      this.modalDelete = true
      this.saveRoleCode = this.confData[index].roleCode
    //   console.log(this.saveRoleCode)
    },
    cancelDelete () { // 取消删除
      this.modalDelete = false
    },
    handleSubmitDelete () {
      const info = this.saveRoleCode
      deleteRole(info).then(res => {
        this.renderPangeAgain()
      }).catch(err => console.log(err))
      this.modalDelete = false
    },
    confPageList () {
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
    },
    renderPage (data) {
      this.confData = data
    }
  },
  created () {
    const data = {
      roleName: this.roleName,
      roleCode: this.roleCode
    }
    getInfoRole(data).then(res => {
      const data = res.data.data
      this.renderPage(data)
    })
  },
  mounted () {
    getAuthTree().then(res => {
      this.treeData = res.data.data
      console.log(res.data.data, 'authTree')
    })
  }
}
</script>
