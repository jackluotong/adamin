<template>
  <div>
    <Select v-model="redisKeyType" style="width:200px; margin-right: 10px;">
        <Option v-for="item in redisKeyTypes" :value="item.value" :key="item.value">{{ item.key }}</Option>
    </Select>
    <Input v-model="redisKey" placeholder="请输入key" style="width: 30%; margin-right: 10px;" />
    <Button type="success" style="margin-right: 10px;" @click="search()">搜索</Button>
    <Button @click="reset()">重置</Button>
    <Table stripe :columns="columns" :data="redisDataList" style="margin-top: 20px">
      <template slot-scope="{ row, index }" slot="action">
          <Button type="info" size="small" style="margin-right: 15px" @click="updateRedis(index)">修改</Button>
          <Button type="error" size="small" style="" @click="delRedisByKey(index)">删除</Button>
        </template>
     </Table>
    <Modal v-model="isDisplay" :loading="loading" @on-ok="updateRedisByKey()" width="80%" height="40%"  :mask-closable="false" :closable="true" v-bind:title="detailTitle">
      <Form ref="redisData" :model="redisData" :rules="ruleRedisData" inline>
        <FormItem prop="key" style="width: 100%;">
          KEY:
          <Input type="text" disabled v-model="redisData.key" placeholder="key" >
          </Input>
        </FormItem>
        <FormItem prop="value" style="width: 100%;">
          VALUE:
          <Input type="textarea" :autosize="{minRows: 1,maxRows: 10}" v-model="redisData.value" placeholder="value">
          </Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>

<script>
import { searchResisByKey, updateRedisByKey, delRedisByKey } from '@/api/data'
export default {
  data () {
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      redisKeyType: '',
      redisKeyTypes: [
        {
          key: '基础数据-全局配置',
          value: 'BaseData:conf:'
        },
        {
          key: '基础数据-字典数据',
          value: 'BaseData:dict:'
        },
        {
          key: '登陆用户数据',
          value: 'LoginUser:admin:'
        }
      ],
      redisKey: '',
      redisDataList: [],
      redisData: {},
      columns: [
        {
          title: 'key',
          key: 'key',
          width: 300,
          align: 'center'
        },
        {
          title: 'value',
          key: 'value',
          width: 500,
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          width: 100,
          align: 'center'
        },
        {
          title: '大小',
          key: 'size',
          width: 80,
          align: 'center'
        },
        {
          title: '剩余过期时间(s)',
          key: 'timeRemaining',
          width: 200,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      isDisplay: false,
      loading: true,
      detailTitle: 'Redis-数据修改',
      ruleRedisData: {
        key: [
          { required: true, message: 'key不能为空！', trigger: 'blur' }
        ],
        value: [
          { required: true, message: 'value不能为空！', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    delRedisByKey (index) {
      this.$Modal.confirm({
        title: '警告',
        content: '确认删除 key:' + this.redisDataList[index].key,
        okText: '确认删除',
        cancelText: '取消',
        onOk: () => {
          delRedisByKey(this.redisDataList[index]).then(res => {
            this.$Message.info(res.data.data)
            this.search()
            this.$Modal.remove()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    updateRedisByKey () {
      this.$refs['redisData'].validate((valid) => {
        if (valid) {
          if (this.redisData.type !== 'STRING') {
            this.$Message.error('暂不支持就该非String类型的reids数据!')
            this.isDisplay = false
            return
          }
          updateRedisByKey(this.redisData).then(res => {
            this.$Message.info(res.data.data)
            this.search()
            this.isDisplay = false
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$Message.error('请检查数据')
        }
      })
    },
    updateRedis (index) {
      this.redisData = this.redisDataList[index]
      this.isDisplay = true
    },
    reset () {
      this.redisKeyType = ''
      this.redisKey = ''
      this.redisDataList = []
    },
    search () {
      if (!this.redisKey) {
        this.$Message.error('key不能为空!')
        return
      }
      const date = {
        'key': this.redisKeyType + this.redisKey
      }
      searchResisByKey(date).then(res => {
        this.redisDataList = []
        this.redisDataList = res.data.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {

  }
}
</script>
<style lang="less" scoped>

</style>
