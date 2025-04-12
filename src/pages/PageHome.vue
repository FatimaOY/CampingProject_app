<template>
  <div class="home-container">
    <!-- Hero Image -->
    <div class="hero-image">
        <!-- <img :src="require('@/assets/camplyLogo.png')" alt="Camply logo" /> -->
    </div>

    <!-- Welcome Text -->
    <section class="welcome-text">
      <h1>Welcome to Camply — the Airbnb for campers.</h1>
      <p>
        Discover epic spots with just a few clicks. From cozy parks to hidden
        gems in the woods, we've got it all. Honest reviews, budget-friendly
        finds, and a hassle-free booking experience await.
      </p>

      <!-- Action Buttons -->
      <!-- <div class="auth-buttons">
        <button @click="$emit('setActivePage', 'login')">Log in</button>
        <button @click="$emit('setActivePage', 'register')">Sign up</button>
      </div> -->
    </section>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="footer-content">
        <div>Contact us: info@camply.com</div>
        <div>
          <a href="#">Instagram</a> |
          <a href="#">Facebook</a> |
          <a href="#">Twitter</a>
        </div>
        <div>
          Language:
          <select>
            <option>EN</option>
            <option>NL</option>
          </select>
          Currency:
          <select>
            <option>EUR</option>
            <option>USD</option>
          </select>
        </div>
        <div><a href="#">Terms & Privacy</a></div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PageHome'
};
</script>

<style scoped>
.home-container {
  text-align: center;
  font-family: Arial, sans-serif;
}

.hero-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
}

.welcome-text {
  background-color: #3d5018;
  color: #fff;
  padding: 2rem;
}

.auth-buttons button {
  margin: 10px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  background-color: #afb686;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.auth-buttons button:hover {
  background-color: #727047;
}

.main-footer {
  background-color: #2d2814;
  color: white;
  padding: 1rem;
}

.footer-content div {
  margin: 0.5rem 0;
}

.footer-content a {
  color: #afb686;
  text-decoration: none;
}
</style>
