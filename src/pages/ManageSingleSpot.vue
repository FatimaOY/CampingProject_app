<template>
  <div class="manage-spot-page">
    <h1>Edit & Activate Spot</h1>

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
      error: ''
    };
  },
  mounted() {
    this.fetchSpot();
    this.fetchAvailability();
  },
  methods: {
    fetchSpot() {
      fetch(`http://localhost:3000/campingspots/${this.spotId}`)
        .then(res => res.json())
        .then(data => {
          this.spot = data;
          this.error = '';
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
      fetch(`http://localhost:3000/campingspots/${this.spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.spot)
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
    }

  }
};
</script>

<style scoped>
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
</style>
