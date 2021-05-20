<template>
  <div class="user-content">
    <div class="content-button">
      <Input v-model.trim="userName" placeholder="登录账号"/>
      <Input v-model.trim="nickName" placeholder="用户名"/>
      <Button type="primary" icon="md-search" @click="search()">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
      <Button type="primary" icon="md-add" @click="addSetting()">新增用户</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="userInfoAdminData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">修改</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
          </div>
        </template>
     </Table>
     <Page @on-change="changePage" @on-page-size-change="ageSizeChange" :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
     <Modal v-model.trim="modalAddOrUpdate" width="600" :mask-closable="false" :closable="false" v-bind:title="detailTitle">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100" style="margin-left:20%;">
        <FormItem label="用户类型" prop="access" style="width:270px;">
          <CheckboxGroup v-model.trim="formInline.access">
            <Checkbox label="root">Root</Checkbox>
            <Checkbox label="user">User</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <Row>
          <Col>
          <FormItem label="轮播图：" prop='banner'>
            <Button icon="ios-cloud-upload-outline" @click="uploadFile('banner')" :disabled="NotAllowedEdit">点击上传</Button>
            <input type="file" @change="uploadBanner($event)" ref="file" id="banner" accept="image/jpeg,image/jpg">
            <div class='ImgText'>&#42;支持JPG格式图片，500k以内</div>
          </FormItem>
          <FormItem>
            <div class="upload" v-for="(item, index) in hangshuList" v-if="hangshuList.length > 0" :key="index">
              <div class="pic">
                <div class="showImg">
                  <img :src="releaseResourceResult.banner[item * 4 + 0].attachUrl" alt="" />
                  <div class="cover">
                    <Icon type="ios-eye-outline" @click.native="handleViewBanner(item * 4 + 0)" style="size:20%;"></Icon>
                    <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemoveList(item * 4 + 0, 'banner')"></Icon>
                  </div>
                </div>
              </div>
              <div class="pic">
                <div class="showImg">
                  <img :src="releaseResourceResult.banner[item * 4 + 1].attachUrl" alt="" />
                  <div class="cover">
                    <Icon type="ios-eye-outline" @click.native="handleViewBanner(item * 4 + 1)"></Icon>
                    <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemoveList(item * 4 + 1, 'banner')"></Icon>
                  </div>
                </div>
              </div>
              <div class="pic">
                <div class="showImg">
                  <img :src="releaseResourceResult.banner[item * 4 + 2].attachUrl" alt="" />
                  <div class="cover">
                    <Icon type="ios-eye-outline" @click.native="handleViewBanner(item * 4 + 2)"></Icon>
                    <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemoveList(item * 4 + 2, 'banner')"></Icon>
                  </div>
                </div>
              </div>
              <div class="pic">
                <div class="showImg">
                  <img :src="releaseResourceResult.banner[item * 4 + 3].attachUrl" alt="" />
                  <div class="cover">
                    <Icon type="ios-eye-outline" @click.native="handleViewBanner(item * 4 + 3)"></Icon>
                    <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemoveList(item * 4 + 3, 'banner')"></Icon>
                  </div>
                </div>
              </div>
            </div>

            <div class="upload">
              <div class="pic" v-for="(item, index) in yushuList" v-if="yushuList.length > 0" :key="index">
                <div class="showImg">
                  <img :src="releaseResourceResult.banner[item].attachUrl" alt="" />
                  <div class="cover">
                    <Icon type="ios-eye-outline" @click.native="handleViewBanner(item)"></Icon>
                    <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemoveList(item, 'banner')"></Icon>
                  </div>
                </div>
              </div>
            </div>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancelAddOrUpdate('formInline')">取消</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">确定</Button>
      </div>
     </Modal>
    <Modal title="头像预览" footer-hide v-model.trim="visible">
      <img :src="visibleSrc" v-if="visible" style="width: 100%;">
    </Modal>
    <Modal v-model.trim="modalDelete" width="450" title="删除用户信息提示">
      <div >
        <p>确定删除该用户吗？</p>
      </div>
      <div slot="footer">
          <Button type="text" @click="cancelDelete" size="large">取消</Button>
          <Button type="primary" @click="handleSubmitDelete" size="large" >确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { userInfoAdminPageList, userInfoAdminDelete, userInfoAdmin, userInfoAdminEnable, userInfoAdminDisable } from '@/api/data'
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
    const validateUserName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入登录账号'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateNickName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    const validateAccess = (rule, value, callback) => {
      let arr = this.formInline.access
      if (!arr || arr.length === 0) {
        callback(new Error('请至少勾选一个用户类型'))
      } else {
        callback()
      }
    }
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      userName: '', // 登录账号
      nickName: '', // 用户名
      modalAddOrUpdate: false, // 是否显示弹窗
      modalDelete: false, // 是否显示删除提示弹窗
      visible: false, // 图片预览弹框控制
      isValid: '', // 开启/暂停
      detailTitle: '', // 表单标题
      showType: '', // 表单展示类型（edit、add）
      formInline: { // 实体
        userName: '', // 登录账号
        nickName: '', // 用户名
        access: ['root'], // 用户类型
        gender: '0', // 性别
        mobileNum: '', // 手机号
        email: '', // 邮箱
        headImg: '' // 头像
      },
      startOrSuspendSession: {
        isValid: '',
        id: ''
      },
      ruleInline: {
        userName: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ],
        nickName: [
          { required: true, validator: validateNickName, trigger: 'blur' }
        ],
        access: [
          { required: true, validator: validateAccess, trigger: 'change' }
        ]
      },
      userInfoAdminData: [ // 参数配置数据

      ],
      columns: [
        {
          title: '登录账号',
          key: 'userName',
          tooltip: true,
          width: 200,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'nickName',
          width: 200,
          align: 'center'
        },
        {
          title: '用户类型',
          key: 'access',
          width: 200,
          align: 'center'
        },
        {
          title: '性别',
          key: 'gender',
          width: 100,
          align: 'center',
          render: (h, params) => {
            const row = params.row.gender
            let text
            switch (row) {
              case '0':
                text = '男'
                break
              case '1':
                text = '女'
                break
            }
            return h('Span', {
              props: {
                type: 'dot'
              }
            }, text)
          }
        },
        {
          title: '手机号',
          key: 'mobileNum',
          width: 200,
          align: 'center'
        },
        {
          title: '邮箱',
          key: 'email',
          width: 300,
          align: 'center'
        },
        {
          title: '头像',
          key: 'headImg',
          width: 100,
          align: 'center',
          render: (h, params) => {
            let headImg = params.row.headImg
            if (!headImg) {
              headImg = '../../assets/index/noQR.jpg'
            }
            return h('div', [
              h('img', {
                attrs: {
                  src: headImg
                },
                style: {
                  width: '33px',
                  height: '33px'
                },
                on: {
                  click: () => {
                    this.visibleSrc = headImg
                    this.visible = true
                  }
                }
              })
            ])
          }
        },
        {
          title: '状态(停用/启用)',
          key: 'isValid',
          align: 'center',
          width: 140,
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
        'userName': this.userName,
        'nickName': this.nickName,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      userInfoAdminPageList(date).then(res => {
        // this.$Message['success']({
        //   background: true,
        //   content: res.data.data
        // })
        this.userInfoAdminData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    reset () { // 点击重置按钮
      this.userName = ''
      this.nickName = ''
      this.pageNum = 1
      this.userInfoAdminPageList()
    },
    addSetting () { // 点击新增按钮
      this.showType = 'add'
      this.detailTitle = '新增用户信息'
      this.modalAddOrUpdate = true
    },
    handleSubmitAddOrUpdate (index) { // 点击提交新增或更新按钮
      this.$refs[index].validate((valid) => {
        if (valid) {
          if (this.showType === 'add') {
            this.access = JSON.stringify(this.formInline.access, null)
            const date = {
              'userName': this.formInline.userName,
              'nickName': this.formInline.nickName,
              'access': this.access,
              'gender': this.formInline.gender,
              'mobileNum': this.formInline.mobileNum,
              'email': this.formInline.email,
              'headImg': 'https://wsmblobdev01.blob.core.chinacloudapi.cn/zejia/avatar.png'
            }
            userInfoAdmin(date).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalAddOrUpdate = false
              this.userInfoAdminPageList()
              this.$refs[index].resetFields()
            }).catch(err => {
              console.log(err)
            })
          } else if (this.showType === 'edit') {
            this.access = JSON.stringify(this.formInline.access, null)
            const date = {
              'id': this.id,
              'userName': this.formInline.userName,
              'nickName': this.formInline.nickName,
              'access': this.access,
              'gender': this.formInline.gender,
              'mobileNum': this.formInline.mobileNum,
              'email': this.formInline.email
            }
            userInfoAdmin(date).then(res => {
              this.$Message['success']({
                background: true,
                content: res.data.message
              })
              this.modalAddOrUpdate = false
              this.userInfoAdminPageList()
              this.$refs[index].resetFields()
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
      this.id = this.userInfoAdminData[index].id
      this.formInline.userName = this.userInfoAdminData[index].userName
      this.formInline.nickName = this.userInfoAdminData[index].nickName
      this.formInline.access = JSON.parse(this.userInfoAdminData[index].access)
      this.formInline.gender = this.userInfoAdminData[index].gender
      this.formInline.mobileNum = this.userInfoAdminData[index].mobileNum
      this.formInline.email = this.userInfoAdminData[index].email
      this.formInline.headImg = this.userInfoAdminData[index].headImg
      this.showType = 'edit'
      this.detailTitle = '修改用户信息'
      this.modalAddOrUpdate = true
    },
    del (index) { // 提交删除按钮
      this.modalDelete = true
      this.id = this.userInfoAdminData[index].id
    },
    cancelDelete () { // 取消删除
      this.modalDelete = false
    },
    handleSubmitDelete () { // 确认删除
      userInfoAdminDelete(this.id).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.modalDelete = false
        this.userInfoAdminPageList()
      }).catch(err => {
        console.log(err)
      })
    },
    userInfoAdminPageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      userInfoAdminPageList(date).then(res => {
        this.userInfoAdminData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    changePage (date) {
      this.pageNum = date
      this.userInfoAdminPageList()
    },
    ageSizeChange (date) {
      this.pageNum = 1
      this.pageSize = date
      this.userInfoAdminPageList()
    },
    switch () {
      // 打开是true
      this.updateFeedbackMessage()
    },
    updateFeedbackMessage () { // 点击更新状态按钮
      if (this.startOrSuspendSession.isValid === '1') { // 置为生效
        userInfoAdminEnable(this.startOrSuspendSession.id).then(res => {
          this.userInfoAdminPageList()
        }).catch(err => {
          console.log(err)
        })
      } else { // 置为失效
        userInfoAdminDisable(this.startOrSuspendSession.id).then(res => {
          this.userInfoAdminPageList()
        }).catch(err => {
          console.log(err)
        })
      }
    }
  },
  created () {
    this.userInfoAdminPageList()
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
</style>
