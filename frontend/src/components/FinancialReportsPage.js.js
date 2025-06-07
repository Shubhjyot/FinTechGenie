import { fetchIndianStockNews } from '../services/api';
import { useState, useEffect } from 'react';

function FinancialReportsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadNews();
  }, []);
  
  const loadNews = async (stockId = null) => {
    setLoading(true);
    try {
      const response = await fetchIndianStockNews({ 
        stock_id: stockId,
        limit: 10
      });
      
      if (response.status === 'success' && response.data) {
        setNews(response.data);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1>View Financial Reports</h1>
      
      <div className="news-section">
        <h2>Latest News</h2>
        {loading ? (
          <p>Loading news...</p>
        ) : (
          <div className="news-grid">
            {news.map((item) => (
              <div key={item.id} className="news-card">
                {item.metadata.image_url && (
                  <img src={item.metadata.image_url} alt={item.metadata.title} />
                )}
                <h3>{item.metadata.title}</h3>
                <p>{item.text.substring(0, 150)}...</p>
                <div className="news-meta">
                  <span>{item.metadata.source}</span>
                  <span>{new Date(item.metadata.published_at).toLocaleDateString()}</span>
                </div>
                {item.metadata.url && (
                  <a href={item.metadata.url} target="_blank" rel="noopener noreferrer">
                    Read More
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FinancialReportsPage;