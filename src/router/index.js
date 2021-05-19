import Vue from "vue";
import VueRouter from "vue-router";
import Login from '../views/Login'
Vue.use(VueRouter);

const routes = [

  {
    path:'/',
    name:'Login',
    component:Login
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "主页",
    },
    component: () => import("../views/Main"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "账户管理",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
    children:[
     {
     path: "/RoleManage",
    name: "RoleManage",
    meta: {
      title: "角色管理",
      hideInMenu: true,
    },
    component: () => import("../components/AccountManage/RoleManage"),
    children:[
      {
        path: "/home",
        name: "Home",
        meta: {
          title: "添加/编辑角色管理",
          hideInMenu: true,
        },
        component: () => import("../views/Main"),
      },
      {
    path: "/home",
    name: "Home",
    meta: {
      title: "权限管理",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
      },
      {
        path: "/home",
    name: "Home",
    meta: {
      title: "用户管理",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
    children:[
      {
        path: "/home",
    name: "Home",
    meta: {
      title: "角色关联",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
      }
    ]
      }
    ]

  },
    {
      path: "/home",
    name: "Home",
    meta: {
      title: "主页",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
    }
    ]
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "账户类型管理",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
    children:[
      {
        path: "/home",
        name: "Home",
        meta: {
          title: "主页",
          hideInMenu: true,
        },
        component: () => import("../views/Main"),
      },
      {
        path: "/home",
        name: "Home",
        meta: {
          title: "主页",
          hideInMenu: true,
        },
        component: () => import("../views/Main"),
      }
    ]
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "第三方服务管理",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "应用系统管理",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "权重管理",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "阈值管理",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "提醒通知管理",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "统计报表",
      hideInMenu: true,
    },
    component: () => import("../views/Main"),
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

/* router.beforeEach((to,from,next)=>{
  
}) */
export default router;
