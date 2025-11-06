# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud like MongoDB Atlas)
- Domain with SSL certificate (for production)
- API keys for payment processors
- Facebook Developer Account
- Amazon Developer Account (for Alexa)

## Environment Setup

1. **Copy and configure environment variables:**
```bash
cp .env.example .env
```

2. **Required Environment Variables:**

### Database
- `MONGODB_URI`: Your MongoDB connection string

### Security
- `JWT_SECRET`: A secure random string for JWT signing

### Payment Processors
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- PayPal: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
- Square: `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`
- Others: Configure as needed

### Facebook
- `FACEBOOK_PAGE_ACCESS_TOKEN`: From Facebook App settings
- `FACEBOOK_VERIFY_TOKEN`: Your chosen verification token
- `FACEBOOK_APP_SECRET`: From Facebook App

### Alexa
- `ALEXA_SKILL_ID`: From Alexa Developer Console
- `ALEXA_CLIENT_ID` and `ALEXA_CLIENT_SECRET`: For account linking

## Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Start MongoDB locally:**
```bash
mongod
```

3. **Run the development server:**
```bash
npm run dev
```

Server will start on `http://localhost:3000`

## Production Deployment

### Option 1: Heroku

1. **Create a Heroku app:**
```bash
heroku create your-app-name
```

2. **Add MongoDB addon:**
```bash
heroku addons:create mongolab:sandbox
```

3. **Set environment variables:**
```bash
heroku config:set JWT_SECRET=your_secret
heroku config:set STRIPE_SECRET_KEY=your_key
# ... set all other variables
```

4. **Deploy:**
```bash
git push heroku main
```

### Option 2: AWS/DigitalOcean/VPS

1. **Install Node.js and MongoDB on server**

2. **Clone repository:**
```bash
git clone https://github.com/Bmcbob76/auto-sweep-loyalty-system.git
cd auto-sweep-loyalty-system
```

3. **Install dependencies:**
```bash
npm install --production
```

4. **Create .env file with production values**

5. **Use PM2 for process management:**
```bash
npm install -g pm2
pm2 start src/server.js --name loyalty-system
pm2 startup
pm2 save
```

6. **Set up Nginx as reverse proxy:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Set up SSL with Let's Encrypt:**
```bash
sudo certbot --nginx -d your-domain.com
```

## Facebook Integration Setup

1. **Create Facebook App:**
   - Go to https://developers.facebook.com/
   - Create a new app
   - Add Messenger product

2. **Configure Webhook:**
   - URL: `https://your-domain.com/api/facebook/webhook`
   - Verify Token: Same as `FACEBOOK_VERIFY_TOKEN` in .env
   - Subscribe to: `messages`, `messaging_postbacks`

3. **Generate Page Access Token:**
   - Link your Facebook Page to the app
   - Generate and save the Page Access Token

4. **Test webhook:**
```bash
curl -X GET "https://your-domain.com/api/facebook/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE"
```

## Alexa Skill Setup

1. **Create Alexa Skill:**
   - Go to https://developer.amazon.com/alexa
   - Create a new skill (Custom, Hosted)
   - Use `alexa-skill-model.json` for the interaction model

2. **Configure Endpoint:**
   - HTTPS endpoint: `https://your-domain.com/api/alexa`
   - SSL Certificate: Select appropriate option

3. **Account Linking:**
   - Authorization URL: `https://your-domain.com/api/auth/login`
   - Access Token URI: `https://your-domain.com/api/auth/token`
   - Client ID and Secret: Set in your .env

4. **Test the skill in Alexa Simulator**

## Payment Webhook Setup

### Stripe
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/payment/webhook/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### PayPal
Configure IPN (Instant Payment Notification) in PayPal settings

### Square
Configure webhook in Square Dashboard

## Database Initialization

1. **Create admin user:**
```bash
node scripts/create-admin.js
```

Or use the API:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

2. **Create sample rewards:**
Use the admin dashboard to create initial rewards

3. **Create first sweepstakes:**
Use the admin dashboard to create your first sweepstakes

## Monitoring

1. **Logs:**
```bash
# Using PM2
pm2 logs loyalty-system

# Direct logs
tail -f logs/combined.log
tail -f logs/error.log
```

2. **Health Check:**
```bash
curl http://localhost:3000/health
```

## Backup

1. **Database backup:**
```bash
mongodump --uri="mongodb://localhost:27017/loyalty-system" --out=/backup/$(date +%Y%m%d)
```

2. **Restore:**
```bash
mongorestore --uri="mongodb://localhost:27017/loyalty-system" /backup/20240101
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable SSL/HTTPS in production
- [ ] Set secure cookie options
- [ ] Configure CORS properly
- [ ] Keep dependencies updated
- [ ] Regular database backups
- [ ] Monitor logs for suspicious activity
- [ ] Rate limiting is enabled
- [ ] API keys are environment variables

## Troubleshooting

### Server won't start
- Check MongoDB connection
- Verify all required env variables are set
- Check port 3000 is available

### Webhooks not working
- Verify webhook URLs are accessible publicly
- Check webhook secrets match
- Review webhook logs

### Authentication issues
- Verify JWT_SECRET is set
- Check token expiration
- Verify user exists in database

## Support

For issues or questions:
- Open an issue on GitHub
- Check documentation at DOCUMENTATION.md
- Review API endpoints and examples

## Performance Tips

1. **Enable MongoDB indexes:**
   - Indexes are defined in models
   - Run in production: `db.collection.createIndexes()`

2. **Use Redis for caching:**
   - Cache frequent queries
   - Store session data

3. **CDN for static assets:**
   - Host HTML/CSS/JS on CDN
   - Use CloudFlare for DDoS protection

4. **Database optimization:**
   - Regular backups
   - Monitor slow queries
   - Optimize indexes based on query patterns
