<template>
  <div class="reset-password-page">
    <h2>Reset Your Password</h2>

    <form @submit.prevent="submitNewPassword">
      <input
        type="password"
        v-model="newPassword"
        placeholder="Enter new password"
        required
      />
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Repeat new password"
        required
      />
      <button type="submit">Reset Password</button>
    </form>

    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      token: '',
      success: '',
      error: ''
    };
  },
  mounted() {
    // this code checks the URL for a token. If it's there: store it. If it's missing: it show an error.
    const urlParams = new URLSearchParams(window.location.search);
    //window.location.search gives you the query string in the URL
    //new URLSearchParams(...) turns that string into an object you can easily read.
    this.token = urlParams.get('token');
    if (!this.token) {
      this.error = 'Missing reset token.';
    }
  },
  methods: {
    submitNewPassword() {
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

      if (this.newPassword !== this.confirmPassword) {
        this.error = 'Passwords do not match.';
        this.success = '';
        return;
      }

      if (!passwordRegex.test(this.newPassword)) {
        this.error =
          'Password must be at least 8 characters, include a number and a special character.';
        this.success = '';
        return;
      }

      fetch('http://localhost:3000/password/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          //converts a JavaScript object into a JSON string
          token: this.token,
          newPassword: this.newPassword
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            this.success = '';
            this.error = data.error;
          } else {
            this.error = '';
            this.success = 'Password has been reset! You can now log in.';
          }
        })
        .catch(() => {
          this.error = 'Something went wrong.';
          this.success = '';
        });
    }
  }
};
</script>

<style scoped>
.reset-password-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}

input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  background-color: #3d5018;
  color: white;
  padding: 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.success {
  color: green;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
