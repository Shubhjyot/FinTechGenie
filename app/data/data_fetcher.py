from app.services.data_service import IndianStockService, NewsAPIService, MarketauxService
from app.core.config import settings
from typing import Dict, List, Any, Optional
import logging
import uuid
import os
from datetime import datetime

class FinancialDataFetcher:
    """Class for fetching and processing financial data from various sources"""
    
    def __init__(self):
        self.indian_stock_service = IndianStockService()  # Remove the argument
        self.news_api_service = NewsAPIService(settings.NEWS_API_KEY)
        self.marketaux_service = MarketauxService(settings.MARKETAUX_API_KEY)
    
    async def fetch_financial_news(self, query: Optional[str] = None, symbols: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        Fetch financial news articles
        
        Args:
            query: Optional search query
            symbols: Optional list of stock symbols
            
        Returns:
            List of processed news documents
        """
        # Prepare search query
        search_query = query
        if not search_query and symbols:
            search_query = " OR ".join(symbols)
            
        news_data = await self.news_api_service.get_financial_news(query=search_query, page_size=50)
        
        if "error" in news_data:
            logging.error(f"Error fetching news: {news_data['error']}")
            return []
            
        # Process and format the data for indexing
        documents = []
        for article in news_data.get("articles", []):
            doc = {
                "id": f"news_{uuid.uuid4()}",
                "text": f"{article.get('title', '')}. {article.get('description', '')}. {article.get('content', '')}",
                "metadata": {
                    "type": "news",
                    "title": article.get("title"),
                    "source": article.get("source", {}).get("name"),
                    "author": article.get("author"),
                    "published_at": article.get("publishedAt"),
                    "url": article.get("url"),
                    "image_url": article.get("urlToImage")
                }
            }
            documents.append(doc)
            
        return documents
        
    async def fetch_news_with_sentiment(self, symbols: List[str]) -> List[Dict[str, Any]]:
        """
        Fetch financial news with sentiment analysis
        
        Args:
            symbols: List of stock symbols
            
        Returns:
            List of processed sentiment news documents
        """
        news_data = await self.marketaux_service.get_news_with_sentiment(symbols=symbols, limit=50)
        
        if "error" in news_data:
            logging.error(f"Error fetching news with sentiment: {news_data['error']}")
            return []
            
        # Process and format the data for indexing
        documents = []
        for article in news_data.get("data", []):
            # Extract sentiment data
            sentiment = article.get("sentiment", {})
            entities = article.get("entities", [])
            
            # Create text that includes sentiment information
            sentiment_text = f"Sentiment: {sentiment.get('polarity', 'neutral')} (score: {sentiment.get('score', 0)})"
            entities_text = ", ".join([f"{e.get('name')} ({e.get('symbol')})" for e in entities if e.get('name')])
            
            doc = {
                "id": f"sentiment_news_{uuid.uuid4()}",
                "text": f"{article.get('title', '')}. {article.get('description', '')}. {sentiment_text}. Related entities: {entities_text}",
                "metadata": {
                    "type": "sentiment_news",
                    "title": article.get("title"),
                    "source": article.get("source"),
                    "published_at": article.get("published_at"),
                    "url": article.get("url"),
                    "sentiment_polarity": sentiment.get("polarity"),
                    "sentiment_score": sentiment.get("score"),
                    "entities": [e.get("symbol") for e in entities if e.get("symbol")]
                }
            }
            documents.append(doc)
            
        return documents
    
    # Update the fetch_indian_stock_data method to include text field
    async def fetch_indian_stock_data(self, stock_names: List[str]) -> List[Dict[str, Any]]:
        """
        Fetch Indian stock data for specified stock names
        
        Args:
            stock_names: List of stock names
            
        Returns:
            List of processed stock data documents
        """
        documents = []
        logging.info(f"Fetching Indian stock data for: {stock_names}")
        
        for stock_name in stock_names:
            try:
                logging.info(f"Fetching data for stock: {stock_name}")
                stock_data = await self.indian_stock_service.get_stock_data(stock_name)
                
                if "error" in stock_data:
                    logging.error(f"Error fetching Indian stock data: {stock_data['error']}")
                    continue
                    
                logging.info(f"Successfully fetched data for {stock_name}")
                
                # Create text representation
                company_name = stock_data.get("companyName", stock_name)
                industry = stock_data.get("industry", "N/A")
                
                text = f"Stock data for {company_name} in {industry} industry."
                
                if "companyProfile" in stock_data and "companyDescription" in stock_data["companyProfile"]:
                    text += f" {stock_data['companyProfile']['companyDescription']}"
                
                # Process and format the data for indexing
                doc = {
                    "id": f"indian_stock_{stock_name}_{datetime.now().strftime('%Y-%m-%d')}_{uuid.uuid4()}",
                    "text": text,  # Add text field
                    "metadata": {
                        "type": "indian_stock_data",
                        "stock_name": stock_name,
                        "date": datetime.now().strftime("%Y-%m-%d"),
                        "source": "Indian Stock API",
                    },
                    "raw_data": stock_data
                }
                documents.append(doc)
            except Exception as e:
                logging.error(f"Error processing stock data for {stock_name}: {str(e)}")
                
        logging.info(f"Total Indian stock documents: {len(documents)}")
        return documents
    
    # Update the fetch_stock_forecasts method to include text field
    async def fetch_stock_forecasts(self, stock_ids: List[str], measure_code: str, period_type: str = "Annual", data_type: str = "Actuals", age: str = "Current") -> List[Dict[str, Any]]:
        """
        Fetch stock forecast data
        
        Args:
            stock_ids: List of stock IDs
            measure_code: Measure code
            period_type: Period type
            data_type: Data type
            age: Age of data
            
        Returns:
            List of processed forecast data documents
        """
        documents = []
        
        for stock_id in stock_ids:
            try:
                forecast_data = await self.indian_stock_service.get_stock_forecasts(
                    stock_id=stock_id,
                    measure_code=measure_code,
                    period_type=period_type,
                    data_type=data_type,
                    age=age
                )
                
                if "error" in forecast_data:
                    logging.error(f"Error fetching stock forecasts: {forecast_data['error']}")
                    continue
                    
                # Create text representation
                text = f"Forecast data for {stock_id} with measure {measure_code}, period type {period_type}, data type {data_type}, age {age}."
                
                # Process and format the data for indexing
                doc = {
                    "id": f"forecast_{stock_id}_{measure_code}_{period_type}_{data_type}_{age}_{uuid.uuid4()}",
                    "text": text,  # Add text field
                    "metadata": {
                        "type": "stock_forecast",
                        "stock_id": stock_id,
                        "measure_code": measure_code,
                        "period_type": period_type,
                        "data_type": data_type,
                        "age": age,
                        "date": datetime.now().strftime("%Y-%m-%d"),
                        "source": "Indian Stock API",
                    },
                    "raw_data": forecast_data
                }
                documents.append(doc)
            except Exception as e:
                logging.error(f"Error processing forecast data for {stock_id}: {str(e)}")
                
        return documents
        
    async def fetch_comprehensive_data(self, symbols: List[str], query: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetch comprehensive financial data from all sources
        
        Args:
            symbols: List of stock symbols
            query: Optional search query for news
            
        Returns:
            List of all processed documents
        """
        logging.info(f"Fetching comprehensive data for symbols: {symbols}, query: {query}")
        
        try:
            # Fetch data from all sources
            news_data = await self.fetch_financial_news(query, symbols)
            logging.info(f"Fetched {len(news_data)} news articles")
            
            sentiment_data = await self.fetch_news_with_sentiment(symbols)
            logging.info(f"Fetched {len(sentiment_data)} sentiment news articles")
            
            indian_stock_data = await self.fetch_indian_stock_data(symbols)
            logging.info(f"Fetched {len(indian_stock_data)} Indian stock data points")
            
            # Combine all data
            all_documents = indian_stock_data + news_data + sentiment_data
            logging.info(f"Total documents fetched: {len(all_documents)}")
            
            return all_documents
        except Exception as e:
            logging.error(f"Error in fetch_comprehensive_data: {str(e)}")
            raise

    # Fix the indentation of this method to make it part of the FinancialDataFetcher class
    async def fetch_indian_stock_news(self, 
                                    stock_id: Optional[str] = None,
                                    category: Optional[str] = None,
                                    limit: int = 10) -> List[Dict[str, Any]]:
        """
        Fetch news from Indian Stock API
        
        Args:
            stock_id: Optional stock ID to filter news
            category: Optional news category
            limit: Maximum number of results
            
        Returns:
            List of processed news documents
        """
        documents = []
        logging.info(f"Fetching Indian stock news for stock_id: {stock_id}, category: {category}")
        
        try:
            news_data = await self.indian_stock_service.get_stock_news(stock_id, category, limit)
            
            if "error" in news_data:
                logging.error(f"Error fetching Indian stock news: {news_data['error']}")
                return []
                
            # Process the news data based on the API response structure
            articles = news_data
            if isinstance(news_data, dict) and "data" in news_data:
                # Handle case where articles might be nested in a data field
                articles = news_data["data"]
            
            # If articles is a list, process each article
            if isinstance(articles, list):
                for article in articles:
                    # Extract relevant fields from the article
                    title = article.get("title", "")
                    summary = article.get("summary", "")
                    url = article.get("url", "")
                    image_url = article.get("image_url", "")
                    source = article.get("source", "Indian Stock API")
                    published_at = article.get("pub_date", datetime.now().isoformat())
                    topics = article.get("topics", [])
                    
                    # Create text representation
                    text = f"{title}. {summary}"
                    
                    # Create document
                    doc = {
                        "id": f"indian_stock_news_{uuid.uuid4()}",
                        "text": text,
                        "metadata": {
                            "type": "indian_stock_news",
                            "title": title,
                            "source": source,
                            "published_at": published_at,
                            "url": url,
                            "image_url": image_url,
                            "stock_id": stock_id,
                            "category": category,
                            "topics": topics
                        }
                    }
                    documents.append(doc)
            else:
                logging.error(f"Unexpected response format: {news_data}")
                
        except Exception as e:
            logging.error(f"Error processing Indian stock news: {str(e)}")
            
        logging.info(f"Total Indian stock news documents: {len(documents)}")
        return documents