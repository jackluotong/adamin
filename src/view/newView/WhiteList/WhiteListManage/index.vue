<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: william
 * @Date: 2021-07-25 11:23:17
 * @LastEditors: william
 * @LastEditTime: 2021-07-28 11:01:58
-->
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
    <h1 style="margin:10px 10px 10px 10px">白名单管理-白名单管理</h1>
    <div class="content-button" >
      <Button type="primary" icon="md-add" @click="addSetting()"
                v-show="permission.includes('whitelisting:manage:add')"
            >新增</Button>
 </div>
    <Table highlight-row stripe :columns="columns" :data="confData" style="margin-top: 5px">
       <template slot-scope="{ index }" slot="action">
          <div>
            <Button type="error" size="small" style="margin-right: 5px" @click="del(index)"
                v-show="permission.includes('whitelisting:manage:del')"
            >删除</Button>
          </div>
        </template>
     </Table>
      <Page
            :total="total"
            :page-size="pageSize"
            :show-total="true"
            show-sizer
            style="text-align: center;margin-top: 5px"
            @on-change='changePage'
            @on-page-size-change='onpagesizechange'
        />
     <Modal
     v-model.trim="modalAddOrUpdate"
     width="600"
     height="1000"
     v-bind:title="detailTitle"
     :closable='false'
     :mask-closable='false'
     class-name="vertical-center-modal">
      <Form ref="formInline" :model="formInline"  inline>
        <FormItem label="身份证" style="width:270px;">
          <Input v-model.trim="formInline.idCardNo"/>
        </FormItem>
        <FormItem label="手机" style="width:270px;">
          <Input  v-model.trim="formInline.mobile" />
        </FormItem>
         <FormItem label="姓名" style="width:270px;">
          <Input  v-model.trim="formInline.name" />
        </FormItem>
         <FormItem label="类型"  style="width:270px;">
        <Select v-model="formInline.type" clearable style="width:270px">
        <Option v-for="(item,id) in authOptions" :value="item.value" :key="id">{{ item.label }}</Option>
        </Select>
        </FormItem>
        <FormItem>
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
import { getInfo, deleteInfo, addInfo } from '@/api/whiteList'
export default {
  data () {
    return {
      authOptions: [{ value: 1, label: '身份验证' }, { value: 2, label: '手机号验证' }],
      permission: sessionStorage.getItem('permission'),
      deleteId: '',
      total: 0,
      pageNum: 1,
      pageSize: 10,
      modalAddOrUpdate: false,
      detailTitle: '',
      modalDelete: false,
      formInline: {
        idCardNo: '',
        mobile: '',
        name: '',
        type: ''
      },
      confData: [],
      columns: [
        {
          type: 'index',
          width: 60,
          aligin: 'center'
        },
        {
          title: '身份证',
          key: 'idCardNo',
          tooltip: true,
          width: 300,
          align: 'center'
        },
        {
          title: '手机',
          key: 'mobile',
          width: 300,
          align: 'center'
        },
        {
          title: '名字',
          key: 'name',
          width: 300,
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          width: 300,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 150
        }
      ]
    }
  },
  methods: {
    onpagesizechange (e) {
      this.pageSize = e
      const info = {
        pageSize: e,
        currentPage: this.pageNum
      }
      getInfo(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    changePage (e) {
      const info = {
        pageSize: this.pageSize,
        currentPage: e
      }
      getInfo(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total)
      })
    },
    addSetting () {
      this.showType = 'add'
      this.detailTitle = '新增白名单'
      this.modalAddOrUpdate = true
    },
    judge (obj) {
      for (let key in obj) {
        if (obj[key] !== '0' && !obj[key]) {
          this.$Message.info('请完善数据')
          return false
        }
      }
    },
    handleSubmitAddOrUpdate () {
      if (this.formInline.mobile === '' && this.formInline.idCardNo !== '' && this.formInline.name !== '' && this.formInline.type !== '') {
        addInfo(this.formInline).then(res => {
          this.$Message.success({
            content: res.data.message
          })
          this.getInfo()
          this.modalAddOrUpdate = false
        })
      } else if (this.formInline.mobile !== '' && this.formInline.idCardNo !== '' && this.formInline.name !== '' && this.formInline.type !== '') {
        let rule = /1[3,4,5,7,8][0-9]{9}$/
        if (rule.test(this.formInline.mobile) === true) {
          addInfo(this.formInline).then(res => {
            this.$Message.success({
              content: res.data.message
            })
            this.getInfo()
            this.modalAddOrUpdate = false
          })
        } else {
          this.$Message.info('请输入正确的手机号')
        }
      } else {
        this.$Message.info('请输入正确的信息')
      }
    },
    cancelAddOrUpdate () {
      this.modalAddOrUpdate = false
    },
    del (index) {
      console.log(this.confData[index])
      this.modalDelete = true
      this.deleteId = this.confData[index].id
    },
    cancelDelete () {
      this.modalDelete = false
    },
    handleSubmitDelete () {
      deleteInfo(this.deleteId).then(res => {
        this.$Message.success({
          content: res.data.message
        })
        this.getInfo()
      }).catch(err => console.log(err))
      this.modalDelete = false
    },
    renderPage (data, total) {
      this.confData = data
      this.total = total
    },
    getInfo () {
      const data = {
        currentPage: this.pageNum,
        pageSize: this.pageSize
      }
      getInfo(data).then(res => {
        console.log(res)
        const data = res.data.data.records
        const total = res.data.data.total
        this.renderPage(data, total)
      })
    }
  },
  created () {
    this.getInfo()
  }
}
</script>
