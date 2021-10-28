import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   meta: { hiddenType: [0, 1] },
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: '个人资料', icon: 'person', hiddenType: [0, 1] }
  //   }]
  // },
  // {
  //   path: '/task',
  //   component: Layout,
  //   redirect: '/task',
  //   meta: { title: '任务管理', icon: '', hiddenType: [0, 1] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Task',
  //       component: () => import('@/views/task/index'),
  //       meta: { title: '任务管理', icon: 'task', hiddenType: [0, 1] }
  //     }
  //   ]
  // },
  /* 新增 首页 可视化图标 */
  {
    path: '/',
    component: Layout,
    meta: {hiddenType: [0, 1]},
    children: [{
      path: '/',
      name: 'home',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '首页', icon: 'shouye', hiddenType: [0, 1]}
    }]
  },
  {
    path: '/task',
    component: Layout,
    meta: {hiddenType: [0, 1]},
    hidden: true,
    children: [{
      path: 'taskDetail',
      name: 'TaskDetail',
      component: () => import('@/views/task/taskDetail'),
      meta: {title: '任务详情', icon: 'person', hiddenType: [0, 1, 2]}
    }]
  },
  {
    path: '/user',
    component: Layout,
    /* meta: {title: '用户管理', icon: '', hiddenType: [1, 2]}, */
    meta: {title: '用户管理', icon: '', hiddenType: [1]},
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/index'),
        /* meta: {title: '用户管理', icon: 'user', hiddenType: [1, 2]} */
        meta: {title: '用户管理', icon: 'user', hiddenType: [1]}
      }
    ]
  },
  // 号商
  {
    path: '/operator',
    component: Layout,
    meta: {title: '用户管理', icon: 'user', hiddenType: [-1]},
    children: [
      {
        path: 'index',
        name: 'userControl',
        component: () => import('@/views/operator/accountInformation'),
        meta: {title: '用户管理', icon: 'user', hiddenType: [-1]}
      }
    ]
  },
  {
    path: '/operator',
    component: Layout,
    meta: {title: '账号管理', icon: 'zhanghao', hiddenType: [3]},
    children: [
      {
        path: 'accountControl',
        name: 'accountControl',
        component: () => import('@/views/operator/account'),
        meta: {title: '账号管理', icon: 'zhanghao', hiddenType: [3]}
      }
    ]
  },
  {
    path: '/operator',
    component: Layout,
    meta: {title: '商品管理', icon: 'shangpin', hiddenType: [3]},
    children: [
      {
        path: 'operatorGoods',
        name: 'operatorGoods',
        component: () => import('@/views/operator/goods'),
        meta: {title: '商品管理', icon: 'shangpin', hiddenType: [3]}
      }
    ]
  },
  // 代理商
  {
    path: '/agency',
    component: Layout,
    meta: {title: '首页', icon: 'shouye', hiddenType: [2]},
    children: [
      {
        path: 'index',
        name: 'agency',
        component: () => import('@/views/agent/agency'),
        meta: {title: '首页', icon: 'shouye', hiddenType: [2]}
      }
    ]
  },
  {
    path: '/agency',
    component: Layout,
    meta: {title: '用户管理', icon: 'user', hiddenType: [2]},
    children: [
      {
        path: 'userControl',
        name: 'userControl',
        component: () => import('@/views/agent/userControl'),
        meta: {title: '用户管理', icon: 'user', hiddenType: [2]}
      }
    ]
  },
  {
    path: '/agency',
    component: Layout,
    meta: {title: '端口管理', icon: 'device', hiddenType: [-1]},
    children: [
      {
        path: 'agentDevice',
        name: 'agentDevice',
        component: () => import('@/views/agent/device'),
        meta: {title: '端口管理', icon: 'device', hiddenType: [2]}
      }
    ]
  },
  {
    path: '/agency',
    component: Layout,
    meta: {title: '账号管理', icon: 'zhanghao', hiddenType: [2]},
    children: [
      {
        path: 'agentAccount',
        name: 'agentAccount',
        component: () => import('@/views/agent/account'),
        meta: {title: '账号管理', icon: 'zhanghao', hiddenType: [2]}
      }
    ]
  },
  {
    path: '/agency',
    component: Layout,
    meta: {title: '商品管理', icon: 'shangpin', hiddenType: [2]},
    children: [
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/views/agent/goods'),
        meta: {title: '商品管理', icon: 'shangpin', hiddenType: [2]}
      }
    ]
  },
  {
    path: '/tiktokUser',
    component: Layout,
    meta: {title: 'TIKTOK用户', icon: '', hiddenType: [0]},
    children: [
      {
        path: 'tiktokUser',
        name: 'TiktokUser',
        component: () => import('@/views/tiktokuser/index'),
        meta: {title: 'TIKTOK用户', icon: 'user', hiddenType: [0, 1]}
      }
    ]
  },
