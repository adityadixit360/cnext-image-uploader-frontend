import axios from 'axios';

const apiClient1 = axios.create({
  baseURL: 'http://127.0.0.1:8000/list-files/', 
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient1;
