<template>
  <div class="admin-users">
    <h1>Manage Users</h1>

    <!-- Create New User Form -->
    <form @submit.prevent="createUser" class="create-form">
      <input v-model="newUser.email" type="email" placeholder="Email" required />
      <input v-model="newUser.password" type="password" placeholder="Password" required />
      <input v-model="newUser.first_name" type="text" placeholder="First Name" />
      <input v-model="newUser.last_name" type="text" placeholder="Last Name" />
      <input v-model="newUser.phone_number" type="text" placeholder="Phone Number" />
      <button type="submit">Create User</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.user_id">
            <td><input v-model="user.email" /></td>
            <td>
            <input v-model="user.first_name" placeholder="First" />
            <input v-model="user.last_name" placeholder="Last" />
            </td>
            <td><input v-model="user.phone_number" /></td>
            <td>
            <button @click="updateUser(user)">Update</button>
            <button @click="deleteUser(user.user_id)">Delete</button>
            </td>
        </tr>
        </tbody>

    </table>
  </div>
</template>

<script>
export default {
  name: 'AdminUsers',
  data() {
    return {
      users: [],
      newUser: {
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: ''
      }
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      const res = await fetch('http://localhost:3000/users');
      this.users = await res.json();
    },
    async deleteUser(id) {
      if (!confirm('Are you sure you want to delete this user?')) return;

      const res = await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('✅ User deleted successfully.');
        this.fetchUsers();
      } else {
        alert('❌ Failed to delete user.');
      }
    },
    async updateUser(user) {
      const res = await fetch(`http://localhost:3000/users/${user.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          image_url: user.image_url,
          //is_admin: user.is_admin
        })
      });

      if (res.ok) {
        alert('✅ User updated successfully.');
        this.fetchUsers();
      } else {
        alert('❌ Failed to update user.');
      }
    },
    async createUser() {
      const res = await fetch(`http://localhost:3000/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newUser)
      });

      if (res.ok) {
        alert('✅ User created successfully.');
        this.newUser = {
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          phone_number: ''
        };
        this.fetchUsers();
      } else {
        alert('❌ Failed to create user.');
      }
    }
  }
};
</script>


<style scoped>
.admin-users {
  padding: 2rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: center;
}
.create-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}
.create-form input {
  padding: 0.5rem;
}
</style>
