<template>
  <div class="host-page">
    <h1>Become a Host - List Your Camping Spot</h1>

    <form @submit.prevent="submitSpot">
      <div class="form-group">
        <label>Name</label>
        <input v-model="spot.name" required />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="spot.description" required></textarea>
      </div>

      <div class="form-group">
        <label>Location</label>
        <input v-model="spot.location" required />
      </div>

      <div class="form-group">
        <label>Country</label>
        <input v-model="spot.country_name" placeholder="Enter country name" required />
      </div>

      <div class="form-group">
        <label>City</label>
        <input v-model="spot.city_name" placeholder="Enter city name" required />
      </div>

      <div class="form-group">
        <label>Max Guests</label>
        <input v-model.number="spot.amountGuests" type="number" required />
      </div>

      <div class="form-group">
        <label>Price per Night (EUR)</label>
        <input v-model.number="spot.price_per_night" type="number" required />
      </div>

      <div class="form-group">
        <label>Amenities</label>
        <div class="amenities-scroll">
          <div v-for="amenity in allAmenities" :key="amenity.amenity_id" class="amenity-item">
            <input type="checkbox" :value="amenity.amenity_id" v-model="selectedAmenities" :id="'amenity-' + amenity.amenity_id" /><label :for="'amenity-' + amenity.amenity_id">{{ amenity.name }}</label>
          </div>
        </div>
      </div>

      <button type="submit">Submit Camping Spot</button>

      <p v-if="success" class="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "PageHost",

  props: ['userId'],
  data() {
    return {
      spot: {
        name: '',
        description: '',
        location: '',
        country_name: '',
        city_name: '',
        amountGuests: null,
        price_per_night: null
      },
      selectedAmenities: [],
      allAmenities: [],
      success: '',
      error: ''
    };
  },
  methods: {
    fetchAmenities() {
      fetch("http://localhost:3000/amenities")
        .then(res => res.json())
        .then(data => {
          this.allAmenities = data;
        });
    },
    submitSpot() {
      // ✅ Set owner_id here using prop value
      this.spot.owner_id = this.userId;

      const fullSpotData = {
        ...this.spot,
        amenities: this.selectedAmenities
      };

      fetch("http://localhost:3000/campingspots", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fullSpotData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.spot_id) {
            this.success = "Camping spot created successfully!";
            this.error = '';
            this.$emit('setAsHost'); // Let App.vue know user is now a host
          } else {
            this.error = data.error || "Something went wrong.";
            this.success = '';
          }
        })
        .catch(() => {
          this.error = "Server error. Please try again later.";
        });
    }
  },
  mounted() {
    this.fetchAmenities();
  }
};
</script>

<style scoped>
.host-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f4;
  border-radius: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #aaa;
}

.amenities-scroll {
  max-height: 150px;
  overflow-y: auto;
  width: 100%;
  background-color: #fff;
  border: 1px solid #aaa;
  border-radius: 6px;
  padding: 0.5rem;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.amenity-item label {
  font-weight: bold;
  margin-left: 0.5rem;
}

input[type="checkbox"] {
  width: auto;
}

button {
  padding: 0.7rem 1.2rem;
  background-color: #3d5018;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>