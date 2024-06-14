<template>
    <div class="register">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" required>
        </div>
        <div>
          <label for="password">Senha:</label>
          <input type="password" v-model="password" id="password" required>
        </div>
        <button @click="register()">Register</button>
      </form>
    </div>
  </template>
  
  <script> 
import { auth } from '@/firebase/firebaseAuth'
import { createUserWithEmailAndPassword } from 'firebase/auth';


  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async register() {
            
                await createUserWithEmailAndPassword(auth, this.email, this.password);
                alert('Usuário registrado com sucesso!');
                this.$router.push('/#');
        },
  }
  };
  </script>
  
  <style scoped>
  .register {
    max-width: 300px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  label {
    display: block;
    margin-bottom: 8px;
  }
  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    width: 100%;
    padding: 10px;
    background-color: #f76e05;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #f76e05;
  }
  </style>
  
