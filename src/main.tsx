import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import emailjs from '@emailjs/browser';

emailjs.init('hl30qpIwZa3gbqWCF');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);