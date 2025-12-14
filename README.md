# Nyuchi Workspace Tools

Google Workspace tools for Nyuchi - Gmail Add-on and Email Signature Generator.

## Projects

### 1. Gmail Add-on (`gmail-addon/`)
Self-service Gmail Add-on that allows users to generate and apply branded email signatures directly within Gmail.

**Features:**
- Generate signatures with Nyuchi branding
- Support for multiple brand families (Nyuchi, Mukoko, Travel, Education, Community)
- Zimbabwe flag strip accent
- One-click signature application

### 2. Email Signature Generator (`email-signature/`)
Standalone Google Apps Script for generating HTML email signatures with Nyuchi branding.

**Features:**
- Generate HTML signatures
- Preview before applying
- Support for custom fields (name, title, phone, etc.)

## Setup

### Prerequisites
- Node.js 18+
- Google Account with Apps Script access
- [clasp](https://github.com/google/clasp) CLI installed

### Installation

```bash
# Install dependencies
npm install

# Login to clasp (first time only)
npx clasp login
```

### Development

```bash
# Push Gmail Add-on to Apps Script
npm run push:gmail

# Push Email Signature to Apps Script
npm run push:signature

# Push both
npm run push:all

# Open in Apps Script editor
npm run open:gmail
npm run open:signature
```

### Deployment

```bash
# Deploy Gmail Add-on
npm run deploy:gmail

# Deploy Email Signature
npm run deploy:signature
```

## Project Structure

```
workspace-tools/
├── gmail-addon/           # Gmail Add-on
│   ├── Code.js           # Main Apps Script code
│   ├── appsscript.json   # Apps Script manifest
│   ├── .clasp.json       # clasp configuration
│   └── README.md         # Add-on documentation
├── email-signature/       # Email Signature Generator
│   ├── Code.js           # Main Apps Script code
│   ├── appsscript.json   # Apps Script manifest
│   ├── .clasp.json       # clasp configuration
│   ├── signature.html    # Signature template
│   ├── preview.html      # Preview template
│   └── README.md         # Generator documentation
└── package.json          # Workspace configuration
```

## Brand Colors

All tools use the Nyuchi Brand System v5 colors:

| Brand | Primary Color | Use |
|-------|--------------|-----|
| Nyuchi Platform | `#D4634A` | Core brand |
| Mukoko | `#6B5CE7` | Social/News |
| Travel | `#0D7D5F` | Travel sites |
| Education | `#1E3A8A` | Learning platforms |
| Community | `#F59E0B` | Foundation/Ubuntu |

## Related Repositories

- [nyuchi-brand-assets](https://github.com/nyuchitech/nyuchi-brand-assets) - Brand system, design tokens, and assets
