-- Auto-Sweep Loyalty Platform
-- Database Seed Data (Development/Testing)

-- Insert sample reward tiers
INSERT INTO reward_tiers (name, points_threshold, benefits, multiplier) VALUES
('Bronze', 0, 'Basic rewards, Transaction tracking', 1.0),
('Silver', 1000, 'Enhanced rewards, Priority support, Exclusive offers', 1.2),
('Gold', 5000, 'Premium rewards, VIP support, Birthday bonus, Early access', 1.5),
('Platinum', 10000, 'Maximum rewards, Dedicated support, Exclusive events, Custom offers', 2.0);

-- Insert sample rewards
INSERT INTO rewards (name, description, points_cost, tier_required, quantity_available, is_active) VALUES
('$5 Gift Card', 'Redeem 500 points for a $5 gift card', 500, 'Bronze', NULL, true),
('$10 Gift Card', 'Redeem 900 points for a $10 gift card', 900, 'Bronze', NULL, true),
('$25 Gift Card', 'Redeem 2000 points for a $25 gift card', 2000, 'Silver', NULL, true),
('Free Shipping', 'Get free shipping on your next order', 300, 'Bronze', NULL, true),
('VIP Support Access', '30 days of priority customer support', 1500, 'Silver', 100, true),
('Exclusive Merchandise', 'Limited edition brand merchandise', 3000, 'Gold', 50, true),
('Premium Experience', 'VIP event access and exclusive perks', 8000, 'Platinum', 20, true);

-- Note: User data should not be seeded in production
-- This is for development/testing only
