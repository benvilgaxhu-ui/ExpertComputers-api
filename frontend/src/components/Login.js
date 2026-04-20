import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import apiBase from '../config'; // Use the relative path to your config file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${apiBase}/api/auth/login`, { email, password });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            Swal.fire({
                icon: 'success',
                title: 'Access Granted',
                text: `Welcome back, ${res.data.user.name}`,
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                if (res.data.user.role === 'Admin') navigate('/admin');
                else navigate('/laptops');
                // Force a reload to update the Navbar token state
                window.location.reload();
            });

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.response?.data?.message || "Invalid credentials. Please try again.",
                confirmButtonColor: '#00aaff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-5">
            <div className="row justify-content-center w-100">
                {/* 🚀 RESPONSIVE WIDTH: 11 columns on mobile, 5 on desktop */}
                <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-white">
                        
                        {/* Header Decoration */}
                        <div className="bg-primary p-2"></div>

                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-dark mb-1">Staff Portal</h2>
                                <p className="text-muted small">Enter your credentials to access the hub</p>
                            </div>

                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="fw-bold small mb-1 text-secondary">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control bg-light border-0 py-3 px-3 rounded-3 custom-input" 
                                        placeholder="admin@expertcomputers.com"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="fw-bold small mb-1 text-secondary">Secure Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control bg-light border-0 py-3 px-3 rounded-3 custom-input" 
                                        placeholder="••••••••"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                </div>

                                <button 
                                    className="btn btn-primary w-100 fw-bold py-3 rounded-pill shadow-sm transition-all"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Verifying...</>
                                    ) : (
                                        'SIGN IN'
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-4">
                                <Link to="/" className="text-decoration-none small text-primary fw-bold">
                                    ← Back to Website
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-center mt-4 text-muted extra-small">
                        Expert Computers Security Protocol v2.0
                    </p>
                </div>
            </div>

            {/* --- 📟 MOBILE-SPECIFIC STYLES --- */}
            <style>{`
                .custom-input {
                    font-size: 16px !important; /* Crucial: Prevents iOS auto-zoom on focus */
                }
                .custom-input:focus {
                    background-color: #fff !important;
                    box-shadow: 0 0 0 0.25rem rgba(0, 170, 255, 0.1);
                    border: 1px solid #00aaff !important;
                }
                .extra-small {
                    font-size: 10px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                .btn-primary {
                    background-color: #00aaff;
                    border: none;
                }
                .btn-primary:hover {
                    background-color: #0088cc;
                    transform: translateY(-2px);
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default Login;