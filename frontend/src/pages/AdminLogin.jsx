import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mock admin login
    if (form.email === 'admin@example.com' && form.password === 'admin') {
      alert('Logged in as admin!');
      localStorage.setItem('token', 'mock-admin-token');
      navigate('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Admin Login</h2>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 mb-4 border" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 mb-4 border" />
        <button type="submit" className="w-full bg-green-500 text-white p-2">Login</button>
      </form>
    </div>
  );
}