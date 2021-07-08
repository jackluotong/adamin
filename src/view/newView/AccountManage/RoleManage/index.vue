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
      <span style="padding:10px" >角色名称</span>
      <Input v-model.trim="roleName" @on-enter="enter"/>
      <span style="padding:10px">角色code</span>
      <Input v-model.trim="roleCode" />
      <Button type="primary" icon="md-search" @click="search()" style="margin:0 10px 0 20px">查询</Button>
      <Button type="primary" icon="md-add" @click="addSetting()"
                v-show="permission.includes('account:role:add')"
            >新增</Button>
            <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)"
                v-show="permission.includes('account:role:edit')"
            >编辑</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="del(index)"
                v-show="permission.includes('account:role:delete')"
            >删除</Button>
          </div>
        </template>
     </Table>
     <Modal
     v-model.trim="modalAddOrUpdate"
     width="600"
     height="1000"
     v-bind:title="detailTitle"
     :closable='false'
     :mask-closable='false'
     class-name="vertical-center-modal">
      <Form ref="formInline" :model="formInline"  inline>
        <FormItem label="角色名称" prop="roleName" style="width:270px;">
          <Input v-model.trim="formInline.roleName"/>
        </FormItem>
        <FormItem label="角色code" prop="roleCode" style="display:none">
          <Input  v-model.trim="formInline.roleCode" :disabled='readOnly'/>
        </FormItem>
        <FormItem>
        <div style="width:280px">
         <el-tree
            v-model="getEl"
            icon-class='el-icon-caret-right'
            :data="treeData"
            show-checkbox
            node-key="authCode"
            :default-checked-keys="checkedData"
            :props="defaultProps"
            highlight-current
            ref="tree"
            empty-text='暂无权限列表'
            @check-change="getCheckedKeys"
            check-strictly
            >
            </el-tree>
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
import { getInfoRole, getAuthTree, editRole, deleteRole } from '@/api/data'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  data () {
    return {
      getEl: '',
      checkedData: [],
      expandedKeys: '',
      checkedKeys: '',
      defaultSelected: '',
      permission: sessionStorage.getItem('permission'),
      saveRoleCode: '',
      readOnly: false,
      saveRoleId: [],
      selectedValue: [],
      treeData: [],
      SHOW_PARENT,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      roleName: '',
      roleCode: '',
      modalAddOrUpdate: false,
      detailTitle: '',
      showType: '',
      modalDelete: false,
      formInline: {
        roleName: '',
        roleCode: '',
        confValue: '',
        confDescribtion: ''
      },
      confData: [],
      columns: [
        {
          type: 'index',
          width: 60,
          aligin: 'center'
        },
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
      defaultProps: {
        children: 'children',
        label: 'authName',
        key: 'authCode',
        value: 'authCode'
      }
    }
  },
  methods: {
    getCheckedKeys (e) {
    },
    reset () {
      this.roleName = null
      this.roleCode = null
    },
    enter () {
      this.renderPangeAgain()
    },
    renderPangeAgain () {
      const data = {
        roleName: this.roleName,
        roleCode: this.roleCode
      }
      getInfoRole(data).then(res => {
        const data = res.data.data
        const total = res.data.data.total
        this.renderPage(data, total)
      })
    },
    selected (checkedKeys) {
    },
    search () {
      const data = {
        roleName: this.roleName,
        roleCode: this.roleCode
      }
      getInfoRole(data).then(res => {
        const data = res.data.data
        const total = res.data.data.length
        this.renderPage(data, total)
      }).catch(err => console.log(err))
    },
    addSetting () {
      this.showType = 'add'
      this.detailTitle = '新增全局配置信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) {
      console.log(this.$refs.tree.getCheckedNodes())
      this.$refs[index].validate((valid) => {
        if (valid) {
          if (this.showType === 'edit') {
            const info = {
              roleName: this.formInline.roleName,
              roleCode: this.formInline.roleCode,
              roleId: this.saveRoleId,
              auths: this.$refs.tree.getCheckedNodes().map((item) => {
                return item.authCode
              })
            }
            console.log(info)
            editRole(info).then(res => {
              this.renderPangeAgain()
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalAddOrUpdate = false
              this.$refs[index].resetFields()
            }).catch(err => console.log(err))
          } else if (this.showType === 'add') {
            const info = {
              roleName: this.formInline.roleName,
              auths: this.$refs.tree.getCheckedNodes().map((item) => {
                return item.authCode
              })
            }
            editRole(info).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalAddOrUpdate = false
              this.renderPangeAgain()
              this.checkedData = []
              this.formInline.roleName = null
            }).catch(err => {
              console.log(err)
            })
          }
          this.$router.go(0)
        } else {
          this.$Message.error('请检查参数配置！')
        }
      })
    },
    cancelAddOrUpdate (name) {
      this.modalAddOrUpdate = false
      this.$router.go(0)
    },
    edit (index) {
      this.checkedData = null
      console.log(this.checkedData, this.confData[index], this.getEl)
      this.saveRoleId = this.confData[index].roleId
      this.checkedData = this.confData[index].auths.map((item) => {
        return item
      })
      console.log(this.confData[index])
      this.showType = 'edit'
      this.id = this.confData[index].id
      this.formInline.roleName = this.confData[index].roleName
      this.formInline.roleCode = this.confData[index].roleCode
      this.formInline.confValue = this.confData[index].confValue
      this.formInline.confDescribtion = this.confData[index].confDescribtion
      this.detailTitle = '修改全局配置信息'
      this.modalAddOrUpdate = true
      this.defaultSelected = ''
    },
    del (index) {
      this.modalDelete = true
      this.saveRoleCode = this.confData[index].roleCode
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      const info = this.saveRoleCode
      deleteRole(info).then(res => {
        this.$Message.success({
          content: res.data.message
        })
        this.renderPangeAgain()
      }).catch(err => console.log(err))
      this.modalDelete = false
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    }
  },
  created () {
    const data = {
      roleName: this.roleName,
      roleCode: this.roleCode,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
    getInfoRole(data).then(res => {
      const data = res.data.data
      const total = res.data.data.length
      this.renderPage(data, total)
    })
  },
  mounted () {
    getAuthTree().then(res => {
      this.treeData = res.data.data
    })
  },
  computed: {

  }
}
</script>
