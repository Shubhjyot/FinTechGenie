import aiohttp
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import time
from typing import Dict, Any

class IndianStockService:
    """Service for fetching stock data from Indian Stock API"""
    
    BASE_URL = "https://stock.indianapi.in"
    
    def __init__(self, api_key: str = None):
        self.api_key = "sk-live-xn1VNZFwe3bO2pMeqgTLA3jXtJJkjYf9QUdDxC4A"
        self.headers = {
            "X-API-Key": self.api_key,  # Changed from Authorization to X-API-Key
            "Content-Type": "application/json"
        }
        self.base_url = self.BASE_URL
        self.rate_limit_delay = 1

    async def get_stock_data(self, stock_name: str) -> Dict[str, Any]:
        """
        Fetch stock data for a given stock name
        
        Args:
            stock_name: Name of the stock (e.g., "Reliance")
            
        Returns:
            Dictionary containing stock data
        """
        params = {
            "name": stock_name
        }
        
        logging.info(f"Making request to {self.BASE_URL}/stock with params: {params}")
        logging.info(f"Using headers: {self.headers}")
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.BASE_URL}/stock", params=params, headers=self.headers) as response:
                    status = response.status
                    logging.info(f"Response status: {status}")
                    
                    if status != 200:
                        error_text = await response.text()
                        logging.error(f"API error: {error_text}")
                        return {"error": f"API returned status {status}: {error_text}"}
                    
                    # Try to parse as JSON first
                    try:
                        data = await response.json()
                        logging.info(f"API response (JSON): {data}")
                        return data
                    except Exception as json_error:
                        # If JSON parsing fails, get the text and create a structured response
                        text_data = await response.text()
                        logging.info(f"API response (Text): {text_data}")
                        
                        # Create a structured response from the text
                        return {
                            "stock_name": stock_name,
                            "data": text_data,
                            "response_type": "text",
                            "timestamp": datetime.now().isoformat()
                        }
        except Exception as e:
            logging.error(f"Error fetching stock data: {str(e)}")
            return {"error": str(e)}
            
    async def get_stock_forecasts(self, 
                                stock_id: str, 
                                measure_code: str, 
                                period_type: str = "Annual", 
                                data_type: str = "Actuals", 
                                age: str = "Current") -> Dict[str, Any]:
        """
        Fetch stock forecast data
        
        Args:
            stock_id: Stock ID (e.g., "tcs")
            measure_code: Measure code (e.g., "EPS")
            period_type: Period type (e.g., "Annual")
            data_type: Data type (e.g., "Actuals")
            age: Age of data (e.g., "Current")
            
        Returns:
            Dictionary containing forecast data
        """
        params = {
            "stock_id": stock_id,
            "measure_code": measure_code,
            "period_type": period_type,
            "data_type": data_type,
            "age": age
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.BASE_URL}/stock_forecasts", params=params, headers=self.headers) as response:
                    status = response.status
                    logging.info(f"Response status: {status}")
                    
                    if status != 200:
                        error_text = await response.text()
                        logging.error(f"API error: {error_text}")
                        return {"error": f"API returned status {status}: {error_text}"}
                    
                    # Try to parse as JSON first
                    try:
                        data = await response.json()
                        logging.info(f"API response (JSON): {data}")
                        return data
                    except Exception as json_error:
                        # If JSON parsing fails, get the text and create a structured response
                        text_data = await response.text()
                        logging.info(f"API response (Text): {text_data}")
                        
                        # Create a structured response from the text
                        return {
                            "stock_id": stock_id,
                            "measure_code": measure_code,
                            "period_type": period_type,
                            "data_type": data_type,
                            "age": age,
                            "data": text_data,
                            "response_type": "text",
                            "timestamp": datetime.now().isoformat()
                        }
        except Exception as e:
            logging.error(f"Error fetching stock forecasts: {str(e)}")
            return {"error": str(e)}
    
    # Update the get_stock_news method in your IndianStockService class
    
    async def get_stock_news(self, 
                       stock_id: Optional[str] = None,
                       category: Optional[str] = None,
                       limit: int = 10) -> Dict[str, Any]:
        """
        Fetch news articles from Indian Stock API
        
        Args:
            stock_id: Optional stock ID to filter news
            category: Optional news category
            limit: Maximum number of results
            
        Returns:
            Dictionary containing news articles
        """
        # For the simple /news endpoint, we don't need any parameters
        # as per your instructions
        
        logging.info(f"Making request to {self.BASE_URL}/news")
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.BASE_URL}/news", headers=self.headers) as response:
                    status = response.status
                    logging.info(f"Response status: {status}")
                    
                    if status != 200:
                        error_text = await response.text()
                        logging.error(f"API error: {error_text}")
                        return {"error": f"API returned status {status}: {error_text}"}
                    
                    try:
                        data = await response.json()
                        logging.info(f"API response (JSON): {data}")
                        return data
                    except Exception as json_error:
                        text_data = await response.text()
                        logging.info(f"API response (Text): {text_data}")
                        
                        return {
                            "error": "Failed to parse JSON response",
                            "text_data": text_data
                        }
        except Exception as e:
            logging.error(f"Error fetching stock news: {str(e)}")
            return {"error": str(e)}


