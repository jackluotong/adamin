<template>
  <div class="main">
    <Row>
      <Col span="6" v-for="item in menuVersionList" :value="item.name" :key="item.name">
        <Card style="width:350px; margin-bottom: 50px">
          <div class="div-left">
            {{item.versionDescription}}
          </div>
          <div class="div-right">
            <span>已启用</span>
          </div>
          <div class="content">
            <p>版本描述：{{item.menuVersion}}</p>
            <p>创建时间：{{item.dateCreate}}</p>
            <p>修改时间：{{item.dateModify}}</p>
          </div>
          <Divider style="margin-bottom: 0px;"/>
          <div class="bottom">
            <div class="opreation">
              <Button type="text" size="small" @click="valid(item.menuVersion)">启用</Button>
              <Divider type="vertical" style="margin-bottom: -10px; margin-left: 10%"/>
              <Button type="text" size="small" @click="invalid(item.menuVersion)">停用</Button>
              <Divider type="vertical" style="margin-bottom: -10px; margin-left: 10%" />
              <Dropdown placement="top">
                <div>
                  <Icon type="ios-arrow-up" style="margin-left: 35px; margin-bottom: -10px;"></Icon>
                </div>
                <DropdownMenu slot="list" style="margin-right:0px">
                  <div class="dropdownMenu">
                    <Button type="text" size="small" style="margin-top:-13px; margin-left:auto" @click="edit(item.id)">编辑</Button><br>
                    <Button type="text" size="small" style="margin-top:-13px; margin-left:auto" @click="copy(item.menuVersion)">复用</Button>
                  </div>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import { validById, getMenuVersionList, batchInsert } from '@/api/data'
export default {
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      menuVersionList: [],
      authMenuInfoReqDTO: {
        versionId: '',
        newMenuVersion: '',
        versionDescription: ''
      },
      modelInfo: {
        id: ''
      },
      movieList: [
        {
          menuVersion: '1',
          versionDescription: '默认套装',
          dateCreate: 2021,
          dateModify: 2021
        },
        {
          menuVersion: '2',
          versionDescription: '测试2',
          dateCreate: 2021,
          dateModify: 2021
        },
        {
          menuVersion: '3',
          versionDescription: '新春套装',
          dateCreate: 2021,
          dateModify: 2021
        },
        {
          menuVersion: '4',
          versionDescription: '测试4',
          dateCreate: 2021,
          dateModify: 2021
        },
        {
          menuVersion: '5',
          versionDescription: '开门宏测试',
          dateCreate: 2021,
          dateModify: 2021
        }
      ],
      randomMovieList: []
    }
  },
  methods: {
    valid (index) { // 启用
      validById(index).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
      }).catch(err => {
        console.log(err)
      })
    },
    invalid () { // 停用

    },
    edit (index) { // 编辑（带menuVersion跳转页面）
      sessionStorage.setItem('modelInfo', JSON.stringify(index))
      this.$router.push({
        name: 'addResource'
      })
    },
    copy (index) { // 复用
      this.authMenuInfoReqDTO.versionId = index
      this.authMenuInfoReqDTO.newMenuVersion = ''
      this.authMenuInfoReqDTO.versionDescription = ''
      batchInsert(this.authMenuInfoReqDTO).then(res => {
        this.$Message['success']({
          background: true,
          content: res.data.message
        })
        if (res.data.code === '000') {
          this.getMenuVersionList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getMenuVersionList () {
      const date = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      getMenuVersionList(date).then(res => {
        // this.$Message['success']({
        //   background: true,
        //   content: res.data.data
        // })
        this.menuVersionList = res.data.data.resultList
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.getMenuVersionList()
  }
}
</script>
<style lang="less" scoped>
.main{
  margin-left:40px;
  .div-left{
    float:left;
    margin-left: 20px;
    margin-bottom: 5px;
    width:60%;
    font-size: 20px
  }
  .div-right{
    float:right;
    margin-top: 5px;
    width:30%;
    height: 30px;
    text-align: center;
    font-size: 10px
  }
  .content{
    margin-left: 20px;
    p{
      margin-bottom: 5px;
      color:rgba(0,0,0,0.45);
    }
  }
  .bottom{
    .opreation{
      button{
        margin-left: 10%;
        margin-bottom: -10px;
        font-weight:bold
      }
    }
    .dropdownMenu{
      margin-left:30%
    }
  }
}
.ivu-btn:focus{
  box-shadow: none!important;
}
</style>
