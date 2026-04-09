import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import apiBase from '../config'; // Use the relative path to your config file

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
        <div className="container my-5">
            {/* 🚀 FIXED HEIGHT CARD (Locked at 500px) */}
            <div className="card border-0 shadow-lg overflow-hidden rounded-5 bg-dark text-white" style={{ height: '500px' }}>
                <div className="row g-0 h-100">
                    
                    {/* --- LEFT SIDE: THE SPECS (Flex centered) --- */}
                    <div className="col-lg-6 p-5 d-flex flex-column justify-content-center h-100">
                        <div className={`${fade ? 'animate__fadeInUp' : 'animate__fadeOutDown'} animate__animated`}>
                            <span className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold">
                                <i className="bi bi-fire me-2"></i>FEATURED GAMING RIG
                            </span>
                            
                            {/* Fixed height for name to prevent pushing content down */}
                            <h1 className="fw-black mb-3" style={{ fontSize: '2.5rem', minHeight: '80px', display: 'flex', alignItems: 'center' }}>
                                {current.name}
                            </h1>
                            
                            <p className="fs-5 text-info mb-4 opacity-75">
                                Professional Grade Performance • Expert Verified 
                            </p>
                            
                            <div className="d-flex align-items-center gap-4 mb-4">
                                <div>
                                    <p className="small text-uppercase mb-0 opacity-50">Best Price</p>
                                    <h2 className="text-warning fw-bold mb-0">₹{current.price.toLocaleString('en-IN')}</h2>
                                </div>
                                <div className="vr bg-white opacity-25" style={{ height: '40px' }}></div>
                                <div>
                                    <p className="small text-uppercase mb-0 opacity-50">Condition</p>
                                    <h4 className="fw-bold mb-0">Refurbished</h4>
                                </div>
                            </div>

                            <div className="d-flex gap-3 mt-auto">
                                <Link to={`/product/${current._id}`} className="btn btn-primary btn-lg px-5 rounded-pill fw-bold shadow">
                                    Grab This Deal
                                </Link>
                                <a href="https://wa.me/919319199300" target="_blank" rel="noreferrer" className="btn btn-outline-light btn-lg px-4 rounded-pill">
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: THE BIG IMAGE (Fixed Container) --- */}
                    <div 
    className="col-lg-6 d-flex align-items-center justify-content-center p-5 h-100" 
    style={{ backgroundColor: '#ffffff' }} // 🚀 FORCED PURE WHITE
>
    {/* --- Gradient Shadow (Adjusted to be much subtler or removed) --- */}
    <div 
        className="position-absolute" 
        style={{ 
            width: '400px', 
            height: '400px', 
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 80%)', 
            zIndex: 0 
        }}
    ></div>
    
    <img 
        key={current._id} 
        src={imgPath} 
        alt={current.name} 
        className={`img-fluid position-relative z-1 animate__animated ${fade ? 'animate__zoomIn' : 'animate__zoomOut'}`}
        style={{ 
            height: '350px', 
            width: '100%', 
            objectFit: 'contain', 
            // 🚀 We use a lighter drop-shadow so it doesn't "muddy" the white background
           
        }}
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
                            width: currentIndex === i ? '35px' : '12px', 
                            height: '12px',
                            cursor: 'pointer'
                        }}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default GamingCarousel;