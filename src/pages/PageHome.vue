<template>
  <div class="home-container">
    <!-- Hero Image -->
    <div class="hero-image">
        <img :src="require('@/assets/photo1.avif')" alt="Camply logo" />
    </div>

    <!-- Welcome Text -->
    <section class="welcome-text">
      <h1>Welcome To Camply ~~ The Airbnb For Campers.</h1>
      <p>
        Discover epic spots with just a few clicks. From cozy parks to hidden
        gems in the woods, we've got it all. Honest reviews, budget-friendly
        finds, and a hassle-free booking experience await.
      </p>
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f7f7f7;
  color: #333;
}

.hero-image img {
  width: 100%;
  height: 80vh;
  object-fit: cover;
  object-position: center;
  border-bottom: 5px solid #3d5018;
}

/* Welcome Section Styling */
.welcome-text {
  background-color: #3d5018;
  color: #fff;
  padding: 4rem 2rem;
  text-align: center;
}

.welcome-text h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.welcome-text p {
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Footer Styling */
.main-footer {
  background-color: #2d2814;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
  font-size: 0.95rem;
}

.footer-content div {
  margin: 0.5rem 0;
}

.footer-content a {
  color: #afb686;
  text-decoration: none;
  margin: 0 0.5rem;
}

.footer-content a:hover {
  text-decoration: underline;
}
</style>
