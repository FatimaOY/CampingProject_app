<template>
  <div class="explore-page">
    <h1>Explore Camping Spots</h1>

    <div class="filters">
      <strong>Filter by:</strong>
      <select v-model="filters.country">
        <option value="">Country</option>
        <option v-for="c in availableCountries" :key="c" :value="c">{{ c }}</option>
      </select>

      <select v-model="filters.city">
        <option value="">City</option>
        <option v-for="c in availableCities" :key="c" :value="c">{{ c }}</option>
      </select>

      <input v-model.number="filters.minPrice" type="number" placeholder="Min Price" />
      <input v-model.number="filters.maxPrice" type="number" placeholder="Max Price" />
      <input v-model.number="filters.guests" type="number" placeholder="Guests (Exact)" />
      <input v-model.number="filters.minRating" type="number" step="0.1" min="1" max="5" placeholder="Min Rating" />

      <button @click="applyFilters">Apply Filters</button>
    </div>

    <div class="grid">
      <div class="camping-card" v-for="spot in filteredSpots" :key="spot.spot_id" @click="$emit('showSpotDetails', spot.spot_id)">
        <div v-if="spot.images && spot.images.length" class="image-container">
          <img
            v-if="spot.images && spot.images.length > 0"
            :src="spot.images[0].image_url"
            alt="Camping Image"
            class="spot-image"
          />        
      </div>
        <h3>{{ spot.name }}</h3>
        <p><strong>Location:</strong> {{ spot.location }}</p>
        <p><strong>City:</strong> {{ spot.city?.name }}</p>
        <p><strong>Country:</strong> {{ spot.country?.name }}</p>
        <p><strong>Guests:</strong> {{ spot.amountGuests }}</p>
        <p><strong>Price:</strong> €{{ spot.price_per_night }} / night</p>
        <p><strong>Rating:</strong> {{ spot.averageRating ? spot.averageRating.toFixed(1) : 'No reviews' }}</p>
        <p><strong>Amenities:</strong>
          <span v-for="a in spot.amenities" :key="a.amenity_id">
            {{ a.name }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageExplore",
  data() {
    return {
      campingSpots: [],
      filteredSpots: [],
      filters: {
        country: '',
        city: '',
        guests: null,
        minPrice: null,
        maxPrice: null,
        minRating: null
      },
      availableCountries: [],
      availableCities: []
    };
  },
  methods: {
    applyFilters() {
      this.filteredSpots = this.campingSpots.filter(spot => {
        const matchCountry = !this.filters.country || spot.country?.name === this.filters.country;
        const matchCity = !this.filters.city || spot.city?.name === this.filters.city;
        const matchGuests = !this.filters.guests || spot.amountGuests === this.filters.guests;
        const matchMinPrice = !this.filters.minPrice || spot.price_per_night >= this.filters.minPrice;
        const matchMaxPrice = !this.filters.maxPrice || spot.price_per_night <= this.filters.maxPrice;
        const matchRating = !this.filters.minRating || (spot.averageRating ?? 0) >= this.filters.minRating;

        return (
          matchCountry &&
          matchCity &&
          matchGuests &&
          matchMinPrice &&
          matchMaxPrice &&
          matchRating
        );
      });
    }
  },
  mounted() {
    fetch("http://localhost:3000/campingspots")
      .then(res => res.json())
      .then(data => {
        this.campingSpots = data;
        this.filteredSpots = data;

        this.availableCountries = [...new Set(data.map(s => s.country?.name).filter(Boolean))];
        this.availableCities = [...new Set(data.map(s => s.city?.name).filter(Boolean))];
      });
  }
};
</script>

<style scoped>
.explore-page {
  padding: 2rem;
  background-color: #e6f2e6;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: #d4d4d4;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  align-items: center;
}

.filters input,
.filters select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #888;
}

.filters button {
  padding: 0.5rem 1rem;
  background-color: #3d5018;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.camping-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.spot-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
</style>
