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
      <small>Example: yourname@example.com</small>
    </div>

    <div class="form-group">
      <label for="phone">Phone Number</label>
      <input type="tel" id="phone" v-model="phone_number" placeholder="Enter your phone number" />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" placeholder="Create a password" />
      <small>Password must be at least 8 characters, contain 1 digit and 1 special character.</small>
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
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    isValidPassword(password) {
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
      return passwordRegex.test(password);
    },
    register() {
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match.";
        this.success = '';
        return;
      }

      if (!this.isValidEmail(this.email)) {
        this.error = "Please enter a valid email address.";
        this.success = '';
        return;
      }

      if (!this.isValidPassword(this.password)) {
        this.error = "Password must be at least 8 characters, include a digit and a special character.";
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

            setTimeout(() => {
              this.$emit('setActivePage', 'login');
            }, 2000);
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
  max-width: 500px;
  margin: 3rem auto;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background:  #ffffff;

}

.register-page h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.2rem;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.3rem;
}

input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus {
  border-color: #3d5018;
  outline: none;
}

small {
  display: block;
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.2rem;
}

button {
  width: 100%;
  padding: 0.8rem 1.5rem;
  background-color: #3d5018;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  margin-top: 1.5rem;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #5f6c30;
}

.error-msg {
  color: #d9534f;
  background-color: #fcebea;
  border: 1px solid #f5c6cb;
  padding: 0.8rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
}

.success-msg {
  color: #28a745;
  background-color: #e6f9ed;
  border: 1px solid #c3e6cb;
  padding: 0.8rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
}
</style>
