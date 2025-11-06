# 🎯 Auto-Sweep Loyalty Platform

A fully automated loyalty and sweepstakes system with intelligent payment processing, rewards management, and customer engagement through AI.

## 🌟 Features

- **Multi-Payment Support**: Accept payments from Venmo, PayPal, Cash App, Chime, Zelle, Crypto, Credit/Debit cards
- **Facebook Messenger Integration**: Automated bot for customer engagement
- **Intelligent Rewards Engine**: Points-based system with tier management (Bronze, Silver, Gold, Platinum)
- **Admin Dashboard**: Comprehensive analytics and management interface
- **Customer Portal**: User-friendly interface for tracking rewards and history
- **AI Voice Assistant**: Echo integration for voice commands and automation
- **Real-time Analytics**: Track user behavior, predict churn, optimize rewards

## 🏗️ Architecture

```
auto-sweep-loyalty-platform/
├── backend/                 # FastAPI business logic & API
├── frontend/               # React admin dashboard & customer portal
├── ai_engine/              # AI/Voice/Automation module
├── integrations/           # Payment & third-party services
├── infrastructure/         # Docker, K8s, CI/CD configs
├── scripts/                # Utility scripts & migrations
├── tests/                  # Comprehensive test suite
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bmcbob76/auto-sweep-loyalty-system.git
   cd auto-sweep-loyalty-system
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database**
   ```bash
   docker-compose exec backend python scripts/init_db.py
   docker-compose exec backend python scripts/seed_demo_data.py
   ```

5. **Access the applications**
   - Backend API: http://localhost:8000
   - Admin Dashboard: http://localhost:3000
   - Customer Portal: http://localhost:3001
   - API Documentation: http://localhost:8000/docs

## 💳 Supported Payment Processors

| Provider | Status | Integration |
|----------|--------|-------------|
| Stripe (Credit/Debit) | ✅ | Direct API |
| PayPal | ✅ | REST API |
| Venmo | ✅ | Braintree |
| Cash App | ✅ | Direct API |
| Chime | ✅ | Plaid Integration |
| Zelle | ✅ | Bank API |
| Cryptocurrency | ✅ | Coinbase Commerce |

## 📊 Rewards Tiers

- **Bronze**: 0+ points - Basic rewards
- **Silver**: 1,000+ points - Enhanced benefits
- **Gold**: 5,000+ points - Premium perks
- **Platinum**: 10,000+ points - VIP treatment

Default: **10 points per dollar spent**

## 🔧 Development

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development

```bash
# Admin Dashboard
cd frontend/dashboard
npm install
npm run dev

# Customer Portal
cd frontend/customer_portal
npm install
npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend/dashboard
npm test
```

## 🤖 AI Features

- **Voice Commands**: "Echo, show me today's top earners"
- **Loyalty Prediction**: ML-based churn prediction
- **Reward Optimization**: AI-suggested reward balance
- **Auto-Responder**: Intelligent Messenger bot responses

## 📚 Documentation

- [Project Plan](docs/PROJECT_PLAN.md)
- [API Reference](docs/API_REFERENCE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Admin Manual](docs/USER_MANUAL_ADMIN.md)
- [Customer Manual](docs/USER_MANUAL_CUSTOMER.md)

## 🔒 Security

- JWT-based authentication
- Encrypted payment data
- Rate limiting
- SQL injection prevention
- XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Bmcbob76** - Initial work

## 🙏 Acknowledgments

- FastAPI for the excellent Python framework
- React & Tailwind CSS for modern UI
- Stripe, PayPal, and other payment processors
- ElevenLabs for voice AI capabilities
