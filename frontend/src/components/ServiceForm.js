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
                text: 'Our expert technician will call you within 30 minutes.',
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
        <div className="container py-5">
            <div className="row g-5 align-items-center">
                
                {/* --- LEFT SIDE: BRAND PROMISE --- */}
                <div className="col-lg-6">
                    <span className="badge px-3 py-2 rounded-pill mb-3" style={{ backgroundColor: '#e0f4ff', color: '#00aaff' }}>
                        CERTIFIED REPAIR HUB
                    </span>
                    <h1 className="display-4 fw-bold mb-4">Professional <span style={{ color: '#00aaff' }}>Hardware</span> Solutions</h1>
                    <p className="lead text-secondary mb-5">
                        Whether it's a broken screen, motherboard failure, or a simple upgrade, 
                        Expert Computers provides guaranteed results with genuine parts.
                    </p>

                    <div className="row g-4">
                        <div className="col-6">
                            <h5 className="fw-bold"><i className="bi bi-clock-history text-primary me-2"></i>Quick Turnaround</h5>
                            <p className="small text-muted">Most repairs are completed within 24-48 hours.</p>
                        </div>
                        <div className="col-6">
                            <h5 className="fw-bold"><i className="bi bi-shield-check text-primary me-2"></i>90-Day Warranty</h5>
                            <p className="small text-muted">Peace of mind on every chip-level repair service.</p>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE: THE FORM CARD --- */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-lg rounded-5 p-4 p-md-5 bg-white border-top border-info border-5">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Book a Repair</h2>
                            <p className="text-muted small">Enter details below for an instant estimate.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold">Laptop / Device Model</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-laptop text-info"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light border-0 py-2" 
                                        placeholder="e.g. Dell G15, MacBook Air" 
                                        value={formData.device} 
                                        onChange={e => setFormData({...formData, device: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold">Describe the Issue</label>
                                <textarea 
                                    className="form-control bg-light border-0 py-2" 
                                    rows="3" 
                                    placeholder="e.g. Blue screen, liquid damage, keyboard not working" 
                                    value={formData.issue} 
                                    onChange={e => setFormData({...formData, issue: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold">Contact Number</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-telephone text-info"></i></span>
                                    <input 
                                        type="tel" 
                                        className="form-control bg-light border-0 py-2" 
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
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                                ) : (
                                    'Schedule Technical Visit'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceForm;