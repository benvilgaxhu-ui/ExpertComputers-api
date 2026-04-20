import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import apiBase from '../config'; 

const GamingCarousel = () => {
    const [gamingLaptops, setGamingLaptops] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        axios.get(`${apiBase}/api/products`)
            .then(res => {
                const gaming = res.data.filter(lp => lp.category === 'Gaming');
                setGamingLaptops(gaming);
            })
            .catch(err => console.error(err));
    }, []);

    const handleManualChange = (index) => {
        if (index === currentIndex) return;
        setFade(false);
        setTimeout(() => {
            setCurrentIndex(index);
            setFade(true);
        }, 400);
    };

    useEffect(() => {
        if (gamingLaptops.length > 0) {
            const interval = setInterval(() => {
                setFade(false);
                setTimeout(() => {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % gamingLaptops.length);
                    setFade(true);
                }, 600); 
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [gamingLaptops]);

    if (gamingLaptops.length === 0) return null;

    const current = gamingLaptops[currentIndex];
    const imgPath = current.images?.[0]?.startsWith('http') 
        ? current.images[0] 
        : `${apiBase}${current.images?.[0]}`;

    return (
        <div className="container my-4 my-md-5 px-2 px-md-0">
            {/* 🚀 RESPONSIVE SPLIT-BLOCK CARD: Dark side and White side */}
            <div className="card border-0 shadow-lg overflow-hidden rounded-4 rounded-md-5 bg-dark text-white carousel-main-card">
                <div className="row g-0 h-100">
                    
                    {/* --- LEFT BLOCK: THE SPECS (Dark Side) --- */}
                    {/* Order-2 on mobile (bottom), Order-1 on desktop (left) */}
                    <div className="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center order-2 order-md-1 bg-dark">
                        <div className={`${fade ? 'animate__fadeInUp' : 'animate__fadeOutDown'} animate__animated`}>
                            <span className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold small">
                                <i className="bi bi-fire me-2"></i>FEATURED GAMING RIG
                            </span>
                            
                            <h1 className="fw-black mb-2 mb-md-3 carousel-title">
                                {current.name}
                            </h1>
                            
                            <p className="carousel-subtitle text-info mb-4 opacity-75">
                                High-FPS Hardware • Stress Tested • Expert Certified 
                            </p>
                            
                            <div className="d-flex align-items-center gap-3 gap-md-4 mb-4">
                                <div>
                                    <p className="x-small text-uppercase mb-0 opacity-50">Best Price</p>
                                    <h2 className="text-warning fw-bold mb-0">₹{current.price.toLocaleString('en-IN')}</h2>
                                </div>
                                <div className="vr bg-white opacity-25" style={{ height: '40px' }}></div>
                                <div>
                                    <p className="x-small text-uppercase mb-0 opacity-50">Warranty</p>
                                    <h4 className="fw-bold mb-0 small-on-mobile">1 Year</h4>
                                </div>
                            </div>

                            <div className="d-grid d-md-flex gap-2 gap-md-3 mt-md-auto">
                                <Link to={`/product/${current._id}`} className="btn btn-primary btn-lg px-md-5 rounded-pill fw-bold shadow py-3">
                                    Grab This Deal
                                </Link>
                                <a href={`https://wa.me/919319199300?text=I am interested in ${current.name}`} target="_blank" rel="noreferrer" className="btn btn-outline-light btn-lg px-md-4 rounded-pill py-3">
                                    <i className="bi bi-whatsapp me-2"></i> WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT BLOCK: THE IMAGE (White Side) --- */}
                    {/* Order-1 on mobile (top), Order-2 on desktop (right) */}
                    <div className="col-md-6 order-1 order-md-2 p-0 bg-white d-flex align-items-center justify-content-center overflow-hidden">
                        {/* 🚀 Image occupies the block perfectly without being cut */}
                        <img 
                            key={current._id} 
                            src={imgPath} 
                            alt={current.name} 
                            className={`carousel-img-adjusted animate__animated ${fade ? 'animate__zoomIn' : 'animate__zoomOut'}`}
                        />
                    </div>

                </div>
            </div>
            
            {/* --- INDICATORS --- */}
            <div className="d-flex justify-content-center gap-2 mt-4">
                {gamingLaptops.map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleManualChange(i)}
                        className={`border-0 rounded-pill transition-all ${currentIndex === i ? 'bg-primary' : 'bg-secondary opacity-25'}`}
                        style={{ 
                            width: currentIndex === i ? '35px' : '10px', 
                            height: '10px',
                            cursor: 'pointer'
                        }}
                    ></button>
                ))}
            </div>

            {/* --- 📟 UPDATED MOBILE & IMAGE ADJUSTMENT CSS --- */}
            <style>{`
                .carousel-main-card {
                    min-height: 500px;
                }
                
                .carousel-img-adjusted {
                    width: 100%;
                    height: 100%;
                    /* 🚀 KEY FIX: 'contain' ensures the image is never cut, 'padding' makes it look shorter/centered */
                    object-fit: contain; 
                    padding: 40px;
                    transition: all 0.5s ease;
                }

                .carousel-title {
                    font-size: calc(1.5rem + 1.5vw);
                    line-height: 1.1;
                }

                .carousel-subtitle {
                    font-size: 1.1rem;
                }

                .x-small {
                    font-size: 10px;
                    letter-spacing: 1px;
                }

                @media (max-width: 767px) {
                    .carousel-main-card {
                        min-height: auto;
                    }
                    .carousel-img-adjusted {
                        height: 250px; /* Fixed height for mobile to keep the block "short" */
                        padding: 20px; /* Reduced padding for smaller screens */
                        background-color: #ffffff;
                    }
                    .carousel-title {
                        font-size: 1.6rem;
                    }
                    .carousel-subtitle {
                        font-size: 0.9rem;
                    }
                    .small-on-mobile {
                        font-size: 1rem;
                    }
                }

                .fw-black {
                    font-weight: 900;
                }
                
                .transition-all {
                    transition: all 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default GamingCarousel;