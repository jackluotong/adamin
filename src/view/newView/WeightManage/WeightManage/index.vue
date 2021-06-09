<template>
    <div class="user-content">
        <h1 style="margin:10px 10px 10px 10px">权重管理-权重管理</h1>
        <div class="content-button">
            <span style="padding:10px">服务模块</span>
            <Select v-model.trim="selectedModule" style="width:200px" @on-change='selectedModuleClick'>
                <Option v-for="(item,id) in modulesOption" :key="id" :value="item.serviceModuleCode">
                    {{ item.serviceModule }}
                </Option>
            </Select>
            <Button
                type="primary"
                icon="md-search"
                @click="search()"
                style="margin:0 10px 0 20px"
                >查询</Button
            >
            <Button type="primary" icon="md-add" @click="addSetting()"
                >新增权重</Button
            >
        </div>
        <Table
            highlight-row
            stripe
            :columns="showWeightNormal"
            :data="confData"
            style="margin-top: 5px"
        >
            <template slot-scope="{ row, index }" slot="action">
                <div>
                    <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="edit(index)"
                        >编辑</Button
                    >
                    <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="lookAbnormalWeight(index)"
                        >查看异常权重</Button
                    >
                   <!--  <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="weightRecover(index)"
                        >权重恢复</Button
                    > -->
                </div>
            </template>
        </Table>
        <Page
            :total="total"
            :page-size="pageSize"
            :show-total="true"
            show-sizer
            style="text-align: center;margin-top: 5px"
        />

        <Modal
            v-model.trim="modalEdit"
            width="600"
            :mask-closable="false"
            :closable="false"
            v-bind:title="detailTitle"
        >
            <Form ref="formInline" :model="formInline">
                <div style="display:inline-table">
                    <FormItem
                    label="服务模块"
                    prop="confName"
                    style="width:270px;"
                >
                   <Select v-model.trim="selectedModule" style="width:200px" @on-change='selectedModuleClick'>
                <Option v-for="(item,id) in modulesOption" :key="id" :value="item.serviceModule">
                    {{ item.serviceModule }}
                </Option>
                 </Select>
                </FormItem>
                 <FormItem
                    label="服务类型"
                    prop="confName"
                    style="width:270px;"
                >
                   <Select v-model.trim="selectedModuleType" style="width:200px" >
                <Option v-for="(item,id) in typeOption" :key="id" :value="item.serviceTypeCode">
                    {{ item.serviceType }}
                </Option>
                 </Select>
                </FormItem>
                <FormItem
                        label="权重类型"
                        prop="useName"
                        style="width:270px;"
                    >
                         <Select v-model.trim="selectedWeight" style="width:200px">
                            <Option v-for="(item,index) in weightOptions" :key="index" :value='item.id'>{{ item.value }}</Option>
                         </Select>
                </FormItem>
                </div>
                <FormItem
                    label="所属应用"
                    prop="useCalled"
                    style="width:270px;"
                >
                    <Select v-model.trim="useSelected" style="width:200px">
                            <Option v-for="(item,index) in useOption" :key="index" :value='item.id'>{{ item.applicationCode }}</Option>
                    </Select>
                </FormItem>
                <FormItem
                label='权重'
                  prop="weight"
                >
                <Input placeholder="输入权重配比">

                </Input>
                </FormItem>

            </Form>
            <div slot="footer">
                <Button
                    type="primary"
                    ghost
                    size="large"
                    @click="cancelAddOrUpdateType('formInline')"
                    >返回</Button
                >
                <Button
                    type="primary"
                    size="large"
                    @click="handleSubmitAddOrUpdate('formInline')"
                    >保存</Button
                >
            </div>
        </Modal>
        <Modal v-model.trim="showWeightAbnormal" width="900"  title="权重异常展示">
             <Table :columns="columnsShowAbnormalWeight" :data="showWeightAbnormalData"></Table>
        </Modal>
    </div>
</template>

