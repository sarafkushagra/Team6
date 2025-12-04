import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VolunteerFeed from './pages/VolunteerFeed';
import DonorDashboard from './pages/DonorDashboard';
import PickupScreen from './pages/PickupScreen';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="volunteer" element={<VolunteerFeed />} />
          <Route path="donor" element={<DonorDashboard />} />
          <Route path="pickup/:id" element={<PickupScreen />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
