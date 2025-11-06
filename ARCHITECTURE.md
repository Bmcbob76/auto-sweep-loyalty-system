# System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT INTERFACES                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │   Customer  │  │    Admin    │  │  Facebook   │  │  Alexa   │ │
│  │   Portal    │  │  Dashboard  │  │  Messenger  │  │  Voice   │ │
│  │   (HTML)    │  │   (HTML)    │  │    Bot      │  │   AI     │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬─────┘ │
│         │                │                 │               │       │
└─────────┼────────────────┼─────────────────┼───────────────┼───────┘
          │                │                 │               │
          └────────────────┴─────────────────┴───────────────┘
                                  │
                                  ▼
          ┌───────────────────────────────────────────────┐
          │         EXPRESS.JS REST API SERVER            │
          │              (Port 3000)                      │
          ├───────────────────────────────────────────────┤
          │                                               │
          │  ┌─────────────────────────────────────────┐ │
          │  │          MIDDLEWARE LAYER               │ │
          │  ├─────────────────────────────────────────┤ │
          │  │ • CORS         • Helmet                 │ │
          │  │ • Rate Limiter • JWT Authentication     │ │
          │  │ • Body Parser  • Error Handler          │ │
          │  └─────────────────────────────────────────┘ │
          │                                               │
          │  ┌─────────────────────────────────────────┐ │
          │  │              ROUTES                     │ │
          │  ├─────────────────────────────────────────┤ │
          │  │ /api/auth         /api/loyalty          │ │
          │  │ /api/payment      /api/sweepstakes      │ │
          │  │ /api/admin        /api/facebook         │ │
          │  │ /api/alexa                              │ │
          │  └─────────────────────────────────────────┘ │
          │                                               │
          │  ┌─────────────────────────────────────────┐ │
          │  │           CONTROLLERS                   │ │
          │  ├─────────────────────────────────────────┤ │
          │  │ Auth      Payment      Loyalty          │ │
          │  │ Admin     Sweepstakes  Facebook         │ │
          │  └─────────────────────────────────────────┘ │
          │                                               │
          │  ┌─────────────────────────────────────────┐ │
          │  │            SERVICES                     │ │
          │  ├─────────────────────────────────────────┤ │
          │  │ • PaymentService   (Multi-processor)    │ │
          │  │ • LoyaltyService   (Points/Tiers/AI)    │ │
          │  │ • FacebookService  (Messenger/Groups)   │ │
          │  │ • AlexaService     (Voice AI)           │ │
          │  └─────────────────────────────────────────┘ │
          │                                               │
          │  ┌─────────────────────────────────────────┐ │
          │  │         DATA MODELS (Mongoose)          │ │
          │  ├─────────────────────────────────────────┤ │
          │  │ User • Transaction • Reward             │ │
          │  │ Sweepstakes                             │ │
          │  └─────────────────────────────────────────┘ │
          │                                               │
          └───────────────────────────────────────────────┘
                          │               │
        ┌─────────────────┴───────┐      └──────────────┐
        │                         │                      │
        ▼                         ▼                      ▼
┌───────────────┐      ┌──────────────────┐    ┌─────────────┐
│   MongoDB     │      │   AUTOMATION     │    │  LOGGING    │
│   Database    │      │   (node-cron)    │    │  (Winston)  │
├───────────────┤      ├──────────────────┤    ├─────────────┤
│ • users       │      │ Daily Tasks:     │    │ • error.log │
│ • transactions│      │ • End sweepstakes│    │ • combined  │
│ • rewards     │      │ • Select winners │    │   .log      │
│ • sweepstakes │      │ • Activate new   │    └─────────────┘
└───────────────┘      └──────────────────┘
        │
        │
        ▼
┌──────────────────────────────────────────────────────────┐
│               EXTERNAL INTEGRATIONS                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  PAYMENT PROCESSORS:                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────────────┐  │
│  │ Stripe │ │ PayPal │ │ Square │ │ Chime/CashApp/  │  │
│  │        │ │        │ │        │ │ Venmo/Zelle     │  │
│  └────────┘ └────────┘ └────────┘ └─────────────────┘  │
│                                                          │
│  ┌──────────────────┐                                   │
│  │ Crypto Payments  │                                   │
│  │ (Coinbase, etc)  │                                   │
│  └──────────────────┘                                   │
│                                                          │
│  SOCIAL & AI:                                            │
│  ┌──────────────────┐  ┌───────────────────┐           │
│  │ Facebook Graph   │  │ Amazon Alexa      │           │
│  │ API (Messenger)  │  │ Skills Kit        │           │
│  └──────────────────┘  └───────────────────┘           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. Customer Makes Purchase
```
Customer Portal → POST /api/payment/process
                ↓
        PaymentController
                ↓
        PaymentService → External Payment Processor
                ↓
        Webhook received → Award Points
                ↓
        Update User Tier → Check for Tier Upgrade
                ↓
        Save Transaction → Notify Customer
```

### 2. Messenger Bot Interaction
```
Facebook User sends message
                ↓
        Facebook webhook → POST /api/facebook/webhook
                ↓
        FacebookController → FacebookService
                ↓
        Parse message → AI logic determines intent
                ↓
        Query user data from MongoDB
                ↓
        Generate response → Send via Facebook API
```

### 3. Sweepstakes Winner Selection (Automated)
```
Daily cron job (midnight)
                ↓
        LoyaltyService.initializeAutomation()
                ↓
        Find ended sweepstakes
                ↓
        selectWinners() → Random weighted selection
                ↓
        Update sweepstakes.winners
                ↓
        FacebookService.announceSweepstakesWinner()
                ↓
        Post to Facebook Group
```

### 4. Voice Command (Alexa)
```
User: "Alexa, ask Loyalty System about my points"
                ↓
        Amazon Alexa → POST /api/alexa
                ↓
        AlexaService.GetPointsIntent
                ↓
        Find user by alexaUserId
                ↓
        Return voice response with points & tier
```

## Security Layers

```
┌────────────────────────────────────────┐
│         Security Measures              │
├────────────────────────────────────────┤
│ 1. JWT Authentication                  │
│ 2. bcrypt Password Hashing             │
│ 3. Helmet.js HTTP Headers              │
│ 4. Rate Limiting (100 req/15min)       │
│ 5. CORS Configuration                  │
│ 6. Input Validation                    │
│ 7. Role-Based Access Control           │
│ 8. Webhook Signature Verification      │
└────────────────────────────────────────┘
```

## Scalability Considerations

1. **Horizontal Scaling**: Stateless API design allows multiple instances
2. **Database Indexing**: Optimized queries on user, transaction, sweepstakes
3. **Caching Layer**: Redis can be added for session management
4. **CDN Integration**: Static assets served via CloudFlare
5. **Load Balancing**: Nginx/AWS ALB for traffic distribution
6. **Message Queue**: Can add Bull/RabbitMQ for async processing
