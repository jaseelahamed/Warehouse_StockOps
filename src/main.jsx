import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './service/Context.jsx';
import { ToastContainer } from 'react-toastify';
// import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <AuthProvider>
      <App />
      <ToastContainer/>
      </AuthProvider>
  </React.StrictMode>,
)
