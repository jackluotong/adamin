<template>
  <div>
    <div class="baseContent">
      <div class="title">应用信息</div>
      <div v-for="(item, index) in menuList" :value="item.name" :key="index">
      <Form ref="resourceInfoForm" :model="resourceInfo" :rules="ruleValidate" :label-width="170" class="baseInfo" inline style="margin-top:20px;">
        <FormItem label="菜单code：" prop="menuCode" style="width:20%;">
            <Input :disabled="true" v-model.trim="item.menuCode"  style="width:200px;" icon="ios-alert-outline" />
        </FormItem>
        <FormItem label="菜单描述：" prop="menuDesc" style="width:20%;">
            <Input :disabled="true" style="width:200px;" v-model.trim="item.menuDesc"></Input>
        </FormItem>
        <FormItem label="菜单展示名称：" prop="menuText" style="width:100%;">
            <Input :disabled="NotAllowedEdit" style="width:200px;" v-model.trim="item.menuText"></Input>
        </FormItem>

        <div>
          <Button>{{index}}</Button>
          <div class="upload">
            <!-- <input type="file" @click="asd(index)" @change="uploadImg($event, index)" ref="file" id="application" accept="image/jpeg,image/jpg"> -->
            <div>
              <label :for="index">
                <input type="file" @click="asd(index)" @change="uploadImg($event, index)" ref="file" :id="index" accept="image/jpeg,image/jpg">
              </label>
            </div>
            <div class="showImg" :class="{'nameHidden': !item.menuImgUrl}">
              <img :src="item.menuImgUrl" alt="" />
              <div class="cover">
                <Icon type="ios-eye-outline" @click.native="handleView('application')"></Icon>
                <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemove('application')"></Icon>
              </div>
            </div>
            <div @click="uploadFile(index)" class="addButton" :class="{'nameHidden': item.menuImgUrl}">+</div>
            <div class='ImgText'>&#42;支持JPG格式图片，500k以内</div>
          </div>

        </div>

        <!-- <FormItem label="菜单展示图片：" prop='application' style="width:100%;">
          <Button>{{index}}</Button>
          <div class="upload"> -->
            <!-- <input type="file" @click="asd(index)" @change="uploadImg($event, index)" ref="file" id="application" accept="image/jpeg,image/jpg"> -->
            <!-- <div>
              <label :for="index">
                <input type="file" @click="asd(index)" @change="uploadImg($event, index)" ref="file" id="application" accept="image/jpeg,image/jpg">
              </label>
            </div>
            <div class="showImg" :class="{'nameHidden': !item.menuImgUrl}">
              <img :src="item.menuImgUrl" alt="" />
              <div class="cover">
                <Icon type="ios-eye-outline" @click.native="handleView('application')"></Icon>
                <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemove('application')"></Icon>
              </div>
            </div>
            <div @click="uploadFile('application')" class="addButton" :class="{'nameHidden': item.menuImgUrl}">+</div>
            <div class='ImgText'>&#42;支持JPG格式图片，500k以内</div>
          </div>
        </FormItem> -->
      </Form>
      </div>
    </div>
    <Modal title="图片预览" :disabled="NotAllowedEdit" v-model.trim="visible">
      <img :src="visibleSrc" v-if="visible" style="width: 100%">
    </Modal>
    <div class="submit">
      <Button type="primary" @click="handleSave()" :disabled="NotAllowedEdit" style="margin-right:15px">提交</Button>
      <Button type="primary" @click="goBack" style="margin-right:15px">返回</Button>
    </div>
  </div>
</template>

