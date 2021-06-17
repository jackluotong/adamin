import axios from '@/libs/api.request'

/*
    user mange get info
*/
// #region
export const getInfoUser = (info) => {
  return axios.request({
    url: '/dcenter/userInfo/list',
    method: 'post',
    data: info
  })
}
/*
    role connect
*/
export const roleConnect = (info) => {
  return axios.request({
    url: '/dcenter/userRoleRelation/bind ',
    method: 'post',
    data: info
  })
}
// #endregion

/*
    role manage
*/

// #region

/*
    get info
*/
export const getInfoRole = (info) => {
  return axios.request({
    url: '/dcenter/roleInfo/query',
    method: 'post',
    data: info
  })
}
/*
    get author
*/
export const getAuthTree = () => {
  return axios.request({
    url: '/dcenter/authInfo/query',
    method: 'get'
  })
}
/*
    edit/add
*/
export const editRole = (info) => {
  return axios.request({
    url: '/dcenter/roleInfo/createOrUpdate',
    method: 'post',
    data: info
  })
}
/*
    delete
*/
export const deleteRole = (info) => {
  return axios.request({
    url: `/dcenter/roleInfo/remove/${info}`,
    method: 'get'
  })
}
// #endregion

/*
    permission manage
    -create
    -get
*/
// #region
export const createParent = (info) => {
  return axios.request({
    url: '/dcenter/authInfo/create',
    data: info,
    method: 'post'
  })
}

export const editPermission = (info) => {
  return axios.request({
    url: '/dcenter/authInfo/update',
    data: info,
    method: 'post'
  })
}

export const deletePermission = (info) => {
  return axios.request({
    url: '/dcenter/authInfo/remove/' + info,
    method: 'get'
  })
}

// #endregion

/*
    manage service type
*/

// #region
/*
        get info for service type

    */
export const getServiceTypeInfo = (info) => {
  return axios.request({
    url: '/dcenter/type/select/ServiceType',
    data: info,
    method: 'post'
  })
}

/*
    search type by module code
*/

export const serarchTypeByModule = (info) => {
  return axios.request({
    url: `/dcenter/type/findTypeName/${info}`,
    data: info,
    method: 'get'
  })
}

/*
    edit service module
*/

export const editServiceModule = (info) => {
  return axios.request({
    url: '/dcenter/type/edit/ServiceModule',
    data: info,
    method: 'post'
  })
}
/*
    edit service type
*/
export const editServiceType = (info) => {
  return axios.request({
    url: '/dcenter/type/edit/ServiceType',
    data: info,
    method: 'post'
  })
}

/*
    inquire service type
*/
export const inquireServiceModule = (info) => {
  return axios.request({
    url: '/dcenter/type/select/ServiceModule',
    method: 'post',
    data: info
  })
}

/*
    delete module
*/
export const deletModule = (info) => {
  return axios.request({
    url: `/dcenter/type/del/ServiceModule/${info}`,
    method: 'get'
  })
}

/*
    delete type
*/
export const deleteType = (id, code) => {
  return axios.request({
    url: `/dcenter/type/del/ServiceType/${id}/${code}`,
    method: 'get'
  })
}

/*
    get all service type
*/

export const getAllServiceType = () => {
  return axios.request({
    url: '/dcenter/type/serviceTypes',
    method: 'get'
  })
}

// #endregion

// 根据条件分页查询全部定时任务配置表
export const confJobPageList = (info) => {
  return axios.request({
    url: '/admin/confJob/pageList',
    data: info,
    method: 'post'
  })
}
//  按主键 启动 定时任务
export const confJobStart = (info) => {
  return axios.request({
    url: '/admin/confJob/start',
    data: info,
    method: 'post'
  })
}
//  按主键 暂停 定时任务
export const confJobPasue = (info) => {
  return axios.request({
    url: '/admin/confJob/pasue',
    data: info,
    method: 'post'
  })
}
//  按主键 立即执行 定时任务
export const confJobTrigger = (info) => {
  return axios.request({
    url: '/admin/confJob/trigger',
    data: info,
    method: 'post'
  })
}
//  按主键 删除 定时任务
export const confJobDelete = (info) => {
  return axios.request({
    url: '/admin/confJob/' + info,
    method: 'delete'
  })
}
//  新增或修改定时任务配置表功能
export const confJob = (info) => {
  return axios.request({
    url: '/admin/confJob',
    data: info,
    method: 'post'
  })
}