class NewsAPIService:
    """Service for fetching financial news from News API"""
    
    BASE_URL = "https://newsapi.org/v2"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        
    async def get_financial_news(self, 
                               query: Optional[str] = None,
                               sources: Optional[List[str]] = None,
                               from_date: Optional[str] = None,
                               to_date: Optional[str] = None,
                               page_size: int = 20,
                               page: int = 1) -> Dict[str, Any]:
        """
        Fetch financial news articles
        
        Args:
            query: Search query (e.g., "Apple" or "AAPL stock")
            sources: List of news sources
            from_date: Start date in format YYYY-MM-DD
            to_date: End date in format YYYY-MM-DD
            page_size: Number of results per page
            page: Page number
            
        Returns:
            Dictionary containing news articles
        """
        # Set default category if no query or sources
        category = "business" if not query and not sources else None
        
        # Prepare request parameters
        params = {
            "apiKey": self.api_key,
            "pageSize": page_size,
            "page": page,
            "language": "en"
        }
        
        if query:
            params["q"] = query
        if sources:
            params["sources"] = ",".join(sources)
        if category:
            params["category"] = category
        if from_date:
            params["from"] = from_date
        if to_date:
            params["to"] = to_date
            
        try:
            endpoint = f"{self.BASE_URL}/everything" if query or sources else f"{self.BASE_URL}/top-headlines"
            async with aiohttp.ClientSession() as session:
                async with session.get(endpoint, params=params) as response:
                    response.raise_for_status()
                    return await response.json()
        except Exception as e:
            logging.error(f"Error fetching news: {str(e)}")
            return {"error": str(e)}


class MarketauxService:
    """Service for fetching financial news with sentiment analysis from Marketaux"""
    
    BASE_URL = "https://api.marketaux.com/v1"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        
    async def get_news_with_sentiment(self, 
                                    symbols: Optional[List[str]] = None,
                                    industries: Optional[List[str]] = None,
                                    countries: Optional[List[str]] = None,
                                    limit: int = 10,
                                    published_after: Optional[str] = None) -> Dict[str, Any]:
        """
        Fetch financial news with sentiment analysis
        
        Args:
            symbols: List of stock symbols
            industries: List of industries
            countries: List of country codes
            limit: Maximum number of results
            published_after: Articles published after this date (YYYY-MM-DD)
            
        Returns:
            Dictionary containing news with sentiment analysis
        """
        # Prepare request parameters
        params = {
            "api_token": self.api_key,
            "limit": limit,
            "language": "en"
        }
        
        if symbols:
            params["symbols"] = ",".join(symbols)
        if industries:
            params["industries"] = ",".join(industries)
        if countries:
            params["countries"] = ",".join(countries)
        if published_after:
            params["published_after"] = published_after
            
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.BASE_URL}/news/all", params=params) as response:
                    response.raise_for_status()
                    return await response.json()
        except Exception as e:
            logging.error(f"Error fetching news with sentiment: {str(e)}")
            return {"error": str(e)}

    async def fetch_data(self, endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        try:
            time.sleep(self.rate_limit_delay)  # Add delay to respect rate limits
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/{endpoint}",
                    headers=self.headers,
                    params=params
                ) as response:
                    if response.status == 429:
                        time.sleep(5)  # Wait longer on rate limit
                        return await self.fetch_data(endpoint, params)  # Retry
                    return await response.json()
        except Exception as e:
            logging.error(f"Error fetching data: {str(e)}")
            raise