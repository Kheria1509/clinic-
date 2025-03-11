import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
axios.defaults.baseURL = 'https://clinic-backend-o8ys.onrender.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <App />

);


