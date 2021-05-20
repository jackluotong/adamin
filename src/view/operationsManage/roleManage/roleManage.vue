<template>
  <div class="user-content">
    <div class="content-button">
      <Input v-model.trim="roleCode" placeholder="角色Code"/>
      <Button type="primary" icon="md-search" @click="search()">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
      <Button type="primary" icon="md-add" @click="addSetting()">新增角色</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="authRoleData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="info" size="small" style="margin-right: 5px" @click="edit(index)">修改</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
            <Button type="warning" size="small" style="margin-right: 5px" @click="permission(index)">权限配置</Button>
          </div>
        </template>
     </Table>
     <Page @on-change="changePage" @on-page-size-change="ageSizeChange" :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100" style="margin-left:20%;">
        <FormItem label="角色描述" prop="roleDesc" style="width:270px;">
          <Input placeholder="请输入角色描述" v-model.trim="formInline.roleDesc"/>
        </FormItem>
        <FormItem label="角色Code" prop="roleCode" style="width:270px;">
          <Input placeholder="请输入角色Code" v-model.trim="formInline.roleCode"/>
        </FormItem>
        <FormItem label="角色类型" prop="roleType" style="width:270px;">
          <Input placeholder="请输入角色类型" v-model.trim="formInline.roleType"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">取消</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">确定</Button>
      </div>
     </Modal>
    <Modal v-model.trim="modalDelete" width="450" title="删除角色信息提示">
      <div >
        <p>确定删除该角色吗？</p>
      </div>
      <div slot="footer">
          <Button type="text" @click="cancelDelete" size="large">取消</Button>
          <Button type="primary" @click="handleSubmitDelete" size="large" >确定</Button>
      </div>
    </Modal>
    <Drawer
        title="角色—菜单权限配置"
        v-model="drawerShow"
        width="720"
        :mask-closable="false"
    >
      <RadioGroup v-model.trim="deviceType" type="button">
          <Radio label="iPhone" :disabled="NotAllowedplatformEdit">iPhone</Radio>
          <Radio label="iPad" :disabled="NotAllowedplatformEdit">iPad</Radio>
          <Radio label="Android" :disabled="NotAllowedplatformEdit">Android</Radio>
          <Radio label="AndroidPad" :disabled="NotAllowedplatformEdit">Android Pad</Radio>
      </RadioGroup>
      <Tree :data="authMenuInfoList" ref="tree" show-checkbox multiple check-strictly @on-check-change="choiceAll"></Tree>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="canclePermission">取消</Button>
        <Button type="primary" @click="handleSubmitPermission">提交</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { authRolePageList, authRoleDelete, updateRoleMenu, authRoleEnable, authRoleDisable, selectMenuInfoByRoleCode } from '@/api/data'
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
    const validateRoleCode = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入角色Code'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateRoleType = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    const validateRoleDesc = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入角色描述'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      roleDesc: '', // 角色描述
      roleCode: '', // 角色Code
      deviceType: 'pad',
      NotAllowedplatformEdit: false,
      modalAddOrUpdate: false, // 是否显示弹窗
      modalDelete: false, // 是否显示删除提示弹窗
      visible: false, // 图片预览弹框控制
      drawerShow: false, // 抽屉展示
      isValid: '', // 开启/暂停
      detailTitle: '', // 表单标题
      showType: '', // 表单展示类型（edit、add）
      menuInfoRequest: {
        roleCode: '',
        deviceType: ''
      },
      authMenuInfoList: [],
      roleMenuReqDTO: {
        roleCode: '',
        authMenuInfoDTOS: []
      },
      formInline: { // 实体
        roleDesc: '', // 角色描述
        roleCode: '', // 角色Code
        roleType: '' // 角色类型
      },
      startOrSuspendSession: {
        isValid: '',
        id: ''
      },
      ruleInline: {
        roleCode: [
          { required: true, validator: validateRoleCode, trigger: 'blur' }
        ],
        roleType: [
          { required: true, validator: validateRoleType, trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, validator: validateRoleDesc, trigger: 'blur' }
        ]
      },
      authRoleData: [ // 参数配置数据

      ],
      columns: [
        {
          id: '11',
          title: 'id',
          key: 'id',
          tooltip: true,
          width: 250,
          align: 'center'
        },
        {
          title: '角色code',
          key: 'roleCode',
          width: 250,
          align: 'center'
        },
        {
          title: '角色类型',
          key: 'roleType',
          width: 250,
          align: 'center'
        },
        {
          title: '角色描述',
          key: 'roleDesc',
          width: 300,
          align: 'center'
        },
        {
          title: '状态(停用/启用)',
          key: 'isValid',
          align: 'center',
          width: 200,
          render: (h, params) => { // 重点
            return h('i-switch', { // 按钮的话是：button自行替换
              props: { // 这里可以设置它的属性
                value: params.row.isValid === '1' // 设置它的值比如：true或false
                // disabled: !params.row.online 设置是否可以操作，变灰
              },
              on: { // 操作事件
                'on-change': (value) => { // 触发事件是on-change,用双引号括起来，
                  if (value === true) {
                    this.startOrSuspendSession.isValid = '1'
                  } else {
                    this.startOrSuspendSession.isValid = '0'
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
        'roleDesc': this.roleDesc,
        'roleCode': this.roleCode,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      authRolePageList(date).then(res => {
        // this.$Message['success']({
        //   background: true,
        //   content: res.data.data
        // })
        this.authRoleData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    reset () { // 点击重置按钮
      this.roleDesc = ''
      this.roleCode = ''
      this.pageNum = 1
      this.authRolePageList()
    },
    addSetting () { // 点击新增按钮
      this.showType = 'add'
      this.detailTitle = '新增用户信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) { // 点击提交新增或更新按钮
      this.roleMenuReqDTO.roleCode = this.authRoleData[index].roleCode
      updateRoleMenu(this.roleMenuReqDTO).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        if (res.data.code === '000') {
          this.drawerShow = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    cancelAddOrUpdate (name) { // 取消新增
      this.$refs[name].resetFields()
      this.modalAddOrUpdate = false
    },
    permission (index) { // 权限配置按钮触发抽屉
      this.drawerShow = true
      this.menuInfoRequest.roleCode = this.authRoleData[index].roleCode
      this.menuInfoRequest.deviceType = 'pad'
      selectMenuInfoByRoleCode(this.menuInfoRequest).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.authMenuInfoList = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    canclePermission () { // 取消权限配置
      this.drawerShow = false
    },
    handleSubmitPermission () { // 提交权限配置
      console.log(this.$refs.tree.getCheckedNodes())
    },
    edit (index) { // 点击修改按钮
      this.id = this.authRoleData[index].id
      this.formInline.roleDesc = this.authRoleData[index].roleDesc
      this.formInline.roleCode = this.authRoleData[index].roleCode
      this.formInline.roleType = this.authRoleData[index].roleType
      this.showType = 'edit'
      this.detailTitle = '修改角色信息'
      this.modalAddOrUpdate = true
    },
    del (index) { // 提交删除按钮
      this.modalDelete = true
      this.id = this.authRoleData[index].id
    },
    cancelDelete () { // 取消删除
      this.modalDelete = false
    },
    handleSubmitDelete () { // 确认删除
      authRoleDelete(this.id).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.modalDelete = false
        this.authRolePageList()
      }).catch(err => {
        console.log(err)
      })
    },
    authRolePageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      authRolePageList(date).then(res => {
        this.authRoleData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    changePage (date) {
      this.pageNum = date
      this.authRolePageList()
    },
    ageSizeChange (date) {
      this.pageNum = 1
      this.pageSize = date
      this.authRolePageList()
    },
    switch () {
      // 打开是true
      this.updateFeedbackMessage()
    },
    updateFeedbackMessage () { // 点击更新状态按钮
      if (this.startOrSuspendSession.isValid === '1') { // 置为生效
        authRoleEnable(this.startOrSuspendSession.id).then(res => {
          this.authRolePageList()
        }).catch(err => {
          console.log(err)
        })
      } else { // 置为失效
        authRoleDisable(this.startOrSuspendSession.id).then(res => {
          this.authRolePageList()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    choiceAll (data) {
      console.log(data)
      this.roleMenuReqDTO.authMenuInfoDTOS = this.$refs.tree.getCheckedAndIndeterminateNodes() // 方法的运用 getSelectedNodes也是如此用法
    }
  },
  created () {
    this.authRolePageList()
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
.demo-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
</style>
