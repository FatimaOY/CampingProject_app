<template>
  <div>
    <nav class="c-navigation">
      <ul class="c-navigation__list">
        <li
          v-for="(item, index) in filteredItems"
          :key="index"
          class="c-navigation__link"
          @click="setActivePage(item.page)"
        >
          {{ item.label }}
        </li>

        <!-- Bookings (regular users only) -->
        <li
          v-if="isLoggedIn"
          class="c-navigation__link"
          @click="setActivePage('bookings')"
        >
          Bookings
        </li>

        <!-- Profile always last when logged in -->
        <li
          v-if="isLoggedIn"
          class="c-navigation__link"
          @click="setActivePage('profile')"
        >
          Profile
        </li>

      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavigationComponent",
  props: ['isLoggedIn', 'isHost', 'isAdmin'],
  data() {
    return {
      allItems: [
        { label: "Home", page: "home" },
        { label: "Explore", page: "explore" },
        { label: "Become a Host", page: "host", requiresNonHost: true },
        { label: "Login / Register", page: "auth", requiresAuth: false },

        // admin pages 
        { label: "Users", page: "adminUsers", requiresAdmin: true },
        { label: "Camping Spots", page: "adminSpots", requiresAdmin: true },
        { label: "All Bookings", page: "adminBookings", requiresAdmin: true }
      ]
    };
  },
  computed: {
    filteredItems() {
      return this.allItems.filter(item => {
        if (item.requiresAdmin) return this.isAdmin;
        if (item.requiresAuth === false) return !this.isLoggedIn;
        if (item.page === 'auth' && this.isLoggedIn) return false;
        if (item.page === 'host' && this.isHost) return false;
        return !item.requiresAdmin || !this.isAdmin;
      });
    }
  },
  methods: {
    setActivePage(page) {
      if (page === "host" && !this.isLoggedIn) {
        this.$emit("setActivePage", "auth");
      } else {
        this.$emit("setActivePage", page);
      }
    }
  }
};
</script>

<style scoped>
.c-navigation {
  background-color: #2d2814;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.c-navigation__list {
  list-style: none;
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
}

.c-navigation__link {
  color: #afb686;
  font-weight: bold;
  cursor: pointer;
}

.c-navigation__link:hover {
  color: #fff;
}
</style>