from app.services.gemini_service import GeminiService
from app.services.retrieval_service import RetrievalService
from typing import List, Dict, Any, Optional

class ReportGenerator:
    def __init__(self):
        self.gemini_service = GeminiService()
        self.retrieval_service = RetrievalService()
    
    async def generate_report(self, 
                             query: str, 
                             report_type: str = "general",
                             structured: bool = True,
                             sections: Optional[List[str]] = None,
                             top_k: Optional[int] = None) -> Dict[str, Any]:
        """
        Generate a comprehensive research report based on a query
        
        Args:
            query: The user's query
            report_type: Type of report (e.g., "equity", "venture_capital", "investment_banking")
            structured: Whether to generate a structured report with sections
            sections: Custom sections for structured reports
            top_k: Number of documents to retrieve
            
        Returns:
            Dictionary containing the generated report
        """
        # Retrieve relevant documents
        documents = await self.retrieval_service.retrieve_relevant_documents(query, top_k)
        
        # Extract text from documents for context
        context = [doc['text'] for doc in documents]
        
        # Generate report
        if structured:
            report_content = await self.gemini_service.generate_structured_report(
                query=query,
                context=context,
                report_type=report_type,
                sections=sections
            )
        else:
            report_content = await self.gemini_service.generate_response(
                query=query,
                context=context,
                report_type=report_type
            )
        
        # Prepare response
        report = {
            "query": query,
            "report_type": report_type,
            "content": report_content,
            "sources": [
                {
                    "id": doc["id"],
                    "source": doc["source"],
                    "date": doc["date"],
                    "relevance_score": doc["score"]
                } for doc in documents
            ]
        }
        
        return report