import Vue from 'vue'
import VueRouter from 'vue-router'

import PageHome from '@/pages/PageHome.vue'
import PageExplore from '@/pages/PageExplore.vue'
import PageManageSpots from '@/pages/PageManageSpots.vue'
import PageProfile from '@/pages/PageProfile.vue'
import ManageSingleSpot from '@/pages/ManageSingleSpot.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: PageHome },
  { path: '/explore', name: 'Explore', component: PageExplore },
  { path: '/profile', name: 'Profile', component: PageProfile },
  { path: '/manage-spots', name: 'ManageSpots', component: PageManageSpots },
  {
    path: '/manage-spot/:id',
    name: 'ManageSingleSpot',
    component: ManageSingleSpot
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
