import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('${apiBase}/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            alert(`Welcome back, ${res.data.user.name}!`);
            
            if (res.data.user.role === 'Admin') navigate('/admin');
            else navigate('/sales');
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="container mt-5 py-5">
            <div className="row justify-content-center">
                <div className="col-md-5 card shadow-lg border-0 rounded-4 p-5">
                    <h2 className="text-center fw-bold text-primary mb-4">Expert Computers Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="fw-bold small">Email</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="fw-bold small">Password</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button className="btn btn-primary w-100 fw-bold py-3 shadow">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;