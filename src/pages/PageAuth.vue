<template>
  <div class="auth-chooser">
    <h1>Welcome to Camply</h1>
    <p>Please choose how you'd like to continue:</p>

    <div class="button-group">
      <button @click="$emit('setActivePage', 'login')">Log in</button>
      <button @click="$emit('setActivePage', 'register')">Sign up</button>
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
  padding: 2rem;
  text-align: center;
}

.button-group {
  margin-top: 1.5rem;
}

button {
  margin: 0 1rem;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  background-color: #3d5018;
  color: white;
  border: 2px solid #1e1e1e;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #5f4e32;
}
</style>
