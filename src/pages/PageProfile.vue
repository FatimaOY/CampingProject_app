<template>
  <div class="profile-page">
    <h1>User Profile</h1>

    <div v-if="user">
      <div class="form-group">
        <label>Profile Image</label>
        <img :src="editableUser.image_url || defaultImage" alt="Profile Image" class="profile-img" />

        <input type="file" @change="handleImageUpload" accept="image/*" />

        <p v-if="uploading">Uploading...</p>
        <p v-if="uploadError" class="error">{{ uploadError }}</p>

      </div>

      <div class="form-group">
        <label>First Name</label>
        <input type="text" v-model="editableUser.first_name" />
      </div>

      <div class="form-group">
        <label>Last Name</label>
        <input type="text" v-model="editableUser.last_name" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input type="text" v-model="editableUser.email" disabled />
      </div>

      <div class="form-group">
        <label>Phone Number</label>
        <input type="text" v-model="editableUser.phone_number" />
      </div>

      <button @click="updateProfile">Update Profile</button>
      <button class="danger" @click="$emit('setActivePage', 'changePassword')">Change Password</button>
      <button class="danger" @click="deleteAccount">Delete Account</button>

      <!-- Owner-specific content -->
      <div v-if="isHost" class="owner-section">
        <hr />
        <h2>Owner Tools</h2>
        <button @click="$emit('setActivePage', 'manageSpots')">Manage My Camping Spots</button>

      </div>

      <p v-if="success" class="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageProfile',
  props: ['userId'],
  data() {
    return {
      user: null,
      editableUser: {},
      success: '',
      error: '',
      isHost: false,
      defaultImage: 'https://via.placeholder.com/100',
      uploading: false,
      uploadError: ''
    };
  },

  methods: {
    fetchUserProfile() {
        fetch(`http://localhost:3000/profile?userId=${this.userId}`)
        .then(res => res.json())
        .then(data => {
          this.user = data;
          this.editableUser = { ...data };
        });
    },
    updateProfile() {
      fetch('http://localhost:3000/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.editableUser)
      })
        .then(res => res.json())
        .then(response => {
          if (response.user) {
            this.success = 'Profile updated successfully.';
            this.error = '';
            this.user = { ...response.user };
          } else {
            this.error = response.error || 'Something went wrong.';
            this.success = '';
          }
        });
    },
    checkHostStatus() {
      fetch(`http://localhost:3000/campingspots/owner/${this.userId}`)
        .then(res => res.json())
        .then(spots => {
          this.isHost = Array.isArray(spots) && spots.length > 0;
        });
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      this.uploading = true;
      fetch('http://localhost:3000/upload/upload-profile-image', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.imageUrl) {
            this.editableUser.image_url = data.imageUrl;
            this.uploadError = '';
          } else {
            this.uploadError = 'Upload failed';
          }
        })
        .catch(() => {
          this.uploadError = 'Error uploading image';
        })
        .finally(() => {
          this.uploading = false;
        });
    },
    deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;

    fetch(`http://localhost:3000/users/${this.user.user_id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        // Optionally redirect or reset state
        window.location.reload();

      })
      .catch(() => {
        this.error = 'Failed to delete account.';
      });
  }


  },
  mounted() {
    this.fetchUserProfile();
    this.checkHostStatus();
  }
};
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f4;
  border-radius: 8px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

input {
  width: 100%;
  padding: 0.5rem;
}

button {
  margin-right: 10px;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.danger {
  background-color: #a33;
  color: white;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
