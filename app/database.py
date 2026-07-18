from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# We use SQLite for simplicity. It stores data in a file named "crm.db" in the root directory.
SQLALCHEMY_DATABASE_URL = "sqlite:///./crm.db"

# Create the SQLAlchemy engine. 
# check_same_thread=False is needed for SQLite to allow multiple threads (FastAPI async) to share the same connection.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a SessionLocal class. Each instance of this class will be a database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our models. All our models will inherit from this Base.
Base = declarative_base()

# Dependency to get the database session in our routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
