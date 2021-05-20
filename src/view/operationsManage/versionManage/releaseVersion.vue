<template>
  <div>
    <div class="baseContent">
      <div class="title">应用信息</div>
      <Form ref="versionInfoForm" :model="versionInfo" :rules="ruleValidate" :label-width="170" class="baseInfo">
        <FormItem label="应用平台：" prop="platform" style="margin-top:20px; width:70%;">
          <RadioGroup v-model.trim="versionInfo.platform" type="button">
              <Radio label="iPhone" :disabled="NotAllowedplatformEdit">iPhone</Radio>
              <Radio label="iPad" :disabled="NotAllowedplatformEdit">iPad</Radio>
              <Radio label="Android" :disabled="NotAllowedplatformEdit">Android</Radio>
              <Radio label="AndroidPad" :disabled="NotAllowedplatformEdit">Android Pad</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="版本号：" prop="version" style="width:31%;">
            <Input placeholder="请输入版本号" :disabled="NotAllowedEdit" v-model.trim="versionInfo.version" icon="ios-alert-outline" />
        </FormItem>
        <FormItem label="更新描述：" prop="saleModelName" style="width:70%;">
            <Input
            :disabled="NotAllowedEdit"
            :maxlength="50"
            style="font-size: 12px"
            v-model.trim="versionInfo.releaseDescription"
            type="textarea"
            :autosize="{minRows: 4,maxRows: 5}"
            placeholder="请输入版本更新描述"></Input>
        </FormItem>
        <FormItem label="安装包上传：" prop='installPackage'>
          <Button icon="ios-cloud-upload-outline" @click="uploadFile('installPackage')" :disabled="NotAllowedEdit">点击上传</Button>
          <input type="file" @change="uploadInstallPackage($event)" ref="file" id="installPackage" accept=".ipa,.apk,.plist">
          <div class='ImgText'>&#42;Android请上传.apk文件，iOS请上传.ipa文件与.plist文件</div>
        </FormItem>
        <FormItem>
          <div class="upload" v-for="(item, index) in hangshuList1" v-if="hangshuList1.length > 0" :key="index">
            <div>
              {{releaseResourceResult.installPackage[item * 4 + 0].attachName}}
              <span class="delInstallPackage" @click="handleRemoveList(index, 'installPackage')">X</span>
            </div>
            <div>
              {{releaseResourceResult.installPackage[item * 4 + 1].attachName}}
              <span class="delInstallPackage" @click="handleRemoveList(index, 'installPackage')">X</span>
            </div>
            <div>
              {{releaseResourceResult.installPackage[item * 4 + 2].attachName}}
              <span class="delInstallPackage" @click="handleRemoveList(index, 'installPackage')">X</span>
            </div>
            <div>
              {{releaseResourceResult.installPackage[item * 4 + 3].attachName}}
              <span class="delInstallPackage" @click="handleRemoveList(index, 'installPackage')">X</span>
            </div>
          </div>

          <div class="upload">
            <div v-for="(item, index) in yushuList1" v-if="yushuList1.length > 0" :key="index">
              <div>
                {{releaseResourceResult.installPackage[item].attachName}}
                <span class="delInstallPackage" @click="handleRemoveList(index, 'installPackage')">X</span>
              </div>
            </div>
          </div>
        </FormItem>
      </Form>
    </div>
    <div class="baseContent">
      <div class="title">下载页面配置</div>
      <Form ref="resourceInfoForm" :model="resourceInfo" :rules="ruleValidate" :label-width="170" class="baseInfo">
        <FormItem label="页面资源：" prop="chooseResourceType" style="margin-top:20px; width:70%;">
          <RadioGroup v-model.trim="chooseResourceType" type="button">
              <Radio label="0" :disabled="NotAllowedEdit">默认</Radio>
              <Radio label="1" :disabled="NotAllowedEdit">新建</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="应用图标：" prop='applicationIcon'>
          <div class="upload">
            <input type="file" @change="uploadApplicationIcon($event)" ref="file" id="applicationIcon" accept="image/jpeg,image/jpg">
            <div class="showImg" :class="{'nameHidden': !releaseResourceResult.applicationIcon.attachUrl}">
              <img :src="releaseResourceResult.applicationIcon.attachUrl" alt="" />
              <div class="cover">
                <Icon type="ios-eye-outline" @click.native="handleView('applicationIcon')"></Icon>
                <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemove('applicationIcon')"></Icon>
              </div>
            </div>
            <div @click="uploadFile('applicationIcon')" class="addButton" :class="{'nameHidden': releaseResourceResult.applicationIcon.attachUrl}">+</div>
            <div class='ImgText'>&#42;支持JPG格式图片，500k以内</div>
          </div>
        </FormItem>
        <FormItem label="页面背景图：" prop='backgroundImage'>
          <div class="upload">
            <input type="file" @change="uploadBackgroundImage($event)" ref="file" id="backgroundImage" accept="image/jpeg,image/jpg">
            <div class="showImg" :class="{'nameHidden': !releaseResourceResult.backgroundImage.attachUrl}">
              <img :src="releaseResourceResult.backgroundImage.attachUrl" alt="" />
              <div class="cover">
                <Icon type="ios-eye-outline" @click.native="handleView('backgroundImage')"></Icon>
                <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemove('backgroundImage')"></Icon>
              </div>
            </div>
            <div @click="uploadFile('backgroundImage')" class="addButton" :class="{'nameHidden': releaseResourceResult.backgroundImage.attachUrl}">+</div>
            <div class='ImgText'>&#42;支持JPG格式图片，500k以内</div>
          </div>
        </FormItem>
        <Row>
          <Col>
          <FormItem label="轮播图：" prop='banner'>
            <Button icon="ios-cloud-upload-outline" @click="uploadFile('banner')" :disabled="NotAllowedEdit">点击上传</Button>
            <input type="file" @change="uploadBanner($event)" ref="file" id="banner" accept="image/jpeg,image/jpg">
            <div class='ImgText'>&#42;支持JPG格式图片，500k以内</div>
          </FormItem>
          <FormItem>
            <div class="upload" v-for="(item, index) in hangshuList" v-if="hangshuList.length > 0" :key="index">
              <div class="pic">
                <div class="showImg">
                  <img :src="releaseResourceResult.banner[item * 4 + 0].attachUrl" alt="" />
                  <div class="cover">
                    <Icon type="ios-eye-outline" @click.native="handleViewBanner(item * 4 + 0)" style="size:20%;"></Icon>
                    <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemoveList(item * 4 + 0, 'banner')"></Icon>
                  </div>
                </div>
              </div>
              <div class="pic">
                <div class="showImg">
                  <img :src="releaseResourceResult.banner[item * 4 + 1].attachUrl" alt="" />
                  <div class="cover">
                    <Icon type="ios-eye-outline" @click.native="handleViewBanner(item * 4 + 1)"></Icon>
                    <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemoveList(item * 4 + 1, 'banner')"></Icon>
                  </div>
                </div>
              </div>
              <div class="pic">
                <div class="showImg">
                  <img :src="releaseResourceResult.banner[item * 4 + 2].attachUrl" alt="" />
                  <div class="cover">
                    <Icon type="ios-eye-outline" @click.native="handleViewBanner(item * 4 + 2)"></Icon>
                    <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemoveList(item * 4 + 2, 'banner')"></Icon>
                  </div>
                </div>
              </div>
              <div class="pic">
                <div class="showImg">
                  <img :src="releaseResourceResult.banner[item * 4 + 3].attachUrl" alt="" />
                  <div class="cover">
                    <Icon type="ios-eye-outline" @click.native="handleViewBanner(item * 4 + 3)"></Icon>
                    <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemoveList(item * 4 + 3, 'banner')"></Icon>
                  </div>
                </div>
              </div>
            </div>

            <div class="upload">
              <div class="pic" v-for="(item, index) in yushuList" v-if="yushuList.length > 0" :key="index">
                <div class="showImg">
                  <img :src="releaseResourceResult.banner[item].attachUrl" alt="" />
                  <div class="cover">
                    <Icon type="ios-eye-outline" @click.native="handleViewBanner(item)"></Icon>
                    <Icon type="ios-trash-outline" v-if="!NotAllowedEdit" @click.native="handleRemoveList(item, 'banner')"></Icon>
                  </div>
                </div>
              </div>
            </div>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <Modal title="图片预览" :disabled="NotAllowedEdit" v-model.trim="visible">
      <img :src="visibleSrc" v-if="visible" style="width: 100%">
    </Modal>
    <div class="submit">
      <Button type="primary" @click="handleSave(formValid)" v-show="ButtonCacheShow" :disabled="NotAllowedEdit" style="margin-right:15px">暂存</Button>
      <Button type="primary" @click="goBack" style="margin-right:15px">返回</Button>
    </div>
  </div>
