<template>
  <div class="user-content">
    <div class="content-button">
      <Input v-model.trim="menuCode" placeholder="菜单code"/>
      <Button type="primary" icon="md-search" @click="search()">查询</Button>
      <Button type="primary" icon="md-refresh" @click="reset()">重置</Button>
      <Button type="primary" icon="md-add" @click="addSetting()">新增菜单</Button>
    </div>
    <Table highlight-row stripe :columns="columns" :data="authMenuData" style="margin-top: 5px"/>
    <Modal v-model.trim="modelDelete" title="确认框" :scrollable="true" @on-ok="ok" @on-cancel="cancel">
      <p>确定删除该平台版本吗？</p>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { authMenuPageList, deleteMenuById } from '@/api/data'
export default {
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      menuCode: '', // 菜单Code
      modelDelete: false,
      modelInfo: {
        actionFlag: '',
        menuId: ''
      },
      ruleInline: {
      },
      authMenuData: [ // 参数配置数据
      ],
      columns: [
        {
          title: '菜单code',
          key: 'menuCode',
          width: 200,
          align: 'center'
        },
        {
          title: '菜单描述',
          key: 'menuDesc',
          width: 200,
          align: 'center'
        },
        {
          title: '菜单级别',
          key: 'menuLevel',
          width: 100,
          align: 'center'
        },
        {
          title: '所属页面',
          key: 'belongPage',
          width: 200,
          align: 'center'
        },
        {
          title: '所属菜单',
          key: 'menuParentCode',
          width: 200,
          align: 'center'
        },
        {
          title: '菜单布局标识',
          key: 'menuLayoutType',
          width: 150,
          align: 'center',
          render (h, params) {
            const colorObj = {
              '01': '#ed4014',
              '02': '#ff9900',
              '03': '#cc6666',
              '04': '#003399',
              '05': '#19be6b'
            }
            const textObj = {
              '01': 'banner',
              '02': '八宫格',
              '03': '四宫格',
              '04': '两宫格',
              '05': '列表'
            }

            const color = colorObj[params.row.menuLayoutType]
            const text = textObj[params.row.menuLayoutType]
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
          title: '所属设备类型',
          key: 'deviceType',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let text
            switch (row.deviceType) {
              case 'android':
                text = 'android'
                break
              case 'iphone':
                text = 'iPhone'
                break
              case 'ipad':
                text = 'iPad'
                break
              case 'pad':
                text = 'pad'
                break
              default:
                text = '-'
                break
            }
            return h('Tag', text)
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    sessionStorage.setItem('modelInfo', JSON.stringify(params.row))
                    this.$router.push({
                      name: 'addMenu'
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
                      menuId: params.row.id,
                      saveOrCacheFlag: '1',
                      actionFlag: 'delete'
                    }))
                    this.modelDelete = true
                  }
                }
              }, '删除')
            ])
          }
        }
      ]

    }
  },
  methods: {
    search () { // 点击查询按钮
      const date = {
        'menuCode': this.menuCode,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      authMenuPageList(date).then(res => {
        // this.$Message['success']({
        //   background: true,
        //   content: res.data.data
        // })
        this.authMenuData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    reset () { // 点击重置按钮
      this.menuCode = ''
      this.pageNum = 1
      this.authMenuPageList()
    },
    addSetting () { // 点击新增按钮
      this.$router.push({
        name: 'addMenu'
      })
    },
    ok () {
      let modelInfo = JSON.parse(sessionStorage.getItem('modelInfo'))
      if (modelInfo.actionFlag === 'delete') {
        this.deleteMenuById(modelInfo.menuId)
      }
    },
    cancel () {
      let modelInfo = JSON.parse(sessionStorage.getItem('modelInfo'))
      if (modelInfo.actionFlag === 'delete') {
        this.modelDelete = false
      }
    },
    deleteMenuById (id) {
      deleteMenuById(id).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        this.modelDelete = false
        this.authMenuPageList()
      }).catch(err => {
        console.log(err)
      })
    },
    authMenuPageList () { // 根据条件分页查询全部配置
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      authMenuPageList(date).then(res => {
        this.authMenuData = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    changePage (date) {
      this.pageNum = date
      this.authMenuPageList()
    },
    ageSizeChange (date) {
      this.pageNum = 1
      this.pageSize = date
      this.authMenuPageList()
    }
  },
  created () {
    this.authMenuPageList()
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
