import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import apiBase from '../config'; // Use the relative path to your config file

const ServiceForm = () => {
    const [formData, setFormData] = useState({ device: '', issue: '', contact: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${apiBase}/api/services`, formData);
            
            Swal.fire({
                title: 'Request Received!',
                text: 'Our expert technician will call you shortly.',
                icon: 'success',
                confirmButtonColor: '#00aaff',
                timer: 3000
            });

            setFormData({ device: '', issue: '', contact: '' });
        } catch (err) { 
            Swal.fire('Error', 'Unable to submit request. Please check your connection.', 'error'); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4 py-md-5 animate__animated animate__fadeIn overflow-x-hidden">
            <div className="row g-4 g-lg-5 align-items-center">
                
                {/* --- LEFT SIDE: BRAND PROMISE (Center on Mobile, Left on Desktop) --- */}
                <div className="col-lg-6 text-center text-lg-start order-2 order-lg-1 mt-5 mt-lg-0">
                    <span className="badge px-3 py-2 rounded-pill mb-3" style={{ backgroundColor: '#e0f4ff', color: '#00aaff', fontSize: '0.75rem' }}>
                        CERTIFIED REPAIR HUB
                    </span>
                    <h1 className="fw-bold mb-3 h1-mobile-scale">Professional <span style={{ color: '#00aaff' }}>Hardware</span> Solutions</h1>
                    <p className="lead text-secondary mb-4 mb-md-5 fs-6 fs-md-5 px-2 px-lg-0">
                        Whether it's a broken screen, motherboard failure, or a simple upgrade, 
                        Expert Computers provides guaranteed results with genuine parts.
                    </p>

                    <div className="row g-3 text-start px-2 px-md-0">
                        <div className="col-6">
                            <h6 className="fw-bold mb-1"><i className="bi bi-clock-history text-primary me-2"></i>Quick Service</h6>
                            <p className="extra-small text-muted mb-0">Most repairs finished in 24-48 hours.</p>
                        </div>
                        <div className="col-6">
                            <h6 className="fw-bold mb-1"><i className="bi bi-shield-check text-primary me-2"></i>90-Day Warranty</h6>
                            <p className="extra-small text-muted mb-0">Guaranteed peace of mind on services.</p>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE: THE FORM CARD (Priority on Mobile) --- */}
                <div className="col-lg-6 order-1 order-lg-2">
                    <div className="card border-0 shadow-lg rounded-4 rounded-md-5 p-4 bg-white border-top border-info border-5 mx-1 mx-md-0">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold h4">Book a Repair</h2>
                            <p className="text-muted small">Enter details for an instant estimate</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Device Model</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-laptop text-info"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light border-0 py-3 rounded-end-3 custom-input" 
                                        placeholder="e.g. Dell G15, MacBook" 
                                        value={formData.device} 
                                        onChange={e => setFormData({...formData, device: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Describe the Issue</label>
                                <textarea 
                                    className="form-control bg-light border-0 py-3 rounded-3 custom-input" 
                                    rows="3" 
                                    placeholder="e.g. Blue screen, liquid damage..." 
                                    value={formData.issue} 
                                    onChange={e => setFormData({...formData, issue: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">Contact Number</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-telephone text-info"></i></span>
                                    <input 
                                        type="tel" 
                                        className="form-control bg-light border-0 py-3 rounded-end-3 custom-input" 
                                        placeholder="Mobile number" 
                                        value={formData.contact} 
                                        onChange={e => setFormData({...formData, contact: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>

                            <button 
                                className="btn w-100 py-3 rounded-pill fw-bold text-white shadow-sm transition-all" 
                                style={{ backgroundColor: '#00aaff', border: 'none' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Connecting...</>
                                ) : (
                                    'Schedule Technical Visit'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* --- 📟 MOBILE-SPECIFIC STYLES --- */}
            <style>{`
                .h1-mobile-scale {
                    font-size: calc(1.8rem + 1.5vw);
                    line-height: 1.2;
                }
                .custom-input {
                    font-size: 16px !important; /* Vital: Stops iOS auto-zoom */
                }
                .extra-small {
                    font-size: 0.75rem;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                .transition-all:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                }

                @media (max-width: 768px) {
                    .h1-mobile-scale {
                        font-size: 1.9rem;
                    }
                    .container {
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                    .card {
                        padding: 1.5rem !important;
                    }
                }

                .overflow-x-hidden {
                    overflow-x: hidden !important;
                }
            `}</style>
        </div>
    );
};

export default ServiceForm;