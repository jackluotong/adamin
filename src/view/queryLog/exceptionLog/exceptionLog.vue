<template>
  <div class="user-content">
    <div class="content-button">

<span style="padding:10px 10px 10px 10px ">厂商名称</span>
<Select label="" v-model.trim="manufacturerName" style="width:150px; marginRight:20px;">
        <Option v-for="item of statusEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
      </Select>
<span style="padding:10px 10px 10px 10px ">服务模块</span>
 <Select label="" v-model.trim="serviceModule" style="width:150px; marginRight:20px;">
        <Option v-for="item of emailTypeEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
      </Select>
<div style="padding:10px 10px 10px 10px ">
<span style="padding:10px 10px 10px 0 ">服务类型</span>
      <Select label="" v-model.trim="serviceType" style="width:150px; marginRight:20px;">
        <Option v-for="item of serviceTypeEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
      </Select>
<span style="padding:10px 10px 10px 10px ">服务状态</span>
      <Select label="" v-model.trim="serviceStatus" style="width:150px; marginRight:20px;">
        <Option v-for="item of serviceStatusEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
      </Select>
</div>
</div>
<div style="">
      <Button type="primary" icon="md-search" @click="search()" style="margin:10px">查询</Button>
      <Button type="primary" icon="md-refresh" @click="addNew()" style="margin:10px">新增服务</Button>

</div>

    <Table highlight-row stripe :columns="columns" :data="logEmailMessageData" style="margin-top: 5px">
       <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="info" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
            <Button type="info" size="small" style="margin-right: 5px" @click="checkLog(index)">服务生效</Button>
            <Button type="info" size="small" style="margin-right: 5px" @click="checkLog(index)">服务失效</Button>
          </div>
        </template>
    </Table>
    <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
    <Modal v-model="modalCheck" width="30%" height="40%"  :mask-closable="false" :closable="true" title="详情" >
      <Form :model="formInline"  inline>
        <FormItem  label="厂商名称" style="width:300px;" >
<Select label="" v-model.trim="manufacturerName" style="width:150px; marginRight:20px;">
        <Option v-for="item of statusEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
      </Select>        </FormItem><br>
        <FormItem label="服务模块" style="width:300px;" >
 <Select label="" v-model.trim="serviceModule" style="width:150px; marginRight:20px;">
        <Option v-for="item of emailTypeEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
      </Select>        </FormItem>
        <FormItem label="服务类型" style="width:300px;" >
<Select label="" v-model.trim="serviceType" style="width:150px; marginRight:20px;">
        <Option v-for="item of serviceTypeEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
      </Select>        </FormItem><br>
        <FormItem label="服务状态" style="width:300px;" >
<Select label="" v-model.trim="serviceStatus" style="width:150px; marginRight:20px;">
        <Option >{{formInline.serviceStatus}}</Option>
      </Select>        </FormItem><br>
        <FormItem label="厂商接口地址" style="width:100%;" >
        <Input  v-model.trim="formInline.manufacturerAddress" style="width:auto"/>
      </FormItem><br>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost size="large" @click="cancel('formInline')">返回</Button>
        <Button type="primary" size="large" @click="handleSubmitAddOrUpdate('formInline')">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { logEmailMessagePageList } from '@/api/data'
export default {
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      manufacturerName: '', // 厂商名称
      serviceModule: '', // 服务模块
      serviceType: ' ',
      serviceStatus: '',
      manufacturerAddress: '',
      showDetailModal: false, // 是否显示邮件详情弹窗
      showDetailContent: '',
      modalCheck: false, // 是否显示邮件日志详情弹窗
      formInline: { // 实体
        manufacturerName: '',
        serviceModule: '',
        serviceType: '',
        serviceStatus: '',
        manufacturerAddress: ''
      },
      statusEnumList: [ // 发送状态类型枚举
        {
          'value': '1',
          'label': '交通'
        },
        {
          'value': '2',
          'label': '中化'
        }
      ],
      emailTypeEnumList: [
        {
          'value': '1',
          'label': 'OCR'
        },
        {
          'value': '2',
          'label': '人脸识别'
        }
      ],
      serviceTypeEnumList: [
        {
          'value': '1',
          'label': '身份证识别'
        },
        {
          'value': '2',
          'label': '户口本识别'
        }
      ],
      serviceStatusEnumList: [
        {
          'value': '1',
          'label': '生效'
        },
        {
          'value': '2',
          'label': '失效'
        }
      ],
      logEmailMessageData: [
        { manufacturerName: 'jackl', serviceModule: 'jakcls', serviceType: 'orc', serviceStatus: 'ok', serviceAddress: 'www.baidu.com', manufacturerAddress: 'www.ok.com' },
        { manufacturerName: 'jackl', serviceModule: 'jakcls1', serviceType: 'orc1', serviceStatus: 'no', serviceAddress: 'www.okoko.com', manufacturerAddress: 'www.ok1.com' }
      ], // 邮件日志数据
      operatingTime: [],
      columns: [
        {
          title: '厂商名称',
          key: 'manufacturerName',
          tooltip: true,
          width: 150,
          align: 'center'
        },
        // {
        //   title: '收件人',
        //   key: 'receiveEmail',
        //   tooltip: true,
        //   width: 130,
        //   align: 'center'
        // },
        {
          title: '服务模块',
          key: 'serviceModule',
          align: 'center'
        },
        {
          title: '服务类型',
          key: 'serviceType',
          width: 150,
          align: 'center'
        },
        {
          title: '服务状态',
          key: 'serviceStatus',
          width: 200,
          align: 'center'
        },
        {
          title: '统一对外服务地址',
          key: 'serviceAddress',
          width: 150,
          align: 'center'
        },
        {
          title: '厂商接口地址',
          key: 'manufacturerAddress',
          width: 150,
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
        'receiveEmail': this.receiveEmail,
        'emailType': this.emailType,
        'status': this.status,
        'pageNum': this.pageNum,
        'startDate': this.startDate,
        'endDate': this.endDate,
        'pageSize': this.pageSize
      }
      logEmailMessagePageList(date).then(res => {
        // this.$Message['success']({
        //   background: true,
        //   content: res.data.data
        // })
        this.logEmailMessageData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange (date) {
      this.startDate = date[0]
      this.endDate = date[1]
    },
    reset () { // 点击重置按钮
      this.receiveEmail = ''
      this.messageContent = ''
      this.status = ''
      this.pageNum = 1
      this.operatingTime = []
      this.startDate = ''
      this.endDate = ''
      this.logEmailMessagePageList()
    },
    edit (index) {
      this.formInline.serviceStatus = this.logEmailMessageData[index].serviceStatus
      this.formInline.manufacturerAddress = this.logEmailMessageData[index].manufacturerAddress
      this.modalCheck = true
    },
    addNew () {
      this.formInline.manufacturerAddress = ''
      this.modalCheck = true
    },
    cancel () {
      this.modalCheck = false
    },
    logEmailMessagePageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      logEmailMessagePageList(date).then(res => {
        this.logEmailMessageData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.logEmailMessagePageList()
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
