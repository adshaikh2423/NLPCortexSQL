from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    orders = relationship("Order", back_populates="owner", cascade="all, delete-orphan")

    __table_args__ = (
        Index('idx_user_email', 'email'),
        Index('idx_user_created', 'created_at'),
    )

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    amount = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    status = Column(String, default="pending", index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    owner = relationship("User", back_populates="orders")
    product = relationship("Product", back_populates="orders")

    __table_args__ = (
        Index('idx_order_user', 'user_id'),
        Index('idx_order_status', 'status'),
        Index('idx_order_created', 'created_at'),
    )

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, index=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    orders = relationship("Order", back_populates="product")

    __table_args__ = (
        Index('idx_product_category', 'category'),
        Index('idx_product_name', 'name'),
    )

class DynamicTable(Base):
    __tablename__ = "dynamic_tables"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    table_name = Column(String, unique=True, nullable=False)
    original_filename = Column(String)
    columns_info = Column(Text)
    row_count = Column(Integer)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User")

    __table_args__ = (
        Index('idx_dynamic_table_name', 'table_name'),
        Index('idx_dynamic_table_user', 'user_id'),
    )
