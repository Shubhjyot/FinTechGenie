from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from app.core.config import settings
from typing import List, Dict, Any
import logging

class RetrievalService:
    def __init__(self):
        # Initialize Pinecone with the new API
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        
        # Get the embedding model first to determine dimension
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.dimension = len(self.get_embedding("test"))  # Get dimension from a test embedding
        
        # Check if index exists
        index_list = self.pc.list_indexes().names()
        
        if settings.PINECONE_INDEX_NAME not in index_list:
            # Create index with the correct dimension
            logging.info(f"Creating new index with dimension {self.dimension}")
            # Create a spec for the serverless index
            spec = ServerlessSpec(
                cloud="aws",
                region=settings.PINECONE_ENVIRONMENT
            )
            self.pc.create_index(
                name=settings.PINECONE_INDEX_NAME,
                dimension=self.dimension,  # Use the actual dimension from the model
                metric="cosine",
                spec=spec  # Add the required spec parameter
            )
        else:
            # Check if existing index has the correct dimension
            index_info = self.pc.describe_index(settings.PINECONE_INDEX_NAME)
            existing_dimension = index_info.dimension
            
            if existing_dimension != self.dimension:
                logging.warning(f"Dimension mismatch: Model uses {self.dimension} but index has {existing_dimension}")
                # Delete the old index and create a new one with the correct dimension
                logging.info(f"Deleting index {settings.PINECONE_INDEX_NAME} and creating a new one")
                self.pc.delete_index(settings.PINECONE_INDEX_NAME)
                # Create a spec for the serverless index
                spec = ServerlessSpec(
                    cloud="aws",
                    region=settings.PINECONE_ENVIRONMENT
                )
                self.pc.create_index(
                    name=settings.PINECONE_INDEX_NAME,
                    dimension=self.dimension,
                    metric="cosine",
                    spec=spec  # Add the required spec parameter
                )
            
        # Connect to index
        self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)
    
    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding for a text string"""
        return self.embedding_model.encode(text).tolist()
    
    async def index_document(self, document: Dict[str, Any]) -> str:
        """
        Index a document in the vector database
        
        Args:
            document: Dictionary containing document data with at least 'id', 'text', and 'metadata'
            
        Returns:
            Document ID
        """
        doc_id = document['id']
        text = document['text']
        metadata = document.get('metadata', {})
        
        # Generate embedding
        embedding = self.get_embedding(text)
        
        # Upsert to Pinecone
        self.index.upsert(
            vectors=[(doc_id, embedding, metadata)]
        )
        
        return doc_id
    
    async def retrieve_relevant_documents(self, query: str, top_k: int = None) -> List[Dict[str, Any]]:
        """
        Retrieve relevant documents for a query
        
        Args:
            query: The user's query
            top_k: Number of documents to retrieve (defaults to MAX_DOCUMENTS_RETRIEVED)
            
        Returns:
            List of relevant documents with their metadata and text
        """
        if top_k is None:
            top_k = settings.MAX_DOCUMENTS_RETRIEVED
            
        # Generate query embedding
        query_embedding = self.get_embedding(query)
        
        # Query Pinecone
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True
        )
        
        # Format results
        documents = []
        for match in results['matches']:
            documents.append({
                'id': match['id'],
                'score': match['score'],
                'text': match['metadata'].get('text', ''),
                'source': match['metadata'].get('source', ''),
                'date': match['metadata'].get('date', ''),
                'metadata': match['metadata']
            })
            
        return documents