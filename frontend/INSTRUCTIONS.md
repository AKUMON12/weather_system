# SkyCast OS - Build Instructions

## Overview

SkyCast OS is an immersive weather dashboard that creates an "Atmospheric Portal" experience. The UI reflects the environment through dynamic theming, interactive particle backgrounds, and glassmorphism effects.

---

## Project Structure

```
src/
├── assets/                    # Static assets (images, icons)
├── components/
│   ├── backgrounds/
│   │   └── InteractiveBackground.tsx  # Cursor-reactive particle system
│   ├── auth/
│   │   └── AuthCard.tsx              # Login/Register card with neon effects
│   ├── dashboard/
│   │   ├── SearchBar.tsx             # Glass-effect search component
│   │   ├── WeatherHero.tsx           # Main weather display with stats
│   │   ├── FavoritesSidebar.tsx      # Saved cities list
│   │   └── InsightsSidebar.tsx       # Charts and 5-day forecast
│   └── ui/                           # Shadcn UI components
├── hooks/                            # Custom React hooks
├── lib/
│   └── utils.ts                      # Utility functions
├── pages/
│   ├── Index.tsx                     # Entry point (auth/dashboard router)
│   ├── Auth.tsx                      # Authentication portal page
│   └── Dashboard.tsx                 # Main command center
├── App.tsx                           # App router
├── main.tsx                          # React entry
└── index.css                         # Design system & global styles
```

---

## Step-by-Step Build Guide

### Phase 1: Design System Setup

1. **Configure Tailwind** (`tailwind.config.ts`)

   - Add custom fonts (Outfit, Inter)
   - Define weather-specific colors (sunny, rainy, night)
   - Add neon color tokens
   - Configure animation keyframes

2. **Create CSS Variables** (`src/index.css`)
   - Define HSL color variables for theming
   - Create glass morphism utility classes
   - Add neon glow effects
   - Set up theme variations (sunny, rainy, night)

### Phase 2: Core Components

3. **Interactive Background** (`src/components/backgrounds/InteractiveBackground.tsx`)

   - Canvas-based particle system
   - Cursor interaction (particles repel from mouse)
   - Dynamic gradient based on weather condition
   - Connection lines between nearby particles

4. **Authentication Card** (`src/components/auth/AuthCard.tsx`)
   - Floating glass card design
   - Login/Register toggle
   - Neon focus rings on inputs
   - Animated logo with glow effect

### Phase 3: Dashboard Components

5. **Search Bar** (`src/components/dashboard/SearchBar.tsx`)

   - Glass-effect container
   - Location detection button
   - Loading state animation

6. **Weather Hero** (`src/components/dashboard/WeatherHero.tsx`)

   - Large temperature display
   - Dynamic weather icons
   - Favorite toggle with star animation
   - Quick stat tiles (humidity, wind, UV)

7. **Favorites Sidebar** (`src/components/dashboard/FavoritesSidebar.tsx`)

   - Vertical list of saved cities
   - Mini weather icons
   - Active state highlighting

8. **Insights Sidebar** (`src/components/dashboard/InsightsSidebar.tsx`)
   - Temperature trend area chart
   - 5-day forecast list
   - Today's summary text

### Phase 4: Page Assembly

9. **Auth Page** (`src/pages/Auth.tsx`)

   - Full-screen background
   - Centered auth card
   - Ambient light effects

10. **Dashboard Page** (`src/pages/Dashboard.tsx`)

    - Fixed header with branding
    - 3-column responsive grid
    - Search functionality
    - Favorite management

11. **Index Router** (`src/pages/Index.tsx`)
    - Auth state management
    - Route between auth/dashboard

---

## Key Features

### Interactive Background

- **Particle Physics**: Particles have velocity, position, and respond to mouse proximity
- **Dynamic Gradients**: Colors shift based on weather condition
- **Performance**: RequestAnimationFrame loop with canvas rendering

### Glassmorphism

- `backdrop-blur-xl` for frosted glass effect
- Semi-transparent backgrounds with `bg-card/60`
- Thin white borders `border-white/10`
- Layered shadows for depth

### Theming System

- CSS variables for easy theme switching
- Three main themes: sunny (amber), rainy (indigo), night (purple)
- Automatic icon color coordination

### Responsive Design

- Mobile-first approach
- 3-column grid collapses on smaller screens
- Touch support for particle interaction

---

## Future Enhancements

1. **Backend Integration**

   - Connect to weather API (OpenWeatherMap, WeatherAPI)
   - User authentication with Supabase
   - Save favorites to database

2. **Additional Features**

   - Hourly forecast view
   - Weather alerts
   - Multiple location comparison
   - Historical data charts

3. **Performance**
   - Weather data caching
   - Lazy loading for components
   - PWA support for offline access

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Design Tokens Reference

| Token            | Usage                                 |
| ---------------- | ------------------------------------- |
| `--primary`      | Main accent color (changes per theme) |
| `--neon-purple`  | Night theme glow                      |
| `--neon-amber`   | Sunny theme glow                      |
| `--neon-blue`    | Rainy theme glow                      |
| `--glass-bg`     | Glassmorphism background              |
| `--glass-border` | Glassmorphism border                  |

---

## Credits

Built with:

- React + TypeScript
- Tailwind CSS
- Shadcn/UI
- Recharts
- Lucide Icons
