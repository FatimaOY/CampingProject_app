<template>
  <div class="admin-amenities">
    <h1>Manage Amenities</h1>

    <!-- To add new amenities -->
    <form @submit.prevent="addAmenity" class="create-form">
      <input v-model="newAmenity.name" placeholder="Amenity Name" required />
      <input v-model="newAmenity.description" placeholder="Amenity Description" required />
      <button type="submit">Add Amenity</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="amenity in amenities" :key="amenity.amenity_id">
          <td>{{ amenity.name }}</td>
          <td>{{ amenity.description }}</td>
          <td>
            <button @click="deleteAmenity(amenity.amenity_id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<script>
  export default {
    name: 'AdminAmenities',
    data() {
      return {
        amenities: [],
        newAmenity: {
          name: '',
          description: ''
        },
        error: '',
        success: ''
      };
    },
    mounted() {
      this.fetchAmenities();
    },
    methods: {
      async fetchAmenities() {
        const res = await fetch('http://localhost:3000/amenities');
        this.amenities = await res.json();
      },
      async addAmenity() {
        try {
          const res = await fetch('http://localhost:3000/amenities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.newAmenity)
          });

          const data = await res.json();

          if (res.ok) {
            this.success = 'Amenity added successfully!';
            this.error = '';
            this.newAmenity.name = '';
            this.newAmenity.description = '';
            this.fetchAmenities();
          } else {
            this.error = data.error || 'Failed to add amenity.';
            this.success = '';
          }
        } catch (err) {
          this.error = 'Server error.';
          this.success = '';
        }
      },
      async deleteAmenity(id) {
        if (!confirm('Are you sure you want to delete this amenity?')) return; //sends pop up.

        try {
          const res = await fetch(`http://localhost:3000/amenities/${id}`, { method: 'DELETE' });

          if (res.ok) {
            this.success = 'Amenity deleted successfully!';
            this.error = '';
            this.fetchAmenities();
          } else {
            this.error = 'Failed to delete amenity.';
            this.success = '';
          }
        } catch (err) {
          this.error = 'Server error.';
        }
      }
    }
  };
</script>

<style scoped>
  .admin-amenities {
    padding: 2rem;
  }
  .create-form {
    margin-bottom: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .create-form input {
    padding: 0.5rem;
  }
  .create-form button {
    background-color: #3d5018;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 0.5rem;
    border: 1px solid #ddd;
    text-align: center;
  }
  .error {
    color: red;
    margin-top: 1rem;
  }
  .success {
    color: green;
    margin-top: 1rem;
  }
</style>
