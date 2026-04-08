import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// 🚀 REPORT GENERATION LIBRARIES
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    // --- 1. AUTHENTICATION & STATE MANAGEMENT ---
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const [requests, setRequests] = useState([]); 
    const [laptops, setLaptops] = useState([]);   
    const [inquiries, setInquiries] = useState([]); 
    const [orders, setOrders] = useState([]); // 🚀 Purchase Orders State
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['Gaming', 'Business', 'Student', 'Parts', 'Accessories'];
    
    // Detailed Product State for Inventory Management
    const [newProd, setNewProd] = useState({ 
        name: '', brand: '', mrp: '', price: '', category: 'Gaming', description: '' 
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    // --- 🚀 2. STABLE LOGOUT FUNCTION ---
    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate('/login');
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Administrator Logged Out',
            showConfirmButton: false,
            timer: 2000
        });
    }, [navigate]);

    // --- 3. DATA PERSISTENCE (CORE FETCHING ENGINE) ---
    const fetchData = useCallback(async () => {
        if (!token) return;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        
        try {
            // 1. Fetch All Hardware Repair Tickets
            const resRequests = await axios.get('http://localhost:5000/api/services/admin/all', authHeader);
            setRequests(resRequests.data);

            // 2. Fetch Active Inventory Stock
            const resProducts = await axios.get('http://localhost:5000/api/products', authHeader);
            setLaptops(resProducts.data);

            // 3. Fetch Lead Generation Inquiries
            const resInquiries = await axios.get('http://localhost:5000/api/inquiries', authHeader);
            setInquiries(resInquiries.data);

            // 🚀 4. Fetch Buy Now Orders
            const resOrders = await axios.get('http://localhost:5000/api/orders', authHeader);
            setOrders(resOrders.data);

        } catch (err) {
            console.error("Critical Dashboard Sync Failure:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        }
    }, [token, handleLogout]);

    useEffect(() => {
        document.title = "Admin Page | Expert Computers";
        return () => { document.title = "Expert Computers"; };
    }, []);

    // Lifecycle: Initial Load and Security Redirect
    useEffect(() => {
        if (!token) { 
            navigate('/login'); 
        } else {
            fetchData();
        }
    }, [token, navigate, fetchData]);

    // --- 🚀 4. UNIVERSAL SEARCH ENGINE ---
    const filteredLaptops = laptops.filter(lp => {
        const term = searchTerm.toLowerCase();
        return (
            (lp.name || "").toLowerCase().includes(term) || 
            (lp.brand || "").toLowerCase().includes(term) ||
            (lp.category || "").toLowerCase().includes(term)
        );
    });

    const filteredInquiries = inquiries.filter(iq => {
        const term = searchTerm.toLowerCase();
        return (
            (iq.name || "").toLowerCase().includes(term) || 
            (iq.subject || "").toLowerCase().includes(term) ||
            (iq.email || "").toLowerCase().includes(term)
        );
    });

    const filteredRequests = requests.filter(req => {
        const term = searchTerm.toLowerCase();
        return (
            (req.device || "").toLowerCase().includes(term) ||
            (req.issue || "").toLowerCase().includes(term) ||
            (req.contact || "").includes(searchTerm)
        );
    });

    const filteredOrders = orders.filter(ord => {
        const term = searchTerm.toLowerCase();
        return (
            (ord.customerName || ord.name || "").toLowerCase().includes(term) ||
            (ord.productName || "").toLowerCase().includes(term) ||
            (ord.phone || "").includes(searchTerm)
        );
    });

    // --- 🚀 5. BRANDED PDF EXPORT MODULES & INVOICE ---
    
    // 🛠 UPDATED: PROFESSIONAL INVOICE GENERATOR
const generateInvoicePDF = (ord) => {
    // 1. Force 'mm' units and 'a4' size
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = 297;
    const tableStartY = 90;
    const footerStartY = pageHeight - 65; 

    // --- HEADER ---
    doc.setFillColor(0, 150, 255);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("EXPERT COMPUTERS", 15, 22);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Email: expertcomputer.delhi@gmail.com", 15, 32);
    doc.text("Contact: +91 9319199300", 15, 38);
    
    doc.setFontSize(22);
    doc.text("INVOICE", 150, 25);

    // --- BILLING ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 15, 60);
    doc.text("INVOICE SUMMARY:", 130, 60);
    
    doc.setFont("helvetica", "normal");
    doc.text(`${ord.customerName || ord.name}`, 15, 67);
    doc.text(`Contact: ${ord.phone || 'N/A'}`, 15, 73);
    doc.text(`Address: ${ord.address || 'Walk-in Customer'}`, 15, 79, { maxWidth: 80 });
    
    doc.text(`Invoice ID: #EC-${ord._id.substring(0, 8).toUpperCase()}`, 130, 67);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 130, 73);
    doc.text(`Status: Verified`, 130, 79);

    // --- 🚀 FIX 1: DRAW LINES FIRST (SO AUTO-TABLE HEADER COVERS TOP EDGES) ---
    doc.setDrawColor(200, 200, 200); // Light gray
    doc.setLineWidth(0.15);

    // EXACT column boundaries to mathematically match the autoTable below
    // S.No(15), Desc(80), Qty(15), Rate(35), Total(35) = 180mm Total Width
    const colX = [15, 30, 110, 125, 160, 195]; 

    colX.forEach((x) => {
        // Draw to footerStartY - 0.1 to avoid bottom poking
        doc.line(x, tableStartY, x, footerStartY - 0.1); 
    });

    // Bottom closing line
    doc.line(15, footerStartY, 195, footerStartY);

    // --- 🚀 FIX 2: TOTALS BACKGROUND (SAFE GAP) ---
    // Start at 125.5, width 69 -> Ends at 194.5 (leaves exactly 0.5mm gap from lines)
    doc.setFillColor(0, 150, 255);
    doc.rect(125.5, footerStartY + 12, 69, 12, 'F'); 

    // --- 🚀 FIX 3: TABLE (FORCED COLUMN WIDTHS) ---
    autoTable(doc, {
        startY: tableStartY,
        margin: { left: 15, right: 15 }, // Lock table between 15 and 195
        head: [['S.No', 'Description', 'Qty', 'Rate', 'Total']],
        body: [[
            '1', 
            `Asus TUF I7 12th gen RTX 3070 8GB Graphic Card QHD Display 16gb DDR5 512gb Nvme`, 
            '1', 
            `${ord.amount.toLocaleString()}`, 
            `${ord.amount.toLocaleString()}`
        ]],
        headStyles: { fillColor: [0, 150, 255], textColor: 255, fontStyle: 'bold', halign: 'center' },
        theme: 'plain', 
        styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
        columnStyles: { 
            0: { cellWidth: 15, halign: 'center' }, 
            1: { cellWidth: 80, halign: 'left' },  // Locks description to exactly 80mm
            2: { cellWidth: 15, halign: 'center' }, 
            3: { cellWidth: 35, halign: 'right' }, 
            4: { cellWidth: 35, halign: 'right' } 
        }
    });

    // --- TOTALS TEXT ---
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", 128, footerStartY + 20);
    doc.text(`INR ${ord.amount.toLocaleString()}`, 192, footerStartY + 20, { align: 'right' });

    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text("Sub-Total:", 128, footerStartY + 8);
    doc.text(`INR ${ord.amount.toLocaleString()}`, 192, footerStartY + 8, { align: 'right' });

    // --- SIGNATURE SECTION ---
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text("For EXPERT COMPUTERS", 150, pageHeight - 35);
    doc.setDrawColor(200); 
    doc.line(150, pageHeight - 25, 195, pageHeight - 25);
    doc.setFont("helvetica", "normal");
    doc.text("Authorized Signatory", 157, pageHeight - 20);

    // --- FOOTER ---
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Notes: Warranty as per manufacturer policy. Goods once sold will not be taken back.", 105, pageHeight - 8, { align: 'center' });

    doc.save(`Invoice_EC_${ord.customerName || 'Order'}.pdf`);
};
    const downloadOrdersPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(25, 135, 84); // Success Green
        doc.text('EXPERT COMPUTERS: SALES ORDERS', 14, 20);
        const tableColumn = ["Customer", "Product", "Amount", "Status"];
        const tableRows = filteredOrders.map(ord => [
            ord.customerName || ord.name, ord.productName, `Rs. ${ord.amount.toLocaleString('en-IN')}`, ord.status
        ]);
        autoTable(doc, { startY: 30, head: [tableColumn], body: tableRows, headStyles: { fillColor: [25, 135, 84] }, theme: 'grid' });
        doc.save(`Expert_Sales_Report_${Date.now()}.pdf`);
    };

    const downloadRepairsPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(0, 170, 255); 
        doc.text('EXPERT COMPUTERS: REPAIR REPORT', 14, 20);
        const tableColumn = ["Device", "Issue", "Contact", "Status"];
        const tableRows = filteredRequests.map(req => [
            req.device, req.issue || 'Pending Diagnosis', req.contact || 'N/A', req.status
        ]);
        autoTable(doc, {
            startY: 35,
            head: [tableColumn],
            body: tableRows,
            headStyles: { fillColor: [0, 170, 255], textColor: [255, 255, 255], fontStyle: 'bold' },
            theme: 'grid'
        });
        doc.save(`Expert_Repairs_Report_${Date.now()}.pdf`);
    };

    const downloadInventoryPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(0, 170, 255);
        doc.text('EXPERT COMPUTERS: STOCK INVENTORY', 14, 20);
        const tableColumn = ["Model", "Brand", "Category", "MRP", "Price"];
        const tableRows = filteredLaptops.map(lp => [
            lp.name, lp.brand, lp.category, `Rs. ${lp.mrp || 'N/A'}`, `Rs. ${lp.price.toLocaleString('en-IN')}`
        ]);
        autoTable(doc, { startY: 35, head: [tableColumn], body: tableRows, headStyles: { fillColor: [0, 170, 255], textColor: [255, 255, 255] }, theme: 'grid' });
        doc.save(`Expert_Inventory_Report_${Date.now()}.pdf`);
    };

    // --- 🚀 6. CRUD LOGIC (INVENTORY & ORDERS) ---

    // 🛠 UPDATED: VIEW CUSTOMER DETAILS MODAL (Triggers Professional Invoice)
    const viewOrderDetails = (ord) => {
        Swal.fire({
            title: `<span style="color: #198754">Order Manifest</span>`,
            html: `
                <div class="text-start border-top pt-3" style="font-family: sans-serif;">
                    <div class="mb-2"><b>Customer:</b> ${ord.customerName || ord.name || 'N/A'}</div>
                    <div class="mb-2"><b>WhatsApp:</b> ${ord.phone || 'N/A'}</div>
                    <div class="mb-2"><b>Product:</b> ${ord.productName || 'N/A'}</div>
                    <div class="mb-2"><b>Total Amount:</b> ₹${ord.amount?.toLocaleString('en-IN')}</div>
                    <hr>
                    <div class="mb-2"><b>Delivery Address:</b></div>
                    <p class="bg-light p-3 rounded border small" style="line-height: 1.5;">${ord.address || 'No address provided'}</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Print Bill',
            confirmButtonColor: '#1e293b', // Slate Blue to match new invoice
            cancelButtonText: 'Close',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                generateInvoicePDF(ord);
            }
        });
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        Swal.fire({ title: 'Syncing with Database...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

        const formData = new FormData();
        Object.keys(newProd).forEach(key => formData.append(key, newProd[key]));
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(file => formData.append('images', file));
        }

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } };
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/products/${isEditing}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/api/products', formData, config);
            }
            resetForm(); fetchData();
            Swal.fire('Cloud Sync Success', 'Website inventory has been updated live.', 'success');
        } catch (err) { 
            Swal.fire('Database Error', 'Could not save product.', 'error'); 
        }
    };

    const deleteLaptop = async (id) => {
        if ((await Swal.fire({ title: 'Delete Laptop?', icon: 'warning', showCancelButton: true })).isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchData();
                Swal.fire('Deleted', 'Item removed.', 'success');
            } catch (err) { console.error(err); }
        }
    };

    const updateOrderStatus = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/orders/${id}`, { status: newStatus }, config);
            fetchData(); 
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Payment Verified!', showConfirmButton: false, timer: 2000 });
        } catch (err) {
            Swal.fire('Error', 'Could not verify payment.', 'error');
        }
    };

    const deleteOrder = async (id) => {
        if ((await Swal.fire({ title: 'Delete Record?', icon: 'warning', showCancelButton: true })).isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchData();
            } catch (err) { console.error(err); }
        }
    };

    const resetForm = () => {
        setNewProd({ name: '', brand: '', mrp: '', price: '', category: 'Gaming', description: '' });
        setSelectedFiles([]); setIsEditing(null); setShowAddForm(false);
    };

    const startEdit = (lp) => {
        setNewProd({ name: lp.name, brand: lp.brand, mrp: lp.mrp || '', price: lp.price, category: lp.category || 'Gaming', description: lp.description });
        setIsEditing(lp._id); setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- 🚀 7. CUSTOMER SERVICE LOGIC ---

    const readInquiry = (iq) => {
        Swal.fire({
            title: `<span style="color: #00aaff">${iq.subject}</span>`,
            html: `<div class="text-start border-top pt-3"><p><b>From:</b> ${iq.name}</p><hr><p>${iq.message}</p></div>`,
            confirmButtonColor: '#00aaff'
        });
    };

    const markAsFixed = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/services/${id}`, { status: 'Fixed ✅' }, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Marked Fixed', showConfirmButton: false, timer: 2000 });
        } catch (err) { console.error(err); }
    };

    // --- 🚀 8. UI ARCHITECTURE (STRICTLY PRESERVING YOUR ORIGINAL LAYOUT) ---

    return (
        <div className="container-fluid px-4 mt-4 pb-5">
            
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 bg-white p-4 shadow-sm rounded-4 border-start border-info border-5">
                <div className="mb-3 mb-md-0">
                    <h2 className="fw-bold text-dark mb-0">Expert <span style={{color: '#00aaff'}}>Control Hub</span></h2>
                    <p className="text-muted mb-0 small">Admin: <span className="text-dark fw-bold">{user?.name}</span></p>
                </div>
                <div className="d-flex gap-3 align-items-center w-100 w-md-auto">
                    <div className="input-group flex-grow-1" style={{maxWidth: '450px'}}>
                        <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                        <input type="text" className="form-control bg-light border-0" placeholder="Universal Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline-danger px-4 rounded-pill fw-bold">Sign Out</button>
                </div>
            </div>

            {/* STATS OVERVIEW */}
            <div className="row g-3 mb-5">
                <div className="col-md-3"><div className="card border-0 shadow-sm p-4 rounded-4 bg-primary text-white h-100"><small>Stock</small><h2 className="fw-bold mb-0">{laptops.length}</h2></div></div>
                <div className="col-md-3"><div className="card border-0 shadow-sm p-4 rounded-4 bg-success text-white h-100"><small>Orders</small><h2 className="fw-bold mb-0">{orders.length}</h2></div></div>
                <div className="col-md-3"><div className="card border-0 shadow-sm p-4 rounded-4 bg-warning text-dark h-100"><small>Pending Repairs</small><h2 className="fw-bold mb-0">{requests.filter(r => r.status === 'Pending').length}</h2></div></div>
                <div className="col-md-3"><div className="card border-0 shadow-sm p-4 rounded-4 bg-info text-white h-100"><small>Inquiries</small><h2 className="fw-bold mb-0">{inquiries.length}</h2></div></div>
            </div>

            {/* 🚀 SALES ORDERS SECTION */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 border-start border-success border-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0 text-dark">Recent Purchase Requests ({filteredOrders.length})</h4>
                    <button onClick={downloadOrdersPDF} className="btn btn-sm btn-success rounded-pill px-3 fw-bold">Export Sales PDF</button>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light small fw-bold">
                            <tr><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(ord => (
                                <tr key={ord._id}>
                                    <td>
                                        <div className="fw-bold">{ord.customerName || ord.name || "N/A"}</div>
                                        <div className="small text-muted">{ord.phone || "No Phone"}</div>
                                    </td>
                                    <td><div className="small fw-bold">{ord.productName}</div></td>
                                    <td className="text-success fw-bold">₹{ord.amount?.toLocaleString('en-IN')}</td>
                                    <td><span className={`badge rounded-pill ${ord.status === 'Verified' ? 'bg-success' : 'bg-info'}`}>{ord.status}</span></td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {/* 🚀 THE VIEW & BILL BUTTON */}
                                            <button onClick={() => viewOrderDetails(ord)} className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                                                <i className="bi bi-eye-fill me-1"></i> View
                                            </button>
                                            {ord.status !== 'Verified' && <button onClick={() => updateOrderStatus(ord._id, 'Verified')} className="btn btn-sm btn-success rounded-pill px-3">Verify</button>}
                                            <button onClick={() => deleteOrder(ord._id)} className="btn btn-sm btn-outline-danger border-0"><i className="bi bi-trash3"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* INVENTORY EDITOR */}
            <div className="text-center mb-5">
                <button className={`btn ${showAddForm ? 'btn-danger' : 'btn-info text-white'} btn-lg shadow px-5 rounded-pill fw-bold`} onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? '✕ Close Editor' : '＋ Manage Inventory'}
                </button>
                {showAddForm && (
                    <form onSubmit={handleSaveProduct} className="card p-4 shadow-lg mt-4 text-start border-0 rounded-4 animate__animated animate__fadeInUp">
                        <div className="row g-3">
                            <div className="col-md-6"><label className="small fw-bold text-muted">Model Name</label><input type="text" className="form-control bg-light border-0 p-3" value={newProd.name} onChange={(e) => setNewProd({...newProd, name: e.target.value})} required /></div>
                            <div className="col-md-6"><label className="small fw-bold text-muted">Category</label><select className="form-select bg-light border-0 p-3" value={newProd.category} onChange={(e) => setNewProd({...newProd, category: e.target.value})}>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                            <div className="col-md-4"><label className="small fw-bold text-muted">Brand</label><input type="text" className="form-control bg-light border-0 p-3" value={newProd.brand} onChange={(e) => setNewProd({...newProd, brand: e.target.value})} required /></div>
                            <div className="col-md-4"><label className="small fw-bold text-success">Price</label><input type="number" className="form-control bg-light border-0 p-3 fw-bold" value={newProd.price} onChange={(e) => setNewProd({...newProd, price: e.target.value})} required /></div>
                            <div className="col-12"><textarea className="form-control bg-light border-0 p-3" rows="3" value={newProd.description} onChange={(e) => setNewProd({...newProd, description: e.target.value})} required placeholder="Specifications..." /></div>
                            <div className="col-12"><input type="file" className="form-control bg-light border-0 p-3" multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files))} /></div>
                            <button type="submit" className="btn btn-info text-white mt-3 py-3 rounded-pill fw-bold shadow">Confirm Save</button>
                        </div>
                    </form>
                )}
            </div>

            {/* REPAIR REQUESTS */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 border-start border-warning border-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0 text-dark">Service Tickets ({filteredRequests.length})</h4>
                    <button onClick={downloadRepairsPDF} className="btn btn-sm btn-dark rounded-pill px-3 fw-bold shadow-sm">Export Repairs PDF</button>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light text-uppercase small fw-bold">
                            <tr><th>Device</th><th>Issue</th><th>Contact</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(req => (
                                <tr key={req._id}>
                                    <td className="fw-bold">{req.device}</td>
                                    <td className="small text-muted">{req.issue}</td>
                                    <td className="small fw-bold text-info">{req.contact || req.phone}</td>
                                    <td><span className={`badge rounded-pill px-3 py-2 ${req.status === 'Fixed ✅' ? 'bg-success' : 'bg-warning text-dark'}`}>{req.status}</span></td>
                                    <td>
                                        {req.status === 'Pending' && <button onClick={() => markAsFixed(req._id)} className="btn btn-sm btn-success px-3 fw-bold rounded-pill">Mark Fixed</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ACTIVE INVENTORY */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0 text-dark">Active Stock ({filteredLaptops.length})</h4>
                    <button onClick={downloadInventoryPDF} className="btn btn-sm btn-outline-info rounded-pill px-3 fw-bold">Download Inventory PDF</button>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light text-uppercase small fw-bold">
                            <tr><th>Model</th><th>Tier</th><th>Price</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredLaptops.map(lp => (
                                <tr key={lp._id}>
                                    <td className="fw-bold">{lp.name}</td>
                                    <td><span className="badge bg-light text-dark border px-3 rounded-pill fw-normal">{lp.category}</span></td>
                                    <td className="text-success fw-bold">₹{lp.price.toLocaleString('en-IN')}</td>
                                    <td>
                                        <button onClick={() => startEdit(lp)} className="btn btn-sm btn-outline-info me-2 fw-bold border-0">Edit</button>
                                        <button onClick={() => deleteLaptop(lp._id)} className="btn btn-sm btn-outline-danger border-0"><i className="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* INQUIRIES */}
            <div className="card border-0 shadow-sm rounded-4 p-4 border-start border-info border-5">
                <h4 className="fw-bold mb-4 text-info">Customer Inquiries ({filteredInquiries.length})</h4>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <tbody>
                            {filteredInquiries.map(iq => (
                                <tr key={iq._id}>
                                    <td className="small text-muted">{new Date(iq.date).toLocaleDateString()}</td>
                                    <td className="fw-bold">{iq.name}</td>
                                    <td><span className="badge bg-info-subtle text-info px-3 fw-normal">{iq.subject}</span></td>
                                    <td>
                                        <button onClick={() => readInquiry(iq)} className="btn btn-sm btn-outline-info rounded-pill px-3 fw-bold">Open</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-center mt-5 opacity-50">
                <p className="small mb-0">Project BCSP-064 Expert Computers © 2026</p>
            </div>
        </div>
    );
};

export default AdminDashboard;