# 🍱 Food Donation & Pickup Coordination System  
*A hyper-local, real-time platform connecting surplus food to people who need it.*

---

## 📌 1. Background
Every day, tons of edible cooked food from restaurants, events, and households go to waste, while millions of people sleep hungry.  
The issue is not food availability — it’s the **broken logistics system**.

- Donors don’t know whom to call  
- NGOs can’t track extra food in real-time  
- Volunteers lack quick access to pickup locations  

This project builds a **community-driven, real-time bridge** between *food donors → volunteers → NGOs → hungry people*.

---

## 🎯 2. Challenge / Problem Statement
Create a **fast, reliable, and location-aware platform** that:

- Shows real-time surplus food listings  
- Notifies nearby volunteers within seconds  
- Locks the donation once a volunteer claims it  
- Ensures food reaches beneficiaries **before it spoils**  
- Uses OTP verification for safe & trusted handover  

Speed + Accuracy = Key.

---

## 👥 3. User Roles & Flow

---

### 🟩 A. Donor (Restaurant / Caterer / Household)

#### **Flow**
1. Post donation (Food Type, Quantity, Best-Before Time, Photo)
2. Auto-detect or set pickup location
3. Publish donation (visible only to volunteers within radius)
4. Wait for volunteer claim
5. Share OTP at pickup to verify handover
6. Track status: **Claimed → Picked Up → Distributed**

---

### 🟦 B. Volunteer / NGO

#### **Flow**
1. Receive real-time alerts for nearby donations  
2. Claim listing (first-come-first-serve lock)  
3. Navigate using integrated maps  
4. Reach donor and verify using OTP  
5. Upload proof of pickup & distribution  
6. Mark donation as **Distributed**

---

### 🛠️ C. Admin

- Verify NGOs/Volunteers  
- Handle reports (spoiled food, no-shows)  
- Monitor impact metrics (e.g., *500 kg food saved*)  
- View map of active & completed donations  

---

## ⚙️ 4. Core Requirements

---

### 🟩 Functional Requirements

#### ⏱️ 1. Time-Sensitive Listings  
- Countdown timer based on food perishability  
- Auto-expire listings

#### 📍 2. Geo-Fencing  
- Only volunteers within 3–5 km get notifications  
- Efficient routing

#### 🚀 3. Claiming System  
- First volunteer who claims → listing locked  
- Prevents multiple pickups

#### 🔐 4. OTP Verification  
- Donor gives OTP to volunteer  
- Ensures safe & valid handover

#### 🏆 5. Impact Dashboard  
- Meals saved (1kg = ~4 meals)  
- Badges for donors  
- Performance metrics

---

### 🟦 Non-Functional Requirements

- Mobile-first UI (volunteers & donors work on-the-go)  
- Less than 30 seconds to post a donation  
- High location accuracy  
- Lightweight + responsive  
- Scalable and secure backend  

---

## 🧱 5. Suggested Tech Stack

### 🌐 Frontend
- React Native / Flutter (Mobile-first recommended)  
- React.js for Admin Dashboard  

### ⚙️ Backend
- Firebase (Firestore, Auth, FCM)  
OR  
- Node.js + Express + MongoDB  

### 🗺️ Maps / Routing
- Google Maps API  
- Mapbox  
- GeoHash queries  

### 🖼️ Storage
- Firebase Storage  
- Cloudinary  
- AWS S3  

### 🔔 Notifications
- Firebase Cloud Messaging (FCM)  
- OneSignal  

---

## 🚀 6. Hackathon Deliverables

✔ Donor Flow  
✔ Volunteer Flow  
✔ OTP Verification  
✔ Countdown Logic  
✔ Distribution Proof Upload  
✔ Admin Dashboard  
✔ Impact Calculation (meals saved)

---

## 🧪 Safety Protocols

- Donor food quality checklist  
- Mandatory photo upload  
- Volunteer legitimacy verification  
- No-show reporting  
- Spoiled-food reporting  
- Admin review workflow  

---

## 🏆 7. Judging Criteria (Given)

| Category                           | Weight |
|-----------------------------------|--------|
| Social Impact & Utility           | 25%    |
| Logistics Efficiency              | 25%    |
| User Experience                   | 20%    |
| Safety Mechanisms                 | 15%    |
| Completeness                      | 15%    |

---

## 🌍 8. Final Outcome
A real-time, community-driven logistics system that turns **potential food waste into nutritious meals**, dramatically reducing hunger and environmental impact.

**This platform ensures that no edible food is wasted — ever.**

---

## 📝 Want More?
If you need:
- Architecture Diagram  
- Database Schema  
- API Documentation  
- ER Diagram  
- Pitch Deck (10 slides)  
- UI/UX Wireframes  
- Contribution Guidelines  

Ask me — I can generate them in minutes!

---
