# Shopify - Sample

A React-based application for resizing Shopify product images for social media platforms.

## Features

- Browse and select Shopify products
- Choose specific product images for editing
- Crop and resize images for different social media platforms:
  - Instagram Story (1080x1920)
  - Facebook Post (1200x630)
  - YouTube Thumbnail (1280x720)
- Download processed images
- Built with Shopify Polaris for consistent UX

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Shopify store with Admin API access

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kadiralpcil/shopfy-sample.git
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd front-end
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory with the following:
   
   ```env
    SHOPIFY_ACCESS_TOKEN=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
    SHOPIFY_STORE_DOMAIN=testalpcil.myshopify.com
    PORT=8000
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:8000`

2. **Start the frontend development server**
   ```bash
   cd front-end
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Usage

1. Click "Connect to Shopify" on the landing page
2. Browse your product list
3. Click on a product to view its images
4. Select an image to edit
5. Choose your target social media platform
6. Crop and adjust the image using the editor
7. Download the resized image

## Project Structure

```
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Shopify API integration
│   │   └── server.ts       # Express server setup
│   └── package.json
├── front-end/              # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Shopify Polaris
- **Backend**: Node.js, Express, TypeScript
- **Image Processing**: Sharp
- **Shopify Integration**: Admin API (GraphQL)
- **UI Components**: react-easy-crop for image cropping

## Key Assumptions

- Shopify store has products with images
- Admin API access token has necessary permissions for product reading
- Images are accessible via public URLs
- Development environment with Node.js v18+



