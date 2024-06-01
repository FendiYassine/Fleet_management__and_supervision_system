import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

const container = document.getElementById('root');

container.style.backgroundImage = "url('processed_images/Fleet_processed.jpg')";
const root = createRoot(container); // create a root.

root.render(
  <Router>
    <App />
  </Router>
);
