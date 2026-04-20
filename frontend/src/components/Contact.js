import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; // 🚀 Added Axios for Backend connection
import apiBase from '../config'; // Use the relative path to your config file

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', subject: 'Laptop Repair', message: ''
    });
    const [loading, setLoading] = useState(false); // 🚀 Added Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 🚀 Send data to the Backend API
            await axios.post(`${apiBase}/api/inquiries`, formData);

            Swal.fire({
                title: 'Message Received! 🚀',
                text: `Thanks ${formData.name}, your inquiry has been logged. We will contact you shortly.`,
                icon: 'success',
                confirmButtonColor: '#00aaff',
                confirmButtonText: 'Great!'
            });

            // Reset form on success
            setFormData({ name: '', email: '', phone: '', subject: 'Laptop Repair', message: '' });
        } catch (error) {
            console.error("Inquiry Error:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong. Please try again later.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4 py-md-5 animate__animated animate__fadeIn overflow-x-hidden">
            
            {/* --- HEADER SECTION --- */}
            <div className="text-center mb-4 mb-md-5 px-2">
                <h1 className="fw-extrabold display-4 h1-mobile-scale">Get in Touch</h1>
                <p className="text-muted fs-6 fs-md-5 opacity-75">Have a tech emergency? We're just a message away.</p>
            </div>

            <div className="row g-4 g-lg-5 justify-content-center">
                
                {/* --- QUICK CONTACT CARDS --- */}
                <div className="col-lg-4 order-2 order-lg-1">
                    <div className="d-grid gap-3 px-2 px-md-0">
                        {/* WhatsApp Card */}
                        <a href="https://wa.me/919319199300" target="_blank" rel="noreferrer" className="text-decoration-none">
                            <div className="card border-0 shadow-sm p-4 rounded-4 hover-lift bg-success text-white">
                                <div className="d-flex align-items-center gap-3 gap-lg-0 d-lg-block">
                                    <i className="bi bi-whatsapp fs-1 mb-lg-2"></i>
                                    <div>
                                        <h5 className="fw-bold mb-1">Chat on WhatsApp</h5>
                                        <p className="small mb-0 opacity-75">Instant response for repairs & sales.</p>
                                    </div>
                                </div>
                            </div>
                        </a>

                        {/* Email Card */}
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                            <div className="d-flex align-items-center gap-3 gap-lg-0 d-lg-block">
                                <i className="bi bi-envelope-at text-primary fs-1 mb-lg-2"></i>
                                <div>
                                    <h5 className="fw-bold mb-1 text-dark">Email Us</h5>
                                    <p className="text-muted small mb-0 text-break">expertcomputers.delhi@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Hours Card */}
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-light">
                            <div className="d-flex align-items-center gap-3 gap-lg-0 d-lg-block">
                                <i className="bi bi-clock text-dark fs-1 mb-lg-2"></i>
                                <div>
                                    <h5 className="fw-bold mb-1 text-dark">Business Hours</h5>
                                    <p className="text-muted small mb-0">Mon - Sat: 10 AM to 8 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- INQUIRY FORM --- */}
                <div className="col-lg-7 order-1 order-lg-2">
                    <div className="card border-0 shadow-lg p-3 p-md-5 rounded-4 rounded-md-5 bg-white mx-1 mx-md-0">
                        <div className="mb-4 text-center text-md-start">
                            <h3 className="fw-bold mb-2">Send a Message</h3>
                            <p className="small text-muted">Fill out the form below and our hardware experts will get back to you.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light border-0 py-3 rounded-3" 
                                        placeholder="John Doe"
                                        value={formData.name} 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        className="form-control bg-light border-0 py-3 rounded-3" 
                                        placeholder="9319199300"
                                        value={formData.phone} 
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control bg-light border-0 py-3 rounded-3" 
                                        placeholder="name@example.com"
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted">Subject</label>
                                    <select 
                                        className="form-select bg-light border-0 py-3 rounded-3" 
                                        value={formData.subject} 
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    >
                                        <option>Laptop Repair</option>
                                        <option>Buy New Laptop</option>
                                        <option>Parts Inquiry</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted">How can we help?</label>
                                    <textarea 
                                        className="form-control bg-light border-0 py-3 rounded-3" 
                                        rows="4" 
                                        placeholder="Describe your technical issue or requirement..."
                                        value={formData.message} 
                                        onChange={(e) => setFormData({...formData, message: e.target.value})} 
                                        required
                                    ></textarea>
                                </div>
                                <div className="col-12 mt-4">
                                    {/* 🚀 Updated Button with Loading State and Mobile Padding */}
                                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow transition-all" disabled={loading}>
                                        {loading ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>Transmitting...</>
                                        ) : (
                                            <>Send Message <i className="bi bi-send ms-2"></i></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

            {/* --- 📟 MOBILE-SPECIFIC STYLES --- */}
            <style>{`
                .h1-mobile-scale {
                    font-size: calc(2rem + 2vw);
                }
                .hover-lift {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                
                /* Responsive Font Sizes for Inputs */
                input, select, textarea {
                    font-size: 16px !important; /* Prevents iOS auto-zoom on focus */
                }

                @media (max-width: 768px) {
                    .h1-mobile-scale {
                        font-size: 2.2rem;
                    }
                    .container {
                        padding-left: 10px;
                        padding-right: 10px;
                    }
                    .display-4 {
                        font-size: 2.5rem;
                    }
                    /* Make card content align horizontally on very small mobile for contact icons */
                    .bi {
                        font-size: 2rem !important;
                    }
                }

                @media (min-width: 992px) {
                    .hover-lift:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
                    }
                }

                .overflow-x-hidden {
                    overflow-x: hidden !important;
                }
            `}</style>
        </div>
    );
};

export default Contact;