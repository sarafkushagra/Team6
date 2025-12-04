import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VolunteerFeed from './pages/VolunteerFeed';
import DonorDashboard from './pages/DonorDashboard';
import PickupScreen from './pages/PickupScreen';
import ActiveTripPage from './pages/ActiveTripPage';

import HomeMapListPage from './pages/HomeMapListPage';
import OTPPickupPage from './pages/OTPPickupPage';
import OTPVerify from './pages/OTPVerify';
import DistributionPage from './pages/DistributionPage';
import DonationDetailPage from './pages/DonationDetailPage';
import DonationPosted from './pages/DonationPosted';
import CreateDonation from './pages/CreateDonation';
import AuthOnboardPage from './pages/AuthOnboardPage';
import AdminDashboard from './pages/AdminDashboard';
import DonationDetails from './pages/DonationDetails';
import ClaimModal from './pages/ClaimModal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="volunteer" element={<VolunteerFeed />} />
          <Route path="donor" element={<DonorDashboard />} />
          <Route path="pickup/:id" element={<PickupScreen />} />
          <Route path="active-trip" element={<ActiveTripPage />} />

          <Route path="map" element={<HomeMapListPage />} />
          <Route path="otp-pickup" element={<OTPPickupPage />} />
          <Route path="otp-verify" element={<OTPVerify />} />
          <Route path="distribution" element={<DistributionPage />} />
          <Route path="donation/:id" element={<DonationDetailPage />} />
          <Route path="donor/create" element={<CreateDonation />} />
          <Route path="donor/posted" element={<DonationPosted />} />
          <Route path="donation-details" element={<DonationDetails />} />
          <Route path="claim/:id" element={<ClaimModal />} />
          <Route path="auth" element={<AuthOnboardPage />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
