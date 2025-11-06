# Auto-Sweep Loyalty System

A fully automated loyalty and sweepstakes system with comprehensive integrations.

## Features

### Core Features
- **Loyalty Points System**: Earn points on purchases with tier-based multipliers
- **Reward Tiers**: Bronze, Silver, Gold, Platinum, Diamond
- **Sweepstakes Management**: Automated entry, winner selection, and announcements
- **Multi-Channel Integration**: Facebook Messenger, Voice AI (Alexa), Web Portal

### Payment Integration
Support for multiple payment processors:
- Stripe
- PayPal
- Square
- Chime
- CashApp
- Venmo
- Zelle
- Credit/Debit Cards
- Cryptocurrency

### Admin Dashboard
- Real-time analytics
- User management
- Reward creation and management
- Sweepstakes creation and winner selection
- Points adjustment
- Transaction monitoring

### Automation Features
- Automatic tier upgrades
- Scheduled sweepstakes winner selection
- Automated Facebook group announcements
- AI-powered customer engagement

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Facebook Developer Account (for Messenger bot)
- Amazon Developer Account (for Alexa skill)
- Payment processor accounts

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Bmcbob76/auto-sweep-loyalty-system.git
cd auto-sweep-loyalty-system
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Database connection string
- Payment processor API keys
- Facebook credentials
- Alexa credentials
- JWT secret

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Loyalty & Rewards

#### Get Loyalty Info
```
GET /api/loyalty/info
Authorization: Bearer {token}

Response:
{
  "points": 1500,
  "tier": "gold",
  "totalSpent": 1500.00,
  "sweepstakesEntries": 5
}
```

#### Get Available Rewards
```
GET /api/loyalty/rewards
Authorization: Bearer {token}

Response:
{
  "rewards": [...],
  "userPoints": 1500,
  "userTier": "gold"
}
```

#### Redeem Reward
```
POST /api/loyalty/rewards/redeem
Authorization: Bearer {token}
Content-Type: application/json

{
  "rewardId": "reward_id_here"
}
```

### Sweepstakes

#### Get Active Sweepstakes
```
GET /api/sweepstakes?status=active
Authorization: Bearer {token}
```

#### Enter Sweepstakes
```
POST /api/sweepstakes/{id}/enter
Authorization: Bearer {token}
Content-Type: application/json

{
  "entryCount": 5
}
```

### Payment

#### Process Payment
```
POST /api/payment/process
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 100.00,
  "paymentMethod": "stripe",
  "description": "Product purchase",
  "paymentData": {
    "sourceId": "payment_source_id"
  }
}
```

### Admin Endpoints

#### Get Dashboard Stats
```
GET /api/admin/dashboard
Authorization: Bearer {admin_token}
```

#### Create Sweepstakes
```
POST /api/sweepstakes
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Summer Giveaway",
  "description": "Win amazing prizes!",
  "startDate": "2024-06-01",
  "endDate": "2024-06-30",
  "prizes": [
    {
      "name": "$500 Cash",
      "value": 500,
      "quantity": 1
    }
  ],
  "entryMethod": "points",
  "entryCost": {
    "points": 100,
    "amount": 0
  },
  "isAutomatic": true
}
```

## Facebook Messenger Integration

### Setup
1. Create a Facebook App and Page
2. Set up Messenger webhook
3. Configure webhook URL: `https://your-domain.com/api/facebook/webhook`
4. Verify token: Set in `.env` as `FACEBOOK_VERIFY_TOKEN`

### Commands
Users can interact with the bot using:
- "points" or "balance" - Check loyalty points
- "rewards" - View available rewards
- "sweepstakes" - See active sweepstakes
- "help" - Get help

## Alexa Voice Integration

### Setup
1. Create an Alexa Skill in Amazon Developer Console
2. Set endpoint URL: `https://your-domain.com/api/alexa`
3. Configure account linking for user authentication

### Voice Commands
- "Alexa, ask Loyalty System about my points"
- "Alexa, ask Loyalty System what rewards are available"
- "Alexa, ask Loyalty System about sweepstakes"

## Loyalty Tiers

| Tier | Points Required | Points Multiplier |
|------|----------------|-------------------|
| Bronze | 0 | 1x |
| Silver | 1,000 | 1.1x |
| Gold | 2,500 | 1.25x |
| Platinum | 5,000 | 1.5x |
| Diamond | 10,000 | 2x |

## Automation Features

The system includes automated tasks:
- **Daily sweepstakes check**: Automatically ends sweepstakes and selects winners
- **Tier upgrades**: Automatic tier progression based on points
- **Winner announcements**: Posts to Facebook groups automatically

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Helmet.js for HTTP security headers
- Rate limiting on API endpoints
- Role-based access control (RBAC)

## Testing

```bash
npm test
```

## Deployment

### Environment Variables Required
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- Payment processor credentials
- Facebook API credentials
- Alexa API credentials

### Recommended Hosting
- Backend: Heroku, AWS, DigitalOcean
- Database: MongoDB Atlas
- CDN: CloudFlare for static assets

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT License
