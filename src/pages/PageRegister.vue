<template>
  <div class="register-page">
    <h1>Create a Camply Account</h1>

    <div class="form-group">
      <label for="firstName">First Name</label>
      <input type="text" id="firstName" v-model="first_name" placeholder="Enter your first name" />
    </div>

    <div class="form-group">
      <label for="lastName">Last Name</label>
      <input type="text" id="lastName" v-model="last_name" placeholder="Enter your last name" />
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" placeholder="Enter your email" />
    </div>

    <div class="form-group">
      <label for="phone">Phone Number</label>
      <input type="tel" id="phone" v-model="phone_number" placeholder="Enter your phone number" />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" placeholder="Create a password" />
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirm Password</label>
      <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Repeat your password" />
    </div>

    <button @click="register">Sign Up</button>

    <p v-if="error" class="error-msg">{{ error }}</p>
    <p v-if="success" class="success-msg">{{ success }}</p>
  </div>
</template>

<script>
export default {
  name: "PageRegister",
  data() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirmPassword: '',
      error: '',
      success: ''
    };
  },
  methods: {
    register() {
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match.";
        this.success = '';
        return;
      }

      fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          phone_number: this.phone_number,
          password: this.password,
          is_admin: false,
          image_url: null
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            this.error = data.error;
            this.success = '';
          } else {
            this.success = "Registration successful! Redirecting to login...";
            this.error = '';
            this.first_name = '';
            this.last_name = '';
            this.email = '';
            this.phone_number = '';
            this.password = '';
            this.confirmPassword = '';

            // ⏳ Make sure the `this` context is correct:
            setTimeout(() => {
            this.$emit('setActivePage', 'login');
            }, 2000); // 2 seconds is usually better for user experience
          }
        })
        .catch(() => {
          this.error = "Something went wrong. Please try again.";
          this.success = '';
        });
    }
  }
}
</script>


<style scoped>
.register-page {
  max-width: 450px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f4;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
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
  margin-top: 1rem;
}

.error-msg {
  color: red;
  margin-top: 1rem;
}

.success-msg {
  color: green;
  margin-top: 1rem;
}
</style>
