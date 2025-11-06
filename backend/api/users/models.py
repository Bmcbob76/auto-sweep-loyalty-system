"""
User Models
Database models for user accounts
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from core.database import Base


class User(Base):
    """
    User model
    
    TODO (Copilot): Complete user schema
    Fields:
    - id, email, password_hash, first_name, last_name, phone
    - points, tier, is_active, is_verified
    - fb_messenger_id (for Messenger integration)
    - referral_code, referred_by
    - last_login, created_at, updated_at
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    
    # Loyalty program fields
    points = Column(Integer, default=0)
    tier = Column(String(50), default="Bronze")
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Integration fields
    fb_messenger_id = Column(String(255), unique=True, index=True)
    
    # Referral system
    referral_code = Column(String(50), unique=True, index=True)
    referred_by = Column(Integer)  # User ID who referred this user
    
    # Timestamps
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, tier={self.tier})>"