<script>
import { inquireServiceModule, getServiceTypeInfo } from '@/api/data'
import { getWeight } from '@/api/weightManage'
import { getInfoConnect } from '@/api/useSystem'

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
    const validateuseName = function (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入参数名称'))
      } else if (getByteLen(value) > 128) {
        callback(new Error('字符串长度不能超过128'))
      } else {
        callback()
      }
    }
    const validateuseCalled = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参数键名'))
      } else if (getByteLen(value) > 64) {
        callback(new Error('字符串长度不能超过64'))
      } else {
        callback()
      }
    }
    const validateConfValue = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参数键名'))
      } else {
        callback()
      }
    }

    return {
      useOption: [],
      weightOptions: [{ id: 1, value: '通用权重' }, { id: 2, value: '应用权重' }],
      modulesOption: [],
      typeOption: [],
      selectedModuleType: '',
      useSelected: '',
      selectedWeight: '',
      selectedModule: '',
      showWeightAbnormal: false,
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      useName: '',
      useCalled: '',
      contactPhone: '',
      contactEmails: '',
      modalEdit: false,
      detailTitle: '',
      showType: '',
      formInline: {
        useName: '',
        useCalled: '',
        contactPhone: '',
        contactEmails: ''
      },
      ruleInline: {
        useName: [
          {
            required: true,
            validator: validateuseName,
            trigger: 'blur'
          }
        ],
        useCalled: [
          {
            required: true,
            validator: validateuseCalled,
            trigger: 'blur'
          }
        ],
        confValue: [
          {
            required: true,
            validator: validateConfValue,
            trigger: 'blur'
          }
        ]
      },
      flag: '',
      confData: [],
      showWeightAbnormalData: [],
      columnsShowAbnormalWeight: [
        { title: '服务模块',
          key: 'serviceModule',
          align: 'center'
        },
        { title: '权重',
          key: 'weight',
          align: 'center',
          render: (h, params) => {
            return h('sapn', {
            }, `${params.row.weightRatioName}=${params.row.weightRatioValue}`)
          }
        },
        { title: '权重类型',
          key: 'weightType',
          align: 'center'
        },
        { title: '所属应用',
          key: 'applicationCode',
          align: 'center'
        }
      ],
      showWeightNormal: [
        { title: '服务模块',
          key: 'serviceModule',
          align: 'center'
        },
        { title: '权重',
          key: 'weight',
          align: 'center',
          render: (h, params) => {
            return h('sapn', {
            }, `${params.row.weightRatioName}=${params.row.weightRatioValue}`)
          }
        },
        { title: '权重类型',
          key: 'weightType',
          align: 'center',
          render: (h, params) => {
            if (params.row.weightType === '1') { return h('span', '应用权重') } else if (params.row.weightType === '2') { return h('span', '应用权重') } else { return h('span', '参数错误') }
          }
        },
        { title: '所属应用',
          key: 'applicationCode',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        },
        {
          title: '权重恢复',
          key: 'noticeType',
          width: 100,
          render: (h, params) => {
            if (params.row.isAbnormalWeightId === false) {
              return h('Button', {
                on: {
                  click: () => {
                    alert('等待开发')
                    console.log(params)
                  }
                }
              }, '权重恢复')
            } else {
              return h('span', {

              }, '')
            }
          }
        }
      ]
    }
  },
  methods: {
    selectedModuleClick (e) {
      console.log(this.selectedModule)
      const info = {
        serviceModule: e
      }
      getServiceTypeInfo(info).then(res => {
        this.typeOption = res.data.data.records
        console.log(res.data.data.records, 'getServiceTypeInfo')
      }).catch(err => this.$Message.info(err))
    },
    search () {
      const info = {
        serviceModule: this.selectedModule,
        currentPage: this.pageNum,
        pageSize: this.pageSize
      }
      getWeight(info).then(res => {
        this.confData = res.data.data.records
        this.total = res.data.data.total
        this.selectedModule = null
      }).catch(error => {
        this.$Message.error({
          content: error
        })
      })
    },
    reset () {
      this.useName = null
      this.useCalled = null
      this.contactPhone = null
    },
    addSetting () {
      this.reset()
      this.showType = 'add'
      this.detailTitle = '新增模块'
      this.modalEdit = true
    },
    handleSubmitAddOrUpdate (index) {
      console.log(index)
      this.$refs[index].validate(valid => {
        console.log(valid)
        if (valid) {
          if (this.showType === 'add') {
            const data = {
              applicationCode: '',
              serviceTypeCode: '',
              weightRatioKey: '',
              weightRatioValue: '',
              weightType: ''
            }
            console.log(data)
          } else if (this.showType === 'edit') {
            const data = {
              applicationCode: '',
              serviceTypeCode: '',
              weightRatioKey: '',
              weightRatioValue: '',
              weightType: '',
              id: ''
            }
            console.log(data)
          }
        } else {
          this.$Message.error('请检查参数是否有误!')
        }
      })
    },
    cancelAddOrUpdate (name) {
      this.$refs[name].resetFields()
      this.modalEdit = false
    },
    cancelAddOrUpdateType () {
      this.modalEdit = false
    },
    edit (index) {
      this.id = this.confData[index].id
      this.formInline.useName = this.confData[index].useName
      this.formInline.useCalled = this.confData[index].useCalled
      this.formInline.confName = this.confData[index].confName
      this.showType = 'edit'
      this.detailTitle = '编辑模块'
      this.modalEdit = true
    },
    lookAbnormalWeight () {
      this.showWeightAbnormal = true
      this.getWeight(2, 2)
    },
    weightRecover () {

    },
    renderPage (data, total, flag) {
      switch (flag) {
        case 1:
          this.confData = data
          this.total = total
          break
        case 2:
          this.showWeightAbnormalData = data
          break
        default:
          this.$Message.info('检查类型')
      }
    },
    getWeight (number, flag) {
      const info = {
        abnormalWeightType: number,
        serviceModule: '',
        serviceTypeCode: '',
        applicationCode: '',
        currentPage: this.pageNum,
        pageSize: this.pageSize
      }
      getWeight(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total, flag)
        console.log(res)
      }).catch(error => {
        this.$Message.error({
          content: error
        })
      })
    }
  },
  created () {
    this.getWeight(1, 1)
    const info = {}
    inquireServiceModule(info).then(res => {
      this.modulesOption = res.data.data.records
      console.log(res.data.data.records, 'service module')
    })
    getInfoConnect(info).then(res => {
      console.log(res, 'getInfoConnect')
      this.useOption = res.data.data.records
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>
<style lang="less" scoped>
.user-content {
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
        .ivu-btn {
            margin-left: 10px;
        }
        .ivu-btn-info {
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
