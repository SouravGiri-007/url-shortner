import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// Import CSS files correctly
import './App.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
