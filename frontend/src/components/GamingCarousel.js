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
            <div className="card border-0 shadow-lg overflow-hidden rounded-4 rounded-md-5 bg-dark text-white carousel-wrapper-card">
                <div className="row g-0 h-100">
                    
                    {/* --- INFO BLOCK (Dark Side) --- */}
                    <div className="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center order-2 order-md-1">
                        <div className={`${fade ? 'animate__fadeInUp' : 'animate__fadeOutDown'} animate__animated`}>
                            <span className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold" style={{fontSize: '0.7rem'}}>
                                <i className="bi bi-fire me-2"></i>FEATURED RIG
                            </span>
                            
                            <h2 className="fw-black mb-3 laptop-title">
                                {current.name}
                            </h2>
                            
                            <p className="text-info mb-4 opacity-75 small">
                                High-FPS Performance • Expert Verified 
                            </p>
                            
                            <div className="d-flex align-items-center gap-4 mb-4">
                                <div>
                                    <p className="x-small text-uppercase mb-0 opacity-50">Expert Price</p>
                                    <h3 className="text-warning fw-bold mb-0">₹{current.price.toLocaleString('en-IN')}</h3>
                                </div>
                                <div className="vr bg-white opacity-25" style={{ height: '35px' }}></div>
                                <div>
                                    <p className="x-small text-uppercase mb-0 opacity-50">Condition</p>
                                    <p className="fw-bold mb-0">Certified Refurbished</p>
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                <Link to={`/product/${current._id}`} className="btn btn-primary px-4 rounded-pill fw-bold shadow">
                                    Grab Deal
                                </Link>
                                <a href={`https://wa.me/919319199300`} target="_blank" rel="noreferrer" className="btn btn-outline-light px-4 rounded-pill">
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* --- IMAGE BLOCK (White Side) --- */}
                    <div className="col-md-6 order-1 order-md-2 bg-white d-flex align-items-center justify-content-center p-4 p-md-5">
                        <img 
                            key={current._id} 
                            src={imgPath} 
                            alt={current.name} 
                            className={`carousel-img-logic animate__animated ${fade ? 'animate__zoomIn' : 'animate__zoomOut'}`}
                        />
                    </div>

                </div>
            </div>
            
            {/* INDICATORS */}
            <div className="d-flex justify-content-center gap-2 mt-4">
                {gamingLaptops.map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleManualChange(i)}
                        className={`border-0 rounded-pill transition-all ${currentIndex === i ? 'bg-primary' : 'bg-secondary opacity-25'}`}
                        style={{ width: currentIndex === i ? '30px' : '8px', height: '8px', cursor: 'pointer' }}
                    ></button>
                ))}
            </div>

            <style>{`
                /* 🚀 LAPTOP FIX: Reduced total height and tighter alignment */
                .carousel-wrapper-card {
                    min-height: 400px; /* Reduced from 500px to look sharper */
                    max-height: 450px;
                }

                .carousel-img-logic {
                    max-width: 85%;
                    max-height: 280px; /* 🚀 Prevents image from getting "massive" on laptop */
                    object-fit: contain; /* 🚀 Ensures image is NEVER cut */
                    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
                }

                .laptop-title {
                    font-size: 2rem;
                    font-weight: 800;
                    line-height: 1.2;
                }

                .x-small { font-size: 9px; letter-spacing: 1px; }

                @media (max-width: 767px) {
                    .carousel-wrapper-card {
                        min-height: auto;
                        max-height: none;
                    }
                    .carousel-img-logic {
                        max-height: 180px; /* Even shorter for mobile screens */
                        max-width: 90%;
                        padding: 10px;
                    }
                    .laptop-title {
                        font-size: 1.4rem;
                    }
                    .container { padding-left: 15px; padding-right: 15px; }
                }

                @media (min-width: 992px) {
                    .carousel-wrapper-card {
                        height: 420px;
                    }
                }
            `}</style>
        </div>
    );
};

export default GamingCarousel;