"""
Shared Utility Functions
"""
from datetime import datetime, timezone
from typing import Optional, Dict, Any
import re
import hashlib
import uuid


def generate_uuid() -> str:
    """Generate a UUID string"""
    return str(uuid.uuid4())


def get_utc_now() -> datetime:
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_phone(phone: str) -> bool:
    """Validate phone number (basic validation)"""
    pattern = r'^\+?1?\d{9,15}$'
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    return re.match(pattern, cleaned) is not None


def calculate_points(amount: float, points_per_dollar: int) -> int:
    """
    Calculate loyalty points from transaction amount
    
    Args:
        amount: Transaction amount in dollars
        points_per_dollar: Points earned per dollar
        
    Returns:
        Total points earned
    """
    return int(amount * points_per_dollar)


def determine_tier(points: int) -> str:
    """
    Determine user tier based on total points
    
    Args:
        points: Total points earned
        
    Returns:
        Tier name (Bronze, Silver, Gold, Platinum)
    """
    from core.config import settings
    
    if points >= settings.TIER_PLATINUM_THRESHOLD:
        return "Platinum"
    elif points >= settings.TIER_GOLD_THRESHOLD:
        return "Gold"
    elif points >= settings.TIER_SILVER_THRESHOLD:
        return "Silver"
    else:
        return "Bronze"


def hash_string(value: str) -> str:
    """Create SHA-256 hash of a string"""
    return hashlib.sha256(value.encode()).hexdigest()


def format_currency(amount: float, currency: str = "USD") -> str:
    """Format amount as currency string"""
    symbols = {
        "USD": "$",
        "EUR": "€",
        "GBP": "£",
        "BTC": "₿",
        "ETH": "Ξ"
    }
    symbol = symbols.get(currency, "$")
    return f"{symbol}{amount:,.2f}"


def sanitize_input(value: str, max_length: Optional[int] = None) -> str:
    """
    Sanitize user input to prevent XSS and injection attacks
    
    Args:
        value: Input string to sanitize
        max_length: Optional maximum length
        
    Returns:
        Sanitized string
    """
    # Remove leading/trailing whitespace
    sanitized = value.strip()
    
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', ';', '|', '`']
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')
    
    # Limit length if specified
    if max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized


def paginate_query(page: int = 1, page_size: int = 20) -> Dict[str, int]:
    """
    Calculate pagination offset and limit
    
    Args:
        page: Page number (1-indexed)
        page_size: Number of items per page
        
    Returns:
        Dict with 'offset' and 'limit' keys
    """
    page = max(1, page)  # Ensure page is at least 1
    page_size = min(max(1, page_size), 100)  # Limit page size to 100
    
    offset = (page - 1) * page_size
    
    return {
        "offset": offset,
        "limit": page_size,
        "page": page
    }
