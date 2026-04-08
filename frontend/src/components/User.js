import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // 🚀 TARGETED FIX: Using /api/auth/login to match your backend
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // Securely store session data
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            Swal.fire({
                title: 'Access Granted!',
                text: `Welcome back, ${res.data.user.name}`,
                icon: 'success',
                timer: 1800,
                showConfirmButton: false,
                background: '#ffffff',
                customClass: {
                    title: 'fw-bold text-dark',
                    popup: 'rounded-5 shadow-lg border-0'
                }
            });

            // Re-sync the application state
            setTimeout(() => {
                if (res.data.user.role === 'Admin') {
                    window.location.href = '/admin'; // Force refresh to update Navbar state
                } else {
                    window.location.href = '/';
                }
            }, 1500);

        } catch (err) {
            const is404 = err.response?.status === 404;
            Swal.fire({
                title: is404 ? 'Configuration Error' : 'Login Failed',
                text: is404 ? "The server endpoint (/api/auth/login) was not found." : "Invalid email or password.",
                icon: 'error',
                confirmButtonColor: '#00aaff',
                customClass: { popup: 'rounded-4' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-white">
            <div className="row w-100 justify-content-center">
                <div className="col-md-5 col-lg-4 animate__animated animate__fadeIn">
                    
                    {/* --- 🌟 THE SECURE PORTAL CARD --- */}
                    <div className="card border-0 shadow-lg rounded-5 p-4 p-md-5">
                        
                        <div className="text-center mb-5">
                            <div className="bg-light d-inline-block p-3 rounded-circle mb-3" style={{ border: '2px solid #e0f4ff' }}>
                                <i className="bi bi-shield-lock-fill text-info" style={{ fontSize: '2.5rem' }}></i>
                            </div>
                            <h2 className="fw-bold text-dark mb-1">Expert <span style={{ color: '#00aaff' }}>Portal</span></h2>
                            <p className="text-muted small">Authorized Admin & Staff Entry</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            {/* Email Input */}
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0">
                                        <i className="bi bi-envelope text-muted"></i>
                                    </span>
                                    <input 
                                        type="email" 
                                        className="form-control bg-light border-0 py-2 shadow-none" 
                                        placeholder="admin@expertcomputers.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0">
                                        <i className="bi bi-key text-muted"></i>
                                    </span>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className="form-control bg-light border-0 py-2 shadow-none" 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                    {/* Eye Toggle */}
                                    <button 
                                        className="btn bg-light border-0 text-muted" 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Sign In Button */}
                            <button 
                                type="submit" 
                                className="btn w-100 py-3 rounded-pill fw-bold text-white shadow-sm transition-all" 
                                style={{ backgroundColor: '#00aaff', border: 'none' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Authenticating...</>
                                ) : (
                                    'Secure Sign In'
                                )}
                            </button>

                            <div className="text-center mt-4">
                                <button type="button" className="btn btn-link text-decoration-none text-muted small" onClick={() => Swal.fire('Access Notice', 'Please contact Krishna (System Admin) for credential recovery.', 'info')}>
                                    Forgot credentials?
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="text-center mt-4 opacity-50">
                        <small className="text-secondary">© 2026 Expert Computers • Project BCSP-064</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;