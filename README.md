# Auto-Sweep Loyalty System

A fully automated loyalty and sweepstakes system integrating with Facebook Messenger, multiple payment processors, admin dashboard, customer rewards portal, and voice AI (Alexa/Echo).

## 🚀 Features

- **Multi-Payment Support**: Stripe, PayPal, Square, Chime, CashApp, Venmo, Zelle, Crypto
- **Loyalty Tiers**: Bronze, Silver, Gold, Platinum, Diamond with multiplier bonuses
- **Sweepstakes Automation**: Automatic winner selection and announcements
- **Facebook Integration**: Messenger bot and group automation
- **Voice AI**: Alexa skill for hands-free loyalty management
- **Admin Dashboard**: Complete analytics and management interface
- **Customer Portal**: Interactive web interface for customers
- **AI-Driven Logic**: Automated engagement and reward optimization

## 📋 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Bmcbob76/auto-sweep-loyalty-system.git
cd auto-sweep-loyalty-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Start the server**
```bash
npm run dev
```

## 📚 Documentation

See [DOCUMENTATION.md](DOCUMENTATION.md) for complete API documentation, setup guides, and integration instructions.

## 🎯 Key Components

- **Backend API**: Node.js/Express with MongoDB
- **Payment Processing**: Integrated with 10+ payment methods
- **Facebook Bot**: Automated customer interaction via Messenger
- **Alexa Skill**: Voice-controlled loyalty management
- **Admin Dashboard**: Real-time analytics and control panel
- **Customer Portal**: User-friendly rewards interface

## 🛠️ Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Stripe, PayPal, Square SDKs
- Facebook Graph API
- Amazon Alexa Skills Kit
- Winston (Logging)
- Node-cron (Automation)

## 📱 Interfaces

- **Customer Portal**: `customer-portal.html`
- **Admin Dashboard**: `admin-dashboard.html`
- **API Endpoints**: See DOCUMENTATION.md

## 🔐 Security

- JWT-based authentication
- bcrypt password hashing
- Helmet.js security headers
- Rate limiting
- Role-based access control

## 📄 License

MIT License
