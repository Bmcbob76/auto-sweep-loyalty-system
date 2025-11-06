"""
Rewards Models
Database models for rewards and redemptions
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from core.database import Base


class Reward(Base):
    """
    Reward model - defines available rewards
    
    TODO (Copilot): Complete reward schema
    """
    __tablename__ = "rewards"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    points_cost = Column(Integer, nullable=False)
    tier_required = Column(String(50), default="Bronze")
    quantity_available = Column(Integer)  # None = unlimited
    is_active = Column(Boolean, default=True)
    image_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class RewardTier(Base):
    """
    Reward tier model
    """
    __tablename__ = "reward_tiers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    points_threshold = Column(Integer, nullable=False)
    benefits = Column(Text)  # JSON or comma-separated
    multiplier = Column(Float, default=1.0)  # Points multiplier for this tier
    created_at = Column(DateTime, default=datetime.utcnow)


class RewardRedemption(Base):
    """
    Reward redemption history
    
    TODO (Copilot): Complete redemption tracking schema
    """
    __tablename__ = "reward_redemptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)  # TODO: Add ForeignKey
    reward_id = Column(Integer, ForeignKey("rewards.id"))
    points_spent = Column(Integer, nullable=False)
    status = Column(String(50), default="pending")  # pending, fulfilled, cancelled
    redemption_code = Column(String(100), unique=True)
    redeemed_at = Column(DateTime, default=datetime.utcnow)
    fulfilled_at = Column(DateTime)
    
    # Relationship
    reward = relationship("Reward", backref="redemptions")
