import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mock login for demo
    if (form.email === 'donor@example.com' && form.password === 'donor123') {
      localStorage.setItem('token', 'mock-donor-token');
      navigate('/donor');
    } else if (form.email === 'volunteer@example.com' && form.password === 'volunteer123') {
      localStorage.setItem('token', 'mock-volunteer-token');
      navigate('/volunteer');
    } else if (form.email === 'admin@example.com' && form.password === 'admin123') {
      localStorage.setItem('token', 'mock-admin-token');
      navigate('/admin');
    } else {
      alert('Invalid credentials. Use demo accounts: donor@example.com/donor123, volunteer@example.com/volunteer123, admin@example.com/admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
        <p className="text-center">
          Don't have account? <a href="/donate" className="text-blue-500">Register as Donor</a> or <a href="/volunteer" className="text-blue-500">Join as Volunteer</a>
        </p>
      </div>
    </div>
  );
};

export default Login;