</template>

<script>
import { releaseVersionInfo, resourceList, upload } from '@/api/data'
export default {
  data () {
    const validateApplicationIcon = (rule, value, callback) => {
      if (!this.releaseResourceResult.applicationIcon.attachUrl) {
        callback(new Error('请上传应用图标'))
      } else {
        callback()
      }
    }
    const validateBackgroundImage = (rule, value, callback) => {
      if (!this.releaseResourceResult.backgroundImage.attachUrl) {
        callback(new Error('请上传背景图'))
      } else {
        callback()
      }
    }
    const validateInstallPackage = (rule, value, callback) => {
      if (this.versionInfo.platform === 'iPhone' && this.releaseResourceResult.installPackage.length !== 2) {
        callback(new Error('请检查iOS安装包是否上传'))
      } else if (this.versionInfo.platform === 'AndroidPad' && !this.releaseResourceResult.installPackage.length !== 1) {
        callback(new Error('请检查Android安装包是否上传'))
      } else if (this.versionInfo.platform === 'iPad' && this.releaseResourceResult.installPackage.length !== 2) {
        callback(new Error('请检查iOS安装包是否上传'))
      } else if (this.versionInfo.platform === 'Android' && !this.releaseResourceResult.installPackage.length !== 1) {
        callback(new Error('请检查Android安装包是否上传'))
      } else {
        callback()
      }
    }
    const validateBanner = (rule, value, callback) => {
      if (this.releaseResourceResult.banner.length === 0) {
        callback(new Error('请上传轮播图'))
      } else {
        callback()
      }
    }
    const validatePlatform = (rule, value, callback) => {
      if (!this.versionInfo.platform) {
        callback(new Error('请选择发布平台'))
      } else {
        callback()
      }
    }
    const validateVersion = (rule, value, callback) => {
      if (!this.versionInfo.version) {
        callback(new Error('请输入版本号'))
      } else {
        callback()
      }
    }
    const validateReleaseDescription = (rule, value, callback) => {
      if (!this.versionInfo.releaseDescription) {
        callback(new Error('请输入版本发布描述'))
      } else {
        callback()
      }
    }
    return {
      ruleValidate: {
        applicationIcon: [
          { required: true, validator: validateApplicationIcon, trigger: 'change' }
        ],
        backgroundImage: [
          { required: true, validator: validateBackgroundImage, trigger: 'change' }
        ],
        installPackage: [
          { required: true, validator: validateInstallPackage, trigger: 'change' }
        ],
        banner: [
          { required: true, validator: validateBanner, trigger: 'change' }
        ],
        platform: [
          { required: true, validator: validatePlatform, trigger: 'change' }
        ],
        version: [
          { required: true, validator: validateVersion, trigger: 'blur' }
        ],
        releaseDescription: [
          { required: true, validator: validateReleaseDescription, trigger: 'blur' }
        ]
      },
      isValid: true, // 数据校验是否通过
      ButtonCacheShow: true, // 暂存按钮是否展示 （已发布不展示）
      visibleSrc: '', // 图片大图地址
      visible: false, // 是否展示图片大图
      NotAllowedplatformEdit: false, // 是否允许编辑平台信息
      NotAllowedEdit: false, // 是否允许编辑页面
      chooseResourceType: '', // 选择页面资源（0：默认，1：新建）
      isModify: '', // 数据是否修改
      uploadType: '', // 文件上传类型
      versionInfo: { // 版本信息
        id: '', // 版本id
        platform: '', // 发布平台（iPhone、iPad、Android、AndroidPad）
        version: '', // 版本号
        releaseDescription: '', // 发布描述
        releaseStatus: '' // 发布状态（0：未发布，1：已发布）
      },
      formValid: [], // 校验表单
      resourceInfo: { // 资源信息
        id: '', // 资源id
        belongNo: '', // 所属版本id
        attachBizField: '', // 资源类型
        attachName: '', // 资源名称
        attachUrl: '', // 资源下载地址
        isModify: '' // 是否修改（1：是）
      },
      bannerDelete: [], // 轮播图置为失效数据list
      applicationIconDelete: [], // 应用图标置为失效数据list
      backgroundImageDelete: [], // 背景图置为失效数据list
      installPackageDelete: [], // 安装包置为失效数据list
      releaseVersionResult: { // 提交后台所需数据
        releaseVersionInfoDTO: {
          id: '', // 版本id
          platform: '', // 平台
          version: '', // 版本
          releaseDescription: '', // 发布描述
          dateRelease: '', // 发布时间
          releaseStatus: '' // 发布状态
        },
        releaseResourceInfoDTOS: []
      },
      releaseResourceResult: { // 后台返回版本对应资源数据
        backgroundImage: {
          id: '',
          belongVersionId: '',
          attachBizField: '',
          attachName: '',
          attachUrl: ''
        },
        applicationIcon: {
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
    goBack () { // 返回发布版本信息页面
      this.$router.push({
        name: 'releaseVersionInfo'
      })
    },
    getValid (formValid) { // 校验版本提交数据
      formValid.forEach(formItem => {
        this.$refs[formItem].validate((valid) => {
          if (!valid) {
            this.isValid = false
          }
        })
      })
    },
    handleSave (formValid) { // 版本发布（暂存）
      Promise.all([
        this.getFormValidList(),
        this.getValid(formValid)
      ]).then(res => {
        console.log(this.isValid)
        if (this.isValid) {
          this.getreleaseVersionResult()
          releaseVersionInfo(this.releaseVersionResult).then(res => {
            this.$Message['success']({
              background: true,
              content: res.data.message
            })
            if (res.data.code === '000') {
              this.$router.push({
                name: 'releaseVersionInfo'
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$Message.info('请先完善信息')
          this.isValid = true
        }
      })
    },
    getFormValidList () { // 获取校验表单
      this.formValid.push('versionInfoForm')
      this.formValid.push('resourceInfoForm')
    },
    getreleaseVersionResult () { // 组装版本发布提交数据（包含提交、删除信息）
      this.releaseResourceResult.installPackage.unshift.apply(this.releaseResourceResult.installPackage, this.installPackageDelete)
      this.releaseResourceResult.banner.unshift.apply(this.releaseResourceResult.banner, this.bannerDelete)
      this.releaseVersionResult.releaseResourceInfoDTOS.unshift.apply(this.releaseVersionResult.releaseResourceInfoDTOS, this.applicationIconDelete)
      this.releaseVersionResult.releaseResourceInfoDTOS.unshift.apply(this.releaseVersionResult.releaseResourceInfoDTOS, this.backgroundImageDelete)
      if (this.releaseResourceResult.applicationIcon.id !== null) {
        this.releaseVersionResult.releaseResourceInfoDTOS.unshift(this.releaseResourceResult.applicationIcon)
      }
      if (this.releaseResourceResult.backgroundImage.id !== null) {
        this.releaseVersionResult.releaseResourceInfoDTOS.unshift(this.releaseResourceResult.backgroundImage)
      }
      this.releaseVersionResult.releaseResourceInfoDTOS.unshift.apply(this.releaseVersionResult.releaseResourceInfoDTOS, this.releaseResourceResult.banner)
      this.releaseVersionResult.releaseResourceInfoDTOS.unshift.apply(this.releaseVersionResult.releaseResourceInfoDTOS, this.releaseResourceResult.installPackage)
      this.releaseVersionResult.releaseVersionInfoDTO.id = this.versionInfo.id
      this.releaseVersionResult.releaseVersionInfoDTO.version = this.versionInfo.version
      this.releaseVersionResult.releaseVersionInfoDTO.platform = this.versionInfo.platform
      this.releaseVersionResult.releaseVersionInfoDTO.releaseDescription = this.versionInfo.releaseDescription
      this.releaseVersionResult.releaseVersionInfoDTO.dateRelease = this.versionInfo.dateRelease
      if (this.versionInfo.releaseStatus !== 1) {
        this.releaseVersionResult.releaseVersionInfoDTO.releaseStatus = 0
      }
      console.log(this.releaseVersionResult.releaseResourceInfoDTOS)
      console.log(this.releaseVersionResult)
    },
    resourceList () { // 根据条件分页查询全部版本资源信息
      resourceList(this.versionInfo.id).then(res => {
        this.total = res.data.data.totalAmount
        if (res.data.code === '000') {
          let resource = res.data.data
          let that = this
          if (resource.applicationIcon) {
            that.releaseResourceResult.applicationIcon = resource.applicationIcon
          }
          if (resource.backgroundImage) {
            that.releaseResourceResult.backgroundImage = resource.backgroundImage
          }
          if (resource.banner.length !== 0) {
            that.releaseResourceResult.banner = resource.banner
          }
          if (resource.installPackage.length !== 0) {
            that.releaseResourceResult.installPackage = resource.installPackage
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    uploadFile (id) {
      let imFile = document.getElementById(id)
      imFile.click()
    },
    uploadBanner (e) { // 上传轮播图
      var that = this
      that.uploadFileSingle('banner', function (response) {
        that.releaseResourceResult.banner.push({
          id: response.id,
          attachUrl: response.attachUrl,
          attachBizField: 'banner',
          attachName: response.attachName
        })
      }, e)
    },
    uploadInstallPackage (e) { // 上传安装包
      var that = this
      that.uploadFileSingle('installPackage', function (response) {
        that.releaseResourceResult.installPackage.push({
          id: response.id,
          attachUrl: response.attachUrl,
          attachBizField: 'installPackage',
          attachName: response.attachName
        })
      }, e)
    },
    uploadApplicationIcon (e) { // 上传应用图标
      var that = this
      console.log(e)
      that.uploadFileSingle('applicationIcon', function (response) {
        that.releaseResourceResult.applicationIcon.id = response.id
        that.releaseResourceResult.applicationIcon.attachUrl = response.attachUrl
        that.releaseResourceResult.applicationIcon.attachBizField = 'applicationIcon'
        that.releaseResourceResult.applicationIcon.attachName = response.attachName
      }, e)
    },
    uploadBackgroundImage (e) { // 上传背景图
      var that = this
      console.log(e)
      that.uploadFileSingle('backgroundImage', function (response) {
        that.releaseResourceResult.backgroundImage.id = response.id
        that.releaseResourceResult.backgroundImage.attachUrl = response.attachUrl
        that.releaseResourceResult.backgroundImage.attachBizField = 'backgroundImage'
        that.releaseResourceResult.backgroundImage.attachName = response.attachName
        console.log(that.releaseResourceResult.backgroundImage)
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
          case 'applicationIcon':
            this.visibleSrc = this.releaseResourceResult.applicationIcon.attachUrl
            break
          case 'backgroundImage':
            this.visibleSrc = this.releaseResourceResult.backgroundImage.attachUrl
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
        case 'backgroundImage':
          this.resourceInfo.id = this.releaseResourceResult.backgroundImage.id
          this.resourceInfo.belongNo = this.releaseResourceResult.backgroundImage.belongNo
          this.resourceInfo.attachBizField = this.releaseResourceResult.backgroundImage.attachBizField
          this.resourceInfo.attachName = this.releaseResourceResult.backgroundImage.attachName
          this.resourceInfo.attachUrl = this.releaseResourceResult.backgroundImage.attachUrl
          this.resourceInfo.isModify = '1'
          this.backgroundImageDelete.unshift(this.resourceInfo)
          this.resourceInfo = {}
          this.releaseResourceResult.backgroundImage.attachUrl = ''
          this.releaseResourceResult.backgroundImage.attachId = ''
          this.releaseResourceResult.backgroundImage.id = ''
          this.releaseResourceResult.backgroundImage.attachBizField = ''
          this.releaseResourceResult.backgroundImage.attachName = ''
          break
        case 'applicationIcon':
          this.resourceInfo.id = this.releaseResourceResult.applicationIcon.id
          this.resourceInfo.belongNo = this.releaseResourceResult.applicationIcon.belongNo
          this.resourceInfo.attachBizField = this.releaseResourceResult.applicationIcon.attachBizField
          this.resourceInfo.attachName = this.releaseResourceResult.applicationIcon.attachName
          this.resourceInfo.attachUrl = this.releaseResourceResult.applicationIcon.attachUrl
          this.resourceInfo.isModify = '1'
          this.applicationIconDelete.unshift(this.resourceInfo)
          this.resourceInfo = {}
          this.releaseResourceResult.applicationIcon.attachUrl = ''
          this.releaseResourceResult.applicationIcon.attachId = ''
          this.releaseResourceResult.applicationIcon.id = ''
          this.releaseResourceResult.applicationIcon.attachBizField = ''
          this.releaseResourceResult.applicationIcon.attachName = ''
          break
      }
    },
    handleViewBanner (index) { // 点击查看轮播图大图
      if (this.releaseResourceResult) {
        this.visibleSrc = this.releaseResourceResult.banner[index].attachUrl
        this.visible = true
      }
    },
    handleRemoveList (index, params) { // 点击删除已上传（轮播图、安装包）
      if (this.NotAllowedEdit) {
        this.$Message.info('查看状态下不可进行编辑操作！')
        return
      }
      switch (params) {
        case 'banner':
          this.resourceInfo.id = this.releaseResourceResult.banner[index].id
          this.resourceInfo.belongNo = this.releaseResourceResult.banner[index].belongNo
          this.resourceInfo.attachBizField = this.releaseResourceResult.banner[index].attachBizField
          this.resourceInfo.attachName = this.releaseResourceResult.banner[index].attachName
          this.resourceInfo.attachUrl = this.releaseResourceResult.banner[index].attachUrl
          this.resourceInfo.isModify = '1'
          this.bannerDelete.unshift(this.resourceInfo)
          console.log(this.bannerDelete)
          this.resourceInfo = {}
          this.releaseResourceResult.banner.splice(index, 1)
          break
        case 'installPackage':
          this.resourceInfo.id = this.releaseResourceResult.installPackage[index].id
          this.resourceInfo.belongNo = this.releaseResourceResult.installPackage[index].belongNo
          this.resourceInfo.attachBizField = this.releaseResourceResult.installPackage[index].attachBizField
          this.resourceInfo.attachName = this.releaseResourceResult.installPackage[index].attachName
          this.resourceInfo.attachUrl = this.releaseResourceResult.installPackage[index].attachUrl
          this.resourceInfo.isModify = '1'
          this.installPackageDelete.unshift(this.resourceInfo)
          this.resourceInfo = {}
          this.releaseResourceResult.installPackage.splice(index, 1)
          break
      }
    }
  },
  created () {
    // 接收上一个页面传来的版本信息，查询对应资源信息，控制可编辑权限
    let modelInfo = JSON.parse(sessionStorage.getItem('modelInfo'))
    if (modelInfo !== null) {
      this.versionInfo.id = modelInfo.id
      this.versionInfo.platform = modelInfo.platform
      this.versionInfo.version = modelInfo.version
      this.versionInfo.releaseDescription = modelInfo.releaseDescription
      this.versionInfo.releaseStatus = modelInfo.releaseStatus
      this.versionInfo.dateRelease = modelInfo.dateRelease
      this.resourceList()
      if (this.versionInfo.releaseStatus === '1') {
        this.NotAllowedEdit = true
      }
      console.log(this.versionInfo.platform)
      if (this.versionInfo.platform !== null) {
        this.NotAllowedplatformEdit = true
      }
    }
  },
  destroyed () {
    sessionStorage.clear()
  },
  computed: {
    hangshuList () {
      let arr = []
      if (this.releaseResourceResult && this.releaseResourceResult.banner.length > 0) {
        let count = 0
        count = parseInt(this.releaseResourceResult.banner.length / 4)
        let arr = []
        for (let i = 0; i < count; i++) {
          arr.push(i)
        }
        return arr
      } else {
        return arr
      }
    },
    yushuList () {
      let arr = []
      if (this.releaseResourceResult && this.releaseResourceResult.banner.length > 0) {
        let count = parseInt(this.releaseResourceResult.banner.length % 4)
        let zhengchu = parseInt(this.releaseResourceResult.banner.length / 4)
        let arr = []
        for (let i = 0; i < count; i++) {
          arr.push(i + zhengchu * 4)
        }
        return arr
      } else {
        return arr
      }
    },
    hangshuList1 () {
      let arr = []
      if (this.releaseResourceResult && this.releaseResourceResult.installPackage.length > 0) {
        let count = 0
        count = parseInt(this.releaseResourceResult.installPackage.length / 4)
        let arr = []
        for (let i = 0; i < count; i++) {
          arr.push(i)
        }
        return arr
      } else {
        return arr
      }
    },
    yushuList1 () {
      let arr = []
      if (this.releaseResourceResult && this.releaseResourceResult.installPackage.length > 0) {
        let count = parseInt(this.releaseResourceResult.installPackage.length % 4)
        let zhengchu = parseInt(this.releaseResourceResult.installPackage.length / 4)
        let arr = []
        for (let i = 0; i < count; i++) {
          arr.push(i + zhengchu * 4)
        }
        return arr
      } else {
        return arr
      }
    }
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
