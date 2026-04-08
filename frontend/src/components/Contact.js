import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; // 🚀 Added Axios for Backend connection

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
            await axios.post('${apiBase}/api/inquiries', formData);

            Swal.fire({
                title: 'Message Received! 🚀',
                text: `Thanks ${formData.name}, your inquiry has been logged. We will contact you shortly.`,
                icon: 'success',
                confirmButtonColor: '#0d6efd',
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
        <div className="container py-5 animate__animated animate__fadeIn">
            <div className="text-center mb-5">
                <h1 className="fw-extrabold display-4">Get in Touch</h1>
                <p className="text-muted fs-5">Have a tech emergency? We're just a message away.</p>
            </div>

            <div className="row g-5 justify-content-center">
                
                {/* --- QUICK CONTACT CARDS --- */}
                <div className="col-lg-4">
                    <div className="d-grid gap-3">
                        <a href="https://wa.me/919319199300" target="_blank" rel="noreferrer" className="text-decoration-none">
                            <div className="card border-0 shadow-sm p-4 rounded-4 hover-lift bg-success text-white">
                                <i className="bi bi-whatsapp fs-1 mb-2"></i>
                                <h5 className="fw-bold">Chat on WhatsApp</h5>
                                <p className="small mb-0 opacity-75">Instant response for repairs & sales.</p>
                            </div>
                        </a>

                        <div className="card border-0 shadow-sm p-4 rounded-4">
                            <i className="bi bi-envelope-at text-primary fs-1 mb-2"></i>
                            <h5 className="fw-bold">Email Us</h5>
                            <p className="text-muted small mb-0">expertcomputers.delhi@gmail.com</p>
                        </div>

                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-light">
                            <i className="bi bi-clock text-dark fs-1 mb-2"></i>
                            <h5 className="fw-bold">Business Hours</h5>
                            <p className="text-muted small mb-0">Mon - Sat: 10 AM to 8 PM</p>
                        </div>
                    </div>
                </div>

                {/* --- INQUIRY FORM --- */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow p-4 p-md-5 rounded-5">
                        <h3 className="fw-bold mb-4">Send a Message</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Full Name</label>
                                    <input type="text" className="form-control bg-light border-0 py-2" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Phone Number</label>
                                    <input type="tel" className="form-control bg-light border-0 py-2" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Email Address</label>
                                    <input type="email" className="form-control bg-light border-0 py-2" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Subject</label>
                                    <select className="form-select bg-light border-0 py-2" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}>
                                        <option>Laptop Repair</option>
                                        <option>Buy New Laptop</option>
                                        <option>Parts Inquiry</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold">How can we help?</label>
                                    <textarea className="form-control bg-light border-0 py-2" rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required></textarea>
                                </div>
                                <div className="col-12 mt-4">
                                    {/* 🚀 Updated Button with Loading State */}
                                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow" disabled={loading}>
                                        {loading ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
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
        </div>
    );
};

export default Contact;