/*   {
    path: '/group',
    component: Layout,
    meta: {title: '群组管理', icon: '', hiddenType: [0]},
    children: [
      {
        path: 'index',
        name: 'Group',
        component: () => import('@/views/group/index'),
        meta: {title: '群组管理', icon: 'group', hiddenType: [0]}
      }
    ]
  }, */
  {
    path: '/device',
    component: Layout,
    meta: {title: '端口管理', icon: 'device', hiddenType: [0]},
    children: [
      {
        path: 'index',
        name: 'Device',
        component: () => import('@/views/device/index'),
        // meta: {title: '端口管理', icon: 'device', hiddenType: [0, 1, 2]}
        meta: {title: '端口管理', icon: 'device', hiddenType: [0, 1]}
      }
      /* ,{
        path: 'details',
        name: 'deviceDetails',
        component: Layout,
        component: () => import('@/views/device/details'),
        meta: {title: '端口详情'}
      } */
    ]
  },
  {
    path: '/account',
    component: Layout,
    // meta: {title: '账号管理', icon: '', hiddenType: [0, 1, 2, 3]},
    meta: {title: '账号管理', icon: 'zhanghao', hiddenType: [0]},
    children: [
      {
        path: 'index',
        name: 'account',
        component: () => import('@/views/account/index'),
        // meta: {title: '账号管理', icon: 'el-icon-s-custom', hiddenType: [0, 1, 2, 3]}
        meta: {title: '账号管理', icon: 'zhanghao', hiddenType: [0, 1]}
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    meta: {title: '账号管理', icon: 'zhanghao', hiddenType: [-1]},
    children: [
      {
        path: 'index',
        name: 'AccountManage',
        component: () => import('@/views/account/index'),
        meta: {title: '账号管理', icon: 'zhanghao', hiddenType: [1]}
      }
    ]
  },
  // 账号出售 
  /* {
    path: '/sell',
    component: Layout,
    meta: {title: '账号出售', icon: 'integral', hiddenType: [2]},
    children: [
      {
        path: 'sell',
        name: 'accountSell',
        component: () => import('@/views/sell/index'),
        meta: {title: '账号出售', icon: 'integral', hiddenType: [2]}
      }
    ]
  }, */
  {
    path: '/accountInfo',
    component: Layout,
    meta: {title: '账号信息', icon: '', hiddenType: [-1]},
    children: [
      {
        path: 'index',
        name: 'AccountInfo',
        component: () => import('@/views/accountInfo/index'),
        meta: {title: '账号信息', icon: 'info', hiddenType: [0, 1]}
      }
    ]
  },
  // {
  //   path: '/tag',
  //   component: Layout,
  //   meta: {title: '标签管理', icon: '', hiddenType: [1]},
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Tag',
  //       component: () => import('@/views/tag/index'),
  //       meta: {title: '标签管理', icon: 'tag', hiddenType: [1]}
  //     }
  //   ]
  // },
  {
    path: '/resource',
    component: Layout,
    meta: {title: '资源管理', icon: 'ziyuan', hiddenType: [0]},
    children: [
      {
        path: 'index',
        name: 'Resource',
        component: () => import('@/views/resource/index'),
        meta: {title: '资源管理', icon: 'ziyuan', hiddenType: [0, 1]}
      }
    ]
  },
  //  IP设备 原 代理管理修改
  /* {
    path: '/proxy',
    component: Layout,
    meta: {title: '代理管理', icon: '', hiddenType: [0, 1]},
    children: [
      {
        path: 'index',
        name: 'Proxy',
        component: () => import('@/views/proxy/index'),
        meta: {title: '代理管理', icon: 'post', hiddenType: [0, 1]}
      }
    ]
  }, */
  {
    path: '/pack',
    component: Layout,
    meta: {title: '包管理', icon: '', hiddenType: [-1]},
    children: [
      {
        path: 'index',
        name: 'Pack',
        component: () => import('@/views/pack/index'),
        meta: {title: '包管理', icon: 'post', hiddenType: [0, 1]}
      }
    ]
  },
  {
    path: '/offer',
    component: Layout,
    // meta: {title: '广告管理', icon: 'offer', hiddenType: [0, 1, 2]},
    meta: {title: '广告管理', icon: 'offer', hiddenType: [-1]},
    children: [
      {
        path: 'dashboard',
        name: 'OfferDashboard',
        component: () => import('@/views/offer/dashboard'),
        meta: {title: '数据面板', icon: 'dashboard', hiddenType: [0, 1, 2]}
      },
      {
        path: 'distribution',
        name: 'Distribution',
        component: () => import('@/views/offer/distribution'),
        meta: {title: '分成配置', icon: 'distribution', hiddenType: [1]}
      },
      {
        path: 'reward',
        name: 'Reward',
        component: () => import('@/views/offer/reward'),
        meta: {title: '返利记录', icon: 'reward', hiddenType: [1]}
      },
      {
        path: 'adrecord',
        name: 'Adrecord',
        component: () => import('@/views/offer/adrecord'),
        meta: {title: '广告记录', icon: 'adv', hiddenType: [1]}
      },
      {
        path: 'browse',
        name: 'Browse',
        component: () => import('@/views/offer/browse'),
        meta: {title: '申请广告', icon: 'browse', hiddenType: [1, 2]}
      },
      {
        path: 'campaigns',
        name: 'Campaigns',
        component: () => import('@/views/offer/campaigns'),
        meta: {title: '创建链接', icon: 'campaign', hiddenType: [1, 2]}
      },
      {
        path: 'rewardDetail',
        name: 'RewardDetail',
        component: () => import('@/views/offer/rewardDetail'),
        meta: {title: '返利记录', icon: 'reward', hiddenType: [2]}
      },
      {
        path: 'adrecordDetail',
        name: 'AdrecordDetail',
        component: () => import('@/views/offer/adrecordDetail'),
        meta: {title: '广告记录', icon: 'adv', hiddenType: [0, 2]}
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/follow',
    meta: {title: '任务管理', icon: 'renwu', hiddenType: [0]},
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/task/index'),
        meta: {title: '任务管理', icon: 'renwu', hiddenType: [-1]}
      },
      {
        path: 'task/follow',
        name: 'Follow',
        component: () => import('@/views/task/follow'),
        meta: {title: '关注', icon: 'follow', hiddenType: [0, 1]}
      },
      {
        path: 'task/exchange',
        name: 'Exchange',
        component: () => import('@/views/task/exchange'),
        meta: {title: '私信', icon: 'exchange', hiddenType: [0, 1], isPermission: true}
      }
      // 新增页面 评论、点赞管理页面
      /* ,{
          path: 'task/comment',
          name: 'Comment',
          component: () => import('@/views/task/comment'),
          meta: {title: '评论', icon: 'task', hiddenType: [0, 1]}
      } */
    ]
      // }, {
      //   path: 'task/product',
      //   name: 'Product',
      //   component: () => import('@/views/task/product'),
      //   meta: {title: '作品', icon: 'product', hiddenType: [0, 1]}
      // }, {
      //   path: 'task/information',
      //   name: 'Information',
      //   component: () => import('@/views/task/information'),
      //   meta: {title: '资料', icon: 'information', hiddenType: [0, 1]}
      // }, {
      //   path: 'task/account',
      //   name: 'Account',
      //   component: () => import('@/views/task/account'),
      //   meta: {title: '账号', icon: 'account', hiddenType: [0, 1]}
      // }, {
      //   path: 'task/collection',
      //   name: 'Collection',
      //   component: () => import('@/views/task/collection'),
      //   meta: {title: '采集', icon: 'collection', hiddenType: [1]}
      // }, {
      //   path: 'task/comment',
      //   name: 'Comment',
      //   component: () => import('@/views/task/comment'),
      //   meta: {title: '评论', icon: 'task', hiddenType: [-1]}
      // }]
  },
  {
    path: '/tool',
    component: Layout,
    meta: {title: '实用工具', icon: 'gongju', hiddenType: [0]},
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/tool/index'),
        meta: {title: '实用工具', icon: 'gongju', hiddenType: [-1]}
      },
      {
        path: 'tool/git-io',
        name: '短链接生成',
        component: () => import('@/views/tool/git-io'),
        meta: {title: '短链接生成', icon: 'follow', hiddenType: [0, 1]}
      }
    ]
  },
  {
    path: '/accountData',
    component: Layout,
    meta: {title: '账号包管理', icon: 'task', hiddenType: [-1]},
    children: [
      {
        path: 'index',
        name: 'accountData',
        component: () => import('@/views/accountData/index'),
        meta: {title: '账号包管理', icon: 'task', hiddenType: [0, 1, 2]}
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: {title: '积分记录', icon: 'jifen', hiddenType: [1]},
    children: [
      {
        path: 'index',
        name: 'system',
        component: () => import('@/views/system/index'),
        meta: {title: '积分记录', icon: 'jifen', hiddenType: [1]}
      }
    ]
  },
  {
    path: '/letter',
    component: Layout,
    meta: {title: 'VIP等级', icon: 'VIP', hiddenType: [1]},
    children: [
      {
        path: 'index',
        name: 'letter',
        component: () => import('@/views/letter/index'),
        meta: {title: 'VIP等级', icon: 'VIP', hiddenType: [1]}
      }
    ]
  },
  {
    path: '/configuration',
    component: Layout,
    meta: {title: '系统配置', icon: 'xitongpeizhi', hiddenType: [1]},
    children: [
      {
        path: 'index',
        name: 'configuration',
        component: () => import('@/views/configuration/index'),
        meta: {title: '系统配置', icon: 'xitongpeizhi', hiddenType: [0, 1, 2]}
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    meta: {title: '商品管理', icon: 'shangpin', hiddenType: [1]},
    children: [
      {
        path: 'index',
        name: 'goods',
        component: () => import('@/views/goods/index'),
        meta: {title: '商品管理', icon: 'shangpin', hiddenType: [1]}
      }
    ]
  },
  {
    path: '/resourceAudit',
    component: Layout,
    meta: {title: '资源审核', icon: 'shangpin', hiddenType: [1]},
    children: [
      {
        path: 'index',
        name: 'resourceAudit',
        component: () => import('@/views/resource/audit'),
        meta: {title: '资源审核', icon: 'shangpin', hiddenType: [1]}
      }
    ]
  },

  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
