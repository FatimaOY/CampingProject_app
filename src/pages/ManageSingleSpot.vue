  <template>
    <div class="manage-spot-page">
      <h1>Edit & Activate Spot</h1>
      <div v-if="spot.spot_id" class="image-upload-box">
        <h2>Manage Images</h2>

        <input
          type="file"
          @change="handleFileUpload"
        />
        <button @click="uploadImage">Upload Image</button>


        <div class="image-gallery">
          <div v-for="img in images" :key="img.image_id" class="image-item">
            <img :src="img.image_url" alt="Camping spot image" />
            <button @click="deleteImage(img.image_id)">Delete</button>
          </div>
        </div>
      </div>

      <form @submit.prevent="updateSpot">
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

        <div class="form-group inline-left">
          <label>City</label>
          <input v-model="spot.city" placeholder="Enter city" />
        </div>

        <div class="form-group inline-left">
          <label>Country</label>
          <input v-model="spot.country" placeholder="Enter country" />
        </div>


        <div class="form-group">
          <label>Amenities</label>
          <div class="amenities-scrollbox">
            <label
              v-for="am in allAmenities"
              :key="am.amenity_id"
              class="amenity-option"
            >
              <input
                type="checkbox"
                :value="Number(am.amenity_id)"
                v-model="selectedAmenityIds"
              />
              {{ am.name }}
            </label>
          </div>
        </div>


        <div class="form-group">
          <label>Max Guests</label>
          <input v-model.number="spot.amountGuests" type="number" required />
        </div>

        <div class="form-group">
          <label>Price per Night</label>
          <input v-model.number="spot.price_per_night" type="number" step="0.01" required />
        </div>

        <button type="submit">Save Changes</button>
      </form>

      <div v-if="spot.spot_id">
      <h2>Select Availability Dates</h2>
      <v-calendar
          is-multiple
          :attributes="calendarAttributes"
          @dayclick="toggleAvailability"
      />
      </div>

      <p v-else class="error">Loading spot details...</p>


      <!-- <button v-if="selectedDates.length > 0 && !spot.is_Active" @click="activateSpot">
        Activate Spot
      </button> -->
      <!-- Toggle activation -->
      <button v-if="spot.spot_id" @click="toggleActivation">
      {{ spot.is_Active ? 'Deactivate Spot' : 'Activate Spot' }}
      </button>


      <p v-if="success" class="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>

  <script>
  export default {
    name: "ManageSingleSpot",
    props: ['spotId'],
    data() {
      return {
        spot: {},
        selectedDates: [],
        calendarAttributes: [],
        success: '',
        error: '',
        selectedFile: null,
        images: [],
        cities: [],
        countries: [],
        allAmenities: [],
        selectedAmenityIds: []

      };
    },
    mounted() {
      this.fetchSpot();
      this.fetchAvailability();
      this.fetchImages();
      this.fetchAllAmenities();
      this.fetchCities();
      this.fetchCountries();
    },
    methods: {
      fetchSpot() {
        fetch(`http://localhost:3000/campingspots/${this.spotId}`)
          .then(res => res.json())
          .then(data => {
            this.spot = {
              ...data,
              city: data.city?.name || '',
              country: data.country?.name || ''
            };

            this.error = '';
            this.selectedAmenityIds = data.campingspot_amenities.map(ca => ca.amenities.amenity_id);

          })
          .catch(() => {
            this.error = 'Failed to load spot.';
          });
      },
      fetchAvailability() {
        fetch(`http://localhost:3000/availability/${this.spotId}`)
          .then(res => res.json())
          .then(data => {
            this.selectedDates = data.map(d => d.Date.split('T')[0]);
            this.updateCalendarAttributes();
          });
      },
      toggleAvailability(day) {
        const isoDate = day.date.toISOString().split('T')[0];
        fetch("http://localhost:3000/availability/toggle", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spot_id: this.spot.spot_id, date: isoDate })
        })
          .then(res => res.json())
          .then(response => {
            if (response.action === 'added') {
              this.selectedDates.push(isoDate);
            } else if (response.action === 'removed') {
              this.selectedDates = this.selectedDates.filter(d => d !== isoDate);
            }
            this.updateCalendarAttributes();
          });
      },
      updateCalendarAttributes() {
        this.calendarAttributes = this.selectedDates.map(date => ({
          key: date,
          dates: new Date(date),
          highlight: { backgroundColor: '#3d5018' }
        }));
      },
      updateSpot() {
      const updatedData = {
        ...this.spot,
        amenities: this.selectedAmenityIds
      };

      fetch(`http://localhost:3000/campingspots/${this.spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
        .then(res => res.json())
        .then(() => {
          this.success = 'Spot updated successfully.';
          this.error = '';
        })
        .catch(() => {
          this.success = '';
          this.error = 'Failed to update spot.';
        });
    },
      toggleActivation() {
      const newStatus = !this.spot.is_Active;

      fetch(`http://localhost:3000/campingspots/${this.spotId}/activate`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_Active: newStatus })
      })
          .then(res => res.json())
          .then(() => {
          this.spot.is_Active = newStatus;
          this.success = newStatus
              ? 'Spot activated successfully!'
              : 'Spot deactivated.';
          this.error = '';
          })
          .catch(() => {
          this.error = 'Failed to update spot activation.';
          });
      },
      fetchImages() {
        fetch(`http://localhost:3000/images/${this.spotId}`)
          .then(res => res.json())
          .then(data => {
            this.images = data;
          });
      },

      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
      },

      uploadImage() {
        if (!this.selectedFile || !this.spot.spot_id) return;

        const formData = new FormData();
        formData.append('image', this.selectedFile);
        formData.append('spot_id', this.spot.spot_id);

        fetch('http://localhost:3000/images/upload', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(() => {
            this.selectedFile = null;
            this.fetchImages(); // Refresh image gallery
          });
      },

      deleteImage(imageId) {
        fetch(`http://localhost:3000/images/${imageId}`, {
          method: 'DELETE'
        })
          .then(() => {
            this.fetchImages(); // refresh
          });
      },
      fetchAllAmenities() {
        fetch('http://localhost:3000/amenities')
          .then(res => res.json())
          .then(data => {
            this.allAmenities = data;
          });
      },
      fetchCities() {
        fetch('http://localhost:3000/cities') // Change this if your endpoint is different
          .then(res => res.json())
          .then(data => {
            this.cities = data;
          });
      },
      fetchCountries() {
        fetch('http://localhost:3000/countries') // Change this if needed
          .then(res => res.json())
          .then(data => {
            this.countries = data;
          });
      }



    }
  };
  </script>

<style scoped>
  .manage-spot-page {
  max-width: 850px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #fdfdfd;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

h1, h2 {
  margin-bottom: 1rem;
  color: #3d5018;
}

form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

input, textarea {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

/* Inline Left Fields */
.inline-left {
  display: inline-block;
  width: 48%;
  margin-right: 2%;
}

/* Buttons */
button {
  background-color: #3d5018;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #5a6631;
}

.success {
  color: green;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}

/* Image Upload Section */
.image-upload-box {
  margin-bottom: 2rem;
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 8px;
}

.image-upload-box input[type="file"] {
  margin-bottom: 0.5rem;
  padding: 0.4rem;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
}

.image-item {
  position: relative;
  width: 100px;
  height: 100px;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.image-item button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: crimson;
  border: none;
  color: white;
  font-size: 0.7rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

/* Amenities Scrollbox */
.amenities-scrollbox {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.7rem;
  max-height: 160px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.amenity-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

/* Calendar Wrapper */
.vc-container {
  margin-top: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
}
</style>