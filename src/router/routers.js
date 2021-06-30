import Main from '@/components/main'
export default[
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import ('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: false,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: false,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import ('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: false
    },
    component: Main,
    children: [
      {
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
        component: () => import ('@/view/argu-page/params.vue')
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
        component: () => import ('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: false
    },
    component: () => import ('@/view/error-page/401.vue')
  }, {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: false
    },
    component: () => import ('@/view/error-page/500.vue')
  }, {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: false
    },
    component: () => import ('@/view/error-page/404.vue')
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
      access: 'account',
      hideInMenu: false
    },
    component: Main,
    children: [

      {
        path: '/RoleManage',
        name: 'RoleManage',
        meta: {
          icon: 'ios-settings',
          title: '角色管理',
          access: 'account:role',
          hideInMenu: false
        },
        component: () => import ('@/view/newView/AccountManage/RoleManage')
      }, {
        path: '/PermissionManage',
        name: 'PermissionManage',
        meta: {
          icon: 'ios-settings',
          title: '权限管理',
          access: 'account:auth',
          hideInMenu: false
        },
        component: () => import ('@/view/newView/AccountManage/PermissionManage')
      }, {
        path: '/UserManage',
        name: 'UserManage',
        meta: {
          icon: 'ios-settings',
          title: '用户管理',
          access: 'account:user',
          hideInMenu: false
        },
        component: () => import ('@/view/newView/AccountManage/UserManage')
      }
    ]
  }, {
    path: '/ServiceTypeManage',
    name: 'ServiceTypeManage',
    meta: {
      icon: 'ios-construct',
      title: ' 服务类型管理',
      access: 'serviceType',
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: '/ServiceTypeManage',
        name: 'ServiceTypeManage',
        meta: {
          icon: 'ios-folder-open-outline',
          title: '服务类型管理',
          access: 'serviceType:serviceType',
          hideInMenu: false
        },
        component: () => import ('@/view/newView/ServiceTypeManage/ServiceTypeManage')
      }, {
        path: '/ServiceModuleManage',
        name: 'ServiceModuleManage',
        meta: {
          icon: 'ios-folder-open-outline',
          title: '服务模块管理',
          access: 'serviceType:serviceModule',
          hideInMenu: false
        },
        component: () => import ('@/view/newView/ServiceTypeManage/ServiceModuleManage')
      }
    ]
  }, {
    path: '/ThirdPartManage',
    name: 'ThirdPartManage',
    meta: {
      icon: 'ios-search',
      title: '第三方服务管理',
      access: 'tripartite',
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: '/ThirdManufacturerManage',
        name: 'ThirdManufacturerManage',
        meta: {
          icon: 'ios-hand-outline',
          title: '第三方厂商管理 ',
          access: 'tripartite:provider',

          hideInMenu: false
        },
        component: () => import ('@/view/newView/ThirdPartManage/ThirdManufacturerManage')
      }, {
        path: '/ThirdServiceManage',
        name: 'ThirdServiceManage',
        meta: {
          icon: 'md-alert',
          title: '第三方服务管理',
          access: 'tripartite:service',

          hideInMenu: false
        },
        component: () => import ('@/view/newView/ThirdPartManage/ThirdServiceManage')
      }
    ]
  }, {
    path: '/UseSystemManage',
    name: 'UseSystemManage',
    meta: {
      icon: 'ios-construct',
      title: '应用系统管理',
      access: 'application',
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: '/UseSystemManage',
        name: 'UseSystemManage',
        meta: {
          icon: 'ios-settings',
          title: '应用系统管理',
          access: 'application:manage',

          hideInMenu: false
        },
        component: () => import ('@/view/newView/UseSystemManage/UseSystemManage')
      }, {
        path: '/UseConnectManage',
        name: 'UseConnectManage',
        meta: {
          icon: 'ios-settings',
          title: '应用关联服务管理',
          access: 'application:service',

          hideInMenu: false
        },
        component: () => import ('@/view/newView/UseSystemManage/UseConnectManage')
      }
    ]
  }, {
    path: '/WeightManage',
    name: '_WeightManage',
    meta: {
      icon: 'ios-construct',
      title: '权重管理',
      access: 'weight',
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: '/WeightManage',
        name: 'WeightManage',
        meta: {
          icon: 'ios-settings',
          title: '权重管理',
          access: 'weight:manage',

          hideInMenu: false
        },
        component: () => import ('@/view/newView/WeightManage/WeightManage')
      }
    ]
  }, {
    path: '/ThresholdManage',
    name: 'ThresholdManage',
    meta: {
      icon: 'ios-construct',
      title: '阈值管理',
      access: 'threshold',
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: '/UseThresholdManage',
        name: 'UseThresholdManage',
        meta: {
          icon: 'ios-settings',
          title: '应用阈值管理',
          access: 'threshold:application',

          hideInMenu: false
        },
        component: () => import ('@/view/newView/ThresholdManage/UseThresholdManage')
      }, {
        path: '/ServiceThresholdManage',
        name: 'ServiceThresholdManage',
        meta: {
          icon: 'ios-settings',
          title: '服务阈值管理',
          access: 'threshold:service',

          hideInMenu: false
        },
        component: () => import ('@/view/newView/ThresholdManage/ServiceThresholdManage')
      }
    ]
  }, {
    path: '/InformManage',
    name: 'InformManage',
    meta: {
      icon: 'ios-construct',
      title: '提醒通知管理',
      access: 'notice',
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: '/InformManage',
        name: 'InformManage',
        meta: {
          icon: 'ios-settings',
          title: '提醒通知管理',
          access: 'notice:manage',

          hideInMenu: false
        },
        component: () => import ('@/view/newView/InformManage/InformManage')
      }, {
        path: '/AlarmManage',
        name: 'AlarmManage',
        meta: {
          icon: 'ios-settings',
          title: '警示管理',
          access: 'notice:warning',

          hideInMenu: false
        },
        component: () => import ('@/view/newView/InformManage/AlarmManage')
      }
    ]
  }, {
    path: '/StatisticalForm',
    name: 'StatisticalForm',
    meta: {
      icon: 'ios-construct',
      title: '统计报表',
      access: 'statistic',
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: '/DetailsInquire',
        name: 'DetailsInquire',
        meta: {
          icon: 'ios-settings',
          title: '明细查询',
          access: 'statistic:detail',
          hideInMenu: false
        },
        component: () => import ('@/view/newView/StatisticalForm/DetailsInquire')
      }
    ]
  }

]
