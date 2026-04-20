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
        <div className="container my-4 my-md-5">
            {/* 🚀 THE PROFESSIONAL SPLIT-BLOCK */}
            <div className="card border-0 shadow-lg overflow-hidden rounded-4 bg-dark text-white carousel-firm-card">
                <div className="row g-0 h-100">
                    
                    {/* --- INFO BLOCK (Dark Side) --- */}
                    <div className="col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-center order-2 order-md-1 bg-dark">
                        <div className={`${fade ? 'animate__fadeInUp' : 'animate__fadeOutDown'} animate__animated`}>
                            <span className="badge bg-warning text-dark mb-2 px-2 py-1 rounded-pill fw-bold" style={{fontSize: '0.65rem'}}>
                                FEATURED RIG
                            </span>
                            
                            <h2 className="fw-bold mb-2 carousel-title-compact">
                                {current.name}
                            </h2>
                            
                            <p className="text-info mb-4 opacity-75 small">
                                High-FPS Performance • Stress Tested • Expert Verified 
                            </p>
                            
                            <div className="d-flex align-items-center gap-4 mb-4">
                                <div>
                                    <p className="x-small text-uppercase mb-0 opacity-50">Expert Price</p>
                                    <h3 className="text-warning fw-bold mb-0">₹{current.price.toLocaleString('en-IN')}</h3>
                                </div>
                                <div className="vr bg-white opacity-25" style={{ height: '30px' }}></div>
                                <div>
                                    <p className="x-small text-uppercase mb-0 opacity-50">Condition</p>
                                    <p className="fw-bold mb-0 small">Refurbished</p>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <Link to={`/product/${current._id}`} className="btn btn-primary px-4 rounded-pill fw-bold shadow-sm btn-sm py-2">
                                    Grab Deal
                                </Link>
                                <a href={`https://wa.me/919319199300`} target="_blank" rel="noreferrer" className="btn btn-outline-light px-3 rounded-pill btn-sm py-2">
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* --- IMAGE BLOCK (White Side) --- */}
                    {/* 🚀 Ensure p-0 so image touches the inner boundaries */}
                    <div className="col-md-6 order-1 order-md-2 p-0 bg-white d-flex align-items-center justify-content-center overflow-hidden">
                        <img 
                            key={current._id} 
                            src={imgPath} 
                            alt={current.name} 
                            className={`carousel-img-fill animate__animated ${fade ? 'animate__zoomIn' : 'animate__zoomOut'}`}
                        />
                    </div>

                </div>
            </div>
            
            {/* INDICATORS */}
            <div className="d-flex justify-content-center gap-2 mt-3">
                {gamingLaptops.map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleManualChange(i)}
                        className={`border-0 rounded-pill transition-all ${currentIndex === i ? 'bg-primary' : 'bg-secondary opacity-25'}`}
                        style={{ width: currentIndex === i ? '25px' : '6px', height: '6px', cursor: 'pointer' }}
                    ></button>
                ))}
            </div>

            <style>{`
                .carousel-firm-card {
                    min-height: 400px; 
                    max-height: 450px; /* Slightly taller to allow a bigger photo */
                }

                .carousel-img-fill {
                    /* 🚀 KEY FIX: width and height 100% makes it touch edges */
                    width: 100%;
                    height: 100%;
                    /* 🚀 contain ensures it fits exactly inside without any parts being cut off */
                    object-fit: contain; 
                    transition: all 0.5s ease;
                }

                .carousel-title-compact {
                    font-size: 1.8rem;
                    font-weight: 800;
                    line-height: 1.2;
                    letter-spacing: -0.5px;
                }

                .x-small { font-size: 9px; letter-spacing: 1px; }

                @media (max-width: 767px) {
                    .carousel-firm-card {
                        min-height: auto;
                        max-height: none;
                    }
                    .carousel-img-fill {
                        height: 250px; /* Big and filling on mobile too */
                        width: 100%;
                    }
                    .carousel-title-compact {
                        font-size: 1.4rem;
                    }
                }

                @media (min-width: 992px) {
                    .carousel-firm-card {
                        height: 420px;
                    }
                }

                .transition-all { transition: all 0.3s ease-in-out; }
            `}</style>
        </div>
    );
};

export default GamingCarousel;