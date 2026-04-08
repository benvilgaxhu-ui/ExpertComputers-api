import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="container py-5 animate__animated animate__fadeIn">
            
            {/* --- HERITAGE SECTION --- */}
            <div className="row align-items-center mb-5 g-5">
                <div className="col-lg-6">
                    <h6 className="text-primary fw-bold text-uppercase tracking-wider">Our Heritage</h6>
                    <h1 className="display-4 fw-extrabold mb-4">Two Decades of Technical Excellence</h1>
                    <p className="lead text-secondary mb-4">
                        Founded in the <strong>early 2000s</strong>, Expert Computers began as a small hardware 
                        workshop in Delhi during the dawn of the personal computing era.
                    </p>
                    <p className="text-muted mb-4">
                        Over the last 20+ years, we have evolved alongside technology. What started as 
                        basic PC assembly has grown into Delhi's premier hub for <strong>chip-level 
                        motherboard diagnostics</strong> and high-end gaming hardware sales.
                    </p>
                    <div className="d-flex gap-3">
                        <Link to="/laptops" className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm">
                            Browse Catalogue
                        </Link>
                        <Link to="/contact" className="btn btn-outline-dark px-4 py-2 rounded-pill fw-bold">
                            Speak to an Expert
                        </Link>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="position-relative">
                        <img 
                            src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop" 
                            alt="Expert Computers Workshop" 
                            className="img-fluid rounded-4 shadow-lg animate__animated animate__zoomIn"
                        />
                        <div className="position-absolute bottom-0 start-0 bg-dark text-white p-4 rounded-4 m-3 shadow animate__animated animate__fadeInUp border-start border-primary border-4">
                            <h4 className="fw-bold mb-0">ESTD. 2000s</h4>
                            <p className="small mb-0 text-info">Delhi's Trusted Hub</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PILLARS OF TRUST --- */}
            <div className="row g-4 mb-5">
                {[
                    { icon: 'bi-clock-history', title: '20+ Years Experience', desc: 'Deep technical knowledge passed down through the evolution of laptop architecture.' },
                    { icon: 'bi-tools', title: 'Precision Repair', desc: 'Specialized in micro-soldering and complex circuit repairs that others find impossible.' },
                    { icon: 'bi-award', title: 'Genuine Inventory', desc: 'A long-standing network of suppliers ensuring 100% authentic parts and systems.' }
                ].map((item, i) => (
                    <div className="col-md-4" key={i}>
                        <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift border-bottom border-primary border-3">
                            <div className="mb-3">
                                <i className={`bi ${item.icon} fs-1 text-primary`}></i>
                            </div>
                            <h5 className="fw-bold">{item.title}</h5>
                            <p className="text-muted small mb-0">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- THE DELHI LEGACY --- */}
            <div className="bg-dark text-white rounded-5 p-5 shadow-lg position-relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="position-absolute top-0 end-0 p-5 opacity-10">
                    <i className="bi bi-cpu display-1"></i>
                </div>
                
                <div className="row justify-content-center text-center">
                    <div className="col-lg-8 position-relative">
                        <h2 className="fw-bold mb-4">The Expert computers Legacy</h2>
                        <p className="fs-5 text-light-50 mb-4">
                            "From the era of heavy desktops to today's ultra-thin gaming powerhouses, 
                            our commitment to the Delhi tech community hasn't changed: 
                            Fast repairs, honest pricing, and expert advice."
                        </p>
                        <hr className="w-25 mx-auto my-4 border-info border-2" />
                        <h6 className="fw-bold text-info mb-0 text-uppercase tracking-widest">Reliability Since the 2000s</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;