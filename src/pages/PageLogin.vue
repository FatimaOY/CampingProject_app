<template>
  <div class="login-page">
    <h1>Login to Camply</h1>

    <div class="form-group">
      <label>Email</label>
      <input type="email" v-model="email" placeholder="Enter email" />
    </div>

    <div class="form-group">
      <label>Password</label>
      <input type="password" v-model="password" placeholder="Enter password" />
    </div>

    <button @click="login">Log In</button>

    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'PageLogin',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    login() {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            email: this.email,
            password: this.password
            })
        })
            .then(res => res.json())
            .then(data => {
            if (data.user) { // ✅ check if a user object was returned
                this.$emit('setLoggedIn', true);
                this.$emit('setActivePage', 'explore');
            } else {
                this.error = data.error || 'Login failed.';
            }
            })
            .catch((err) => {
            console.error("Login error:", err);
            this.error = 'Something went wrong. Try again later.';
            });
        }

  }
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f4;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 5px;
}

button {
  padding: 0.6rem 1.2rem;
  background-color: #3d5018;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-msg {
  color: red;
  margin-top: 1rem;
}
</style>
