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

        <!-- Show Bookings only when logged in -->
        <li
          v-if="isLoggedIn"
          class="c-navigation__link"
          @click="setActivePage('bookings')"
        >
          Bookings
        </li>

        <!-- Show Profile always last when logged in -->
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
  props: ["isLoggedIn"],
  data() {
    return {
      items: [
        { label: "Home", page: "home" },
        { label: "Explore", page: "explore" },
        { label: "Become a Host", page: "host" },
        { label: "Contact", page: "contact" },
        { label: "Login / Register", page: "auth", requiresAuth: false }
      ]
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => {
        return this.isLoggedIn ? item.page !== 'auth' : !item.requiresAuth;
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