<script>
import { resourceList, upload } from '@/api/data'
export default {
  data () {
    return {
      ruleValidate: {
      },
      menuList: [
        {
          menuCode: '111',
          menuDesc: '222',
          menuImgUrl: '',
          menuText: ''
        },
        {
          menuCode: '333',
          menuDesc: '444',
          menuImgUrl: '',
          menuText: ''
        }
      ],
      imgIndex: '',
      menuResourceList: [],
      visibleSrc: '', // 图片大图地址
      visible: false, // 是否展示图片大图
      NotAllowedEdit: false, // 是否允许编辑页面
      isModify: '', // 数据是否修改
      uploadType: '', // 文件上传类型
      resourceInfo: { // 版本信息
        id: '', // 版本id
        platform: '', // 发布平台（iPhone、iPad、Android、AndroidPad）
        menuCode: '111', // 版本号
        menuDesc: '', // 发布描述
        menuText: '' // 发布状态（0：未发布，1：已发布）
      },
      applicationIconDelete: [], // 应用图标置为失效数据list
      releaseResourceResult: { // 后台返回版本对应资源数据
        backgroundImage: {
          id: '',
          belongVersionId: '',
          attachBizField: '',
          attachName: '',
          attachUrl: ''
        },
        application: {
          id: '',
          belongVersionId: '',
          attachBizField: '',
          attachName: '',
          attachUrl: ''
        },
        banner: [],
        installPackage: []
      }
    }
  },
  methods: {
    asd (index) {
      console.log(index)
      this.imgIndex = index
    },
    goBack () { // 返回发布版本信息页面
      this.$router.push({
        name: 'resourceManage'
      })
    },
    handleSave () { // 版本发布（暂存）
      console.log(this.menuList)
    },
    resourceList () { // 根据条件分页查询全部版本资源信息
      resourceList(this.resourceInfo.id).then(res => {
        this.total = res.data.data.totalAmount
      }).catch(err => {
        console.log(err)
      })
    },
    uploadFile (id) {
      let imFile = document.getElementById(id)
      imFile.click()
    },
    uploadImg (e, index) { // 上传图标
      var that = this
      console.log(e)
      console.log(index)
      that.uploadFileSingle('application', function (response) {
        that.menuList[index].menuImgUrl = response.attachUrl
        console.log(that.menuList)
      }, e)
    },
    uploadFileSingle (uploadType, fn, e) { // 单个文件上传
      let files = e.target.files.length > 0 ? e.target.files[0] : ''
      console.log(files)
      let formData = new FormData()
      formData.append('file', files)
      formData.append('uploadType', uploadType)
      upload(formData).then(res => {
        if (res.data.code === '000') {
          var response = res.data.data.data
          fn(response)
          console.log(response)
          this.total = res.data.data.totalAmount
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleView (params) { // 点击查看图片大图
      if (this.releaseResourceResult) {
        switch (params) {
          case 'application':
            this.visibleSrc = this.releaseResourceResult.application.attachUrl
            break
        }
        this.visible = true
      }
    },
    handleRemove (params) { // 点击删除已上传图片（背景图、应用图标）
      if (this.NotAllowedEdit) {
        this.$Message.info('查看状态下不可进行编辑操作！')
        return
      }
      switch (params) {
        case 'application':
          this.resourceInfo.id = this.releaseResourceResult.application.id
          this.resourceInfo.belongNo = this.releaseResourceResult.application.belongNo
          this.resourceInfo.attachBizField = this.releaseResourceResult.application.attachBizField
          this.resourceInfo.attachName = this.releaseResourceResult.application.attachName
          this.resourceInfo.attachUrl = this.releaseResourceResult.application.attachUrl
          this.resourceInfo.isModify = '1'
          this.applicationIconDelete.unshift(this.resourceInfo)
          this.resourceInfo = {}
          this.releaseResourceResult.application.attachUrl = ''
          this.releaseResourceResult.application.attachId = ''
          this.releaseResourceResult.application.id = ''
          this.releaseResourceResult.application.attachBizField = ''
          this.releaseResourceResult.application.attachName = ''
          break
      }
    }
  },
  created () {
    // 接收上一个页面传来的版本信息，查询对应资源信息，控制可编辑权限
    let modelInfo = JSON.parse(sessionStorage.getItem('modelInfo'))
    console.log(modelInfo)
    authMenuPageList(modelInfo).then(res => {
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
  destroyed () {
    sessionStorage.clear()
  },
  computed: {
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
