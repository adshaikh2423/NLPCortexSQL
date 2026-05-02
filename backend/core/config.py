import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "NLPCortexSQL"
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    MODEL_ID: str = "gemini-2.0-flash"

settings = Settings()
