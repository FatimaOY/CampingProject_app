<template>
  <div id="app">
    <!-- Navigation -->
    <NavigationComponent :isLoggedIn="isLoggedIn" @setActivePage="setActivePage" />

    <!-- Pages -->
    <PageHome v-if="activePage === 'home'" />
    <PageAuth v-if="activePage === 'auth'" @setActivePage="setActivePage" />
    <PageLogin v-if="activePage === 'login'" @setActivePage="setActivePage" @setLoggedIn="setLoggedIn" />
    <PageRegister v-if="activePage === 'register'" @setActivePage="setActivePage"/>
    <PageExplore v-if="activePage === 'explore'" />
    <PageBookings v-if="activePage === 'bookings'" />
    <PageHost v-if="activePage === 'host'" />
    <PageContact v-if="activePage === 'contact'" />
    <PageProfile v-if="activePage === 'profile'" />

  </div>
</template>

<script>
// Components
import NavigationComponent from './components/NavigationComponent.vue'

// Pages
import PageHome from './pages/PageHome.vue'
import PageAuth from './pages/PageAuth.vue'
import PageLogin from './pages/PageLogin.vue'
import PageRegister from './pages/PageRegister.vue'
import PageExplore from './pages/PageExplore.vue'
import PageBookings from './pages/PageBookings.vue'
import PageHost from './pages/PageHost.vue'
import PageContact from './pages/PageContact.vue'

export default {
  name: 'App',
  components: {
    NavigationComponent,
    PageHome,
    PageAuth,
    PageLogin,
    PageRegister,
    PageExplore,
    PageBookings,
    PageHost,
    PageContact
  },
  data() {
    return {
      activePage: 'home',
      isLoggedIn: false

    }
  },
  methods: {
  setActivePage(page) {
    this.activePage = page;
    },
    setLoggedIn(status) {
      this.isLoggedIn = status;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>