# 🚀 Quick Setup Guide

## Step 1: Install Node.js

Make sure you have Node.js 18+ installed:
```bash
node --version
```

If not installed, download from: https://nodejs.org/

## Step 2: Install Dependencies

Open terminal in the `Frontend` folder and run:

```bash
npm install
```

This will install all required packages (~300MB download).

## Step 3: Start Development Server

```bash
npm run dev
```

The application will open at: `http://localhost:3000`

## Step 4: Test the Features

### 🧪 Test Scenario 1: Safe Payment
1. Go to "Payment Simulator"
2. Enter:
   - Amount: 2500
   - Recipient: `merchant@paytm`
   - Note: "Monthly subscription"
3. Click "Analyze Payment"
4. Result: **ALLOW** (Low risk, fast-path)

### 🧪 Test Scenario 2: Suspicious Payment
1. Amount: 50000
2. Recipient: `unknown@apl`
3. Check boxes:
   - ☑️ First-time payee
   - ☑️ Urgency language detected
   - ☑️ Scam pattern match
4. Click "Analyze Payment"
5. Result: **PAUSE** with cognitive dwell gate
6. Wait 5 seconds, then click to see evidence

### 🧪 Test Scenario 3: Voice Guardian
1. Click "Voice Guardian" button
2. Click microphone icon
3. Simulated voice questions will appear
4. Try quick action buttons

### 🧪 Test Scenario 4: SOC Console
1. Navigate to "SOC Console"
2. View live threat feed
3. Check agent performance metrics
4. Review domain latencies

### 🧪 Test Scenario 5: Audit History
1. Go to "Audit History"
2. Use search to filter transactions
3. Check different action types
4. Notice SHA-256 hash chains

## Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3001,  // Change to different port
}
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found Errors
```bash
# Make sure all files are in place
# Re-run npm install
npm install
```

### Slow Performance
```bash
# Run production build
npm run build
npm run preview
```

## Next Steps

1. ✅ Review the Dashboard
2. ✅ Test all 5 payment scenarios
3. ✅ Try Voice Guardian
4. ✅ Explore SOC Console
5. ✅ Check Audit History
6. 🔧 Customize colors in `tailwind.config.js`
7. 🔧 Adjust risk weights in `src/utils/riskCalculator.js`
8. 🔧 Connect to backend API (when ready)

## Backend Integration (Future)

When backend is ready, update API endpoints:

```javascript
// src/services/api.js (create this file)
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
})

export default api
```

Then use in components:
```javascript
import api from '../services/api'

const analyzePayment = async (data) => {
  const response = await api.post('/analyze', data)
  return response.data
}
```

## Production Deployment

```bash
# Build
npm run build

# Deploy to Vercel
npm i -g vercel
vercel deploy

# Or deploy to Netlify
npm i -g netlify-cli
netlify deploy --prod
```

---

Need help? Check:
- 📖 Full docs: `README.md`
- 🎨 Design patterns: Reference websites (Ebury, Tempo)
- 💻 Code: All components in `src/`
