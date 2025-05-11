<template>
  <div class="home-container">
    <section class="hero">
      <img :src="require('@/assets/photo1.avif')" alt="Backgroud picture" />
      <div class="overlay">
        <h1>Welcome to Camply</h1>
        <h2>Find Your Perfect Spot</h2>
        <p>
          Discover epic spots with just a few clicks. From cozy parks to hidden
          gems in the woods, we've got it all. Honest reviews, budget-friendly
          finds, and a hassle-free booking experience await.
        </p>
        <h2>The Airbnb for campers ~ find your next outdoor escape.</h2>

      </div>
    </section>    

    <footer class="main-footer">
      <div class="footer-content">
        <div>Contact us: info@camply.com</div>
        <div class="social-links">
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
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

.hero {
  position: relative;
  width: 100%;
  height: 75vh;
  overflow: hidden;
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(70%);
}

.overlay {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #FEB;
}

.overlay h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.overlay p {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.overlay button {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #afb686;
  color: #2d2814;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.overlay button:hover {
  background-color: #c8cf98;
}


.welcome-text h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.welcome-text p {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.main-footer {
  background-color: #2d2814;
  color: #FEB;
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

.social-links a:not(:last-child)::after {
  content: " | ";
  color: #afb686;
}

.home-container {
  min-height: 100vh; /* Ensures it at least fills the screen */
  display: flex;
  flex-direction: column;
}

.hero {
  flex: 1;
}
.hero img {
  display: block; /* Prevents inline spacing below image */
}


.camplyLogo {
  width: 20px;
  height: 20px;
}
</style>
