# Interactive Linear Regression Visualization

A beautiful, interactive React application for teaching and learning linear regression concepts.

## Features

- 🎯 Real-time parameter adjustment with smooth sliders
- 📊 Interactive scatter plot with regression lines
- 🎨 Modern glassmorphic UI with beautiful gradients
- 📈 Live statistics (R², MSE, best fit calculations)
- 🎬 Animation mode for dynamic demonstrations
- 📱 Fully responsive design

## Local Development

1. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)

2. **Install Dependencies**
   ```bash
   cd my-linear-regression
   npm install
   ```

3. **Run Locally**
   ```bash
   npm start
   ```
   Opens at `http://localhost:3000`

## Deploy to Netlify

### Option 1: GitHub + Netlify (Recommended)

1. **Upload to GitHub**
   - Create new repository on GitHub
   - Upload all project files
   - Make repository public

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"

### Option 2: Direct Deploy

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Deploy build folder**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `build` folder
   - Get instant live URL!

## Technologies Used

- React 18
- Recharts for data visualization
- Tailwind CSS for styling
- Lucide React for icons

## Perfect for Teaching

This visualization helps students understand:
- How slope and intercept affect linear regression
- The concept of best fit lines
- Model evaluation metrics (R², MSE)
- The impact of data noise on model performance
