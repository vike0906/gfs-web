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
        path:'user',
        component:()=>import('@/components/action/User')
      },{
        path:'resource',
        component:()=>import('@/components/action/Resource')
      }]
    },
    {
      path: '/logout',
      component: Login
    },
    { path: '*', component: ()=>import('@/components/NotFound') }
  ]
})
