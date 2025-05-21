<template>
  <div class="auth-chooser">
    <div class="auth-box">
      <h1>Welcome to <span>Camply</span></h1>
      <p>Please choose how you'd like to continue:</p>

      <div class="button-group">
        <button @click="$emit('setActivePage', 'login')">Log In</button>
        <button @click="$emit('setActivePage', 'register')">Sign Up</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageAuth'
}
</script>

<style scoped>
.auth-chooser {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #e0eafc, #cfdef3);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.auth-box {
  background-color: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.auth-box h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #3d5018;
}

.auth-box h1 span {
  color: #5f4e32;
  font-weight: bold;
}

.auth-box p {
  color: #555;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

button {
  flex: 1 1 45%;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #3d5018;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #5f4e32;
}
</style>
