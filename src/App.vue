<template>
  <div id="app">
    <!-- Navigation -->
    <NavigationComponent
      :isLoggedIn="isLoggedIn"
      :isHost="isHost"
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
    <PageContact v-if="activePage === 'contact'" />
    <PageProfile v-if="activePage === 'profile'" :userId="userId" @setActivePage="setActivePage"/>
    <PageChangePassword v-if="activePage === 'changePassword'" :userId="userId"/>
    <PageManageSingleSpot v-if="activePage === 'manageSingleSpot'" :spotId="selectedSpotId" />
    <PageManageSpots v-if="activePage === 'manageSpots'" :userId="userId" @editSpot="setSelectedSpot" />
    <PageSpotDetails v-if="activePage === 'spotDetails'" :spotId="selectedSpotId"   @bookThisSpot="startBooking"/>
    <PageExplore v-if="activePage === 'explore'" @showSpotDetails="handleSpotClick"/>
    <MakeBooking v-if="activePage === 'makeBooking'" :spotId="selectedSpotId" :userId="userId"/>
    <PageWriteReview v-if="activePage === 'writeReview'" :userId="userId" :spotId="selectedSpotId" />

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
import PageContact from './pages/PageContact.vue'
import PageProfile from './pages/PageProfile.vue'
import PageManageSpots from './pages/PageManageSpots.vue'
import PageChangePassword from './pages/PageChangePassword.vue'
import PageManageSingleSpot from './pages/ManageSingleSpot.vue'
import PageSpotDetails from './pages/PageSpotDetails.vue'
import MakeBooking from './pages/MakeBooking.vue';
import PageWriteReview from './pages/PageWriteReview.vue';

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
    PageContact,
    PageProfile,
    PageManageSpots,
    PageChangePassword,
    PageManageSingleSpot,
    PageSpotDetails,
    MakeBooking,
    PageWriteReview

    
  },
  data() {
    return {
      activePage: 'home',
      isLoggedIn: false,
      userId: null,
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
      this.checkIfUserIsHost();
    },
    setIsHostTrue() {
      this.isHost = true;
    },
    checkIfUserIsHost() {
      // 👇 Replace with your actual API URL
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
