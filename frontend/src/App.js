
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import Swal from 'sweetalert2';
import apiBase from '../config'; // Make sure the path to config.js is correct

// 🚀 CONFIG & LOGO
import API_BASE_URL from './config'; // Centralized URL
import logo from './assets/LOGO.png'; 

// --- COMPONENT IMPORTS ---
import Home from './components/Home'; 
import ProductList from './components/ProductList';
import ServiceForm from './components/ServiceForm';
import AdminDashboard from './components/AdminDashboard';
import ProductDetails from './components/ProductDetails';
import UserLogin from './components/User'; 
import About from './components/About';
import Contact from './components/Contact';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Sync token state across tabs and on login/logout
  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "You will need to login again to access the Admin panel.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00aaff',
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null); 
          
          Swal.fire({
            title: 'Logged Out',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
          }).then(() => {
            // Using window.location.href forces a full refresh to clear any cached states
            window.location.href = '/'; 
          });
      }
    });
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-white">
        
        {/* --- 🌟 NAVIGATION BAR --- */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-0 border-bottom border-info border-3">
          <div className="container align-items-end"> 
            <Link className="navbar-brand py-0" to="/">
              <img 
                src={logo} 
                alt="Expert Computers" 
                style={{ height: '100px', width: 'auto', objectFit: 'contain' }} 
              />
            </Link>
            
            <button className="navbar-toggler mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse align-items-md-end justify-content-end" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center align-items-md-end gap-2 pb-md-3">
                <li className="nav-item"><Link className="nav-link px-3 fw-bold text-dark hover-blue" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link px-3 fw-bold text-dark hover-blue" to="/laptops">Laptops</Link></li>
                <li className="nav-item"><Link className="nav-link px-3 fw-bold text-dark hover-blue" to="/services">Services</Link></li>
                <li className="nav-item"><Link className="nav-link px-3 fw-bold text-dark hover-blue" to="/about">About</Link></li>
                <li className="nav-item"><Link className="nav-link px-3 fw-bold text-dark hover-blue me-2" to="/contact">Contact</Link></li>
                
                {token ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link px-3 fw-bold text-info border border-info rounded-pill shadow-sm bg-light mb-md-1" to="/admin">
                        Dashboard 🛠️
                      </Link>
                    </li>
                    <li className="nav-item">
                      <button className="btn btn-sm btn-outline-danger ms-lg-2 px-4 rounded-pill fw-bold mb-md-1" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link className="btn btn-info text-white fw-bold ms-lg-2 px-4 shadow-sm rounded-pill mb-md-1" style={{ backgroundColor: '#00aaff', border: 'none' }} to="/login">
                      Admin Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* --- MAIN ROUTING AREA --- */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/laptops" element={<ProductList apiBase={API_BASE_URL} />} />
            <Route path="/services" element={<ServiceForm apiBase={API_BASE_URL} />} />
            <Route path="/admin" element={<AdminDashboard apiBase={API_BASE_URL} />} />
            <Route path="/product/:id" element={<ProductDetails apiBase={API_BASE_URL} />} />
            <Route path="/login" element={<UserLogin apiBase={API_BASE_URL} />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* --- 🌟 FOOTER --- */}
        <footer className="bg-white text-dark py-5 mt-auto border-top border-info border-4 shadow">
          <div className="container">
            <div className="row align-items-center text-center text-md-start">
              <div className="col-md-4 mb-4 mb-md-0">
                <img src={logo} alt="Expert Computers" style={{ height: '50px', marginBottom: '15px' }} />
                <p className="text-secondary small pe-lg-5">Delhi's premium partner for high-performance computing and expert hardware solutions.</p>
              </div>
              <div className="col-md-4 mb-4 mb-md-0 text-center">
                <h6 className="fw-bold mb-3 text-info">Quick Navigation</h6>
                <ul className="list-unstyled d-flex flex-column gap-2">
                  <li><Link to="/about" className="text-secondary text-decoration-none small hover-blue">Our Story</Link></li>
                  <li><Link to="/contact" className="text-secondary text-decoration-none small hover-blue">Support Hub</Link></li>
                  <li><Link to="/laptops" className="text-secondary text-decoration-none small hover-blue">View Inventory</Link></li>
                </ul>
              </div>
              <div className="col-md-4 text-center text-md-end">
                <div className="p-3 rounded-4 bg-light shadow-sm">
                  <p className="mb-1 fw-bold text-dark">BCSP-064 Final Project</p>
                  <p className="small text-secondary mb-0">Developed by <span className="text-info fw-bold">Krishna</span> | © 2026</p>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;