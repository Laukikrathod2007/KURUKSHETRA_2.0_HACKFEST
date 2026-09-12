# Agentic Guardian - Frontend

Modern, enterprise-grade payment security platform UI built with React, Vite, and Tailwind CSS.

## 🎨 Design Inspiration

This interface draws design patterns from:
- **Ebury.com** - Enterprise fintech dashboard aesthetics
- **Tempo.xyz** - Modern blockchain payment flows
- **Oscilar.com** - Security-first UI patterns

## 🚀 Features

### Core Components

1. **Dashboard** - Real-time security monitoring
   - Live transaction statistics
   - 24-hour activity charts
   - Recent security alerts feed
   - System status indicators

2. **Payment Simulator** - Interactive fraud testing
   - Realistic payment composition canvas
   - Recipient verification panel
   - Risk meter with 5-level scoring
   - Evidence modal with AI analysis
   - Cognitive dwell gate (4-5s countdown)
   - Voice Guardian assistant

3. **SOC Analyst Console** - Technical operations view
   - Live threat feed
   - Multi-agent performance metrics
   - Domain-level latency monitoring
   - Detection accuracy analytics

4. **Audit History** - Cryptographic transaction log
   - SHA-256 hash-chained records
   - Advanced filtering and search
   - Export capabilities
   - Tamper-evident design

### Unique Features

- **Voice Guardian** - AI-powered voice assistant for accessibility
  - Real-time voice interaction
  - Full payment context awareness
  - Guides users through security decisions
  - Perfect for elderly/low digital literacy users

- **Cognitive Dwell Gate** - Enforced security pause
  - 4-5 second educational countdown
  - Scam awareness messaging
  - Counter-coaching content
  - Cannot be skipped (compliance)

- **Dual-Viewport Cockpit** - Consumer + SOC analyst views
  - Consumer-friendly explanations
  - Technical metrics for analysts
  - Evidence sanitization (anti-tipping-off)

## 📦 Installation

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Setup Steps

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will start at `http://localhost:3000`

## 🛠 Tech Stack

- **Framework**: React 18.3 with Vite 5
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Utilities**: clsx + tailwind-merge

## 📁 Project Structure

```
Frontend/
├── public/               # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout.jsx           # Main layout wrapper
│   │   ├── RiskMeter.jsx        # Risk score visualization
│   │   ├── RecipientPanel.jsx   # Recipient verification
│   │   ├── EvidenceModal.jsx    # AI analysis report
│   │   ├── DwellGate.jsx        # Cognitive pause overlay
│   │   └── VoiceGuardian.jsx    # Voice assistant
│   ├── pages/           # Route pages
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── PaymentSimulator.jsx # Payment testing
│   │   ├── SOCConsole.jsx       # Analyst view
│   │   └── AuditHistory.jsx     # Transaction log
│   ├── utils/           # Helper functions
│   │   ├── cn.js               # Class name merger
│   │   └── riskCalculator.js   # Risk scoring logic
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## 🎯 Usage Examples

### Testing Payment Scenarios

1. **Low-Risk Routine Payment**
   - Amount: ₹2,500
   - Recipient: `merchant@paytm`
   - Result: Fast-path ALLOW (<15ms)

2. **First-Time Payee**
   - Amount: ₹5,000
   - Recipient: `newperson@ybl`
   - Check "First-time payee"
   - Result: ADVISE with gentle warning

3. **High-Risk Scam**
   - Amount: ₹50,000
   - Recipient: `unknown@apl`
   - Check: Urgency + Scam pattern + Unknown
   - Result: PAUSE with dwell gate

4. **Sanctions Block**
   - Any amount
   - Any recipient
   - Check "Sanctions list match"
   - Result: Terminal BLOCK

### Voice Guardian Testing

1. Click "Voice Guardian" button
2. Click microphone to start
3. Ask questions:
   - "Is this payment safe?"
   - "Why is this risky?"
   - "What should I do?"

## 🎨 Color Scheme

```css
Primary (Blue):   #0ea5e9
Success (Green):  #22c55e
Warning (Amber):  #f59e0b
Danger (Red):     #ef4444
Background:       #020617 (slate-950)
Cards:            #0f172a (slate-900)
```

## 🔧 Customization

### Changing Risk Thresholds

Edit `src/utils/riskCalculator.js`:

```javascript
function getRiskLevel(score) {
  if (score >= 70) return 'CRITICAL'  // Change threshold
  if (score >= 50) return 'HIGH'
  if (score >= 30) return 'MEDIUM'
  return 'LOW'
}
```

### Adding New Scam Types

Edit `SCAM_TYPES` in `riskCalculator.js`:

```javascript
export const SCAM_TYPES = {
  ROMANCE: 'Romance/Dating Scam',
  INVESTMENT: 'Investment/Crypto Scam',
  YOUR_TYPE: 'Your Custom Scam Type'  // Add here
}
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Outputs to `dist/` directory. Deploy to:
- Vercel: `vercel deploy`
- Netlify: Drag & drop `dist` folder
- AWS S3: Upload `dist` contents
- Firebase Hosting: `firebase deploy`

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=https://api.yourbackend.com
VITE_WS_URL=wss://api.yourbackend.com
```

Access in code: `import.meta.env.VITE_API_URL`

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check (if using TypeScript)
npm run type-check
```

## 📝 Architecture Alignment

This frontend implements the 5-domain architecture:

| Domain | Frontend Component |
|--------|-------------------|
| Domain 1: Recipient Verification | `RecipientPanel.jsx` |
| Domain 2: ML Risk Engine | `RiskMeter.jsx` + `riskCalculator.js` |
| Domain 3: Agentic Reasoning | `EvidenceModal.jsx` |
| Domain 4: Policy Gatekeeper | Action buttons + Decision display |
| Domain 5: Cognitive Intervention | `DwellGate.jsx` + `VoiceGuardian.jsx` |

## 🔒 Security Features

- **No sensitive data storage** - All risk analysis happens in memory
- **Sanitized explanations** - Consumer view hides AML details
- **Hash-chained audit** - Cryptographic integrity
- **Anti-tipping-off compliance** - Careful wording in warnings

## 📱 Responsive Design

- **Desktop**: Full dual-viewport experience
- **Tablet**: Stacked layout with all features
- **Mobile**: Touch-optimized with voice-first

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [Recharts Examples](https://recharts.org)

## 🤝 Contributing

This is a hackathon submission for **KURUKSHETRA 2.0** by Team **Midnight Ciphers**.

## 📄 License

Built for educational and demonstration purposes.

---

**Team**: Midnight Ciphers  
**Event**: KURUKSHETRA 2.0  
**Problem Statement**: PS09 - Agentic Guardian for Real-Time Payment Scam Interception
