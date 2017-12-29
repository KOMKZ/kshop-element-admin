import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'User',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'index',
        name: 'UserIndex',
        component: _import('user/index'),
        meta: { title: '用户列表', icon: 'table' }
      },
      {
        path: 'create',
        name: 'UserCreate',
        component: _import('user/create'),
        meta: { title: '创建用户', icon: 'table' }
      },
      {
        path: 'update',
        name: 'UserUpdate',
        component: _import('user/update'),
        meta: { title: '更新用户', icon: 'table' }
      }
    ]
  },

  {
    path: '/file',
    component: Layout,
    redirect: '/file/create',
    name: 'File',
    meta: { title: '文件管理', icon: 'file' },
    children: [
      {
        path: 'create',
        name: 'FileCreate',
        component: _import('file/create'),
        meta: { title: '文件创建', icon: 'table' }
      },
      {
        path: 'list',
        name: 'FileList',
        component: _import('file/index'),
        meta: { title: '文件列表', icon: 'table' }
      }
    ]

  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: _import('form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
