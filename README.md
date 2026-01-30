# 🌤️ SkyCast OS: Atmospheric Weather Portal

**SkyCast OS** is a premium, full-stack weather dashboard that transforms raw meteorological data into an immersive "Atmospheric Portal." Built with a cloud-native architecture, SkyCast leverages interactive background simulations and Glassmorphism design to reflect the environment of the searched location in real-time.

---

## 📖 Project Overview

SkyCast OS bridges the gap between utility and art. It serves as a comprehensive dashboard where users manage their personal library of locations while experiencing a UI that shifts its "mood" based on global weather conditions.

### **The Architecture**
The system is distributed across three specialized cloud environments to ensure high availability and performance:
1. **Frontend:** Hosted on **Vercel** for lightning-fast edge delivery.
2. **Backend:** Powered by a **Node.js** instance on **Render**.
3. **Database:** High-performance **MySQL** hosted via **Clever Cloud**.

---

## ✨ Key Highlights & Features

### 🌪️ Immersive Experience
- **Reactive Backgrounds:** A full-screen HTML5 Canvas particle system that flows in response to cursor movement.
- **Time-Aware Gradients:** UI palettes transition from sunrise gold to midnight obsidian based on the target city's local time.
- **Live Sync Indicator:** A real-time fetching state that ensures users know exactly when data is being refreshed.

### 🔐 Secure User Management
- **JWT Authentication:** Robust login/registration system using JSON Web Tokens and Bcrypt password hashing.
- **Persistent Sessions:** Secure token management in `localStorage` to keep users logged in across sessions.

### 📊 Professional Data Visualization
- **Smart Favorites:** A personalized "Pinned Cities" sidebar allowing users to track multiple global locations.
- **Trend Analysis:** High-contrast Area Charts powered by **Recharts**, visualizing 5-day temperature fluctuations.

---

## 🛠️ The Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS v3, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (Relational Schema) |
| **Infrastructure** | Vercel (Frontend), Render (Backend), Clever Cloud (DB) |
| **Security** | JWT, Bcrypt.js, SSL/TLS Encryption |
| **API** | OpenWeatherMap API |

---

## 📂 Project Structure

```text
weather-system
├── backend                # Express server handling Auth, Weather Caching, and Favorites
│   ├── server.js          # Entry point with MySQL Connection Pooling & SSL support
│   └── .env               # (Ignored) Cloud DB credentials and JWT Secrets
├── frontend               # React/Vite application
│   ├── src
│   │   ├── components
│   │   │   ├── auth       # Registration & Login logic
│   │   │   ├── backgrounds# Particle system & atmospheric shaders
│   │   │   ├── dashboard  # Sidebars, Search, and Recharts components
│   │   │   └── ui         # Shadcn/ui core components
│   │   ├── pages          # Main views: Dashboard and Auth
│   │   └── App.tsx        # Authentication state & Route guarding
│   └── tailwind.config.ts # Custom Glassmorphism & Animation themes
└── README.md

```

---

## ⚙️ Environment Configuration

To run this project locally, create a `.env` file in both directories:

**Backend `.env**`

```env
PORT=5000
DB_HOST=your_clever_cloud_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_db_name
WEATHER_API_KEY=your_openweather_key
JWT_SECRET=your_secret_key

```

**Frontend `.env**`

```env
VITE_API_BASE_URL=[https://your-backend-on-render.com](https://your-backend-on-render.com)

```

---

## 🚀 Future Roadmap

* [ ] **Weather Map Layers:** Integration of precipitation and wind-speed maps.
* [ ] **Multi-Unit Support:** Real-time toggling between Metric and Imperial systems.
* [ ] **Push Notifications:** Alert users for severe weather changes in pinned cities.

---

### **Contact & Support**

*Developed with ❤️ as a modern take on environmental data visualization.*
