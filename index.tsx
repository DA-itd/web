import React from 'react';
// FIX: Import `createRoot` from `react-dom/client` instead of relying on a non-existent global `ReactDOM`.
import { createRoot } from 'react-dom/client'; 
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// FIX: Use the imported `createRoot` function to render the application.
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);