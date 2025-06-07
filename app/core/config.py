import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    PROJECT_NAME: str = "VittSaar - AI Financial Research Assistant"
    PROJECT_DESCRIPTION: str = "An AI-powered research assistant for generating comprehensive financial reports"
    API_V1_STR: str = "/api/v1"
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY")
    PINECONE_ENVIRONMENT: str = os.getenv("PINECONE_ENVIRONMENT")
    HUGGINGFACE_TOKEN: str = os.getenv("HUGGINGFACE_TOKEN")
    
    # Financial Data API Keys
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY")
    MARKETAUX_API_KEY: str = os.getenv("MARKETAUX_API_KEY")
    INDIAN_STOCK_API_KEY: str = os.getenv("INDIAN_STOCK_API_KEY", "sk-live-tCFhNlGH3qG8ObK4MinbWeC7K5Y9yxZjdnVnfzNs")
    
    # Configuration
    PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL")
    MAX_DOCUMENTS_RETRIEVED: int = int(os.getenv("MAX_DOCUMENTS_RETRIEVED"))
    
    # Report Generation
    DEFAULT_REPORT_SECTIONS = [
        "Executive Summary",
        "Market Overview",
        "Key Trends",
        "Financial Metrics",
        "Risk Analysis",
        "Recommendations"
    ]

settings = Settings()