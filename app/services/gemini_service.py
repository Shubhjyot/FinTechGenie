import google.generativeai as genai
from app.core.config import settings
from typing import List, Dict, Any, Optional

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    async def generate_response(self, query: str, context: List[str], 
                               report_type: str = "general") -> str:
        """
        Generate a response using the Gemini API with RAG approach
        
        Args:
            query: The user's query
            context: List of retrieved document excerpts
            report_type: Type of report (e.g., "equity", "venture_capital", "investment_banking")
            
        Returns:
            Generated response from Gemini API
        """
        # Combine context into a single string
        context_text = "\n\n".join([f"Document {i+1}: {doc}" for i, doc in enumerate(context)])
        
        # Create a prompt that includes the query, context, and instructions
        prompt = f"""
        User Query: {query}
        
        Context Information:
        {context_text}
        
        Task: Based on the user query and the provided context, generate a comprehensive financial research report.
        The report should be well-structured, factually accurate, and provide valuable insights for {report_type} analysis.
        Include relevant metrics, trends, and actionable recommendations where appropriate.
        Ensure all information is grounded in the provided context.
        """
        
        # Generate response
        response = self.model.generate_content(prompt)
        return response.text
    
    async def generate_structured_report(self, 
                                        query: str, 
                                        context: List[str],
                                        report_type: str,
                                        sections: Optional[List[str]] = None) -> Dict[str, str]:
        """
        Generate a structured report with predefined sections
        
        Args:
            query: The user's query
            context: List of retrieved document excerpts
            report_type: Type of report
            sections: Custom sections for the report (optional)
            
        Returns:
            Dictionary with section names as keys and content as values
        """
        if sections is None:
            sections = settings.DEFAULT_REPORT_SECTIONS
            
        report = {}
        
        # Generate content for each section
        for section in sections:
            section_prompt = f"""
            User Query: {query}
            
            Context Information:
            {"\n\n".join([f"Document {i+1}: {doc}" for i, doc in enumerate(context)])}
            
            Task: Generate the "{section}" section of a financial research report for {report_type} analysis.
            Focus specifically on information relevant to this section.
            Ensure all information is factually accurate and grounded in the provided context.
            """
            
            response = self.model.generate_content(section_prompt)
            report[section] = response.text
            
        return report