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
  .image-upload-box input[type="file"] {
    margin-bottom: 0.5rem;
  }

  .manage-spot-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f8f8f8;
    border-radius: 10px;
  }
  form {
    margin-bottom: 2rem;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  input, textarea {
    width: 100%;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  button {
    margin-top: 1rem;
    background-color: #3d5018;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
  }
  .success {
    color: green;
  }
  .error {
    color: red;
  }
  .image-upload-box {
    margin-bottom: 2rem;
  }

  .image-upload-box input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .image-upload-box button {
    background-color: #3d5018;
    color: white;
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .image-item {
    position: relative;
  }

  .image-item img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
  }

  .image-item button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: crimson;
    border: none;
    color: white;
    font-size: 0.7rem;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .inline-left {
  text-align: left;
}

.amenities-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.amenities-scrollbox {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  max-height: 160px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.amenity-option {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

  </style>
