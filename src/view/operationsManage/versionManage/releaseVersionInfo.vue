<template>
  <div class="user-content">
    <div class="content-button">
      发布平台：
      <Select label="" v-model.trim="platform" style="width:150px; marginRight:20px;">
        <Option v-for="item of plateformEnumList" :key="item.value" :value="item.value" >{{item.label}}</Option>
      </Select>
      <Button type="primary" icon="md-search" @click="search()">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
      <Button type="primary" icon="md-add" @click="release()">版本更新</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="versionData" style="margin-top: 5px">
    </Table>
    <Page :total='total' :page-size='pageSize' :show-total="true" show-sizer style="text-align: center;margin-top: 5px"/>
    <Modal v-model="showDetailModal" title="发布描述详情" footer-hide>
      <p>{{showDetailContent}}</p>
    </Modal>
    <Modal v-model.trim="modelDelete" title="确认框" :scrollable="true" @on-ok="ok" @on-cancel="cancel">
      <p>确定删除该平台版本吗？</p>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal v-model.trim="modelRelease" title="确认框" :scrollable="true" @on-ok="ok" @on-cancel="cancel">
      <p>该平台版本为
        <span style='color:blue;cursor:pointer'>{{showPlateform}}</span>
        <span style='color:blue;cursor:pointer'>{{showVersion}}</span>
      </p>
      <p>确定发布该平台版本吗？</p>
    </Modal>
  </div>
</template>

<script>
import { versionPageList, versionRelease, versionDelete } from '@/api/data'
export default {
  data () {
    return {
      NotAllowedEdit: false, // 是否能够操作
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      platform: '',
      showDetailModal: false, // 是否显示短信详情弹窗
      showDetailContent: '',
      showPlateform: '',
      showVersion: '',
      modelDelete: false,
      modelRelease: false,
      modelInfo: {
        actionFlag: '',
        versionId: ''
      },
      formInline: { // 实体

      },
      plateformEnumList: [ // 发送状态类型枚举
        {
          'value': 'iPhone',
          'label': 'iPhone'
        },
        {
          'value': 'iPad',
          'label': 'iPad'
        },
        {
          'value': 'Android',
          'label': 'Android'
        },
        {
          'value': 'AndroidPad',
          'label': 'AndroidPad'
        }
      ],
      versionData: [], // 版本信息数据
      columns: [
        {
          title: 'id',
          key: 'id',
          tooltip: true,
          width: 200,
          align: 'center'
        },
        {
          title: '发布平台',
          key: 'platform',
          width: 200,
          align: 'center'
        },
        {
          title: '版本号',
          key: 'version',
          width: 200,
          align: 'center'
        },
        {
          title: '发布描述',
          key: 'releaseDescription',
          width: 300,
          tooltip: true,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.releaseDescription
                },
                on: {
                  click: () => {
                    this.showDetailContent = params.row.releaseDescription.replace(/\n/g, '<br>')
                    this.showDetailModal = true
                  }
                }
              }, params.row.releaseDescription)
            ])
          }
        },
        {
          title: '发布时间',
          key: 'dateRelease',
          width: 200,
          align: 'center'
        },
        {
          title: '发布状态',
          key: 'dateRelease',
          width: 200,
          align: 'center',
          render (h, params) {
            const colorObj = {
              '1': '#19be6b',
              '0': '#cccccc'
            }
            const textObj = {
              '1': '已发布',
              '0': '未发布'
            }
            const color = colorObj[params.row.releaseStatus]
            const text = textObj[params.row.releaseStatus]
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  'background-color': color,
                  marginRight: '5px'
                }
              }, ''),
              h('span', {
                style: {
                  color: color
                }
              }, text)
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            switch (params.row.releaseStatus) {
              case '0': // 未发布
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small',
                      disabled: this.NotAllowedEdit
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        sessionStorage.setItem('modelInfo', JSON.stringify({
                          versionId: params.row.id,
                          saveOrCacheFlag: '1',
                          actionFlag: 'release'
                        }))
                        this.showPlateform = params.row.platform
                        this.showVersion = params.row.version
                        this.modelRelease = true
                      }
                    }
                  }, '发布'),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      disabled: this.NotAllowedEdit
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        sessionStorage.setItem('modelInfo', JSON.stringify(params.row))
                        this.$router.push({
                          name: 'releaseVersion'
                        })
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      disabled: this.NotAllowedEdit
                    },
                    on: {
                      click: () => {
                        sessionStorage.setItem('modelInfo', JSON.stringify({
                          versionId: params.row.id,
                          saveOrCacheFlag: '1',
                          actionFlag: 'delete'
                        }))
                        this.modelDelete = true
                      }
                    }
                  }, '删除')
                ])
              case '1': // 已发布
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        sessionStorage.setItem('modelInfo', JSON.stringify(params.row))
                        this.$router.push({
                          name: 'releaseVersion'
                        })
                      }
                    }
                  }, '查看')
                ])
            }
          }
        }
      ]

    }
  },
  methods: {
    search () { // 点击查询按钮
      const date = {
        'platform': this.platform,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      versionPageList(date).then(res => {
        this.versionData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    reset () { // 点击重置按钮
      this.platform = ''
      this.pageNum = 1
      this.versionPageList()
    },
    versionPageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      versionPageList(date).then(res => {
        // this.versionData = []
        // const data = res.data.data.resultList
        // data.forEach(e => {
        //   this.versionData.push(e.releaseVersionInfoDTO)

        // })
        this.versionData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    release () {
      this.$router.push({
        name: 'releaseVersion'
      })
    },
    ok () {
      let modelInfo = JSON.parse(sessionStorage.getItem('modelInfo'))
      if (modelInfo.actionFlag === 'delete') {
        this.versionDelete(modelInfo.versionId)
      } else if (modelInfo.actionFlag === 'release') {
        this.versionRelease(modelInfo.versionId)
      }
    },
    cancel () {
      let modelInfo = JSON.parse(sessionStorage.getItem('modelInfo'))
      if (modelInfo.actionFlag === 'delete') {
        this.modelDelete = false
      } else if (modelInfo.actionFlag === 'release') {
        this.modelRelease = false
      }
    },
    versionDelete (id) {
      versionDelete(id).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.modelDelete = false
        this.versionPageList()
      }).catch(err => {
        console.log(err)
      })
    },
    versionRelease (id) {
      versionRelease(id).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.modelRelease = false
        this.versionPageList()
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.versionPageList()
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
