import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
},
{
  path: '/',
  name: '_home',
  redirect: '/home',
  component: Main,
  meta: {
    hideInMenu: true,
    notCache: true
  },
  children: [{
    path: '/home',
    name: 'home',
    meta: {
      hideInMenu: true,
      title: '首页',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/single-page/home')
  }]
},
{
  path: '/argu',
  name: 'argu',
  meta: {
    hideInMenu: true
  },
  component: Main,
  children: [{
    path: 'params/:id',
    name: 'params',
    meta: {
      icon: 'md-flower',
      title: route => `{{ params }}-${
        route.params.id
      }`,
      notCache: true,
      beforeCloseName: 'before_close_normal'
    },
    component: () => import('@/view/argu-page/params.vue')
  }, {
    path: 'query',
    name: 'query',
    meta: {
      icon: 'md-flower',
      title: route => `{{ query }}-${
        route.query.id
      }`,
      notCache: true
    },
    component: () => import('@/view/argu-page/query.vue')
  }]
}, {
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/401.vue')
}, {
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/500.vue')
}, {
  path: '*',
  name: 'error_404',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/404.vue')
},

  /*
  新定义的路由配置
  */
{
  path: '/AccountManage',
  name: 'AccountManage',
  meta: {
    icon: 'ios-construct',
    title: '账户管理',
    access: ['root']
  },
  component: Main,
  children: [

    {
      path: '/RoleManage',
      name: 'RoleManage',
      meta: {
        icon: 'ios-settings',
        title: '角色管理'
      },
      component: () => import('@/view/newView/AccountManage/RoleManage')
    },
    {
      path: '/PermissionManage',
      name: 'PermissionManage',
      meta: {
        icon: 'ios-settings',
        title: '权限管理'
      },
      component: () => import('@/view/newView/AccountManage/PermissionManage')
    },
    {
      path: '/UserManage',
      name: 'UserManage',
      meta: {
        icon: 'ios-settings',
        title: '用户管理'
      },
      component: () => import('@/view/newView/AccountManage/UserManage')
    }
  ]
},

{
  path: '/ServiceTypeManage',
  name: 'ServiceTypeManage',
  meta: {
    icon: 'ios-construct',
    title: ' 服务类型管理',
    access: ['root']
  },
  component: Main,
  children: [{
    path: '/ServiceTypeManage',
    name: 'ServiceTypeManage',
    meta: {
      icon: 'ios-folder-open-outline',
      title: '服务类型管理'
    },
    component: () => import('@/view/newView/ServiceTypeManage/ServiceTypeManage')
  }]
},
{
  path: '/ThirdPartManage',
  name: 'ThirdPartManage',
  meta: {
    icon: 'ios-search',
    title: '第三方服务管理',
    access: ['root']
  },
  component: Main,
  children: [{
    path: '/ThirdManufacturerManage',
    name: 'ThirdManufacturerManage',
    meta: {
      icon: 'ios-hand-outline',
      title: '第三方厂商管理 '
    },
    component: () => import('@/view/newView/ThirdPartManage/ThirdManufacturerManage')
  }, {
    path: '/ThirdServiceManage',
    name: 'ThirdServiceManage',
    meta: {
      icon: 'md-alert',
      title: '第三方服务管理'
    },
    component: () => import('@/view/newView/ThirdPartManage/ThirdServiceManage')
  }]
},
{
  path: '/UseSystemManage',
  name: 'UseSystemManage',
  meta: {
    icon: 'ios-construct',
    title: 'UseSystemManage',
    access: ['root']
  },
  component: Main,
  children: [{
    path: '/UseSystemManage',
    name: 'UseSystemManage',
    meta: {
      icon: 'ios-settings',
      title: '应用系统管理'
    },
    component: () => import('@/view/newView/UseSystemManage/UseSystemManage')
  }, {
    path: '/UseConnectManage',
    name: 'UseConnectManage',
    meta: {
      icon: 'ios-settings',
      title: '应用关联服务管理'
    },
    component: () => import('@/view/newView/UseSystemManage/UseConnectManage')
  }]
}, {
  path: '/WeightManage',
  name: 'WeightManage',
  meta: {
    icon: 'ios-construct',
    title: '权重管理',
    access: ['root']
  },
  component: Main,
  children: [{
    path: '/WeightManage',
    name: 'WeightManage',
    meta: {
      icon: 'ios-settings',
      title: '权重管理'
    },
    component: () => import('@/view/newView/WeightManage/WeightManage')
  }]
}, {
  path: '/ThresholdManage',
  name: 'ThresholdManage',
  meta: {
    icon: 'ios-construct',
    title: '阈值管理',
    access: ['root']
  },
  component: Main,
  children: [{
    path: '/UseThresholdManage',
    name: 'UseThresholdManage',
    meta: {
      icon: 'ios-settings',
      title: '应用阈值管理'
    },
    component: () => import('@/view/newView/ThresholdManage/UseThresholdManage')
  }, {
    path: '/ServiceThresholdManage',
    name: 'ServiceThresholdManage',
    meta: {
      icon: 'ios-settings',
      title: '服务阈值管理'
    },
    component: () => import('@/view/newView/ThresholdManage/ServiceThresholdManage')
  }]
}, {
  path: '/InformManage',
  name: 'InformManage',
  meta: {
    icon: 'ios-construct',
    title: '提醒通知管理',
    access: ['root']
  },
  component: Main,
  children: [{
    path: '/InformManage',
    name: 'InformManage',
    meta: {
      icon: 'ios-settings',
      title: '提醒通知管理'
    },
    component: () => import('@/view/newView/InformManage/InformManage')
  }]
}, {
  path: '/StatisticalForm',
  name: 'StatisticalForm',
  meta: {
    icon: 'ios-construct',
    title: '统计报表',
    access: ['root']
  },
  component: Main,
  children: [{
    path: '/DetailsInquire',
    name: 'DetailsInquire',
    meta: {
      icon: 'ios-settings',
      title: '明细查询'
    },
    component: () => import('@/view/newView/StatisticalForm/DetailsInquire')
  }]
}

]
