"""
Database Initialization Script
Creates all tables based on SQLAlchemy models
"""
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

from core.database import Base, engine, init_db
from core.logger import logger
from api.users.models import User
from api.payments.models import Transaction
from api.rewards.models import Reward, RewardTier, RewardRedemption


def main():
    """Initialize database tables"""
    logger.info("Initializing database...")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
        
        # List created tables
        logger.info("Created tables:")
        for table in Base.metadata.sorted_tables:
            logger.info(f"  - {table.name}")
            
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
