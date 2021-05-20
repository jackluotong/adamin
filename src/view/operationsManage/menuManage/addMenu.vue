<template>
  <div>
    <div class="baseContent">
      <div class="title">菜单信息</div>
      <Form ref="menuInfoForm" :model="menuInfo" :rules="ruleValidate" :label-width="170" class="baseInfo">
        <FormItem label="应用平台：" prop="deviceType" style="margin-top:20px; width:70%;">
          <RadioGroup v-model.trim="menuInfo.deviceType" type="button">
              <Radio label="iPhone" :disabled="NotAllowedplatformEdit">iPhone</Radio>
              <Radio label="iPad" :disabled="NotAllowedplatformEdit">iPad</Radio>
              <Radio label="Android" :disabled="NotAllowedplatformEdit">Android</Radio>
              <Radio label="pad" :disabled="NotAllowedplatformEdit">Android Pad</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="版本选择：" prop="menuVersion1" style="width:31%;" v-show="showMenuVersion">
            <Input :disabled="true" v-model.trim="menuInfo.menuVersion" icon="ios-alert-outline" />
        </FormItem>
        <FormItem label="版本描述：" prop="menuDescription1" style="width:31%;" v-show="showMenuDescription">
            <Input
            :disabled="true"
            v-model.trim="menuInfo.menuDescription"
            type="textarea"
            :autosize="{minRows: 4,maxRows: 5}"/>
        </FormItem>

        <FormItem label="版本选择：" prop="menuVersion" style="margin-top:20px; width:70%;" v-show="showVersion">
          <Select v-model.trim="description" style="width:150px; marginRight:20px;" :label-in-value="true" @on-change="getMenuDescription">
            <Option v-for="item in menuVersionList" :key="item.menuDescription" :value="item.menuDescription">{{item.menuVersion}}</Option>
          </Select>
        </FormItem>
        <FormItem label="版本描述：" prop="menuDescription" style="width:31%;" v-show="showDescription">
            <Input
            :disabled="DescNotAllowedEdit"
            v-model.trim="description"
            type="textarea"
            :autosize="{minRows: 4,maxRows: 5}"/>
        </FormItem>
        <FormItem label="菜单级别：" prop="menuLevel" style="margin-top:20px; width:70%;">
          <Select v-model.trim="menuInfo.menuLevel" style="width:150px; marginRight:20px;" @on-change="menuLevelChange">
            <Option v-for="item of menuLevelEnumList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="菜单Code：" prop="menuCode" style="width:31%;">
            <Input placeholder="菜单Code" :disabled="NotAllowedEdit" v-model.trim="menuInfo.menuCode" icon="ios-alert-outline" />
        </FormItem>

        <FormItem label="所属页面：" prop="belongPage" style="width:31%;" v-show="showBelongPage">
            <Input placeholder="请输入所属页面" :disabled="NotAllowedEdit" v-model.trim="menuInfo.belongPage" icon="ios-alert-outline" />
        </FormItem>

        <FormItem label="父资源Code：" prop="menuParentCode" style="width:31%;" v-show="showMenuParentCode">
            <Input placeholder="请输入父资源Code" :disabled="NotAllowedEdit" v-model.trim="menuInfo.menuParentCode" icon="ios-alert-outline" />
        </FormItem>

        <FormItem label="布局标识：" prop="menuLayoutType" style="margin-top:20px; width:70%;">
          <Select v-model.trim="menuInfo.menuLayoutType" style="width:150px; marginRight:20px;">
            <Option v-for="(item, index) in menuLayoutTypeEnumList" :key="index" :value="item.value" :label="item.lable">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="菜单描述：" prop="menuDesc" style="width:70%;">
            <Input
            :disabled="NotAllowedEdit"
            :maxlength="50"
            style="font-size: 12px"
            v-model.trim="menuInfo.menuDesc"
            type="textarea"
            :autosize="{minRows: 4,maxRows: 5}"
            placeholder="请输入版本更新描述"></Input>
        </FormItem>
      </Form>
    </div>
    <div class="submit">
      <Button type="primary" @click="handleSave('menuInfoForm')" :disabled="NotAllowedEdit" style="margin-right:15px">保存</Button>
      <Button type="primary" @click="goBack" style="margin-right:15px">返回</Button>
    </div>
  </div>
</template>

