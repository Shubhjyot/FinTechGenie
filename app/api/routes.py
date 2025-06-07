from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.services.report_generator import ReportGenerator
from app.data.indexing import DataIndexer
from app.data.data_fetcher import FinancialDataFetcher
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize router and services
router = APIRouter()
report_generator = ReportGenerator()
data_indexer = DataIndexer()
financial_data_fetcher = FinancialDataFetcher()

# Request models
class ReportRequest(BaseModel):
    query: str
    report_type: str = "general"
    structured: bool = True
    sections: Optional[List[str]] = None
    top_k: Optional[int] = None

class IndexTextRequest(BaseModel):
    text: str
    source: str
    doc_type: str
    date: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

# Report generation endpoint
@router.post("/generate-report", response_model=Dict[str, Any])
async def generate_report(request: ReportRequest):
    """Generate a comprehensive research report based on a query"""
    try:
        report = await report_generator.generate_report(
            query=request.query,
            report_type=request.report_type,
            structured=request.structured,
            sections=request.sections,
            top_k=request.top_k
        )
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

# Document indexing endpoints
@router.post("/index-text", response_model=Dict[str, str])
async def index_text(request: IndexTextRequest):
    """Index a text document"""
    try:
        doc_id = await data_indexer.index_text_document(
            text=request.text,
            source=request.source,
            doc_type=request.doc_type,
            date=request.date,
            metadata=request.metadata
        )
        return {"status": "success", "document_id": doc_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error indexing document: {str(e)}")

@router.post("/index-csv", response_model=Dict[str, Any])
async def index_csv(
    file: UploadFile = File(...),
    text_column: str = Form(...),
    source_column: Optional[str] = Form(None),
    date_column: Optional[str] = Form(None),
    doc_type: str = Form("structured_data")
):
    """Index documents from a CSV file"""
    try:
        # Save uploaded file temporarily
        file_path = f"/tmp/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # Index documents
        doc_ids = await data_indexer.index_csv_file(
            file_path=file_path,
            text_column=text_column,
            source_column=source_column,
            date_column=date_column,
            doc_type=doc_type
        )
        
        return {
            "status": "success", 
            "indexed_documents": len(doc_ids),
            "document_ids": doc_ids
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error indexing CSV file: {str(e)}")

@router.post("/index-json", response_model=Dict[str, Any])
async def index_json(
    file: UploadFile = File(...),
    text_field: str = Form(...),
    source_field: Optional[str] = Form(None),
    date_field: Optional[str] = Form(None),
    doc_type: str = Form("structured_data")
):
    """Index documents from a JSON file"""
    try:
        # Save uploaded file temporarily
        file_path = f"/tmp/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # Index documents
        doc_ids = await data_indexer.index_json_file(
            file_path=file_path,
            text_field=text_field,
            source_field=source_field,
            date_field=date_field,
            doc_type=doc_type
        )
        
        return {
            "status": "success", 
            "indexed_documents": len(doc_ids),
            "document_ids": doc_ids
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error indexing JSON file: {str(e)}")

# Financial data endpoints
@router.post("/fetch-and-index-data", response_model=Dict[str, Any])
async def fetch_and_index_financial_data(
    symbols: List[str],
    query: Optional[str] = None
):
    """Fetch financial data and index it for retrieval"""
    try:
        # Fetch comprehensive data
        documents = await financial_data_fetcher.fetch_comprehensive_data(symbols, query)
        
        # Add debug logging
        logging.info(f"Fetched {len(documents)} documents")
        for doc_type in ["indian_stock_data", "news", "sentiment_news"]:
            count = len([d for d in documents if d["metadata"].get("type") == doc_type])
            logging.info(f"Document type {doc_type}: {count}")
        
        # Index all documents
        indexed_docs = []
        for doc in documents:
            doc_id = await data_indexer.index_text_document(
                text=doc["text"],
                source=doc["metadata"].get("source", "Unknown"),
                doc_type=doc["metadata"].get("type", "financial_data"),
                date=doc["metadata"].get("date") or doc["metadata"].get("published_at"),
                metadata=doc["metadata"]
            )
            indexed_docs.append(doc_id)
            
        return {
            "status": "success",
            "indexed_documents": len(indexed_docs),
            "document_types": {
                "indian_stock_data": len([d for d in documents if d["metadata"].get("type") == "indian_stock_data"]),
                "news": len([d for d in documents if d["metadata"].get("type") == "news"]),
                "sentiment_news": len([d for d in documents if d["metadata"].get("type") == "sentiment_news"])
            },
            "data": documents  # Add this line to include the actual data in the response
        }
    except Exception as e:
        logging.error(f"Error in fetch_and_index_financial_data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching financial data: {str(e)}")

# Helper function to index data
async def index_data_helper(documents, doc_type="financial_data"):
    """Helper function to index data and return results"""
    if not documents:
        return {"status": "success", "data": documents, "indexed": False}
        
    indexed_docs = []
    for doc in documents:
        doc_id = await data_indexer.index_text_document(
            text=doc["text"],
            source=doc["metadata"].get("source", "Unknown"),
            doc_type=doc["metadata"].get("type", doc_type),
            date=doc["metadata"].get("date") or doc["metadata"].get("published_at"),
            metadata=doc["metadata"]
        )
        indexed_docs.append(doc_id)
    
    return {
        "status": "success", 
        "data": documents,
        "indexed": True,
        "indexed_documents": len(indexed_docs)
    }

# Indian Stock API endpoints
@router.get("/fetch-indian-stock", response_model=Dict[str, Any])
async def get_indian_stock_data(stock_name: str, index_data: bool = False):
    """Fetch Indian stock data for specified stock name with option to index"""
    try:
        stock_data = await financial_data_fetcher.fetch_indian_stock_data([stock_name])
        
        if index_data and stock_data:
            return await index_data_helper(stock_data, "indian_stock_data")
        
        return {"status": "success", "data": stock_data, "indexed": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Indian stock data: {str(e)}")

@router.get("/fetch-stock-forecasts", response_model=Dict[str, Any])
async def get_stock_forecasts(
    stock_id: str, 
    measure_code: str, 
    period_type: str = "Annual", 
    data_type: str = "Actuals", 
    age: str = "Current",
    index_data: bool = False
):
    """Fetch stock forecast data with option to index"""
    try:
        forecast_data = await financial_data_fetcher.fetch_stock_forecasts(
            [stock_id], 
            measure_code, 
            period_type, 
            data_type, 
            age
        )
        
        if index_data and forecast_data:
            return await index_data_helper(forecast_data, "stock_forecast")
        
        return {"status": "success", "data": forecast_data, "indexed": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock forecasts: {str(e)}")

# Legacy financial data endpoints
@router.get("/fetch-news", response_model=Dict[str, Any])
async def get_financial_news(query: Optional[str] = None, symbols: Optional[str] = None, index_data: bool = False):
    """Fetch financial news articles with option to index"""
    try:
        symbol_list = symbols.split(",") if symbols else None
        news_data = await financial_data_fetcher.fetch_financial_news(query, symbol_list)
        
        if index_data and news_data:
            return await index_data_helper(news_data, "news")
        
        return {"status": "success", "data": news_data, "indexed": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching news: {str(e)}")

@router.get("/fetch-sentiment-news", response_model=Dict[str, Any])
async def get_sentiment_news(symbols: str, index_data: bool = False):
    """Fetch financial news with sentiment analysis with option to index"""
    try:
        symbol_list = symbols.split(",")
        sentiment_data = await financial_data_fetcher.fetch_news_with_sentiment(symbol_list)
        
        if index_data and sentiment_data:
            return await index_data_helper(sentiment_data, "sentiment_news")
        
        return {"status": "success", "data": sentiment_data, "indexed": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sentiment news: {str(e)}")
    
# Add this route to your routes.py file

@router.get("/fetch-indian-stock-news", response_model=Dict[str, Any])
async def get_indian_stock_news(
    stock_id: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 10,
    index_data: bool = False
):
    """Fetch news from Indian Stock API with option to index"""
    try:
        news_data = await financial_data_fetcher.fetch_indian_stock_news(stock_id, category, limit)
        
        if index_data and news_data:
            return await index_data_helper(news_data, "indian_stock_news")
        
        return {"status": "success", "data": news_data, "indexed": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Indian stock news: {str(e)}")
    