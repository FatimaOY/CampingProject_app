<template>
  <div class="admin-spots">
    <h1>Manage Camping Spots</h1>

    <!-- ➕ Add Amenities Button -->
    <div class="amenity-button">
      <button @click="goToAddAmenity">Add New Amenities Option</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>City</th>
          <th>Country</th>
          <th>Guests</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="spot in spots" :key="spot.spot_id">
          <td><input v-model="spot.name" /></td>
          <td><input v-model="spot.location" /></td>
          <td>{{ spot.city?.name }}</td>
          <td>{{ spot.country?.name }}</td>
          <td><input v-model.number="spot.amountGuests" /></td>
          <td><input v-model.number="spot.price_per_night" /></td>
          <td>
            <button @click="updateSpot(spot)">Update</button>
            <button @click="deleteSpot(spot.spot_id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AdminSpots',
  data() {
    return {
      spots: []
    };
  },
  mounted() {
    this.fetchSpots();
  },
  methods: {
    async fetchSpots() {
      const res = await fetch('http://localhost:3000/campingspots');
      this.spots = await res.json();
    },
    async deleteSpot(id) {
      if (!confirm('Are you sure you want to delete this spot?')) return;

      const res = await fetch(`http://localhost:3000/campingspots/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('✅ Spot deleted successfully.');
        this.fetchSpots();
      } else {
        alert('❌ Failed to delete spot.');
      }
    },
    async updateSpot(spot) {
      const res = await fetch(`http://localhost:3000/campingspots/${spot.spot_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: spot.name,
          location: spot.location,
          city: spot.city?.name,
          country: spot.country?.name,
          description: spot.description,
          amountGuests: spot.amountGuests,
          price_per_night: spot.price_per_night,
          is_Active: true,
          is_booked: false
        })
      });

      if (res.ok) {
        alert('✅ Spot updated successfully.');
        this.fetchSpots();
      } else {
        alert('❌ Failed to update spot.');
      }
    },
    goToAddAmenity() {
      this.$emit("setActivePage", "adminAmenities");
    }
  }
};
</script>

<style scoped>
.admin-spots {
  padding: 2rem;
}
.amenity-button {
  margin-bottom: 1rem;
}
.amenity-button button {
  padding: 0.5rem 1rem;
  background-color: #3d5018;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: center;
}
input {
  padding: 0.4rem;
}
</style>
