# 🛒 FreshCart Online Grocery Store

<div align="center">
  <img src="public/freshcart-logo.png" alt="FreshCart Logo" width="200"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org)
  [![MongoDB](https://img.shields.io/badge/Mongoose-8.14.1-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.5-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
</div>

## 🚀 Overview

FreshCart is a cutting-edge online grocery delivery platform built with Next.js 15, offering a seamless and intuitive shopping experience. Our platform combines modern web technologies with user-centric design to revolutionize how people shop for groceries online.

### 🌟 Why FreshCart?

- 🚀 Lightning-fast performance with Next.js 15.3.1
- 🎨 Beautiful, responsive UI with Tailwind CSS and Radix UI
- 🔒 Enterprise-grade security with NextAuth.js
- 📱 Modern app architecture with Next.js App Router
- 🌐 SEO optimized
- 🔄 Real-time inventory updates with Redux Toolkit

### ✨ Key Features

- 🏪 Smart Product Catalog
  - Advanced search and filtering
  - Best selling products section
  - Discount products section
  - Stock availability tracking
  - Category-based browsing

- 🛍️ Enhanced Shopping Experience
  - One-click checkout with Stripe
  - Shopping cart management
  - Order history tracking
  - Multiple delivery addresses
  - Wishlist functionality

- 👤 User Features
  - Secure authentication with NextAuth.js
  - Profile management
  - Address book
  - Order tracking
  - Comment section

- 💳 Payment & Security
  - Stripe payment integration
  - Secure transactions
  - Order verification
  - User data protection

- 📊 Admin Dashboard
  - Customer management
  - Product management
  - Order management
  - Analytics dashboard

## 🛠️ Tech Stack

### Frontend
- [Next.js 15.3.1](https://nextjs.org/) - React Framework
- [React 19.0.0](https://reactjs.org/) - UI Library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State Management
- [Tailwind CSS 4.1.5](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI Components
- [Framer Motion](https://www.framer.com/motion/) - Animations

### Backend
- [Next.js API Routes](https://nextjs.org/) - Backend API
- [MongoDB with Mongoose](https://www.mongodb.com/) - Database
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Stripe](https://stripe.com/) - Payment Processing
- [Cloudinary](https://cloudinary.com/) - Image Management

### Development Tools
- [ESLint](https://eslint.org/) - Code Linting
- [Turbopack](https://turbo.build/pack) - Development Server
- [PostCSS](https://postcss.org/) - CSS Processing

## 📁 Project Structure
src/
├── app/                 # Next.js App Router pages
│   ├── (admin)/        # Admin dashboard routes
│   ├── (app)/          # Main app routes
│   ├── (authPage)/     # Authentication routes
│   └── api/            # API routes
├── components/         # React components
│   ├── custom-components/ # Custom UI components
│   └── ui/             # Shared UI components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── models/             # MongoDB models
├── store/              # Redux store and slices
└── pages/              # Page components

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install