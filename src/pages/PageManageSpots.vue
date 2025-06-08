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
      <p><strong>Location:</strong> {{ spot.location }}</p>
      <p>{{ spot.description }}</p>
      <p><strong>Guests:</strong> {{ spot.amountGuests }} | <strong>Price:</strong> €{{ spot.price_per_night }}</p>

      <!-- Edit / Activate button -->
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
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f7fdf7;
}

.manage-spots-page h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

button {
  padding: 0.6rem 1.2rem;
  background-color: #3d5018;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin: 0.5rem 0;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #5a6631;
}

.form-container {
  margin-top: 1rem;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.form-container h2 {
  margin-bottom: 1rem;
  color: #3d5018;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

form input,
form textarea {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;
}

form button {
  align-self: flex-start;
  background-color: #3d5018;
}

.spots-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.spot-card {
  background: #ffffff;
  padding: 1.2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.spot-card h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.spot-card p {
  margin: 0.3rem 0;
  color: #444;
}

.spot-card button {
  margin-top: 0.7rem;
  width: 100%;
}

.error {
  color: red;
  background-color: #fcebea;
  border: 1px solid #f5c6cb;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1.5rem;
  text-align: center;
}
</style>