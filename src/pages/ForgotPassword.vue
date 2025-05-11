<template>
  <div class="forgot-password-page">
    <h2>Forgot Your Password?</h2>
    <p>Enter your email and we'll send you a link to reset your password.</p>

    <form @submit.prevent="submitEmail">
      <input type="email" v-model="email" placeholder="Enter your email" required />
      <button type="submit">Send Reset Link</button>
    </form>

    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      success: '',
      error: ''
    };
  },
  methods: {
    submitEmail() {
      fetch('http://localhost:3000/password/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            this.success = '';
            this.error = data.error;
          } else {
            this.error = '';
            this.success = 'Check your email inbox! (Check the console preview if using Ethereal).';
          }
        })
        .catch(() => {
          this.error = 'Something went wrong. Try again later.';
          this.success = '';
        });
    }
  }
};
</script>

<style scoped>
.forgot-password-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}

form {
  margin-top: 1rem;
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
