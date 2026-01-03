
# 🌤️ SkyCast OS: Atmospheric Weather Portal

**SkyCast OS** is a premium, full-stack weather dashboard that transforms raw meteorological data into an immersive "Atmospheric Portal." Unlike traditional weather apps, SkyCast leverages interactive background simulations and Glassmorphism design to reflect the environment of the searched location in real-time.

---

## 📖 Project Overview

SkyCast OS was built to bridge the gap between utility and art. It serves as a comprehensive dashboard where users can manage their personal library of locations while experiencing a UI that shifts its "mood" based on global weather conditions.

### **The Problem**

Most weather applications are static, cluttered with ads, and fail to provide a sensory experience of the location being searched.

### **The Solution**

An "Atmospheric Portal" that uses:

1. **Dynamic Theming:** The entire UI color palette and background animations shift based on live weather data (Clear, Rain, Storm, Snow).
2. **Cursor Interactivity:** A custom particle system that reacts to mouse movements, simulating wind flow and environmental depth.
3. **Glassmorphism Architecture:** High-end translucent layers that maintain readability without obscuring the beautiful environmental simulations.

---

## ✨ Key Highlights & Features

### 🌪️ Immersive Experience

* **Reactive Backgrounds:** A full-screen HTML5 Canvas particle system that swirls and flows in response to your cursor.
* **Time-Aware Gradients:** UI backgrounds transition naturally from sunrise gold to midnight obsidian based on the target city's local time.

### 🔐 Secure User Management

* **JWT Authentication:** Robust login/registration system using JSON Web Tokens and Bcrypt password hashing.
* **Persistent Sessions:** Stay logged in across refreshes using localized token management.

### 📊 Professional Data Visualization

* **Smart Favorites:** A personalized "Pinned Cities" sidebar allows users to save and track multiple global locations simultaneously.
* **Interactive Forecasts:** High-contrast Area Charts powered by Recharts, visualizing 5-day temperature trends at a glance.

### 📱 Premium UI/UX

* **Responsive Grid:** A fluid 3-column layout that elegantly collapses into a mobile-friendly "Stack" view.
* **Apple-Style Aesthetics:** Large border-radii, heavy background blurs, and bold, tracking-heavy typography.

---

## 🛠️ The MyERN Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, Tailwind CSS v3, Axios, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (XAMPP/Local Environment) |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js |
| **API** | OpenWeatherMap API |

---

## 📂 Project Structure

```text
skycast-os/
├── backend/                # Express API & Security Logic
│   ├── routes/             # Auth & Weather Endpoints
│   ├── middleware/         # JWT Verification
│   └── server.js           # Server Entry Point
├── frontend/               # React + Vite UI
│   ├── src/
│   │   ├── components/     # InteractiveBackground, WeatherHero, GlassSidebar
│   │   ├── App.jsx         # Global State & Router logic
│   │   └── index.css       # Tailwind Directives & Animations
└── database/               # SQL Schemas for Users & Favorites

```

---

## 🚀 Future Roadmap

* [ ] **Weather Map Layers:** Integration of precipitation and wind-speed maps.
* [ ] **Voice Search:** Hands-free weather queries.
* [ ] **Push Notifications:** Alert users for severe weather changes in their pinned cities.

---

### **Contact & Support**

*Developed with ❤️ as a modern take on environmental data visualization.*

---
