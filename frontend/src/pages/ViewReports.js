import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchIndianStockNews } from '../services/api';
import { FiLoader, FiAlertCircle, FiFileText, FiCalendar } from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';

const PageContainer = styled.div`
  padding: 3rem 0;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

// Removed SearchContainer and SearchInput styled components

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ReportCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const ReportHeader = styled.div`
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ReportTitle = styled.h3`
  margin-bottom: 0.5rem;
`;

const ReportMeta = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.textLight};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  
  svg {
    margin-right: 0.25rem;
  }
  
  span {
    margin-right: 1rem;
    display: flex;
    align-items: center;
  }
`;

const ReportExcerpt = styled.div`
  margin-bottom: 1rem;
  flex-grow: 1;
  color: ${props => props.theme.colors.textLight};
  
  p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const ReportFooter = styled.div`
  margin-top: auto;
`;

const Tag = styled.span`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary}22;
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  animation: spin 1.5s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.error}22;
  color: ${props => props.theme.colors.error};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  
  svg {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textLight};
  
  h3 {
    margin-bottom: 1rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.large};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85); /* Increased opacity for better contrast */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(5px); /* Adds a blur effect to the background */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.textLight};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ReportContent = styled.div`
  line-height: 1.7;
  background-color: ${props => props.theme.colors.background};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  blockquote {
    border-left: 4px solid ${props => props.theme.colors.border};
    padding-left: 1rem;
    margin-left: 0;
    color: ${props => props.theme.colors.textLight};
  }
  
  code {
    background-color: ${props => props.theme.colors.border};
    padding: 0.2rem 0.4rem;
    border-radius: ${props => props.theme.borderRadius.small};
    font-family: monospace;
  }
  
  pre {
    background-color: #f6f8fa;
    padding: 1rem;
    border-radius: ${props => props.theme.borderRadius.medium};
    overflow-x: auto;
    margin-bottom: 1rem;
    
    code {
      background-color: transparent;
      padding: 0;
    }
  }
`;

const ViewReports = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  
  // Removed searchQuery state and related functions
  
  useEffect(() => {
    // Fetch news on component mount
    fetchNewsData();
  }, []);
  
  const fetchNewsData = async (stockId = null) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetchIndianStockNews({ 
        stock_id: stockId,
        limit: 10
      });
      
      if (response.status === 'success' && response.data) {
        setNews(response.data);
      } else {
        setError('Failed to fetch news data');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.response?.data?.detail || 'Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Removed handleSearch function
  
  const closeReportModal = () => {
    setSelectedNews(null);
  };
  
  // Update this function to work with news items if needed
  const renderNewsContent = (newsItem) => {
    return (
      <div>
        <p>{newsItem.text}</p>
        {newsItem.metadata.url && (
          <p>
            <a href={newsItem.metadata.url} target="_blank" rel="noopener noreferrer">
              Read original article
            </a>
          </p>
        )}
      </div>
    );
  };
  
  return (
    <PageContainer>
      <div className="container">
        <PageTitle>Latest Financial News</PageTitle>
        
        {/* Removed SearchContainer component */}
        
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner>
              <FiLoader />
            </LoadingSpinner>
            <p>Loading news...</p>
          </LoadingContainer>
        ) : error ? (
          <ErrorMessage>
            <FiAlertCircle />
            {error}
          </ErrorMessage>
        ) : news.length === 0 ? (
          <EmptyState>
            <h3>No news found</h3>
            <p>Check back later for new content.</p>
          </EmptyState>
        ) : (
          <ReportsGrid>
            {news.map((item) => (
              <ReportCard key={item.id} onClick={() => setSelectedNews(item)}>
                <ReportHeader>
                  <ReportTitle>{item.metadata.title}</ReportTitle>
                  <ReportMeta>
                    <span>
                      <FiCalendar />
                      {new Date(item.metadata.published_at).toLocaleDateString()}
                    </span>
                    <span>
                      <FiFileText />
                      {item.metadata.source}
                    </span>
                  </ReportMeta>
                </ReportHeader>
                <ReportExcerpt>
                  <p>{item.text.substring(0, 150)}...</p>
                </ReportExcerpt>
                <ReportFooter>
                  <Button size="small">View Full Report</Button>
                </ReportFooter>
              </ReportCard>
            ))}
          </ReportsGrid>
        )}
        
        {selectedNews && (
          <ModalBackdrop onClick={() => setSelectedNews(null)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => setSelectedNews(null)}>×</CloseButton>
              <ReportHeader>
                <ReportTitle>{selectedNews.metadata.title}</ReportTitle>
                <ReportMeta>
                  <span>
                    <FiCalendar />
                    {new Date(selectedNews.metadata.published_at).toLocaleDateString()}
                  </span>
                  <span>
                    <FiFileText />
                    {selectedNews.metadata.source}
                  </span>
                </ReportMeta>
              </ReportHeader>
              <ReportContent>
                <p>{selectedNews.text}</p>
                {selectedNews.metadata.url && (
                  <p>
                    <a href={selectedNews.metadata.url} target="_blank" rel="noopener noreferrer">
                      Read original article
                    </a>
                  </p>
                )}
              </ReportContent>
            </ModalContent>
          </ModalBackdrop>
        )}
      </div>
    </PageContainer>
  );
};

export default ViewReports;