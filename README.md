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

- **Reactive Backgrounds:** A full-screen HTML5 Canvas particle system that swirls and flows in response to your cursor.
- **Time-Aware Gradients:** UI backgrounds transition naturally from sunrise gold to midnight obsidian based on the target city's local time.

### 🔐 Secure User Management

- **JWT Authentication:** Robust login/registration system using JSON Web Tokens and Bcrypt password hashing.
- **Persistent Sessions:** Stay logged in across refreshes using localized token management.

### 📊 Professional Data Visualization

- **Smart Favorites:** A personalized "Pinned Cities" sidebar allows users to save and track multiple global locations simultaneously.
- **Interactive Forecasts:** High-contrast Area Charts powered by Recharts, visualizing 5-day temperature trends at a glance.

### 📱 Premium UI/UX

- **Responsive Grid:** A fluid 3-column layout that elegantly collapses into a mobile-friendly "Stack" view.
- **Apple-Style Aesthetics:** Large border-radii, heavy background blurs, and bold, tracking-heavy typography.

---

## 🛠️ The MyERN Stack

| Layer        | Technology                                 |
| ------------ | ------------------------------------------ |
| **Frontend** | React 19, Tailwind CSS v3, Axios, Recharts |
| **Backend**  | Node.js, Express.js                        |
| **Database** | MySQL (XAMPP/Local Environment)            |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js           |
| **API**      | OpenWeatherMap API                         |

---

## 📂 Project Structure

```text
weather-system
├──backend                  # The server-side environment (Node.js/Express) that handles data and security.
│   ├──package-lock.json    # Locks dependency versions to ensure the server runs the same on every machine.
│   ├──package.json         # Lists backend dependencies (like Express/Axios) and startup scripts.
│   └──server.js            # The entry point that connects to the database and provides weather/auth APIs.
├──frontend                 # The client-side React application that users interact with in the browser.
│   ├──public               # Static assets (images, icons) that are served directly without being processed.
│   │   ├──vite.svg         # The default build tool icon.
│   │   └──weather-sun...   # A custom graphic asset used for the weather dashboard branding.
│   ├──src                  # The primary source code folder where all React logic and styling live.
│   │   ├──components       # Reusable UI building blocks used to construct the pages.
│   │   │   ├──auth         # Components specifically for Login and Registration (e.g., AuthCard).
│   │   │   ├──backgrounds  # Specialized logic for the animated mesh and atmospheric weather effects.
│   │   │   ├──dashboard    # Complex parts of the main view (Sidebars, Search bars, and Charts).
│   │   │   └──ui           # Standardized, low-level design elements (buttons, inputs) from shadcn/ui.
│   │   ├──hooks            # Custom React functions that handle repetitive logic (like mobile detection).
│   │   ├──lib              # Utility helper files (like CSS class merging tools).
│   │   ├──pages            # The "Full Views" that combine components into a single screen (Dashboard, Auth).
│   │   ├──App.css          # Local styles specifically for the main App component.
│   │   ├──App.tsx          # The Master Controller that manages routing and user authentication state.
│   │   ├──index.css        # Global styles, Tailwind directives, and our custom Weather Theme variables.
│   │   ├──main.tsx         # The technical bridge that renders the React App into the browser's DOM.
│   │   └──vite-env.d.ts    # TypeScript definitions to ensure the environment variables are recognized.
│   ├──components.json      # Configuration file for the shadcn/ui library components.
│   ├──eslint.config.js     # Rules for keeping your code clean and catching syntax errors.
│   ├──index.html           # The single HTML file where your entire React app is "injected."
│   ├──package.json         # Lists frontend tools (React, Tailwind, Vite) and build commands.
│   ├──postcss.config.js    # A tool that transforms your CSS into a format browsers understand.
│   ├──tailwind.config.ts   # The master design settings for colors, fonts, and custom animations.
│   ├──tsconfig.json        # Settings for the TypeScript compiler to ensure code type-safety.
│   ├──vite.config.js       # The configuration for the build tool that runs your local development server.
│   └──.gitignore           # Tells Git which files (like node_modules) should NOT be uploaded to GitHub.
└──README.md                # The main documentation file explaining how to install and run the project.
```

---

## 🚀 Future Roadmap

- [ ] **Weather Map Layers:** Integration of precipitation and wind-speed maps.
- [ ] **Voice Search:** Hands-free weather queries.
- [ ] **Push Notifications:** Alert users for severe weather changes in their pinned cities.

---

### **Contact & Support**

_Developed with ❤️ as a modern take on environmental data visualization._

---
