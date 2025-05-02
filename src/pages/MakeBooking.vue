<template>
    <div class="booking-page">
      <h1>Booking for {{ spot.name }}</h1>
      <p><strong>Location:</strong> {{ spot.location }}</p>
      <p><strong>Price per night:</strong> €{{ spot.price_per_night }}</p>
  
      <!-- Month/Year Dropdowns -->
      <div class="dropdowns">
        <select v-model="selectedMonth" @change="generateCalendar">
          <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
        </select>
  
        <select v-model="selectedYear" @change="generateCalendar">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
  
      <!-- Custom Calendar Grid -->
      <div class="calendar">
        <div class="day-name" v-for="d in daysOfWeek" :key="d">{{ d }}</div>
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="calendar-cell"
          :class="getDateClass(day)"
          @click="selectDate(day)"
        >
          {{ day ? new Date(day).getDate() : '' }}
        </div>
      </div>
  
      <!-- Selected dates for the debug-->
      <!-- <p><strong>Selected Dates:</strong> {{ selectedDates }}</p> -->
  
      <div class="legend">
        <div><span class="legend-box available"></span> Available</div>
        <div><span class="legend-box booked"></span> Booked</div>
        <div><span class="legend-box selected"></span> Your Selection</div>
      </div>
  
      <button @click="submitBooking" :disabled="selectedDates.length === 0">
        Confirm Booking
      </button>
  
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MakeBooking',
    props: ['spotId', 'userId'],
    data() {
      return {
        spot: {},
        availability: [],
        selectedDates: [],
        calendarDays: [],
        selectedMonth: new Date().getMonth(),
        selectedYear: new Date().getFullYear(),
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        years: [2024, 2025, 2026],
        daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        error: '',
        success: ''
      };
    },
    mounted() {
      this.fetchSpot();
      this.fetchAvailability();
      this.generateCalendar();
    },
    methods: {
      async fetchSpot() {
        const res = await fetch(`http://localhost:3000/campingspots/${this.spotId}`);
        this.spot = await res.json();
      },
      async fetchAvailability() {
        const res = await fetch(`http://localhost:3000/availability/${this.spotId}`);
        const data = await res.json();
        this.availability = data.map(a => ({
          ...a,
          Date: a.Date.split('T')[0],
          isBooked: Boolean(a.isBooked)
        }));
      },
      generateCalendar() {
        const days = [];
        const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
        const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0);
  
        const startDay = firstDay.getDay();
        for (let i = 0; i < startDay; i++) {
          days.push(null); // empty leading cells
        }
  
        for (let i = 1; i <= lastDay.getDate(); i++) {
          const date = new Date(this.selectedYear, this.selectedMonth, i).toISOString().split('T')[0];
          days.push(date);
        }
  
        this.calendarDays = days;
      },
      getDateClass(date) {
        if (!date) return 'empty';
        if (this.selectedDates.includes(date)) return 'selected';
        const booked = this.availability.find(a => a.Date === date && a.isBooked);
        if (booked) return 'booked';
        const available = this.availability.find(a => a.Date === date && !a.isBooked);
        if (available) return 'available';
        return 'disabled';
      },
      selectDate(date) {
        if (!date) return;

        const available = this.availability.find(a => a.Date === date && !a.isBooked);
        if (!available) return;

        // Deselect if already selected
        if (this.selectedDates.includes(date)) {
          this.selectedDates = this.selectedDates.filter(d => d !== date);
          return;
        }

        // If no dates selected, just add the date
        if (this.selectedDates.length === 0) {
          this.selectedDates.push(date);
          return;
        }

        //Here it checkes if the new date is consecutive with existing selection
        const sorted = [...this.selectedDates].sort();
        const first = new Date(sorted[0]);
        const last = new Date(sorted[sorted.length - 1]);
        const newDate = new Date(date);

        const oneDay = 1000 * 60 * 60 * 24;
        const isNextToFirst = (Math.abs(newDate - first) === oneDay);
        const isNextToLast = (Math.abs(newDate - last) === oneDay);

        if (isNextToFirst || isNextToLast) {
          this.selectedDates.push(date);
          return;
        }

        // if it is  not adjacent? then it does nothing
        alert("You can only select dates that are one after the other.");
      },
      async submitBooking() {
        if (this.selectedDates.length === 0) return;
        const sorted = [...this.selectedDates].sort();
        const checkIn = sorted[0];
        const checkOut = sorted[sorted.length - 1];
        const totalPrice = sorted.length * this.spot.price_per_night;
  
        const bookingData = {
          user_id: this.userId,
          spot_id: this.spotId,
          check_in_date: checkIn,
          check_out_date: checkOut,
          total_price: totalPrice,
          status_id: 1
        };
  
        try {
          const res = await fetch('http://localhost:3000/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
          });
          if (res.ok) {
            this.success = 'Booking submitted successfully!';
            this.error = '';
            this.selectedDates = [];
            await this.fetchAvailability();
          } else {
            const result = await res.json();
            this.error = result.error || 'Booking failed.';
          }
        } catch (err) {
          this.error = 'Something went wrong. Try again.';
          console.error(err);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .booking-page {
    padding: 2rem;
    max-width: 700px;
    margin: 0 auto;
    background-color: #f4f9f4;
    border-radius: 12px;
  }
  .dropdowns {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
  }
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    text-align: center;
    margin-bottom: 1rem;
  }
  .day-name {
    font-weight: bold;
  }
  .calendar-cell {
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
  }
  .empty {
    background-color: #e2e2e2;
    cursor: default;
  }
  .available {
    background-color: #3d8ef8;
    color: white;
  }
  .booked {
    background-color: #f84e4e;
    color: white;
    cursor: not-allowed;
  }
  .selected {
    background-color: #32c958;
    color: white;
  }
  .disabled {
    background-color: #dcdcdc;
    color: #999;
  }
  .legend {
    display: flex;
    justify-content: space-around;
    margin: 1rem 0;
  }
  .legend-box {
    width: 20px;
    height: 20px;
    display: inline-block;
    margin-right: 0.5rem;
    border-radius: 4px;
  }
  .available.legend-box {
    background-color: #3d8ef8;
  }
  .booked.legend-box {
    background-color: #f84e4e;
  }
  .selected.legend-box {
    background-color: #32c958;
  }
  button {
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    background-color: #3d5018;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .error {
    color: red;
  }
  .success {
    color: green;
  }
  </style>