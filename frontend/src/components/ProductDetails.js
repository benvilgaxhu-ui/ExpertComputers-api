import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { QRCodeCanvas } from 'qrcode.react';
import ReactDOM from 'react-dom/client'; // 🚀 Updated to React 18 client for the modal render
import apiBase from '../config'; // Use the relative path to your config file

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [isExpanded, setIsExpanded] = useState(false); // 📖 Read More state

    useEffect(() => {
        axios.get(`${apiBase}/api/products/${id}`)
            .then(res => {
                setProduct(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    setMainImage(res.data.images[0]);
                }
            })
            .catch(err => console.error("Database Fetch Error:", err));
    }, [id]);

    if (!product) return (
        <div className="text-center mt-5 py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <h3 className="mt-3 fw-bold">Hydrating Specs...</h3>
        </div>
    );

    const resolveImage = (img) => {
        if (!img) return 'https://via.placeholder.com/400x300?text=No+Image';
        return img.startsWith('http') ? img : `${apiBase}${img}`;
    };

    /**
     * 🔒 THE PRICE LOCK LOGIC
     * am = Amount, mam = Minimum Amount. 
     * Setting them equal disables the keyboard in most UPI apps.
     */
    const generateLockedUPILink = () => {
        const upiId = "kss219797@okicici"; 
        const amount = product.price;
        return `upi://pay?pa=${upiId}&pn=Expert_Computers&am=${amount}&mam=${amount}&cu=INR&tn=Order_For_${product.name.replace(/\s+/g, '_')}`;
    };

    /**
     * 🛒 BUY NOW (Fixed 400 Error + Dynamic Locked QR)
     */
    const handleBuyNow = () => {
        Swal.fire({
            title: 'Secure Checkout',
            html: `
                <div style="text-align: left; font-family: sans-serif;">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Full Name</label>
                        <input id="swal-name" class="swal2-input m-0 w-100" style="font-size: 1rem;" placeholder="Enter your name">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">WhatsApp Number</label>
                        <input id="swal-phone" class="swal2-input m-0 w-100" style="font-size: 1rem;" placeholder="Active phone number">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Delivery Address</label>
                        <textarea id="swal-address" class="swal2-textarea m-0 w-100" style="font-size: 1rem;" placeholder="Full address with PIN code"></textarea>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirm & Generate QR',
            confirmButtonColor: '#1e293b',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const phone = document.getElementById('swal-phone').value;
                const address = document.getElementById('swal-address').value;

                if (!name || !phone || !address) {
                    Swal.showValidationMessage('Please fill all checkout details');
                    return false;
                }
                return { customerName: name, phone: phone, address: address };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // 🛡️ STEP 1: Post to backend using productId to fix 400 error
                    const orderPayload = {
                        customerName: result.value.customerName,
                        phone: result.value.phone,
                        address: result.value.address,
                        productId: product._id 
                    };

                    await axios.post(`${apiBase}/api/orders`, orderPayload);

                    // Root variable to handle cleanup
                    let qrRoot;

                    // 🛡️ STEP 2: Show the Dynamic Locked QR Code
                    Swal.fire({
                        title: 'Scan to Pay',
                        html: `
                            <div class="p-3 text-center">
                                <p class="mb-3 fw-bold text-success fs-5">Amount: ₹${product.price.toLocaleString('en-IN')}</p>
                                <div id="qr-target" style="display: flex; justify-content: center; background: #fff; padding: 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></div>
                                <p class="mt-3 text-muted small">Scanning will auto-fill the amount in your bank app.</p>
                                <p class="fw-bold x-small text-uppercase mt-1 text-primary">Expert Computers | Krishna</p>
                            </div>
                        `,
                        didOpen: () => {
                            // ✅ FIXED: React 18 "createRoot" method
                            const container = document.getElementById('qr-target');
                            if (container) {
                                qrRoot = ReactDOM.createRoot(container);
                                qrRoot.render(
                                    <QRCodeCanvas 
                                        value={generateLockedUPILink()} 
                                        size={200} 
                                        level="H" 
                                        includeMargin={true} 
                                    />
                                );
                            }
                        },
                        willClose: () => {
                            // Clean up React root to prevent memory leaks
                            if (qrRoot) qrRoot.unmount();
                        },
                        confirmButtonText: 'I Have Paid',
                        confirmButtonColor: '#198754'
                    });

                } catch (error) {
                    console.error("Order Submission Error:", error);
                    Swal.fire('Error', 'Server rejected the order. Please check all fields.', 'error');
                }
            }
        });
    };

    const handleWhatsAppInquiry = () => {
        const phoneNumber = "919319199300"; 
        const message = `Hi Expert Computers! 👋 I'm interested in:
🔥 *${product.name}*
💰 Offer Price: ₹${product.price.toLocaleString('en-IN')}
🔗 Link: ${window.location.href}`;
        
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // --- 📖 Description Truncation Logic ---
    const charLimit = 350;
    const isLongDescription = product.description && product.description.length > charLimit;
    const descriptionToShow = isExpanded ? product.description : `${product.description?.substring(0, charLimit)}${isLongDescription ? '...' : ''}`;

    return (
        <div className="container mt-2 mt-md-4 pb-5 animate__animated animate__fadeIn">
            
            {/* --- Navigation --- */}
            <nav aria-label="breadcrumb" className="mb-3 mb-md-4">
                <ol className="breadcrumb bg-white p-2 p-md-3 rounded-pill shadow-sm border small">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                    <li className="breadcrumb-item">
                        <Link to="/laptops" className="text-decoration-none fw-bold text-primary">Catalog</Link>
                    </li>
                    <li className="breadcrumb-item active text-truncate" style={{maxWidth: '120px'}}>{product.name}</li>
                </ol>
            </nav>
            
            <div className="row g-3 g-md-5">
                {/* Image Gallery */}
                <div className="col-lg-6">
                    <div className="bg-white p-2 p-md-4 shadow-sm rounded-4 border sticky-md-top" style={{ top: '100px', zIndex: 1 }}>
                        <div className="text-center mb-3 mb-md-4 bg-light rounded-3 image-main-container">
                            <img 
                                src={resolveImage(mainImage)} 
                                alt={product.name} 
                                className="img-fluid animate__animated animate__zoomIn p-2" 
                                style={{ maxHeight: '100%', objectFit: 'contain' }} 
                            />
                        </div>
                        {/* Thumbnails scroller */}
                        <div className="d-flex gap-2 overflow-auto pb-2 hide-scrollbar">
                            {product.images?.map((img, i) => (
                                <img 
                                    key={i} 
                                    src={resolveImage(img)} 
                                    alt="thumb" 
                                    className={`img-thumbnail transition-all flex-shrink-0 ${mainImage === img ? 'border-primary border-2' : 'opacity-75 border-light'}`} 
                                    style={{ width: '70px', height: '70px', cursor: 'pointer', objectFit: 'cover', borderRadius: '10px' }} 
                                    onClick={() => setMainImage(img)} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="col-lg-6">
                    <div className="px-1">
                        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill mb-2 border border-success small fw-bold">
                             Verified Expert Stock
                        </span>
                        <h1 className="fw-bold h2 h1-md mb-2">{product.name}</h1>
                        <p className="text-muted mb-4 small fs-md-5">Official {product.brand} {product.category} Series</p>

                        {/* 🚀 PRICING BOX - Optimized for mobile width */}
                        <div className="bg-primary text-white p-3 p-md-4 rounded-4 mb-4 shadow-sm border-start border-warning border-5">
                            <div className="d-flex align-items-center flex-wrap gap-2 gap-md-3">
                                <h2 className="fw-bold mb-0" style={{ fontSize: 'calc(1.5rem + 1.5vw)' }}>₹{product.price.toLocaleString('en-IN')}</h2>
                                {product.mrp > product.price && (
                                    <span className="text-white-50 text-decoration-line-through fs-5 fs-md-4">
                                        ₹{product.mrp.toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>
                            {product.mrp > product.price && (
                                <div className="mt-2 py-1 px-2 bg-white bg-opacity-10 rounded d-inline-block">
                                    <p className="mb-0 small fw-bold text-warning animate__animated animate__headShake animate__infinite">
                                        🎉 Instant Savings: ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 🚀 DESCRIPTION WITH READ MORE */}
                        <div className="mb-4 mb-md-5">
                            <h6 className="fw-bold text-uppercase text-muted border-bottom pb-2 mb-3" style={{letterSpacing: '1px'}}>Technical Specifications</h6>
                            <p className="text-secondary mb-2" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                {descriptionToShow}
                            </p>
                            {isLongDescription && (
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)} 
                                    className="btn btn-link p-0 fw-bold text-primary text-decoration-none small"
                                >
                                    {isExpanded ? "Read Less ↑" : "Read More Details ↓"}
                                </button>
                            )}
                        </div>

                        {/* Desktop Only Buttons */}
                        <div className="d-none d-md-grid gap-3">
                            <button onClick={handleBuyNow} className="btn btn-danger btn-lg fw-bold shadow py-3 rounded-pill animate__animated animate__pulse animate__infinite">
                                <i className="bi bi-cart-check me-2"></i> Buy Now
                            </button>
                            
                            <button onClick={handleWhatsAppInquiry} className="btn btn-success btn-lg fw-bold shadow py-3 rounded-pill">
                                <i className="bi bi-whatsapp me-2"></i> Inquiry via WhatsApp
                            </button>

                            <Link to="/laptops" className="btn btn-outline-dark btn-lg rounded-pill fw-bold">
                                ← Back to Catalog
                            </Link>
                        </div>

                        <div className="mt-4 mt-md-5 p-3 bg-light rounded-4 border extra-small text-muted">
                            <i className="bi bi-shield-check me-2 text-primary"></i>
                            Note: This order will be sent to Expert Computers for manual payment verification.
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 📱 MOBILE STICKY ACTION BAR --- */}
            <div className="d-md-none fixed-bottom bg-white border-top p-3 shadow-lg-up" style={{ zIndex: 1050 }}>
                <div className="d-flex gap-2">
                    <button 
                        onClick={handleWhatsAppInquiry} 
                        className="btn btn-light border rounded-pill flex-grow-0 px-3"
                        style={{width: '60px'}}
                    >
                        <i className="bi bi-whatsapp text-success fs-4"></i>
                    </button>
                    <button 
                        onClick={handleBuyNow} 
                        className="btn btn-danger flex-grow-1 fw-bold rounded-pill py-3 shadow-sm animate__animated animate__pulse animate__infinite"
                    >
                        BUY NOW
                    </button>
                </div>
            </div>

            {/* --- FLOATING WHATSAPP BUTTON (Hidden on very small mobile to avoid overlap) --- */}
            <div 
                onClick={handleWhatsAppInquiry}
                className="d-none d-sm-flex animate__animated animate__bounceInRight shadow-lg floating-wa"
            >
                <i className="bi bi-whatsapp"></i>
            </div>

            <style>{`
                .image-main-container {
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @media (min-width: 768px) {
                    .image-main-container { height: 450px; }
                }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .extra-small { font-size: 0.75rem; }
                .shadow-lg-up { box-shadow: 0 -10px 25px rgba(0,0,0,0.1); }
                
                .floating-wa {
                    position: fixed; bottom: 30px; right: 30px; 
                    backgroundColor: #25D366; color: #FFF; borderRadius: 50px;
                    textAlign: center; fontSize: 30px; box-shadow: 2px 2px 15px rgba(37,211,102,0.4); 
                    zIndex: 1000; width: 65px; height: 65px; cursor: pointer; 
                    alignItems: center; justifyContent: center;
                    background-color: #25D366;
                }

                @media (max-width: 767px) {
                    body { padding-bottom: 90px !important; }
                    .breadcrumb { font-size: 0.75rem; }
                    .h1-md { font-size: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default ProductDetails;