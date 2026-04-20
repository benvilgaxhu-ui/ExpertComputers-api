import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import Swal from 'sweetalert2';

// 🚀 CONFIG & LOGO
import API_BASE_URL from './config'; 
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

// --- 📱 MOBILE UTILITY: SCROLL TO TOP ON NAVIGATE ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const checkToken = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "Access to Admin panel will be restricted.",
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
          window.location.href = '/'; 
      }
    });
  };

  return (
    <Router>
      <ScrollToTop /> {/* Ensures page starts at top on mobile */}
      
      <div className="d-flex flex-column min-vh-100 bg-white overflow-x-hidden">
        
        {/* --- 🌟 RESPONSIVE NAVIGATION BAR --- */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm border-bottom border-info border-3 py-1">
          <div className="container"> 
            <Link className="navbar-brand py-0" to="/">
              <img 
                src={logo} 
                className="app-logo"
                alt="Expert Computers" 
              />
            </Link>
            
            {/* Mobile Toggler - Modern Grid Icon */}
            <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center gap-1 py-3 py-lg-0">
                <li className="nav-item w-100 text-center"><Link className="nav-link px-3 fw-bold text-dark" to="/">Home</Link></li>
                <li className="nav-item w-100 text-center"><Link className="nav-link px-3 fw-bold text-dark" to="/laptops">Laptops</Link></li>
                <li className="nav-item w-100 text-center"><Link className="nav-link px-3 fw-bold text-dark" to="/services">Services</Link></li>
                <li className="nav-item w-100 text-center"><Link className="nav-link px-3 fw-bold text-dark" to="/about">About</Link></li>
                <li className="nav-item w-100 text-center"><Link className="nav-link px-3 fw-bold text-dark" to="/contact">Contact</Link></li>
                
                <hr className="d-lg-none w-75 opacity-10 mx-auto" />

                {token ? (
                  <div className="d-flex flex-column flex-lg-row gap-2 w-100 align-items-center">
                    <li className="nav-item w-100">
                      <Link className="nav-link px-4 fw-bold text-info border border-info rounded-pill text-center bg-light" to="/admin">
                        Dashboard ⚙️
                      </Link>
                    </li>
                    <li className="nav-item w-100">
                      <button className="btn btn-outline-danger w-100 rounded-pill fw-bold" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </div>
                ) : (
                  <li className="nav-item w-100 text-center">
                    <Link className="btn btn-info text-white fw-bold px-4 shadow-sm rounded-pill w-100" style={{ backgroundColor: '#00aaff', border: 'none' }} to="/login">
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

        {/* --- 🌟 MOBILE OPTIMIZED FOOTER --- */}
        <footer className="bg-white text-dark py-5 mt-auto border-top border-info border-4 shadow">
          <div className="container">
            <div className="row g-4 text-center text-md-start">
              <div className="col-12 col-md-4">
                <img src={logo} alt="Expert Computers" style={{ height: '40px', marginBottom: '15px' }} />
                <p className="text-secondary small">Delhi's premium firm for high-performance computing and second-hand laptop sales.</p>
              </div>
              
              <div className="col-6 col-md-4">
                <h6 className="fw-bold mb-3 text-info">Explore</h6>
                <ul className="list-unstyled d-flex flex-column gap-2 small">
                  <li><Link to="/laptops" className="text-secondary text-decoration-none">Store Inventory</Link></li>
                  <li><Link to="/services" className="text-secondary text-decoration-none">Repair Center</Link></li>
                  <li><Link to="/contact" className="text-secondary text-decoration-none">Get Quote</Link></li>
                </ul>
              </div>

              <div className="col-6 col-md-4">
                <h6 className="fw-bold mb-3 text-info">Company</h6>
                <ul className="list-unstyled d-flex flex-column gap-2 small">
                  <li><Link to="/about" className="text-secondary text-decoration-none">Our Story</Link></li>
                  <li><Link to="/login" className="text-secondary text-decoration-none">Staff Login</Link></li>
                </ul>
              </div>

              <div className="col-12 mt-5">
                <div className="p-3 rounded-4 bg-light text-center">
                  <p className="mb-0 small text-secondary">
                    <b>Project BCSP-064</b> | Developed by <span className="text-info fw-bold">Krishna</span>
                    <br/>© 2026 Expert Computers Delhi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* --- 📟 MOBILE-SPECIFIC INLINE CSS --- */}
        <style>{`
          .app-logo { 
            height: 80px; 
            width: auto; 
            object-fit: contain; 
            transition: height 0.3s ease;
          }
          
          @media (max-width: 768px) {
            .app-logo { height: 60px; }
            .navbar-nav .nav-link { 
              padding: 12px; 
              font-size: 1.1rem;
              border-radius: 8px;
            }
            .navbar-nav .nav-link:active {
              background-color: #f0faff;
            }
            .container { padding-left: 20px; padding-right: 20px; }
          }

          .hover-blue:hover { color: #00aaff !important; }
          .overflow-x-hidden { overflow-x: hidden !important; }
        `}</style>

      </div>
    </Router>
  );
}

export default App;