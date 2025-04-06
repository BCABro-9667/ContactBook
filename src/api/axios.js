import axios from 'axios';

const api = axios.create({
  baseURL: 'https://contactbook-backend-i42d.onrender.com/api', // Your backend base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;