<script>
import { authMenuInfo, getAuthMenuVersionInfo } from '@/api/data'
export default {
  data () {
    const validateDeviceType = (rule, value, callback) => {
      if (!this.menuInfo.deviceType) {
        callback(new Error('请选择发布平台'))
      } else {
        callback()
      }
    }
    // const validateMenuVersion = (rule, value, callback) => {
    //   if (!this.description) {
    //     callback(new Error('请选择版本'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateMenuLevel = (rule, value, callback) => {
      if (!this.menuInfo.menuLevel) {
        callback(new Error('请选择菜单级别'))
      } else {
        callback()
      }
    }
    const validateMenuCode = (rule, value, callback) => {
      if (!this.menuInfo.menuCode) {
        callback(new Error('请输入菜单Code'))
      } else {
        callback()
      }
    }
    const validateMenuLayoutType = (rule, value, callback) => {
      if (!this.menuInfo.menuLayoutType) {
        callback(new Error('请选择菜单布局标识'))
      } else {
        callback()
      }
    }
    const validateMenuDesc = (rule, value, callback) => {
      if (!this.menuInfo.menuDesc) {
        callback(new Error('请输入菜单描述'))
      } else {
        callback()
      }
    }
    return {
      total: 0, // 总数
      pageNum: 1, // 第几页
      pageSize: 30, // 每页几条数据
      DescNotAllowedEdit: true,
      NotAllowedplatformEdit: false, // 是否允许编辑平台信息
      NotAllowedEdit: false,
      showBelongPage: false,
      showMenuParentCode: false,
      showMenuVersion: false,
      showMenuDescription: false,
      showVersion: true,
      showDescription: true,
      description: '',
      version: '',
      belongVersionNo: '',
      menuInfo: { // 实体
        id: '',
        deviceType: '',
        menuVersion: '',
        menuDescription: '',
        menuLevel: '',
        menuCode: '',
        belongPage: '',
        menuParentCode: '',
        menuLayoutType: '',
        menuDesc: ''
      },
      menuLevelEnumList: [ // 邮件类型枚举
        {
          value: '1',
          label: '一级菜单'
        },
        {
          value: '2',
          label: '二级菜单'
        },
        {
          value: '3',
          label: '三级菜单'
        }
      ],
      menuLayoutTypeEnumList: [
        {
          value: '01',
          label: 'banner'
        },
        {
          value: '02',
          label: '八宫格'
        },
        {
          value: '03',
          label: '四宫格'
        },
        {
          value: '04',
          label: '两宫格'
        },
        {
          value: '05',
          label: '列表'
        }
      ],
      menuVersionList: [],
      menuVersionList1: [
        {
          menuVersion: '20210301',
          menuDescription: '撒大大'
        },
        {
          menuVersion: '20210325',
          menuDescription: '2'
        },
        {
          menuVersion: '20210407',
          menuDescription: '3'
        }
      ],
      ruleValidate: {
        deviceType: [
          { required: true, validator: validateDeviceType, trigger: 'blur' }
        ],
        // menuVersion: [
        //   { required: true, validator: validateMenuVersion, trigger: 'blur' }
        // ],
        menuLevel: [
          { required: true, validator: validateMenuLevel, trigger: 'blur' }
        ],
        menuCode: [
          { required: true, validator: validateMenuCode, trigger: 'blur' }
        ],
        menuLayoutType: [
          { required: true, validator: validateMenuLayoutType, trigger: 'blur' }
        ],
        menuDesc: [
          { required: true, validator: validateMenuDesc, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    goBack () { // 返回发布版本信息页面
      this.$router.push({
        name: 'menuManage'
      })
    },
    handleSave (index) { // 菜单新增
      console.log(this.menuInfo)
      this.$refs[index].validate((valid) => {
        if (valid) {
          authMenuInfo(this.menuInfo).then(res => {
            this.$Message['success']({
              background: true,
              content: res.data.message
            })
            if (res.data.code === '000') {
              this.goBack()
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$Message.error('请检查参数是否有误!')
        }
      })
    },
    menuLevelChange () {
      if (this.menuInfo.menuLevel === '1') {
        this.showBelongPage = false
        this.showMenuParentCode = false
      } else if (this.menuInfo.menuLevel === '2') {
        this.showBelongPage = true
        this.showMenuParentCode = false
      } else if (this.menuInfo.menuLevel === '3') {
        this.showBelongPage = true
        this.showMenuParentCode = true
      }
    },
    getMenuDescription (e) {
      console.log(e)
      if (e !== undefined) {
        this.version = e.label
        // console.log(this.version)
        // console.log(this.description)
        this.menuInfo.menuDescription = this.description
        this.menuInfo.menuVersion = this.version
        // console.log(this.menuInfo.menuDescription)
        // console.log(this.menuInfo.menuVersion)
      }
    }
  },
  created () {
    // 接收上一个页面传来的版本信息，查询对应资源信息，控制可编辑权限
    let modelInfo = JSON.parse(sessionStorage.getItem('modelInfo'))
    console.log(modelInfo)
    if (modelInfo !== null) {
      if (modelInfo.belongVersionNo !== null) {
        let id = modelInfo.belongVersionNo
        getAuthMenuVersionInfo(id).then(res => {
          this.$Message['success']({
            background: true,
            content: res.data.message
          })
          this.menuInfo.menuVersion = res.data.data.menuVersion
          this.menuInfo.menuDescription = res.data.data.menuDescription
        }).catch(err => {
          console.log(err)
        })
      }
      this.menuInfo.menuVersion = '111'
      this.menuInfo.id = modelInfo.id
      this.menuInfo.deviceType = modelInfo.deviceType
      this.menuInfo.menuLevel = modelInfo.menuLevel
      this.menuInfo.menuCode = modelInfo.menuCode
      this.menuInfo.belongPage = modelInfo.belongPage
      this.menuInfo.menuDesc = modelInfo.menuDesc
      this.menuInfo.menuParentCode = modelInfo.menuParentCode
      this.menuInfo.menuLayoutType = modelInfo.menuLayoutType
      if (this.menuInfo.menuVersion !== null) {
        this.showMenuVersion = true
        this.showMenuDescription = true
        this.showVersion = false
        this.showDescription = false
      }
      if (modelInfo.menuLevel === '1') {
        this.showBelongPage = false
        this.showMenuParentCode = false
      } else if (modelInfo.menuLevel === '2') {
        this.showBelongPage = true
        this.showMenuParentCode = false
      } else if (modelInfo.menuLevel === '3') {
        this.showBelongPage = true
        this.showMenuParentCode = true
      }
    } else { // 查询版本信息
      this.menuVersionList = this.menuVersionList1
    }
  },
  destroyed () {
    sessionStorage.clear()
  }
}
</script>
<style lang="less" scoped>
.baseContent {
  background-color: #fff;
  font-size: 14px;
  padding-bottom: 5px;
  margin: 24px 24px 0 24px;
  border-radius: 2px;
  .title {
    height: 55px;
    width: 100%;
    color: #333;
    font-size: 16px;
    line-height: 55px;
    padding: 0 0 0 32px;
    border-bottom: 1px solid #e9e9e9;
    font-weight: 500;
  }
  .upload {
    margin-bottom: 10px;
    .pic {
      display: inline-block;
      width: 94px;
    }
    label {
      width: 140px;
      display: block;
      border-radius: 2px;
      font-size: 14px;
    }
    img {
      display: inline-block;
      width: 32px;
      vertical-align: middle;
    }
    .addButton {
      display: inline-block;
      width: 80px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      border: 1px dotted #ccc;
      color: #ccc;
      font-size: 30px;
      border-radius: 4px;
      vertical-align: middle;
      cursor: pointer;
    }
    .showImg {
      width: 80px;
      height: 80px;
      position: relative;
      border-radius: 3px;
      img {
        width: 100%;
        height: 100%;
      }
      .cover {
        width: 100%;
        height: 30px;
        border-radius: 3px;
        display: none;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        cursor: pointer;
        i {
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          margin: 4px 10px;
        }
      }
      &:hover {
        .cover {
          display: block;
        }
      }
    }
  }
  input[type="file"] {
    display: none;
    z-index: 10;
    width: 120px;
    font-size: 0;
    height: 30px;
  }
  .nameHidden {
    display: none !important;
  }
}
.submit {
  height: 56px;
  background-color: #fff;
  box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
  text-align: center;
  line-height: 56px;
  margin: 1px 24px 0 24px;
  border-radius: 2px;
}
.delInstallPackage {
  padding: 4px;
  cursor: pointer;
}
</style>
