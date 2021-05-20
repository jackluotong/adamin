<template>
  <div class="user-content">
    <div class="content-button">
      <Input v-model.trim="agentCode" placeholder="营销员代码"/>
      <Input v-model.trim="userName" placeholder="姓名"/>
      <Button type="primary" icon="md-search" @click="search()">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="appUserInfoData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">查看</Button>
          </div>
        </template>
     </Table>
     <Page @on-change="changePage" @on-page-size-change="ageSizeChange" :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
   <Modal v-model="isDisplay" width="30%" height="40%"  :mask-closable="false" :closable="true" v-bind:title="detailTitle" footer-hide>
      <Form :model="formInline"  inline>
        <FormItem  label="姓名：" style="width:120px;" >
          {{formInline.userName}}
        </FormItem>
        <FormItem label="手机号：" style="width:180px;">
          {{formInline.phoneNumber}}
        </FormItem>
        <FormItem label="证件号：" style="width:200px;" >
          {{formInline.idNumber}}
        </FormItem>
        <FormItem label="营销员代码：" style="width:180px;" >
          {{formInline.agentCode}}
        </FormItem>
          <FormItem label="营销员类型：" style="width:150px;" >
          {{formInline.agentType}}
          </FormItem>
        <FormItem label="中宏id："  style="width:100px;" >
          {{formInline.mslId}}
        </FormItem><br>
        <FormItem label="设备类型：" style="width:150px;">
          {{formInline.deviceType}}
        </FormItem>
        <FormItem label="设备id：" style="width:150px;">
          {{formInline.deviceId}}
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { appUserInfoPageList } from '@/api/data'
export default {
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      detailTitle: '用户详情',
      isDisplay: false,
      userName: '', // 姓名
      agentCode: '', // 营销员代码
      formInline: { // 实体
        id: '',
        userName: '',
        idNumber: '',
        phoneNumber: '',
        isSetPwd: '',
        mslId: '',
        isFace: '',
        deviceType: '',
        deviceId: '',
        agentCode: '',
        agentType: ''
      },
      ruleInline: {
      },
      appUserInfoData: [ // 参数配置数据
      ],
      columns: [
        {
          title: '营销员代码',
          key: 'agentCode',
          tooltip: true,
          width: 200,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'userName',
          width: 200,
          align: 'center'
        },
        {
          title: '营销员类型',
          key: 'agentType',
          width: 200,
          align: 'center'
        },
        {
          title: '手机号',
          key: 'phoneNumber',
          width: 200,
          align: 'center'
        },
        {
          title: '中宏id',
          key: 'mslId',
          width: 200,
          align: 'center'
        },
        {
          title: '设备id',
          key: 'deviceId',
          width: 200,
          align: 'center'
        },
        {
          title: '设备类型',
          key: 'deviceType',
          width: 200,
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
        'userName': this.userName,
        'agentCode': this.agentCode,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      appUserInfoPageList(date).then(res => {
        // this.$Message['success']({
        //   background: true,
        //   content: res.data.data
        // })
        this.appUserInfoData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    reset () { // 点击重置按钮
      this.userName = ''
      this.agentCode = ''
      this.pageNum = 1
      this.appUserInfoPageList()
    },
    edit (index) { // 点击修改按钮
      this.formInline.id = this.appUserInfoData[index].id
      this.formInline.userName = this.appUserInfoData[index].userName
      this.formInline.idNumber = this.appUserInfoData[index].idNumber
      this.formInline.phoneNumber = this.appUserInfoData[index].phoneNumber
      this.formInline.isSetPwd = this.appUserInfoData[index].isSetPwd
      this.formInline.isFace = this.appUserInfoData[index].isFace
      this.formInline.mslId = this.appUserInfoData[index].mslId
      this.formInline.deviceId = this.appUserInfoData[index].deviceId
      this.formInline.deviceType = this.appUserInfoData[index].deviceType
      this.formInline.agentType = this.appUserInfoData[index].agentType
      this.formInline.agentCode = this.appUserInfoData[index].agentCode
      this.showType = 'edit'
      this.detailTitle = '修改用户信息'
      this.isDisplay = true
    },
    appUserInfoPageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      appUserInfoPageList(date).then(res => {
        this.appUserInfoData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    changePage (date) {
      this.pageNum = date
      this.appUserInfoPageList()
    },
    ageSizeChange (date) {
      this.pageNum = 1
      this.pageSize = date
      this.appUserInfoPageList()
    }
  },
  created () {
    this.appUserInfoPageList()
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
