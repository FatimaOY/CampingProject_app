<template>
  <div class="bookings-page">
    <h1>Bookings</h1>

    <div v-if="isHost">
      <button @click="toggleView">
        {{ showOwnBookings ? 'View My Bookings' : 'View Bookings on My Spots' }}
      </button>
    </div>

    <div v-if="!showOwnBookings">
      <h2>My Bookings</h2>
      <div v-for="booking in myBookings" :key="booking.booking_id" class="booking-card">
        <p><strong>Spot:</strong> {{ booking.spot.name }}</p>
        <p><strong>Location:</strong> {{ booking.spot.city.name }}, {{ booking.spot.country.name }}</p>
        <p><strong>Dates:</strong> {{ booking.check_in_date }} → {{ booking.check_out_date }}</p>
        <p><strong>Status:</strong> {{ booking.status.name }}</p>
        <button v-if="booking.status_id === 2" @click="goToReview(booking.spot.spot_id)">Write a Review</button>
      </div>
    </div>

    <div v-else>
      <h2>Bookings on My Spots</h2>
      <div v-for="booking in bookingsOnMySpots" :key="booking.booking_id" class="booking-card">
        <p><strong>User:</strong> {{ booking.user.first_name }} {{ booking.user.last_name }}</p>
        <p><strong>Spot:</strong> {{ booking.spot.name }}</p>
        <p><strong>Dates:</strong> {{ booking.check_in_date }} → {{ booking.check_out_date }}</p>
        <p><strong>Status:</strong> {{ booking.status.name }}</p>

        <div v-if="booking.status_id === 1">
          <button @click="updateStatus(booking.booking_id, 2)">Accept</button>
          <button @click="updateStatus(booking.booking_id, 3)">Deny</button>
        </div>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>


<script>
export default {
  name: 'PageBookings',
  props: ['userId', 'isHost'],
  data() {
    return {
      myBookings: [],
      bookingsOnMySpots: [],
      showOwnBookings: false,
      error: '',
      success: ''
    };
  },
  mounted() {
    this.loadMyBookings();
    if (this.isHost) this.loadOwnerBookings();
  },
  methods: {
    toggleView() {
      this.showOwnBookings = !this.showOwnBookings;
    },
    async loadMyBookings() {
      const res = await fetch(`http://localhost:3000/bookings/user/${this.userId}`);
      this.myBookings = await res.json();
    },
    async loadOwnerBookings() {
      const res = await fetch(`http://localhost:3000/bookings/owner/${this.userId}`);
      this.bookingsOnMySpots = await res.json();
    },
    async updateStatus(bookingId, status) {
      try {
        const res = await fetch(`http://localhost:3000/bookings/${bookingId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status_id: status })
        });

        if (!res.ok) throw new Error('Failed to update status');

        this.success = 'Booking status updated.';
        this.error = '';
        this.loadOwnerBookings(); // Refresh
        this.loadMyBookings();
      } catch (err) {
        this.error = err.message;
      }
    },
    goToReview(spotId) {
      this.$emit('goToReview', spotId); // This assumes a listener is present in App.vue
    }
  }
};
</script>

<style scoped>
.bookings-page {
  padding: 2rem;
}
.booking-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
}
button {
  margin-right: 1rem;
  background-color: #3d5018;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>
