import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/components/Home";
import Login from "@/components/Login"


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children:[{
        path:'',
        component:()=>import('@/components')
      },{
        path:'stock-base',
        component:()=>import('@/components/stock/StockBase')
      },{
        path:'stock-focus',
        component:()=>import('@/components/stock/StockFocus')
      },{
        path:'system-user',
        component:()=>import('@/components/system/User')
      },{
        path:'system-role',
        component:()=>import('@/components/system/Role')
      },{
        path:'system-action',
        component:()=>import('@/components/system/Action')
      },]
    },
    {
      path: '/logout',
      component: Login
    },
    { path: '*', component: ()=>import('@/components/NotFound') }
  ]
})
