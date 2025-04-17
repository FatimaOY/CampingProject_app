<template>
    <div class="write-review">
      <h2>Write a Review for {{ spot?.name || 'this spot' }}</h2>
  
      <p v-if="spot"><strong>Location:</strong> {{ spot.location }}</p>
  
      <form @submit.prevent="submitReview">
        <label>
          Rating:
          <select v-model.number="rating" required>
            <option disabled value="">Select a rating</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }} Star{{ n > 1 ? 's' : '' }}</option>
          </select>
        </label>
  
        <label>
          Comment:
          <textarea v-model="comment" placeholder="Share your experience..." required></textarea>
        </label>
  
        <button type="submit">Submit Review</button>
      </form>
  
      <p class="success" v-if="success">{{ success }}</p>
      <p class="error" v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PageWriteReview',
    props: ['spotId', 'userId'],
    data() {
      return {
        rating: '',
        comment: '',
        spot: null,
        success: '',
        error: ''
      };
    },
    mounted() {
      this.fetchSpot();
    },
    methods: {
      async fetchSpot() {
        try {
          const res = await fetch(`http://localhost:3000/campingspots/${this.spotId}`);
          this.spot = await res.json();
        } catch (err) {
          console.error('Error loading spot:', err);
        }
      },
      async submitReview() {
        if (!this.rating || !this.comment) {
          this.error = 'Please fill in both fields.';
          return;
        }
  
        try {
          const res = await fetch('http://localhost:3000/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: this.userId,
              spot_id: this.spotId,
              rating: this.rating,
              comment: this.comment
            })
          });
  
          if (res.ok) {
            this.success = 'Review submitted successfully!';
            this.error = '';
            this.rating = '';
            this.comment = '';
          } else {
            const result = await res.json();
            this.error = result.error || 'Failed to submit review.';
          }
        } catch (err) {
          this.error = 'Something went wrong. Please try again.';
          console.error(err);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .write-review {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #f1f7f2;
    border-radius: 12px;
  }
  label {
    display: block;
    margin: 1rem 0;
    font-weight: bold;
  }
  textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.5rem;
    border-radius: 6px;
  }
  select {
    padding: 0.4rem;
  }
  button {
    padding: 0.6rem 1.2rem;
    background-color: #3d5018;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 1rem;
  }
  .success {
    color: green;
    margin-top: 1rem;
  }
  .error {
    color: red;
    margin-top: 1rem;
  }
  </style>
  