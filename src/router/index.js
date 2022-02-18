import Vue from 'vue'
import VueRouter from 'vue-router'
import { Editar, Formulario, Home } from '../views'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/formulario',
    name: 'formulario',
    component: Formulario
  },
  {
    path: '/editar/:pessoaId',
    name: 'editar',
    component: Editar
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
