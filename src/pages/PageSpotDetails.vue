<template>
    <div class="spot-details">
      <h1>{{ spot.name }}</h1>
  
      <!-- Spot Images -->
      <div v-if="images.length > 0" class="image-gallery">
        <img v-for="img in images" :key="img.image_id" :src="img.image_url" alt="Camping spot image" class="spot-image"/>
      </div>
  
      <!-- Owner Info -->
      <p v-if="owner">
        <strong>Hosted by:</strong> {{ owner.first_name }} {{ owner.last_name }}  
        <br>
        <strong>Email:</strong> {{ owner.email }}  
        <br>
        <strong>Phone:</strong> {{ owner.phone_number }}
      </p>
  
      <!-- Spot Info -->
      <p><strong>Description:</strong> {{ spot.description }}</p>
      <p><strong>Location:</strong> {{ spot.location }}</p>
      <p><strong>City:</strong> {{ spot.city?.name }}</p>
      <p><strong>Country:</strong> {{ spot.country?.name }}</p>
      <p><strong>Guests Allowed:</strong> {{ spot.amountGuests }}</p>
      <p><strong>Price per Night:</strong> €{{ spot.price_per_night }}</p>
  
      <!-- Amenities -->
      <h3>Amenities</h3>
      <ul>
        <li v-for="a in spot.amenities" :key="a.amenity_id">{{ a.name }}</li>
      </ul>
  
      <!-- Reviews -->
      <h3>Reviews</h3>
      <p><strong>⭐ Average: </strong> {{ spot.averageRating ? spot.averageRating.toFixed(1) : 'No reviews yet' }}</p>
      <ul v-if="reviews.length > 0">
        <li v-for="r in reviews" :key="r.review_id" class="review-item">
          <div class="review-header">
            <img
              v-if="r.user?.image_url"
              :src="r.user.image_url"
              class="review-avatar"
              alt="Profile Picture"
            />
            <div class="review-user">
              <strong>{{ r.user?.first_name }} {{ r.user?.last_name }}</strong>
              <div>⭐ {{ r.rating }}/5</div>
            </div>
          </div>
          <p>{{ r.comment }}</p>
        </li>
      </ul>

      <p v-else>No reviews yet.</p>

      <!-- Book Button -->
      <button @click="goToBooking">Book This Spot</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PageSpotDetails',
    props: ['spotId'],
    data() {
      return {
        spot: {},
        owner: null,
        images: [],
        reviews: []
      };
    },
    mounted() {
      this.fetchSpotDetails();
      this.fetchImages();
      this.fetchReviews();
    },
    methods: {
      async fetchSpotDetails() {
        const res = await fetch(`http://localhost:3000/campingspots/${this.spotId}`);
        const data = await res.json();
        this.spot = data;

        if (data.owner_id) {
          const ownerRes = await fetch(`http://localhost:3000/users/${data.owner_id}`);
          const ownerData = await ownerRes.json();
          this.owner = ownerData;
        }
      },
      async fetchImages() {
        const res = await fetch(`http://localhost:3000/images/${this.spotId}`);
        const data = await res.json();
        this.images = data;
      },
      async fetchReviews() {
        const res = await fetch(`http://localhost:3000/reviews/spot/${this.spotId}`);
        const data = await res.json();
        this.reviews = data;
      },
      goToBooking() {
        this.$emit('bookThisSpot', this.spotId);
      }
    }
  };
  </script>
  
<style scoped>
  .spot-details {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 12px;
    text-align: left;

  }
  .image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .spot-image {
    width: 100%;
    max-width: 300px;
    border-radius: 10px;
    object-fit: cover;
  }
  button {
    margin-top: 2rem;
    padding: 0.6rem 1.2rem;
    background-color: #3d5018;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .review-item {
  background-color: #e7f2e7;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  text-align: left;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.review-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
}

.review-user {
  display: flex;
  flex-direction: column;
}


</style>
  