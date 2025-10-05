# 5G Walks - Walking Route Management Application

A modern React-based web application for creating, saving, and sharing walking routes with an elegant, motion-inspired interface.

## 🚀 Features

- **Create Routes**: Design custom walking routes with start and end locations
- **Save Routes**: Save your favorite routes for easy access
- **Community Sharing**: Explore and save routes shared by other users
- **MapQuest Integration**: Interactive maps and route visualization
- **Smooth Animations**: Motion.dev-inspired animations using Framer Motion
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **React 18+** with functional components and hooks
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing
- **shadcn/ui** - Professional UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API requests
- **MapQuest API** - Map rendering and route generation

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Copy `.env.example` to `.env` and add your API keys:
   ```bash
   cp .env.example .env
   ```
   
   Update the following variables in `.env`:
   ```
   VITE_BACKEND_URL=http://localhost:3000/api
   VITE_MAPQUEST_API_KEY=your_mapquest_api_key_here
   ```

3. **Get a MapQuest API Key**
   - Go to [MapQuest Developer Portal](https://developer.mapquest.com/)
   - Sign up for a free account
   - Create a new application to get your API key
   - Add the API key to your `.env` file

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
5g-walks/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Footer.jsx       # Footer component
│   │   ├── RouteCard.jsx    # Route display card
│   │   ├── MapView.jsx      # Map integration
│   │   ├── RouteForm.jsx    # Route creation form
│   │   └── MotionPathHero.jsx # Animated hero section
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── CreateRoute.jsx  # Route creation page
│   │   ├── SavedRoutes.jsx  # User's saved routes
│   │   ├── SharedRoutes.jsx # Community routes
│   │   └── RouteDetail.jsx  # Individual route view
│   ├── styles/
│   │   ├── Home.css
│   │   ├── Header.css
│   │   ├── Footer.css
│   │   ├── RouteCard.css
│   │   └── SharedRoutes.css
│   ├── lib/
│   │   ├── api.js           # API configuration
│   │   └── utils.js         # Utility functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Features & Pages

### Home Page
- Animated hero section with motion path animation
- Quick route search functionality
- Display of popular/suggested routes
- Smooth page transitions

### Create Route
- Interactive form for route details
- Real-time map preview
- MapQuest integration for route generation
- Save functionality

### Saved Routes
- Display user's saved routes
- Filter and search capabilities
- Quick access to route details

### Community Routes (Shared)
- Browse routes shared by other users
- Search and filter functionality
- Save community routes to your collection

### Route Detail
- Full map view with route visualization
- Detailed route information (distance, duration, POIs)
- Share and favorite options
- Points of interest along the route

## 🎨 Animation Features

The app uses Framer Motion for smooth, elegant animations:

- **Page Transitions**: Fade and slide effects when navigating
- **Motion Path Hero**: Animated walking route on home page
- **Card Hover Effects**: Smooth hover animations on route cards
- **Loading States**: Animated loading indicators
- **Micro-interactions**: Button press feedback and icon animations

## 🔌 API Integration

### Backend API

The app expects a REST API with the following endpoints:

```
GET    /api/routes           - Get all routes
GET    /api/routes/:id       - Get specific route
POST   /api/routes           - Create new route
PUT    /api/routes/:id       - Update route
DELETE /api/routes/:id       - Delete route
GET    /api/routes/saved     - Get user's saved routes
GET    /api/routes/shared    - Get community routes
POST   /api/routes/:id/save  - Save a route
POST   /api/routes/:id/share - Share a route
```

### MapQuest API

The app uses MapQuest API for:
- Route directions and navigation
- Geocoding addresses
- Place search
- Map rendering

## 📝 Notes

- The app currently uses mock data for development
- MapView component has a placeholder - integrate actual MapQuest rendering
- Update the backend URL in `.env` to point to your API server
- ESLint warnings for motion imports are expected and can be ignored

## 📄 License

This project is licensed under the MIT License.
