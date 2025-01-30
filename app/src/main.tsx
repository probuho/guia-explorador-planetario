import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container); // Create a root.
root.render(<React.StrictMode>
  <App />
</React.StrictMode>); // Render the app inside of it.

