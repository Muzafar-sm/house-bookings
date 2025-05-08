# House-Booking

A full-stack house booking application built with React, Node.js, Express, and MongoDB. This application allows users to browse available properties, make bookings, and manage their listings.

## Features

- User authentication (register, login, profile management)
- Property listings with search and filter functionality
- Interactive map using OpenStreetMap and Leaflet
- Booking system for properties
- Admin dashboard for property management
- Responsive design for all devices

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Leaflet for maps integration
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Mongoose for database modeling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/House-Booking.git
cd House-Booking
```

Set up environment variables
Create a .env file in the root directory with the following variables:

plaintext
```bash
NODE_ENV=developmentPORT=5000MONGODB_URI=your_mongodb_connection_stringJWT_SECRET=your_jwt_secret

```
Create a .env file in the client directory with:

plaintext
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

### Install dependencies and run the application

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Run backend and frontend concurrently (from root directory)
cd ..
npm run dev
```

### Seed the database (optional)
To populate the database with sample data:

bash
```bash

node seeder.js -i
```
This will create a sample admin user and properties.

## Project Structure

```bash
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable components
│       ├── context/        # Context providers
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── types/          # TypeScript type definitions
├── config/                 # Backend configuration
├── controllers/            # Route controllers
├── middleware/             # Express middleware
├── models/                 # Mongoose models
├── routes/                 # API routes
└── utils/                  # Utility functions
```