<template>
  <div class="manage-spots-page">
    <h1>My Camping Spots</h1>

    <button @click="showAddForm = !showAddForm">
      {{ showAddForm ? 'Cancel' : 'Add New Spot' }}
    </button>

    <!-- Add Form -->
    <div v-if="showAddForm" class="form-container">
      <h2>Add New Spot</h2>
      <form @submit.prevent="submitNewSpot">
        <input v-model="newSpot.name" placeholder="Name" required />
        <input v-model="newSpot.location" placeholder="Location" required />
        <input v-model="newSpot.city_name" placeholder="City" required />
        <input v-model="newSpot.country_name" placeholder="Country" required />
        <textarea v-model="newSpot.description" placeholder="Description" required></textarea>
        <input v-model.number="newSpot.amountGuests" placeholder="Max Guests" type="number" required />
        <input v-model.number="newSpot.price_per_night" placeholder="Price per Night" type="number" required />
        <button type="submit">Submit</button>
      </form>
    </div>

    <!-- Spots List -->
    <div class="spots-list">
    <div v-for="spot in spots" :key="spot.spot_id" class="spot-card">
      <h3>{{ spot.name }}</h3>
      <p><strong>Location:</strong> {{ spot.location }}, {{ spot.city?.name }}, {{ spot.country?.name }}</p>
      <p>{{ spot.description }}</p>
      <p><strong>Guests:</strong> {{ spot.amountGuests }} | <strong>Price:</strong> €{{ spot.price_per_night }}</p>

      <!-- ✅ Edit / Activate button -->
      <button @click="$emit('editSpot', spot.spot_id)">Edit / Activate</button>

      <button @click="deleteSpot(spot.spot_id)">Delete</button>
    </div>
  </div>


    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "PageManageSpots",
  props: ['userId'],
  data() {
    return {
      spots: [],
      error: '',
      showAddForm: false,
      newSpot: {
        name: '',
        location: '',
        city_name: '',
        country_name: '',
        description: '',
        amountGuests: null,
        price_per_night: null
      }
    };
  },
  mounted() {
    this.fetchSpots();
  },
  methods: {
    fetchSpots() {
      fetch(`http://localhost:3000/campingspots/owner/${this.userId}`)
        .then(res => res.json())
        .then(data => {
          this.spots = data;
        })
        .catch(() => {
          this.error = 'Failed to load spots';
        });
    },
    submitNewSpot() {
      const spotToSend = {
        ...this.newSpot,
        owner_id: this.userId
      };

      fetch('http://localhost:3000/campingspots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotToSend)
      })
        .then(res => res.json())
        .then(data => {
          this.spots.push(data);
          this.newSpot = {
            name: '', location: '', city_name: '', country_name: '', description: '', amountGuests: null, price_per_night: null
          };
          this.showAddForm = false;
        })
        .catch(() => {
          this.error = 'Failed to add spot';
        });
    },
    deleteSpot(id) {
        console.log('Trying to delete spot with ID:', id);

      fetch(`http://localhost:3000/campingspots/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(() => {
          this.spots = this.spots.filter(spot => spot.spot_id !== id);
        })
        .catch(() => {
          this.error = 'Failed to delete spot';
        });
    }
  }
};
</script>

<style scoped>
.manage-spots-page {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.form-container {
  margin: 1rem 0;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.spots-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.spot-card {
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  text-align: left;
}

button {
  margin-top: 0.5rem;
  background-color: #3d5018;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
