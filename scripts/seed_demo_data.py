"""
Seed Demo Data Script
Populates database with sample data for testing
"""
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from core.database import SessionLocal
from core.logger import logger
from core.security import hash_password
from core.utils import generate_uuid


def seed_data():
    """Seed database with demo data"""
    db = SessionLocal()
    
    try:
        logger.info("Seeding demo data...")
        
        # Import models
        from api.rewards.models import RewardTier, Reward
        
        # Create reward tiers
        tiers = [
            RewardTier(name="Bronze", points_threshold=0, benefits="Basic rewards", multiplier=1.0),
            RewardTier(name="Silver", points_threshold=1000, benefits="Enhanced rewards", multiplier=1.2),
            RewardTier(name="Gold", points_threshold=5000, benefits="Premium rewards", multiplier=1.5),
            RewardTier(name="Platinum", points_threshold=10000, benefits="Maximum rewards", multiplier=2.0),
        ]
        
        for tier in tiers:
            db.add(tier)
        
        # Create sample rewards
        rewards = [
            Reward(name="$5 Gift Card", description="500 points for $5", points_cost=500, tier_required="Bronze"),
            Reward(name="$10 Gift Card", description="900 points for $10", points_cost=900, tier_required="Bronze"),
            Reward(name="$25 Gift Card", description="2000 points for $25", points_cost=2000, tier_required="Silver"),
            Reward(name="Free Shipping", description="300 points for free shipping", points_cost=300, tier_required="Bronze"),
        ]
        
        for reward in rewards:
            db.add(reward)
        
        db.commit()
        logger.info("✅ Demo data seeded successfully")
        
    except Exception as e:
        logger.error(f"❌ Failed to seed data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
