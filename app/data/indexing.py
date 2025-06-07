import os
import json
import pandas as pd
from typing import List, Dict, Any, Optional
from app.services.retrieval_service import RetrievalService
import uuid

class DataIndexer:
    def __init__(self):
        self.retrieval_service = RetrievalService()
    
    async def index_text_document(self, 
                                 text: str, 
                                 source: str, 
                                 doc_type: str,
                                 date: Optional[str] = None,
                                 metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        Index a single text document
        
        Args:
            text: Document text content
            source: Source of the document
            doc_type: Type of document (e.g., "filing", "news", "report")
            date: Document date (optional)
            metadata: Additional metadata (optional)
            
        Returns:
            Document ID
        """
        if metadata is None:
            metadata = {}
            
        # Create document ID if not provided
        doc_id = str(uuid.uuid4())
        
        # Prepare document
        document = {
            "id": doc_id,
            "text": text,
            "metadata": {
                "text": text,  # Include text in metadata for retrieval
                "source": source,
                "type": doc_type,
                "date": date,
                **metadata
            }
        }
        
        # Index document
        await self.retrieval_service.index_document(document)
        return doc_id
    
    async def index_csv_file(self, 
                            file_path: str, 
                            text_column: str,
                            source_column: Optional[str] = None,
                            date_column: Optional[str] = None,
                            doc_type: str = "structured_data") -> List[str]:
        """
        Index documents from a CSV file
        
        Args:
            file_path: Path to CSV file
            text_column: Column containing text to index
            source_column: Column containing source information (optional)
            date_column: Column containing date information (optional)
            doc_type: Type of document
            
        Returns:
            List of document IDs
        """
        # Read CSV
        df = pd.read_csv(file_path)
        
        doc_ids = []
        for _, row in df.iterrows():
            text = row[text_column]
            source = row[source_column] if source_column and source_column in row else os.path.basename(file_path)
            date = row[date_column] if date_column and date_column in row else None
            
            # Create metadata from row
            metadata = {col: row[col] for col in df.columns if col not in [text_column]}
            
            # Index document
            doc_id = await self.index_text_document(
                text=text,
                source=source,
                doc_type=doc_type,
                date=date,
                metadata=metadata
            )
            doc_ids.append(doc_id)
            
        return doc_ids
    
    async def index_json_file(self, 
                             file_path: str,
                             text_field: str,
                             source_field: Optional[str] = None,
                             date_field: Optional[str] = None,
                             doc_type: str = "structured_data") -> List[str]:
        """
        Index documents from a JSON file
        
        Args:
            file_path: Path to JSON file
            text_field: Field containing text to index
            source_field: Field containing source information (optional)
            date_field: Field containing date information (optional)
            doc_type: Type of document
            
        Returns:
            List of document IDs
        """
        # Read JSON
        with open(file_path, 'r') as f:
            data = json.load(f)
            
        # Handle both single object and list of objects
        if not isinstance(data, list):
            data = [data]
            
        doc_ids = []
        for item in data:
            text = item.get(text_field, "")
            source = item.get(source_field, os.path.basename(file_path)) if source_field else os.path.basename(file_path)
            date = item.get(date_field) if date_field else None
            
            # Index document
            doc_id = await self.index_text_document(
                text=text,
                source=source,
                doc_type=doc_type,
                date=date,
                metadata=item
            )
            doc_ids.append(doc_id)
            
        return doc_ids