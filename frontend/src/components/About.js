import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="container py-4 py-md-5 animate__animated animate__fadeIn overflow-x-hidden">
            
            {/* --- HERITAGE SECTION --- */}
            <div className="row align-items-center mb-5 g-4 g-lg-5">
                <div className="col-lg-6 text-center text-lg-start">
                    <h6 className="text-primary fw-bold text-uppercase tracking-wider small">Our Heritage</h6>
                    <h1 className="fw-extrabold mb-4 h1-mobile-scale">Two Decades of Technical Excellence</h1>
                    <p className="lead text-secondary mb-4 fs-6 fs-md-5">
                        Founded in the <strong>early 2000s</strong>, Expert Computers began as a small hardware 
                        workshop in Delhi during the dawn of the personal computing era.
                    </p>
                    <p className="text-muted mb-4 small fs-md-6">
                        Over the last 20+ years, we have evolved alongside technology. What started as 
                        basic PC assembly has grown into Delhi's premier hub for <strong>chip-level 
                        motherboard diagnostics</strong> and high-end gaming hardware sales.
                    </p>
                    <div className="d-grid d-md-flex gap-3 px-4 px-md-0">
                        <Link to="/laptops" className="btn btn-primary px-4 py-3 rounded-pill fw-bold shadow-sm">
                            Browse Catalogue
                        </Link>
                        <Link to="/contact" className="btn btn-outline-dark px-4 py-3 rounded-pill fw-bold">
                            Speak to an Expert
                        </Link>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="position-relative px-2 px-md-0">
                        <img 
                            src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000&auto=format&fit=crop" 
                            alt="Expert Computers Workshop" 
                            className="img-fluid rounded-4 shadow-lg animate__animated animate__zoomIn"
                        />
                        {/* Established Badge - Scaled for Mobile */}
                        <div className="position-absolute bottom-0 start-0 bg-dark text-white p-3 p-md-4 rounded-4 m-2 m-md-3 shadow animate__animated animate__fadeInUp border-start border-primary border-4">
                            <h5 className="fw-bold mb-0">ESTD. 2000s</h5>
                            <p className="x-small mb-0 text-info">Delhi's Trusted Hub</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PILLARS OF TRUST --- */}
            <div className="row g-3 g-md-4 mb-5 px-2">
                {[
                    { icon: 'bi-clock-history', title: '20+ Years Experience', desc: 'Deep technical knowledge passed down through the evolution of laptop architecture.' },
                    { icon: 'bi-tools', title: 'Precision Repair', desc: 'Specialized in micro-soldering and complex circuit repairs that others find impossible.' },
                    { icon: 'bi-award', title: 'Genuine Inventory', desc: 'A long-standing network of suppliers ensuring 100% authentic parts and systems.' }
                ].map((item, i) => (
                    <div className="col-md-4" key={i}>
                        <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift border-bottom border-primary border-3 bg-white">
                            <div className="mb-2 mb-md-3">
                                <i className={`bi ${item.icon} fs-1 text-primary`}></i>
                            </div>
                            <h5 className="fw-bold">{item.title}</h5>
                            <p className="text-muted small mb-0">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- THE DELHI LEGACY --- */}
            <div className="px-2">
                <div className="bg-dark text-white rounded-4 rounded-md-5 p-4 p-md-5 shadow-lg position-relative overflow-hidden">
                    {/* Decorative Background Element - Hidden on very small mobile to save space */}
                    <div className="position-absolute top-0 end-0 p-5 opacity-10 d-none d-sm-block">
                        <i className="bi bi-cpu display-1"></i>
                    </div>
                    
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8 position-relative">
                            <h2 className="fw-bold mb-3 mb-md-4 h2-mobile-scale">The Expert Computers Legacy</h2>
                            <p className="fs-6 fs-md-5 text-light-50 mb-3 mb-md-4 lh-lg">
                                "From the era of heavy desktops to today's ultra-thin gaming powerhouses, 
                                our commitment to the Delhi tech community hasn't changed: 
                                Fast repairs, honest pricing, and expert advice."
                            </p>
                            <hr className="w-25 mx-auto my-3 my-md-4 border-info border-2" />
                            <h6 className="fw-bold text-info mb-0 text-uppercase tracking-widest small">Reliability Since the 2000s</h6>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 📟 MOBILE-SPECIFIC STYLES --- */}
            <style>{`
                .h1-mobile-scale {
                    font-size: calc(1.8rem + 1.5vw);
                    line-height: 1.2;
                }
                .h2-mobile-scale {
                    font-size: calc(1.4rem + 1vw);
                }
                .x-small {
                    font-size: 0.75rem;
                }
                .hover-lift {
                    transition: transform 0.3s ease;
                }
                @media (max-width: 768px) {
                    .h1-mobile-scale { font-size: 1.85rem; }
                    .h2-mobile-scale { font-size: 1.4rem; }
                    .container { padding-left: 15px; padding-right: 15px; }
                }
                @media (min-width: 992px) {
                    .hover-lift:hover {
                        transform: translateY(-8px);
                    }
                }
                .overflow-x-hidden {
                    overflow-x: hidden !important;
                }
            `}</style>
        </div>
    );
};

export default About;