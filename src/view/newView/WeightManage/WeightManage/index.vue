<template>
    <div class="user-content">
        <h1 style="margin:10px 10px 10px 10px">权重管理-权重管理</h1>
        <div class="content-button">
            <span style="padding:10px">服务模块</span>
            <Select v-model.trim="selectedModule" style="width:200px">
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
                        v-show="permission.includes('weight:manage: add')"
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
                        @click="edit(index,row)"
                        v-show="permission.includes('weight:manage: edit')"
                        >编辑</Button
                    >
                    <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="lookAbnormalWeight(index)"
                        v-show="permission.includes('weight:manage: look')"

                        >查看异常权重</Button
                    >
                    <Button
                        type="error"
                        size="small"
                        style="margin-right: 5px"
                        @click="deleteId(index,row)"
                        v-show="permission.includes('weight:manage: delete')"
                        >删除</Button
                    >
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
                   <Select v-model.trim="selectedModuleTwo" style="width:200px" @on-change='selectedModuleClick'>
                <Option v-for="(item,id) in modulesOption" :key="id" :value="item.serviceModuleCode">
                    {{ item.serviceModule }}
                </Option>
                 </Select>
                </FormItem>
                 <FormItem
                    label="服务类型"
                    prop="confName"
                    style="width:270px;"
                >
                   <Select v-model.trim="selectedModuleType" style="width:200px" @on-change='selectedTypeClick'>
                <Option v-for="(item,id) in typeOption" :key="id" :value="item.serviceTypeCode" >
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
                            <Option v-for="(item,index) in useOption" :key="index" :value='item.applicationCode'>{{ item.applicationCode }}</Option>
                    </Select>
                </FormItem>
                   <div>
            <Checkbox-group
                v-model="checkedData"
                @on-change="selectedCheckBox"
            >
                <Checkbox
                    v-for="(item, index) in checkList"
                    :key="index"
                    :label="item.manufacturerCode"
                    size="large"
                    ref="checkBox"
                    >{{ item.manufacturerName }}</Checkbox
                >
              </Checkbox-group>
             </div>
                <FormItem
                label='权重'
                  prop="weight"
                >
                <Input placeholder="输入权重配比按照x:x:x类型（如果有三个其余以此类推）" style="width:200px" v-model="inputValue">
                </Input>
                </FormItem>

            </Form>
            <div slot="footer" style="display:flex;justify-content: center;align-items:center">
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
        <Modal v-model.trim="showWeightAbnormal" width="900" height='600' title="权重异常展示">
             <Table :columns="columnsShowAbnormalWeight" :data="showWeightAbnormalData"></Table>
        </Modal>
         <Modal v-model.trim="modalDelete" width="450" title="删除参数配置提示">
            <div>
                <p>确定删除该参数配置吗？</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelDelete" size="large"
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
import { inquireServiceModule, serarchTypeByModule } from '@/api/data'
import { getWeight, searchManufacture, addWeight, deleteWeight, editWeight } from '@/api/weightManage'
import { getAllApp } from '@/api/thresholdManage'
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
      permission: sessionStorage.getItem('permission'),
      modalDelete: false,
      checkList: [],
      checkedData: [],
      inputValue: '',
      selectedModuleTwo: '',
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
      deleteOject: {
        serviceTypeCode: '',
        applicationCode: '',
        weightType: ''
      },
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
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        { title: '服务模块',
          key: 'serviceModule',
          align: 'center'
        },
        { title: '权重',
          key: 'weight',
          align: 'center',
          render: (h, params) => {
            return h('span', {
            }, `${params.row.weightRatioName}=${params.row.weightRatioValue}`)
          }
        },
        { title: '权重类型',
          key: 'weightType',
          align: 'center'
        },
        { title: '服务类型',
          key: 'serviceType',
          align: 'center',
          width: 200
        },
        { title: '所属应用',
          key: 'applicationCode',
          align: 'center'
        }
      ],
      showWeightNormal: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        { title: '服务模块',
          key: 'serviceModule',
          align: 'center'
        },
        { title: '权重',
          key: 'weight',
          align: 'center',
          render: (h, params) => {
            return h('span', {
            }, `${params.row.weightRatioName}=${params.row.weightRatioValue}`)
          }
        },
        { title: '服务类型',
          key: 'serviceType',
          align: 'center',
          width: 200
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
          align: 'center',
          width: 300
        },
        {
          title: '权重恢复',
          key: 'noticeType',
          width: 100,
          render: (h, params, column) => {
            if (params.row.isAbnormalWeightId === false) {
              return h('Button', {
                on: {
                  click: () => {
                    alert('等待开发')
                  }
                }
              }, '权重恢复')
            } else {
              return h('span', {
              }, '正常权重')
            }
          }
        }
      ]
    }
  },
  methods: {
    selectedCheckBox (e) {
    },
    selectedTypeClick (e) {
      const info = {
        serviceTypeCode: e
      }
      console.log(info)
      searchManufacture(info).then(res => {
        this.checkList = res.data.data
      })
    },
    selectedModuleClick (e) {
      serarchTypeByModule(e).then(res => {
        this.typeOption = res.data.data
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
      this.$refs[index].validate(valid => {
        if (valid) {
          if (this.showType === 'add') {
            const info = {
              applicationCode: this.useSelected,
              serviceTypeCode: this.selectedModuleType,
              weightRatioKey: this.checkedData.join(':'),
              weightRatioValue: this.inputValue,
              weightType: this.selectedWeight,
              serviceModuleCode: this.selectedModuleTwo
            }
            addWeight(info).then(res => {
              this.$Message.success({
                content: res.data.message
              })
              this.getWeight(1, 1)
              this.modalEdit = false
            }).catch(error => {
              this.$Message.error({
                content: error
              })
              this.modalEdit = false
            })
          } else if (this.showType === 'edit') {
            const info = {
              applicationCode: this.useSelected,
              serviceTypeCode: this.selectedModuleType,
              weightRatioKey: this.checkedData.join(':'),
              weightRatioValue: this.inputValue,
              weightType: this.selectedWeight,
              serviceModuleCode: this.selectedModuleTwo
            }
            editWeight(info).then(res => {
              this.$Message.success({
                content: res.data.message
              })
              this.getWeight(1, 1)
              this.modalEdit = false
            }).catch(error => {
              this.$Message.error({
                content: error
              })
              this.modalEdit = false
            })
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
    edit (index, row) {
      this.useSelected = row.applicationCode
      this.inputValue = row.weightRatioValue
      this.selectedWeight = row.weightType
      this.selectedModuleTwo = row.serviceModule
      this.showType = 'edit'
      this.detailTitle = '编辑模块'
      this.modalEdit = true
    },
    lookAbnormalWeight (index) {
      this.showWeightAbnormal = true
      this.getWeight(2, 2, this.confData[index].applicationCode, this.confData[index].serviceTypeCode)
    },
    deleteId (index, row) {
      this.deleteOject.applicationCode = row.applicationCode
      this.deleteOject.weightType = row.weightType
      this.deleteOject.serviceTypeCode = row.serviceTypeCode
      this.modalDelete = true
    },
    handleSubmitDelete () {
      deleteWeight(this.deleteOject).then(res => {
        this.getWeight(1, 1)
        this.modalDelete = false
      }).catch(error => {
        this.$Message.error({
          content: error
        })
      })
      this.modalDelete = false
    },
    cancelDelete () {
      this.modalDelete = false
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
    getWeight (number, flag, applicationCode, serviceTypeCode) {
      const info = {
        serviceTypeCode: serviceTypeCode,
        applicationCode: applicationCode,
        abnormalWeightType: number,
        currentPage: this.pageNum,
        pageSize: this.pageSize
      }
      getWeight(info).then(res => {
        this.renderPage(res.data.data.records, res.data.data.total, flag)
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
    })
    getAllApp().then(res => {
      this.useOption = res.data.data
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
