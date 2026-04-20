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
        <div className="container-fluid px-2 px-md-4 my-4">
            {/* 🚀 FIXED HEIGHT CARD */}
            <div className="card border-0 shadow-lg overflow-hidden rounded-4 bg-dark text-white carousel-firm-card">
                <div className="row g-0 h-100">
                    
                    {/* --- LEFT BLOCK: SPECS --- */}
                    <div className="col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-center order-2 order-md-1 bg-dark h-100">
                        <div className={`${fade ? 'animate__fadeInUp' : 'animate__fadeOutDown'} animate__animated`}>
                            <span className="badge bg-warning text-dark mb-2 px-3 py-2 rounded-pill fw-bold" style={{fontSize: '0.7rem'}}>
                                FEATURED GAMING RIG
                            </span>
                            
                            <h2 className="fw-black mb-3 laptop-title-text">
                                {current.name}
                            </h2>
                            
                            <p className="text-info mb-4 opacity-75 small d-none d-sm-block">
                                High-FPS Performance • Stress Tested • Expert Certified 
                            </p>
                            
                            <div className="d-flex align-items-center gap-4 mb-4">
                                <div>
                                    <p className="x-small text-uppercase mb-0 opacity-50">Expert Price</p>
                                    <h3 className="text-warning fw-bold mb-0 fs-2">₹{current.price.toLocaleString('en-IN')}</h3>
                                </div>
                                <div className="vr bg-white opacity-25" style={{ height: '40px' }}></div>
                                <div>
                                    <p className="x-small text-uppercase mb-0 opacity-50">Condition</p>
                                    <p className="fw-bold mb-0">Refurbished</p>
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                <Link to={`/product/${current._id}`} className="btn btn-primary px-4 py-2 py-md-3 rounded-pill fw-bold shadow">
                                    Grab Deal
                                </Link>
                                <a href={`https://wa.me/919319199300`} target="_blank" rel="noreferrer" className="btn btn-outline-light px-4 rounded-pill d-flex align-items-center justify-content-center">
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT BLOCK: IMAGE (NO CROP FIX) --- */}
                    {/* 🚀 Changed to p-3/p-md-4 to provide the 'Safe Zone' */}
                    <div className="col-md-6 order-1 order-md-2 bg-white d-flex align-items-center justify-content-center h-100 p-3 p-md-4">
                        <div className="image-contain-box">
                            <img 
                                key={current._id} 
                                src={imgPath} 
                                alt={current.name} 
                                className={`carousel-image-final animate__animated ${fade ? 'animate__zoomIn' : 'animate__zoomOut'}`}
                            />
                        </div>
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
                        style={{ width: currentIndex === i ? '35px' : '8px', height: '8px', cursor: 'pointer' }}
                    ></button>
                ))}
            </div>

            <style>{`
                /* 🚀 FIXED CONTAINER LOGIC */
                .carousel-firm-card {
                    min-height: 400px;
                }

                @media (min-width: 992px) {
                    .carousel-firm-card {
                        height: 480px; /* Locked height for laptop */
                    }
                    .laptop-title-text {
                        font-size: 2.2rem;
                        font-weight: 900;
                        line-height: 1.1;
                    }
                }

                /* 🚀 IMAGE BOX FIX */
                .image-contain-box {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden; /* Clips any bleed-out */
                }

                .carousel-image-final {
                    max-width: 100%;
                    max-height: 100%;
                    /* 🚀 KEY FIX: contain makes sure the full photo is visible */
                    object-fit: contain; 
                    display: block;
                }

                @media (max-width: 767px) {
                    .carousel-firm-card {
                        min-height: auto;
                    }
                    .image-contain-box {
                        height: 300px; /* Fixed height for mobile stack */
                    }
                    .laptop-title-text {
                        font-size: 1.4rem;
                    }
                }

                .fw-black { font-weight: 900; }
                .x-small { font-size: 10px; letter-spacing: 1px; }
                .transition-all { transition: all 0.3s ease-in-out; }
            `}</style>
        </div>
    );
};

export default GamingCarousel;