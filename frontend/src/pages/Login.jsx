import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEMO_USERS = {
  'donor@example.com': {
    password: 'donor123',
    token: 'mock-donor-token',
    redirect: '/donor',
  },
  'volunteer@example.com': {
    password: 'volunteer123',
    token: 'mock-volunteer-token',
    redirect: '/volunteer',
  },
  'admin@example.com': {
    password: 'admin123',
    token: 'mock-admin-token',
    redirect: '/admin',
  },
};

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const email = form.email.trim().toLowerCase();
    const user = DEMO_USERS[email];

    setTimeout(() => {
      if (user && user.password === form.password) {
        localStorage.setItem('token', user.token);
        navigate(user.redirect);
      } else {
        setError('Invalid email or password. Try the demo accounts below.');
      }
      setLoading(false);
    }, 400); // small delay for UX
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-800">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition 
              ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/donate" className="text-blue-500 hover:underline">Register as Donor</a>{' '}
          or{' '}
          <a href="/volunteer" className="text-blue-500 hover:underline">Join as Volunteer</a>
        </div>

        <div className="pt-4 text-xs text-gray-500">
          <p className="font-semibold">Demo Accounts:</p>
          <p>Donor → donor@example.com / donor123</p>
          <p>Volunteer → volunteer@example.com / volunteer123</p>
          <p>Admin → admin@example.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
