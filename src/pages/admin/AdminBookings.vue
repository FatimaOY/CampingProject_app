<template>
  <div class="admin-bookings">
    <h1>All Bookings</h1>

    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Email</th>
          <th>Spot</th>
          <th>Check-In</th>
          <th>Check-Out</th>
          <th>Price (€)</th>
          <th>Status</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in bookings" :key="b.booking_id">
          <td>{{ b.user.first_name }} {{ b.user.last_name }}</td>
          <td>{{ b.user.email }}</td>
          <td>{{ b.spot.name }}</td>
          <td>{{ formatDate(b.check_in_date) }}</td>
          <td>{{ formatDate(b.check_out_date) }}</td>
          <td>{{ b.total_price }}</td>
          <td>{{ getStatusLabel(b.status_id) }}</td>
          <td>{{ formatDate(b.created_at) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AdminBookings',
  data() {
    return {
      bookings: []
    };
  },
  mounted() {
    this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      const res = await fetch('http://localhost:3000/bookings/all');
      this.bookings = await res.json();
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    },
    getStatusLabel(statusId) {
        switch (statusId) {
        case 1: return 'Pending';
        case 2: return 'Accepted';
        case 3: return 'Denied';
        default: return 'Unknown';
        }
    }
  }
};
</script>

<style scoped>
.admin-bookings {
  padding: 2rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}
</style>
