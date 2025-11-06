"""
Payment Models
Database models for transactions and payment records
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum as SQLEnum
from datetime import datetime
import enum

from core.database import Base


class PaymentMethodEnum(str, enum.Enum):
    """Payment method types"""
    STRIPE = "stripe"
    PAYPAL = "paypal"
    VENMO = "venmo"
    CASHAPP = "cashapp"
    CHIME = "chime"
    ZELLE = "zelle"
    CRYPTO = "crypto"


class PaymentStatusEnum(str, enum.Enum):
    """Payment status"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class Transaction(Base):
    """
    Transaction model
    
    TODO (Copilot): Define complete transaction schema
    Fields needed:
    - id (primary key)
    - user_id (foreign key to users)
    - amount (decimal)
    - currency (string)
    - payment_method (enum)
    - payment_status (enum)
    - transaction_id (external provider ID)
    - points_earned (integer)
    - metadata (JSON)
    - created_at (timestamp)
    - updated_at (timestamp)
    """
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)  # TODO: Add foreign key
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    payment_method = Column(SQLEnum(PaymentMethodEnum), nullable=False)
    payment_status = Column(SQLEnum(PaymentStatusEnum), default=PaymentStatusEnum.PENDING)
    transaction_id = Column(String(255), unique=True, index=True)
    points_earned = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
