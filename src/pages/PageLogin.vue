<template>
  <div class="login-page">
    <div class="login-box">
      <h1>Login to <span>Camply</span></h1>

      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Enter email" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="password" placeholder="Enter password" />
        <p class="forgot-link" @click="goToForgotPassword">Forgot Password?</p>
      </div>

      <button @click="login">Log In</button>

      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
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
          if (data.user) {
            this.$emit("setLoggedIn", data.user);
            this.$emit('setUserId', data.user.user_id);
            this.$emit('setActivePage', 'explore');
          } else {
            this.error = data.error || 'Login failed.';
          }
        })
        .catch((err) => {
          console.error("Login error:", err);
          this.error = 'Something went wrong. Try again later.';
        });
    },
    goToForgotPassword() {
      this.$emit('setActivePage', 'forgot-password');
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #e0eafc, #cfdef3);
}

.login-box {
  background-color: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-box h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #3d5018;
}

.login-box h1 span {
  font-weight: bold;
  color: #5f4e32;
}

.form-group {
  text-align: left;
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #3d5018;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #5f4e32;
}

.error-msg {
  color: red;
  margin-top: 1rem;
  font-size: 0.95rem;
}

.forgot-link {
  color: #d9534f;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  text-align: right;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #b52b27;
}
</style>
