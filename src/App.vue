<template>
  <div id="app">
    <!-- Navigation -->
    <NavigationComponent
      :isLoggedIn="isLoggedIn"
      :isHost="isHost"
      :isAdmin="isAdmin"

      @setActivePage="setActivePage"
    />

    <!-- Pages -->
    <PageHome v-if="activePage === 'home'" />
    <PageAuth v-if="activePage === 'auth'" @setActivePage="setActivePage" />
    <PageLogin
      v-if="activePage === 'login'"
      @setActivePage="setActivePage"
      @setLoggedIn="handleLogin"
    />
    <PageRegister v-if="activePage === 'register'" @setActivePage="setActivePage" />
    <!-- <PageExplore v-if="activePage === 'explore'" /> -->
    <PageBookings v-if="activePage === 'bookings'" :userId="userId" :isHost="isHost"   @goToReview="startReview"/>
    <PageHost v-if="activePage === 'host'" :userId="userId" @setAsHost="setIsHostTrue" />
    <PageProfile v-if="activePage === 'profile'" :userId="userId" @setActivePage="setActivePage"/>
    <PageChangePassword v-if="activePage === 'changePassword'" :userId="userId"/>
    <PageManageSingleSpot v-if="activePage === 'manageSingleSpot'" :spotId="selectedSpotId" />
    <PageManageSpots v-if="activePage === 'manageSpots'" :userId="userId" @editSpot="setSelectedSpot" />
    <PageSpotDetails v-if="activePage === 'spotDetails'" :spotId="selectedSpotId"   @bookThisSpot="startBooking"/>
    <PageExplore v-if="activePage === 'explore'" @showSpotDetails="handleSpotClick"/>
    <MakeBooking v-if="activePage === 'makeBooking'" :spotId="selectedSpotId" :userId="userId"/>
    <PageWriteReview v-if="activePage === 'writeReview'" :userId="userId" :spotId="selectedSpotId" />
    <!-- Admin pages -->
    <AdminUsers v-if="activePage === 'adminUsers'" />
    <AdminSpots v-if="activePage === 'adminSpots'" />
    <AdminBookings v-if="activePage === 'adminBookings'" />
  </div>
</template>

<script>
import NavigationComponent from './components/NavigationComponent.vue'
import PageHome from './pages/PageHome.vue'
import PageAuth from './pages/PageAuth.vue'
import PageLogin from './pages/PageLogin.vue'
import PageRegister from './pages/PageRegister.vue'
import PageExplore from './pages/PageExplore.vue'
import PageBookings from './pages/PageBookings.vue'
import PageHost from './pages/PageHost.vue'
import PageProfile from './pages/PageProfile.vue'
import PageManageSpots from './pages/PageManageSpots.vue'
import PageChangePassword from './pages/PageChangePassword.vue'
import PageManageSingleSpot from './pages/ManageSingleSpot.vue'
import PageSpotDetails from './pages/PageSpotDetails.vue'
import MakeBooking from './pages/MakeBooking.vue';
import PageWriteReview from './pages/PageWriteReview.vue';

//Admin pages
import AdminUsers from './pages/admin/AdminUsers.vue';
import AdminSpots from './pages/admin/AdminSpots.vue';
import AdminBookings from './pages/admin/AdminBookings.vue';


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
    PageProfile,
    PageManageSpots,
    PageChangePassword,
    PageManageSingleSpot,
    PageSpotDetails,
    MakeBooking,
    PageWriteReview,

    // admin
    AdminUsers,
    AdminSpots,
    AdminBookings
    
  },
  data() {
    return {
      activePage: 'home',
      isLoggedIn: false,
      userId: null,
      isAdmin: false,
      isHost: false,
      selectedSpotId: null

    };
  },
  methods: {
    setActivePage(page) {
      this.activePage = page;
    },
    setLoggedIn(status) {
      this.isLoggedIn = status;
    },
    setUserId(id) {
      this.userId = id; // ✅ update user ID from login
    },
    handleLogin(userData) {
      this.isLoggedIn = true;
      this.userId = userData.user_id;
      this.isAdmin = userData.is_admin === true;
      this.checkIfUserIsHost();
    },
    setIsHostTrue() {
      this.isHost = true;
    },
    checkIfUserIsHost() {
      fetch(`http://localhost:3000/campingspots/owner/${this.userId}`)
      .then(res => res.json())
        .then(spots => {
          this.isHost = Array.isArray(spots) && spots.length > 0;
        })
        .catch(() => {
          this.isHost = false;
        });
    },
    setSelectedSpot(id) {
      this.selectedSpotId = id;
      this.activePage = 'manageSingleSpot';
    },
    handleSpotClick(spotId) {
      this.selectedSpotId = spotId;
      this.activePage = 'spotDetails';
    },
    startBooking(spotId) {
      this.selectedSpotId = spotId;
      this.activePage = 'makeBooking';
    },
    startReview(spotId) {
      this.selectedSpotId = spotId;
      this.activePage = 'writeReview'; // this will show the PageWriteReview component
    }
    ,
    goToWriteReview(spotId) {
    this.selectedSpotId = spotId;
    this.activePage = 'writeReview';
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
