# 🍲 FoodLink: Hyper-Local Food Rescue Platform

[![Hackathon Project](https://img.shields.io/badge/Status-Hackathon_Prototype-orange?style=for-the-badge&logo=fireBASE)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Mobile%20(Flutter%2FReact)-lightgrey?style=for-the-badge&logo=flutter)](https://flutter.dev/)
[![Server](https://img.shields.io/badge/Backend-Node.js%20%2F%20Firebase-green?style=for-the-badge&logo=node.js)]()

> **"The gap isn't a lack of food, but a lack of logistics."**

**FoodLink** is a hyper-local logistics platform designed to bridge the gap between hunger and excess food. By connecting restaurants, caterers, and households with surplus food to nearby NGOs and volunteers in real-time, we optimize the "last-mile" logistics to ensure food is consumed before it spoils.

---

## 📑 Table of Contents
- [The Challenge](#-the-challenge)
- [How It Works](#-how-it-works)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Impact & Safety](#-impact--safety)
- [Installation](#-installation)
- [Screenshots](#-screenshots)

---

## 🌍 The Challenge

Millions of tons of cooked food are wasted daily while millions go hungry. The primary hurdles are:
1.  **Lack of Awareness:** Donors don't know who to call.
2.  **Logistics:** NGOs lack resources for real-time discovery and collection.
3.  **Time Sensitivity:** Cooked food spoils quickly, requiring immediate action.

**FoodLink solves this by creating an Uber-like marketplace for food recovery.**

---

## 🔄 How It Works

The platform operates on a high-speed, geo-fenced logic:

1.  **Post:** A Donor posts details of leftover food (takes <30 seconds).
2.  **Alert:** Nearby Volunteers (within 5km) receive a push notification.
3.  **Claim:** The first Volunteer to accept "locks" the request (preventing multiple pickups).
4.  **Verify:** Volunteer arrives; Donor provides an OTP to confirm handover.
5.  **Distribute:** Volunteer navigates to the drop-off point and uploads proof of distribution.

---

## 🚀 Key Features

### 👨‍🍳 Donor (Restaurant/Caterer)
* **Rapid Listing:** Upload food details + photo in 3 clicks.
* **Smart Location:** Auto-detects pickup address via GPS.
* **Gamification:** Earn badges (e.g., "Food Hero") for milestones.

### 🚚 NGO / Volunteer
* **Geo-Fencing:** Only receive alerts for pickups within a feasible driving distance.
* **Route Optimization:** Integrated map navigation to Donor → Beneficiary.
* **Claim Locking:** First-come-first-serve logic to ensure efficiency.

### 🛡️ Admin
* **Vetting:** Verify NGO credentials.
* **Live Analytics:** Map view of active donations vs. distributed meals.
* **Quality Control:** Handle reports of spoilage or no-shows.

---

## 🛠 Tech Stack

| Component | Tech Choice |
| :--- | :--- |
| **Frontend** | Flutter / React Native (Mobile First) |
| **Backend** | Node.js (Express) / Firebase Functions |
| **Database** | Firestore (NoSQL) / MongoDB |
| **Geolocation** | Google Maps API / Mapbox SDK |
| **Notifications** | Firebase Cloud Messaging (FCM) / OneSignal |
| **Storage** | AWS S3 / Cloudinary (for food images) |

---

## 📊 Impact & Safety

### Measuring Success
We calculate impact based on the weight of food rescued:
> **Metric:** `1 kg of food ≈ 4 meals served`

### Safety Protocols
Safety is paramount when handling cooked food:
1.  **OTP Verification:** The transaction is only complete when the Volunteer inputs the 4-digit code provided by the Donor.
2.  **Freshness Disclaimer:** Donors must check a mandatory "Best Before" acknowledgment before posting.
3.  **Photo Proof:** Volunteers must upload an image of the final distribution to close the ticket.

---

## 💻 Installation

To run this project locally, follow these steps:

### Prerequisites
* Node.js & npm
* Flutter SDK (if using Flutter) or React Native CLI
* Firebase Project Setup / Google Maps API Key

### Backend Setup
```bash
git clone [https://github.com/your-username/foodlink.git](https://github.com/your-username/foodlink.git)
cd backend
npm install
# Configure .env with DB_URI and API_KEYS
npm start