import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// 🚀 REPORT GENERATION LIBRARIES
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import apiBase from '../config'; // Use the relative path to your config file

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
    

    const categories = ['Gaming', 'Apple', 'Business', 'Parts', 'Accessories'];
    
    // Detailed Product State for Inventory Management
    const [newProd, setNewProd] = useState({ 
        name: '', brand: '', mrp: '', price: '', category: 'Gaming', description: '' 
    });
    
    // 📸 IMAGE & PREVIEW STATE
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

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
            const resRequests = await axios.get(`${apiBase}/api/services/admin/all`, authHeader);
            setRequests(resRequests.data);

            // 2. Fetch Active Inventory Stock
            const resProducts = await axios.get(`${apiBase}/api/products`, authHeader);
            setLaptops(resProducts.data);

            // 3. Fetch Lead Generation Inquiries
            const resInquiries = await axios.get(`${apiBase}/api/inquiries`, authHeader);
            setInquiries(resInquiries.data);

            // 🚀 4. Fetch Buy Now Orders
            const resOrders = await axios.get(`${apiBase}/api/orders`, authHeader);
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

    // --- 📸 PHOTO SELECTION HANDLERS ---
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Append new files to existing selection to allow "First this then this" additions
        setSelectedFiles(prev => [...prev, ...files]);

        // Generate Blob URLs for visual previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
        setPreviews(updatedPreviews);
    };

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
    
    // 🛠 PROFESSIONAL INVOICE GENERATOR (RETAINING FULL LOGIC)
    const generateInvoicePDF = (ord) => {
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

        // --- LINES ---
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.15);
        const colX = [15, 30, 110, 125, 160, 195]; 
        colX.forEach((x) => doc.line(x, tableStartY, x, footerStartY - 0.1));
        doc.line(15, footerStartY, 195, footerStartY);

        // --- TABLE ---
        autoTable(doc, {
            startY: tableStartY,
            margin: { left: 15, right: 15 },
            head: [['S.No', 'Description', 'Qty', 'Rate', 'Total']],
            body: [['1', `${ord.productName || 'System Hardware'}`, '1', `${ord.amount.toLocaleString()}`, `${ord.amount.toLocaleString()}`]],
            headStyles: { fillColor: [0, 150, 255], textColor: 255, fontStyle: 'bold', halign: 'center' },
            theme: 'plain', 
            styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
            columnStyles: { 
                0: { cellWidth: 15, halign: 'center' }, 
                1: { cellWidth: 80 }, 2: { cellWidth: 15 }, 3: { cellWidth: 35, halign: 'right' }, 4: { cellWidth: 35, halign: 'right' } 
            }
        });

        // --- TOTALS ---
        doc.setFillColor(0, 150, 255);
        doc.rect(125.5, footerStartY + 12, 69, 12, 'F'); 
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL:", 128, footerStartY + 20);
        doc.text(`INR ${ord.amount.toLocaleString()}`, 192, footerStartY + 20, { align: 'right' });

        // --- SIGNATURE ---
        doc.setTextColor(0);
        doc.setFontSize(10);
        doc.text("For EXPERT COMPUTERS", 150, pageHeight - 35);
        doc.line(150, pageHeight - 25, 195, pageHeight - 25);
        doc.text("Authorized Signatory", 157, pageHeight - 20);

        doc.save(`Invoice_EC_${ord.customerName || 'Order'}.pdf`);
    };

    const downloadOrdersPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(25, 135, 84);
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
            req.device, req.issue || 'Pending', req.contact || 'N/A', req.status
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

    // --- 🚀 6. CRUD LOGIC (WITH NEW DELETE ADDITIONS) ---

    // 🛠 ADDED: DELETE SERVICE REQUEST
    const deleteServiceRequest = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Ticket?',
            text: "Permanent removal from records.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete'
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`${apiBase}/api/services/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchData();
                Swal.fire('Deleted', 'Repair ticket removed.', 'success');
            } catch (err) { Swal.fire('Error', 'Failed to delete', 'error'); }
        }
    };

    // 🛠 ADDED: DELETE INQUIRY
    const deleteInquiry = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Inquiry?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33'
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`${apiBase}/api/inquiries/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchData();
                Swal.fire('Removed', 'Inquiry deleted.', 'success');
            } catch (err) { Swal.fire('Error', 'Could not delete.', 'error'); }
        }
    };

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
                    <p class="bg-light p-3 rounded border small">${ord.address || 'No address provided'}</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Print Bill',
            confirmButtonColor: '#1e293b',
            cancelButtonText: 'Close'
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
                await axios.put(`${apiBase}/api/products/${isEditing}`, formData, config);
            } else {
                await axios.post(`${apiBase}/api/products`, formData, config);
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
                await axios.delete(`${apiBase}/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchData();
                Swal.fire('Deleted', 'Item removed.', 'success');
            } catch (err) { console.error(err); }
        }
    };

    const updateOrderStatus = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${apiBase}/api/orders/${id}`, { status: newStatus }, config);
            fetchData(); 
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Payment Verified!', showConfirmButton: false, timer: 2000 });
        } catch (err) {
            Swal.fire('Error', 'Could not verify payment.', 'error');
        }
    };

    const deleteOrder = async (id) => {
        if ((await Swal.fire({ title: 'Delete Record?', icon: 'warning', showCancelButton: true })).isConfirmed) {
            try {
                await axios.delete(`${apiBase}/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchData();
            } catch (err) { console.error(err); }
        }
    };

    const resetForm = () => {
        setNewProd({ name: '', brand: '', mrp: '', price: '', category: 'Gaming', description: '' });
        setSelectedFiles([]); 
        setPreviews([]); // Clear previews
        setIsEditing(null); 
        setShowAddForm(false);
    };

    const startEdit = (lp) => {
        setNewProd({ name: lp.name, brand: lp.brand, mrp: lp.mrp || '', price: lp.price, category: lp.category || 'Gaming', description: lp.description });
        setIsEditing(lp._id); setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const markAsFixed = async (id) => {
        try {
            await axios.put(`${apiBase}/api/services/${id}`, { status: 'Fixed ✅' }, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Marked Fixed', showConfirmButton: false, timer: 2000 });
        } catch (err) { console.error(err); }
    };

    const readInquiry = (iq) => {
        Swal.fire({
            title: `<span style="color: #00aaff">${iq.subject}</span>`,
            html: `<div class="text-start border-top pt-3"><p><b>From:</b> ${iq.name}</p><hr><p>${iq.message}</p></div>`,
            confirmButtonColor: '#00aaff'
        });
    };

    // --- 🚀 7. UI ARCHITECTURE ---

    return (
        <div className="container-fluid px-2 px-md-4 mt-3 mt-md-4 pb-5">
            
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 bg-white p-3 p-md-4 shadow-sm rounded-4 border-start border-info border-5">
                <div className="mb-3 mb-md-0 text-center text-md-start">
                    <h2 className="fw-bold text-dark mb-0">Expert <span style={{color: '#00aaff'}}>Control Hub</span></h2>
                    <p className="text-muted mb-0 small">Admin: <span className="text-dark fw-bold">{user?.name}</span></p>
                </div>
                <div className="d-flex flex-column flex-md-row gap-3 align-items-center w-100 w-md-auto">
                    <div className="input-group flex-grow-1" style={{maxWidth: '100%'}}>
                        <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                        <input type="text" className="form-control bg-light border-0" placeholder="Search orders, stock..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline-danger px-4 rounded-pill fw-bold w-100 w-md-auto">Sign Out</button>
                </div>
            </div>

            {/* STATS OVERVIEW (Responsive Grid: 2 per row on mobile, 4 on desktop) */}
            <div className="row g-2 g-md-3 mb-4 mb-md-5 text-center text-md-start">
                <div className="col-6 col-md-3"><div className="card border-0 shadow-sm p-3 p-md-4 rounded-4 bg-primary text-white h-100"><small className="text-uppercase fw-bold opacity-75">Stock</small><h2 className="fw-bold mb-0">{laptops.length}</h2></div></div>
                <div className="col-6 col-md-3"><div className="card border-0 shadow-sm p-3 p-md-4 rounded-4 bg-success text-white h-100"><small className="text-uppercase fw-bold opacity-75">Orders</small><h2 className="fw-bold mb-0">{orders.length}</h2></div></div>
                <div className="col-6 col-md-3"><div className="card border-0 shadow-sm p-3 p-md-4 rounded-4 bg-warning text-dark h-100"><small className="text-uppercase fw-bold opacity-75">Pending</small><h2 className="fw-bold mb-0">{requests.filter(r => r.status !== 'Fixed ✅').length}</h2></div></div>
                <div className="col-6 col-md-3"><div className="card border-0 shadow-sm p-3 p-md-4 rounded-4 bg-info text-white h-100"><small className="text-uppercase fw-bold opacity-75">Leads</small><h2 className="fw-bold mb-0">{inquiries.length}</h2></div></div>
            </div>

            {/* RECENT PURCHASE REQUESTS (Card view on mobile) */}
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-4 mb-md-5 border-start border-success border-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 text-center text-md-start">
                    <h4 className="fw-bold mb-3 mb-md-0 text-dark">Sales Orders ({filteredOrders.length})</h4>
                    <button onClick={downloadOrdersPDF} className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm w-100 w-md-auto">Export Sales PDF</button>
                </div>
                
                {/* Desktop View */}
                <div className="table-responsive d-none d-md-block">
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
                                            <button onClick={() => viewOrderDetails(ord)} className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">View</button>
                                            {ord.status !== 'Verified' && <button onClick={() => updateOrderStatus(ord._id, 'Verified')} className="btn btn-sm btn-success rounded-pill px-3">Verify</button>}
                                            <button onClick={() => deleteOrder(ord._id)} className="btn btn-sm text-danger border-0"><i className="bi bi-trash3"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Cards */}
                <div className="d-md-none">
                    {filteredOrders.map(ord => (
                        <div key={ord._id} className="p-3 mb-2 bg-light rounded-4 border position-relative">
                            <div className="fw-bold">{ord.customerName || ord.name || "N/A"}</div>
                            <div className="small text-muted mb-2">{ord.productName}</div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-success fw-bold">₹{ord.amount?.toLocaleString('en-IN')}</span>
                                <span className={`badge rounded-pill ${ord.status === 'Verified' ? 'bg-success' : 'bg-info'}`}>{ord.status}</span>
                            </div>
                            <div className="d-flex gap-2 mt-3">
                                <button onClick={() => viewOrderDetails(ord)} className="btn btn-sm btn-primary flex-grow-1 rounded-pill">Details</button>
                                {ord.status !== 'Verified' && <button onClick={() => updateOrderStatus(ord._id, 'Verified')} className="btn btn-sm btn-success flex-grow-1 rounded-pill">Verify</button>}
                                <button onClick={() => deleteOrder(ord._id)} className="btn btn-sm btn-outline-danger border-0"><i className="bi bi-trash3"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* INVENTORY EDITOR (Optimized Inputs for Touch) */}
            <div className="text-center mb-4 mb-md-5 px-2 px-md-0">
                <button className={`btn ${showAddForm ? 'btn-danger' : 'btn-info text-white'} btn-lg shadow px-5 rounded-pill fw-bold w-100 py-3 py-md-2`} onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? '✕ Close Editor' : '＋ Manage Inventory'}
                </button>
                {showAddForm && (
                    <form onSubmit={handleSaveProduct} className="card p-3 p-md-4 shadow-lg mt-3 text-start border-0 rounded-4 animate__animated animate__fadeInUp">
                        <h5 className="fw-bold mb-4 text-info text-center text-md-start">{isEditing ? 'Update Stock Item' : 'Add New Hardware'}</h5>
                        <div className="row g-2 g-md-3">
                            <div className="col-12 col-md-6"><label className="small fw-bold text-muted">Model Name</label><input type="text" className="form-control bg-light border-0 p-3 rounded-3" value={newProd.name} onChange={(e) => setNewProd({...newProd, name: e.target.value})} required /></div>
                            <div className="col-6 col-md-6"><label className="small fw-bold text-muted">Category</label><select className="form-select bg-light border-0 p-3 rounded-3" value={newProd.category} onChange={(e) => setNewProd({...newProd, category: e.target.value})}>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                            <div className="col-6 col-md-4"><label className="small fw-bold text-muted">Brand</label><input type="text" className="form-control bg-light border-0 p-3 rounded-3" value={newProd.brand} onChange={(e) => setNewProd({...newProd, brand: e.target.value})} required /></div>
                            <div className="col-12 col-md-4"><label className="small fw-bold text-success">Selling Price (₹)</label><input type="number" className="form-control bg-light border-0 p-3 fw-bold rounded-3" value={newProd.price} onChange={(e) => setNewProd({...newProd, price: e.target.value})} required /></div>
                            <div className="col-12"><textarea className="form-control bg-light border-0 p-3 rounded-3" rows="3" value={newProd.description} onChange={(e) => setNewProd({...newProd, description: e.target.value})} required placeholder="Enter specs (RAM, Storage, Graphics...)" /></div>
                            
                            {/* --- 📸 CUSTOMIZABLE PHOTO GALLERY (Responsive Swiper) --- */}
                            <div className="col-12 mt-3">
                                <label className="small fw-bold text-muted d-block mb-2">Product Gallery (Photo 1 = Main Thumbnail)</label>
                                <div className="d-flex flex-wrap gap-2 gap-md-3 p-2 p-md-3 border rounded-4 bg-light shadow-inner overflow-auto">
                                    {/* Add Button */}
                                    <label style={{ width: '90px', height: '90px', cursor: 'pointer', border: '2px dashed #00aaff', borderRadius: '15px' }} className="d-flex flex-column align-items-center justify-content-center text-info bg-white shadow-sm flex-shrink-0">
                                        <i className="bi bi-plus-lg fs-3"></i>
                                        <span style={{ fontSize: '9px' }} className="fw-bold">ADD PHOTO</span>
                                        <input type="file" className="d-none" multiple accept="image/*" onChange={handleImageChange} />
                                    </label>

                                    {/* Numbered Previews */}
                                    {previews.map((url, index) => (
                                        <div key={index} className="position-relative animate__animated animate__zoomIn flex-shrink-0" style={{width: '90px', height: '90px'}}>
                                            <img 
                                                src={url} 
                                                alt="preview" 
                                                style={{ 
                                                    width: '100%', height: '100%', 
                                                    objectFit: 'cover', borderRadius: '15px',
                                                    border: index === 0 ? '3px solid #00aaff' : '1px solid #ddd' 
                                                }} 
                                            />
                                            <span className="position-absolute top-0 start-0 badge rounded-circle bg-info shadow-sm d-flex align-items-center justify-content-center" style={{ transform: 'translate(-30%, -30%)', width: '22px', height: '22px', fontSize: '11px' }}>
                                                {index + 1}
                                            </span>
                                            <button 
                                                type="button" 
                                                onClick={() => removeImage(index)} 
                                                className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border-0 shadow-sm p-1"
                                            >
                                                <i className="bi bi-x fs-6"></i>
                                            </button>
                                            {index === 0 && (
                                                <span className="position-absolute bottom-0 start-50 translate-middle-x badge bg-info w-75 mb-1" style={{ fontSize: '8px', letterSpacing: '0.5px' }}>PRIMARY</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <small className="text-muted mt-2 d-block small">
                                    <i className="bi bi-info-circle me-1"></i> Order is preserved during upload.
                                </small>
                            </div>

                            <button type="submit" className="btn btn-info text-white mt-4 py-3 rounded-pill fw-bold shadow">Save Changes to Cloud</button>
                        </div>
                    </form>
                )}
            </div>

            {/* SERVICE TICKETS (Card view on mobile) */}
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-4 mb-md-5 border-start border-warning border-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 text-center text-md-start">
                    <h4 className="fw-bold mb-3 mb-md-0 text-dark">Repair Tickets ({filteredRequests.length})</h4>
                    <button onClick={downloadRepairsPDF} className="btn btn-sm btn-dark rounded-pill px-3 fw-bold shadow-sm w-100 w-md-auto">Export Repairs PDF</button>
                </div>
                
                <div className="table-responsive d-none d-md-block">
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
                                        <div className="d-flex gap-2">
                                            {req.status !== 'Fixed ✅' && <button onClick={() => markAsFixed(req._id)} className="btn btn-sm btn-success px-3 fw-bold rounded-pill">Complete</button>}
                                            <button onClick={() => deleteServiceRequest(req._id)} className="btn btn-sm btn-outline-danger border-0"><i className="bi bi-trash3"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Cards */}
                <div className="d-md-none">
                    {filteredRequests.map(req => (
                        <div key={req._id} className="p-3 mb-2 bg-white rounded-4 border-start border-warning border-4 shadow-sm">
                            <div className="fw-bold">{req.device}</div>
                            <div className="small text-muted mb-2">{req.issue}</div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small fw-bold text-info">{req.contact || req.phone}</span>
                                <span className={`badge rounded-pill ${req.status === 'Fixed ✅' ? 'bg-success' : 'bg-warning text-dark'}`}>{req.status}</span>
                            </div>
                            <div className="mt-3 d-flex gap-2">
                                {req.status !== 'Fixed ✅' && <button onClick={() => markAsFixed(req._id)} className="btn btn-sm btn-success flex-grow-1 rounded-pill fw-bold">Mark Fixed</button>}
                                <button onClick={() => deleteServiceRequest(req._id)} className="btn btn-sm btn-outline-danger rounded-pill px-3"><i className="bi bi-trash3"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ACTIVE INVENTORY (Mobile-Friendly List) */}
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-4 mb-md-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 text-center text-md-start">
                    <h4 className="fw-bold mb-3 mb-md-0 text-dark">Live Stock Inventory</h4>
                    <button onClick={downloadInventoryPDF} className="btn btn-sm btn-outline-info rounded-pill px-3 fw-bold w-100 w-md-auto">Inventory PDF</button>
                </div>
                
                <div className="row g-2 g-md-3">
                    {filteredLaptops.map(lp => (
                        <div key={lp._id} className="col-12 col-md-6 col-lg-4">
                            <div className="p-3 bg-white rounded-4 border shadow-sm d-flex justify-content-between align-items-center hover-lift transition-all">
                                <div className="text-truncate" style={{maxWidth: '70%'}}>
                                    <div className="fw-bold text-dark text-truncate small">{lp.name}</div>
                                    <div className="text-success fw-bold">₹{lp.price.toLocaleString('en-IN')}</div>
                                    <span className="badge bg-light text-muted fw-normal" style={{fontSize: '10px'}}>{lp.category}</span>
                                </div>
                                <div className="d-flex gap-1">
                                    <button onClick={() => startEdit(lp)} className="btn btn-sm btn-outline-info border-0 rounded-circle"><i className="bi bi-pencil"></i></button>
                                    <button onClick={() => deleteLaptop(lp._id)} className="btn btn-sm btn-outline-danger border-0 rounded-circle"><i className="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CUSTOMER INQUIRIES (Compact Mobile List) */}
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 border-start border-info border-5">
                <h4 className="fw-bold mb-3 text-info text-center text-md-start">Customer Leads ({filteredInquiries.length})</h4>
                <div className="list-group list-group-flush">
                    {filteredInquiries.map(iq => (
                        <div key={iq._id} className="list-group-item px-0 bg-transparent border-bottom mb-2 pb-2">
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="text-truncate pe-2">
                                    <div className="fw-bold small text-truncate">{iq.name}</div>
                                    <div className="text-info fw-bold" style={{fontSize: '11px'}}>{iq.subject}</div>
                                    <div className="extra-small text-muted">{new Date(iq.date).toLocaleDateString()}</div>
                                </div>
                                <div className="d-flex gap-2 flex-shrink-0">
                                    <button onClick={() => readInquiry(iq)} className="btn btn-sm btn-light border rounded-pill fw-bold">Read</button>
                                    <button onClick={() => deleteInquiry(iq._id)} className="btn btn-sm text-danger border-0"><i className="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER */}
            <div className="text-center mt-5 opacity-25">
                <p className="extra-small mb-0 text-uppercase tracking-widest">Project BCSP-064 | Expert Computers © 2026</p>
            </div>

            {/* CUSTOM MOBILE CSS */}
            <style>{`
                .extra-small { font-size: 10px; }
                .hover-lift:hover { transform: translateY(-3px); }
                input, select, textarea { font-size: 16px !important; } /* Prevents iOS auto-zoom */
                @media (max-width: 768px) {
                    .container-fluid { padding-bottom: 80px; }
                    .card { border-radius: 20px !important; }
                    h4 { font-size: 1.1rem; }
                    h2 { font-size: 1.4rem; }
                    .btn-lg { border-radius: 15px !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;