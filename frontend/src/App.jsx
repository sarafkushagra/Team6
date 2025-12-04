import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VolunteerFeed from './pages/VolunteerFeed';
import DonorDashboard from './pages/DonorDashboard';
import PickupScreen from './pages/PickupScreen';
import AdminDashboard from './pages/AdminDashboard';
import ActiveDonationsMap from './pages/AdminDash/ActiveDonationMap';
import NGOApproval from './pages/AdminDash/NGOApproval';
import UserManagement from './pages/AdminDash/UserManagement';
import Reports from './pages/AdminDash/Reports';
import DonationDetails from './pages/DonationDetails';

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
          <Route path="admin/active-map" element={<ActiveDonationsMap />} />
          <Route path="admin/ngo-approval" element={<NGOApproval />} />
          <Route path="admin/user-management" element={<UserManagement />} />
          <Route path="admin/reports" element={<Reports />} />
          <Route path="donation/:id" element={<DonationDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