//  根据条件分页查询全部日志表-系统接口
export const logSysComPageList = (info) => {
  return axios.request({
    url: '/admin/logSysCom/pageList',
    data: info,
    method: 'post'
  })
}
//  根据条件分页查询全部日志表-系统接口
export const queryLogById = (info) => {
  return axios.request({
    url: '/admin/logSysCom/select/' + info,
    data: info,
    method: 'get'
  })
}

//  根据key查询redis信息
export const searchResisByKey = (info) => {
  return axios.request({
    url: '/admin/redis/searchResisByKey',
    data: info,
    method: 'post'
  })
}
//  根据key 修改vulue
export const updateRedisByKey = (info) => {
  return axios.request({
    url: '/admin/redis/updateRedisByKey',
    data: info,
    method: 'post'
  })
}
//  根据key 删除redis
export const delRedisByKey = (info) => {
  return axios.request({
    url: '/admin/redis/delRedisByKey',
    data: info,
    method: 'post'
  })
}

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}

// 根据条件分页查询全部参数配置表
export const confPageList = (info) => {
  return axios.request({
    url: '/decenter/userInfo/list',
    data: info,
    method: 'post'
  })
}
//  按主键 删除 参数配置
export const confDelete = (info) => {
  return axios.request({
    url: '/admin/conf/' + info,
    method: 'delete'
  })
}
//  新增或修改参数配置表功能
export const conf = (info) => {
  return axios.request({
    url: '/admin/conf',
    data: info,
    method: 'post'
  })
}
// 根据条件分页查询全部后台管理-用户信息表
export const userInfoAdminPageList = (info) => {
  return axios.request({
    url: '/admin/userInfoAdmin/pageList',
    data: info,
    method: 'post'
  })
}
//  按主键 删除 后台管理-用户信息
export const userInfoAdminDelete = (info) => {
  return axios.request({
    url: '/admin/userInfoAdmin/' + info,
    method: 'delete'
  })
}
//  新增或修改后台管理-用户信息表功能
export const userInfoAdmin = (info) => {
  return axios.request({
    url: '/admin/userInfoAdmin',
    data: info,
    method: 'post'
  })
}
//  按主键置为有效 后台管理-用户信息表
export const userInfoAdminEnable = (info) => {
  return axios.request({
    url: '/admin/userInfoAdmin/enable/' + info,
    method: 'get'
  })
}
//  按主键置为失效 后台管理-用户信息表
export const userInfoAdminDisable = (info) => {
  return axios.request({
    url: '/admin/userInfoAdmin/disable/' + info,
    method: 'get'
  })
}
//  短信验证码查询
export const querySmsCode = (info) => {
  return axios.request({
    url: '/admin/smsCode/querySmsCode',
    data: info,
    method: 'post'
  })
}
// 根据条件分页查询全部日志表-短信日志
export const logSmsMessagePageList = (info) => {
  return axios.request({
    url: '/admin/logSmsMessage/pageList',
    data: info,
    method: 'post'
  })
}
// 根据条件分页查询全部日志表-邮件日志
export const logEmailMessagePageList = (info) => {
  return axios.request({
    url: '/admin/logEmailMessage/pageList',
    data: info,
    method: 'post'
  })
}
//  新增或修改数据字典主表功能
export const dictionaryMain = (info) => {
  return axios.request({
    url: '/admin/dictionaryMain',
    data: info,
    method: 'post'
  })
}
// 根据条件分页查询全部数据字典主表
export const dictionaryMainPageList = (info) => {
  return axios.request({
    url: '/admin/dictionaryMain/pageList',
    data: info,
    method: 'post'
  })
}
//  按主键 删除 数据字典主表
export const dictionaryMainDelete = (info) => {
  return axios.request({
    url: '/admin/dictionaryMain/' + info,
    method: 'delete'
  })
}
//  新增或修改数据字典明细表功能
export const dictionaryDetail = (info) => {
  return axios.request({
    url: '/admin/dictionaryDetail',
    data: info,
    method: 'post'
  })
}
// 根据条件分页查询全部数据字典明细表
export const dictionaryDetailPageList = (info) => {
  return axios.request({
    url: '/admin/dictionaryDetail/pageList',
    data: info,
    method: 'post'
  })
}
//  按主键 删除 数据字典明细表
export const dictionaryDetailDelete = (info) => {
  return axios.request({
    url: '/admin/dictionaryDetail/' + info,
    method: 'delete'
  })
}
// 根据条件分页查询全部日志表-异常信息记录表
export const logExceptionPageList = (info) => {
  return axios.request({
    url: '/admin/logException/pageList',
    data: info,
    method: 'post'
  })
}
//  修改全部日志表-异常信息记录表功能
export const logException = (info) => {
  return axios.request({
    url: '/admin/logException',
    data: info,
    method: 'post'
  })
}
// 根据条件查询全部参数发布管理-版本信息表
export const versionPageList = (info) => {
  return axios.request({
    url: '/admin/releaseVersionInfo/pageList',
    data: info,
    method: 'post'
  })
}
// 版本发布（更新版本发布状态）
export const versionRelease = (info) => {
  return axios.request({
    url: '/admin/releaseVersionInfo/release/' + info,
    method: 'post'
  })
}
// 新增或修改发布管理-版本信息表功能
export const releaseVersionInfo = (info) => {
  return axios.request({
    url: '/admin/releaseVersionInfo',
    data: info,
    method: 'post'
  })
}
// 按主键删除 发布管理-版本信息表
export const versionDelete = (info) => {
  return axios.request({
    url: '/admin/releaseVersionInfo/' + info,
    method: 'delete'
  })
}
// 根据版本id查询全部发布管理-资源信息
export const resourceList = (info) => {
  return axios.request({
    url: '/admin/releaseVersionInfo/list/' + info,
    data: info,
    method: 'get'
  })
}
// 文件上传
export const upload = (info) => {
  return axios.request({
    url: '/admin/file/upload',
    data: info,
    method: 'post'
  })
}
// 根据条件查询全部权限-角色信息表
export const authRolePageList = (info) => {
  return axios.request({
    url: '/admin/authRoleInfo/pageList',
    data: info,
    method: 'post'
  })
}
//  按主键 删除 权限-角色信息
export const authRoleDelete = (info) => {
  return axios.request({
    url: '/admin/authRoleInfo/' + info,
    method: 'delete'
  })
}
//  新增或修改权限-角色信息表功能
export const authRoleInfo = (info) => {
  return axios.request({
    url: '/admin/authRoleInfo',
    data: info,
    method: 'post'
  })
}
//  按主键置为有效 权限-角色信息表
export const authRoleEnable = (info) => {
  return axios.request({
    url: '/admin/authRoleInfo/enable/' + info,
    method: 'get'
  })
}
//  按主键置为失效 权限-角色信息表
export const authRoleDisable = (info) => {
  return axios.request({
    url: '/admin/authRoleInfo/disable/' + info,
    method: 'get'
  })
}
// 根据条件查询全部权限-菜单信息表
export const authMenuPageList = (info) => {
  return axios.request({
    url: '/admin/authMenuInfo/pageList',
    data: info,
    method: 'post'
  })
}
//  菜单删除
export const deleteMenuById = (info) => {
  return axios.request({
    url: '/admin/authMenuInfo/deleteMenuById/' + info,
    method: 'post'
  })
}
//  新增或修改权限-菜单信息表功能
export const authMenuInfo = (info) => {
  return axios.request({
    url: '/admin/authMenuInfo',
    data: info,
    method: 'post'
  })
}
// 根据菜单所属版本id查询菜单版本信息
export const getAuthMenuVersionInfo = (info) => {
  return axios.request({
    url: '/admin/authMenuVersionInfo/select/' + info,
    data: info,
    method: 'get'
  })
}
//  查询全量菜单版本
export const authMenuVersionList = (info) => {
  return axios.request({
    url: '/admin/authMenuVersionInfo/pageList',
    data: info,
    method: 'post'
  })
}
//  获取角色菜单信息
export const selectMenuInfoByRoleCode = (info) => {
  return axios.request({
    url: '/admin/authMenuInfo/selectMenuInfoByRoleCode',
    data: info,
    method: 'post'
  })
}
//  修改角色菜单权限
export const updateRoleMenu = (info) => {
  return axios.request({
    url: '/admin/authRoleSource/updateRoleMenu',
    data: info,
    method: 'post'
  })
}
//  修改角色菜单权限
export const validById = (info) => {
  return axios.request({
    url: '/admin/authMenuVersion/validById/' + info,
    data: info,
    method: 'get'
  })
}
//  查询菜单版本
export const getMenuVersionList = (info) => {
  return axios.request({
    url: '/admin/authMenuVersion/pageList',
    data: info,
    method: 'post'
  })
}
//  版本复制
export const batchInsert = (info) => {
  return axios.request({
    url: '/admin/authMenuInfo/batchInsert',
    data: info,
    method: 'post'
  })
}
//  查询app用户信息
export const appUserInfoPageList = (info) => {
  return axios.request({
    url: '/admin/userIdentity/pageList',
    data: info,
    method: 'post'
  })
}
