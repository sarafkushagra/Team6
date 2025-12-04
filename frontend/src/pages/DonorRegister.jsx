import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DonorRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => alert('Location access denied')
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert('Please get location');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: 'donor',
          phone: form.phone,
          location
        })
      });
      const data = await res.json();

      if (res.ok) {
        alert('Registered successfully as donor!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/donor');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error registering');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Donor Registration</h2>
        <input name="name" placeholder="Name" onChange={handleChange} required className="w-full p-2 mb-4 border" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 mb-4 border" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 mb-4 border" />
        <input name="phone" placeholder="Phone" onChange={handleChange} required className="w-full p-2 mb-4 border" />
        <button type="button" onClick={getLocation} className="w-full bg-blue-500 text-white p-2 mb-4">Get Location</button>
        {location && <p>Location: {location.lat}, {location.lng}</p>}
        <button type="submit" className="w-full bg-green-500 text-white p-2">Register</button>
      </form>
    </div>
  );
}