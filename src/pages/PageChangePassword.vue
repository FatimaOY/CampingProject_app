<template>
    <div class="change-password-page">
      <h1>Change Password</h1>
  
      <div class="form-group">
        <label>Current Password</label>
        <input type="password" v-model="currentPassword" />
      </div>
  
      <div class="form-group">
        <label>New Password</label>
        <input type="password" v-model="newPassword" />
      </div>
  
      <div class="form-group">
        <label>Confirm New Password</label>
        <input type="password" v-model="confirmPassword" />
      </div>
  
      <button @click="changePassword">Submit</button>
  
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PageChangePassword',
    props: ['userId'],
    data() {
    return {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        error: '',
        success: '',
        user: null
    };
    },
    mounted() {
    // Fetch user details (for email)
    fetch(`http://localhost:3000/profile?userId=${this.userId}`)
        .then(res => res.json())
        .then(data => {
        this.user = data;
        });
    }
    ,
    methods: {
        changePassword() {
        const strongRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9])(.{8,})$/;


        if (!strongRegex.test(this.newPassword)) {
            this.error = 'Password must be at least 8 characters, include a digit and a special character.';
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.error = 'New passwords do not match.';
            return;
        }

        fetch('http://localhost:3000/password/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            email: this.user.email, // we fetch this in mounted()
            currentPassword: this.currentPassword,
            newPassword: this.newPassword
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    this.success = data.message;
                    this.error = '';
                    this.currentPassword = '';
                    this.newPassword = '';
                    this.confirmPassword = '';

                    // redirect to Profile page after 1.5 seconds
                    setTimeout(() => {
                    this.$emit('setActivePage', 'profile');
                    }, 1500);
                } else {
                    this.error = data.error || 'Password update failed.';
                }
            })

            .catch(() => {
            this.error = 'Something went wrong.';
            });
        }

    }
  };
  </script>
  
  <style scoped>
  .change-password-page {
    max-width: 500px;
    margin: auto;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
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
    padding: 0.6rem 1rem;
    background: #3d5018;
    color: white;
    border: none;
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
  