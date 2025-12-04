import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VolunteerRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'volunteer',
    ngoName: ''
  });
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          type: 'Point',
          coordinates: [pos.coords.longitude, pos.coords.latitude]
        });
      },
      (err) => {
        console.error(err);
        alert('Location access denied');
        setLocation({
          type: 'Point',
          coordinates: [77.2, 28.6] // default Delhi
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert('Please get location');
      return;
    }
    try {
      // First create NGO
      const ngoRes = await fetch('http://localhost:5000/api/ngos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.ngoName,
          contact: form.phone,
          email: form.email,
          location
        })
      });
      const ngo = await ngoRes.json();

      // Then register user
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, location, ngoId: ngo._id })
      });
      if (res.ok) {
        alert('Registration request sent. Waiting for admin approval.');
        navigate('/');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Join as Volunteer</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            type="text"
            required
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
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
          <input
            name="phone"
            type="text"
            required
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="ngoName"
            type="text"
            required
            placeholder="NGO Name"
            value={form.ngoName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="button"
            onClick={getLocation}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Get Location
          </button>
          {location && <p>Location set</p>}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerRegister;