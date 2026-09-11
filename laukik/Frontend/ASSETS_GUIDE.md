# 🎨 Assets & Visual Design Guide

## Current Status

The frontend uses **Lucide React** for all icons - a comprehensive, beautiful icon library with 1000+ icons built-in. No external assets needed!

## Icon Library

All icons are imported from `lucide-react`:

```javascript
import { Shield, AlertTriangle, CheckCircle, Mic } from 'lucide-react'
```

### Key Icons Used:
- 🛡️ **Shield** - Main branding, security features
- ⚠️ **AlertTriangle** - Warnings, risk indicators
- ✅ **CheckCircle** - Success states, verified items
- 🎤 **Mic** - Voice Guardian feature
- 📊 **TrendingUp** - Analytics, metrics
- 💰 **IndianRupee** - Payment amounts
- 👤 **User** - Personal accounts
- 🏢 **Building** - Merchant accounts
- 🏛️ **Landmark** - Government entities

## Color Palette

### Primary Colors
```css
/* Sky Blue - Trust & Technology */
Primary: #0ea5e9 (sky-500)
Used for: CTAs, active states, primary actions

/* Success Green - Safe Transactions */
Success: #22c55e (green-500)
Used for: ALLOW actions, verified status, positive metrics

/* Warning Amber - Caution */
Warning: #f59e0b (amber-500)
Used for: ADVISE/CHALLENGE actions, unusual activity

/* Danger Red - Critical Threats */
Danger: #ef4444 (red-500)
Used for: BLOCK/PAUSE actions, critical alerts
```

### Background Colors
```css
/* Dark Theme - Professional Security Aesthetic */
Background: #020617 (slate-950)
Cards: #0f172a (slate-900)
Borders: #334155 (slate-700)
Text Primary: #f1f5f9 (slate-100)
Text Secondary: #94a3b8 (slate-400)
```

## Typography

### Fonts
```html
<!-- Google Fonts (already in index.html) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

- **Inter** - Primary UI font (clean, modern)
- **JetBrains Mono** - Code/data displays (UPI handles, hashes)

### Hierarchy
```css
h1: 3xl (30px) - Page titles
h2: 2xl (24px) - Section headers
h3: xl (20px) - Card titles
body: sm (14px) - Main content
button: sm (14px) - Action buttons
caption: xs (12px) - Metadata, timestamps
```

## Logo Design (DIY)

### Option 1: SVG Shield Badge

Create `public/logo.svg`:

```svg
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Shield shape -->
  <path d="M20 2L4 8V18C4 28 20 38 20 38C20 38 36 28 36 18V8L20 2Z" 
        fill="#0ea5e9" stroke="#0284c7" stroke-width="2"/>
  
  <!-- AI brain icon in center -->
  <circle cx="20" cy="18" r="6" fill="white" opacity="0.2"/>
  <path d="M20 14V22M16 18H24" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>
```

### Option 2: Text Logo with Gradient

```html
<div class="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
  Agentic Guardian
</div>
```

### Option 3: Simple Icon Badge (Current)

Already implemented in `Layout.jsx`:
```javascript
<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600">
  <Shield className="w-6 h-6 text-white" />
</div>
```

## Favicon

Create `public/favicon.svg`:

```svg
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#0ea5e9"/>
  <path d="M16 6L8 10V16C8 22 16 28 16 28C16 28 24 22 24 16V10L16 6Z" 
        fill="white"/>
</svg>
```

Update `index.html`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

## Animations

### Built-in Tailwind Animations

```css
/* Already configured in tailwind.config.js */
animate-pulse-slow: 3s pulsing (risk indicators)
animate-slide-up: Slide from bottom (modals)
animate-slide-down: Slide from top (notifications)
animate-fade-in: Opacity fade (overlays)
```

### Custom Shimmer Effect

```css
/* Add to index.css */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
```

## Gradient Backgrounds

### Hero Gradient
```javascript
<div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
  {/* Content */}
</div>
```

### Card Hover Effect
```javascript
<div className="card hover:shadow-xl hover:shadow-primary-500/20 transition-shadow">
  {/* Content */}
</div>
```

## Screenshot Mockups (For Demo)

### Take Professional Screenshots

1. **Dashboard View**
   - Full browser window
   - Clear stats, clean charts
   - Use sample data showing activity

2. **Payment Simulator - High Risk**
   - Fill form with risky transaction
   - Show risk meter at 85%
   - Evidence modal open

3. **Voice Guardian**
   - Voice assistant open
   - Conversation visible
   - Microphone active state

4. **Dwell Gate**
   - Countdown at 3 seconds
   - Educational content visible
   - Warning messages displayed

5. **SOC Console**
   - Live threat feed
   - Agent metrics
   - Technical dashboard

### Recommended Screenshot Tool
- **Windows**: Windows Key + Shift + S
- **Mac**: Cmd + Shift + 4
- **Chrome Extension**: GoFullPage (full-page screenshots)

## Design System Summary

| Element | Value | Usage |
|---------|-------|-------|
| Border Radius | 8px (lg), 12px (xl), 16px (2xl) | Cards, buttons, modals |
| Shadow | sm, md, xl | Subtle depth on cards |
| Spacing | 4px increments | Consistent padding/margins |
| Transition | 200-300ms | Smooth interactions |
| Font Weight | 400 (normal), 600 (semibold), 700 (bold) | Text hierarchy |

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Minimum 4.5:1 contrast ratio
- Danger red used sparingly for critical only

### Focus States
```css
focus-visible:outline-none 
focus-visible:ring-2 
focus-visible:ring-primary-600
```

### Screen Reader Support
- All icons have aria-labels
- Semantic HTML structure
- Keyboard navigation support

## No External Images Needed!

The entire UI is built with:
✅ Lucide React icons
✅ Tailwind CSS utility classes
✅ CSS gradients & animations
✅ SVG for any custom graphics

**Result**: Fast load times, scalable graphics, zero image hosting costs!

---

**Pro Tip**: To add custom illustrations later, use:
- [Undraw.co](https://undraw.co) - Free illustrations
- [Hero Icons](https://heroicons.com) - Additional icons
- [Humaaans](https://www.humaaans.com) - Character illustrations
