# BudgetBuddy Deployment Guide

## Deploying to Vercel

This guide will help you deploy the BudgetBuddy application to Vercel.

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for the database
3. The [Vercel CLI](https://vercel.com/docs/cli) installed (optional)

### Step 1: Setup MongoDB Atlas

1. Create a MongoDB Atlas cluster if you don't have one already
2. Create a database named `budget-buddy`
3. Create a database user with read/write permissions
4. Add your IP address to the IP access list or allow access from anywhere
5. Get your MongoDB connection string

### Step 2: Configure Environment Variables

You'll need to set these environment variables in Vercel:

- `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/budget-buddy?retryWrites=true&w=majority`)
- `JWT_SECRET`: A secret key for JWT token generation
- `NODE_ENV`: Set to `production`

### Step 3: Deploy to Vercel

#### Option 1: Using the Vercel Dashboard

1. Fork or clone this repository to your GitHub account
2. Login to your Vercel dashboard
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Root Directory: Leave empty (use repository root)
   - Build Command: `npm run build`
   - Output Directory: `frontend/build`
6. Add the environment variables from Step 2
7. Click "Deploy"

#### Option 2: Using the Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Navigate to the project directory
4. Run: `vercel`
5. Follow the prompts to configure your project
6. To add environment variables: `vercel env add`

### Step 4: Verify Deployment

1. Once deployed, Vercel will provide you with a deployment URL
2. Visit the URL to confirm your frontend is working
3. Test the API endpoints at `https://your-deployment-url.vercel.app/api`

### Troubleshooting

- If you encounter CORS issues, make sure the frontend domain is added to the allowed origins in `backend/src/index.js`
- If the API isn't responding, check the Vercel logs for any errors
- Make sure your MongoDB connection string is correct and the database is accessible

### Notes

- The `vercel.json` file configures both the frontend and backend deployments
- The frontend build process sets the production API URL automatically
- The application uses client-side Redux for state management with persistence 