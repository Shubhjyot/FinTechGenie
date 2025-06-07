import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchNews } from '../services/api';
import { FiLoader, FiAlertCircle, FiCalendar, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
`;

const StockCard = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const StockCardTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StockInfoSection = styled.div`
  margin-bottom: 2rem;
`;

const StockInfoTitle = styled.h4`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FinancialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FinancialCard = styled(Card)`
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
`;

const StockLabel = styled.span`
  font-weight: 500;
  margin-right: 0.5rem;
`;

const StockValue = styled.span`
  color: ${props => props.theme.colors.textLight};
`;

const StockDetail = styled.div`
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const OfficersList = styled.div`
  display: grid;
  gap: 1rem;
`;

const OfficerCard = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
`;

const NewsSection = styled(StockInfoSection)`
  margin-top: 2rem;
`;

const NewsItem = styled.div`
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: 1rem;
`;

const NewsContent = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const NewsDate = styled.span`
  color: ${props => props.theme.colors.textLight};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
`;

const ChartSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const ChartControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ChartContainer = styled.div`
  margin: 2rem 0;
  height: 400px;
`;

const ApiInfoBox = styled.div`
  background-color: ${props => props.theme.colors.primary}11;
  border: 1px solid ${props => props.theme.colors.primary}33;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ApiInfoTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const RetryButton = styled(Button)`
  margin-top: 1rem;
`;

// Move ErrorMessage before ConnectionErrorMessage
const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.error};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  background: ${props => props.theme.colors.error}11;
  margin: 1rem 0;
`;

const ConnectionErrorMessage = styled(ErrorMessage)`
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem;
  
  svg {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const StockCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const StockMetadata = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
`;

const StockDescription = styled.p`
  line-height: 1.6;
  color: ${props => props.theme.colors.text}cc;
  margin-bottom: 1.5rem;
`;

const StockSymbolInput = styled(Input)`
  text-transform: uppercase;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
`;

// Add these styled components after the existing ones

const PageContainer = styled.div`
  padding: 3rem 0;
`;

const PageTitle = styled.h1`
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.primary};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`;

const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const FinancialValue = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
`;

const StockTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const MetricButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.primary}22;
  }
`;

const theme = {
  colors: {
    primary: '#007AFF',
    error: '#FF3B30',
    text: '#000000',
    textLight: '#666666',
    border: '#E5E5EA',
    background: '#FFFFFF',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
  },
};

const formatAmount = (value, displayName) => {
  const numValue = parseFloat(value);
  const percentageTerms = ['Margin', 'Ratio', 'Rate', 'Growth', 'Return'];
  const multipleTerms = ['P/E', 'P/B', 'EV/EBITDA'];
  
  if (percentageTerms.some(term => displayName.includes(term))) {
    return `${numValue.toFixed(2)}%`;
  } else if (multipleTerms.some(term => displayName.includes(term))) {
    return `${numValue.toFixed(2)}x`;
  } else {
    if (numValue >= 10000000) {
      return `₹${(numValue / 10000000).toFixed(2)} Cr`;
    } else if (numValue >= 100000) {
      return `₹${(numValue / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${numValue.toFixed(2)}`;
    }
  }
};

const News = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  const [symbol, setSymbol] = useState('NIFTY');
  const [stockType, setStockType] = useState('');
  const [query, setQuery] = useState('');
  const [stockData, setStockData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('price');

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      setError('');
      setConnectionError(false);
      setStockData(null);
      
      const response = await fetchNews({
        stock_name: symbol,
        index_data: false
      });
      
      setStockData(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      
      if (err.message && err.message.includes('Network Error')) {
        setConnectionError(true);
        setError('Failed to connect to the backend server.');
      } else if (err.response && err.response.status === 422) {
        setError(`Invalid request parameters: ${err.response.data.detail || 'The API requires specific parameters.'}`);
      } else {
        setError('Failed to fetch financial news. Please try again later.');
      }
      
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchNewsData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date available';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStockData = () => {
    if (!stockData?.data?.[0]) return null;
    
    const stockInfo = stockData.data[0];
    const { raw_data: rawData, text: newsText } = stockInfo;
    
    return (
      <>
        <StockCard>
          <StockCardHeader>
            <StockCardTitle>{rawData?.companyName}</StockCardTitle>
            <StockMetadata>
              <span>{rawData?.industry}</span>
              {rawData?.currentPrice && (
                <span>₹{rawData.currentPrice.NSE || rawData.currentPrice.BSE}</span>
              )}
            </StockMetadata>
          </StockCardHeader>

          {rawData?.companyProfile?.companyDescription && (
            <StockInfoSection>
              <StockInfoTitle>About the Company</StockInfoTitle>
              <p>{rawData.companyProfile.companyDescription}</p>
            </StockInfoSection>
          )}

          {rawData?.stockTechnicalData && (
            <StockInfoSection>
              <StockInfoTitle>Stock Performance</StockInfoTitle>
              <FinancialGrid>
                {rawData.stockTechnicalData.map((data) => (
                  <FinancialCard key={data.days}>
                    <StockLabel>{data.days} Day Average</StockLabel>
                    <FinancialValue>₹{data.nsePrice}</FinancialValue>
                  </FinancialCard>
                ))}
              </FinancialGrid>
            </StockInfoSection>
          )}

          {rawData?.companyProfile?.officers?.officer && (
            <StockInfoSection>
              <StockInfoTitle>Leadership Team</StockInfoTitle>
              <OfficersList>
                {rawData.companyProfile.officers.officer.map((officer, index) => (
                  <OfficerCard key={index}>
                    <StockDetail>
                      <StockLabel>Name:</StockLabel>
                      <StockValue>
                        {`${officer.firstName || ''} ${officer.mI ? officer.mI + ' ' : ''}${officer.lastName || ''}`}
                      </StockValue>
                    </StockDetail>
                    {officer.title?.Value && (
                      <StockDetail>
                        <StockLabel>Position:</StockLabel>
                        <StockValue>{officer.title.Value}</StockValue>
                      </StockDetail>
                    )}
                    {officer.since && (
                      <StockDetail>
                        <StockLabel>Since:</StockLabel>
                        <StockValue>{officer.since}</StockValue>
                      </StockDetail>
                    )}
                  </OfficerCard>
                ))}
              </OfficersList>
            </StockInfoSection>
          )}

          {rawData?.financials && rawData.financials[0]?.stockFinancialMap && (
            <StockInfoSection>
              <StockInfoTitle>Financial Updates (in Cr)</StockInfoTitle>
              <FinancialGrid>
                {Object.entries(rawData.financials[0].stockFinancialMap).map(([category, items]) => (
                  <FinancialCard key={category}>
                    <StockTitle>
                      {category === 'CAS' ? 'Cash Flow Statement (CAS)' :
                       category === 'BAL' ? 'Balance Sheet (BAL)' :
                       category === 'INC' ? 'Income Statement (INC)' : category}
                    </StockTitle>
                    {items.slice(0, 5).map((item, idx) => (
                      <StockDetail key={idx}>
                        <StockLabel>{item.displayName}:</StockLabel>
                        <StockValue>{formatAmount(item.value, item.displayName)}</StockValue>
                      </StockDetail>
                    ))}
                  </FinancialCard>
                ))}
              </FinancialGrid>
            </StockInfoSection>
          )}
        </StockCard>

        <NewsSection>
          <StockInfoTitle>Latest Market Updates</StockInfoTitle>
          <NewsItem>
            <NewsContent>{newsText}</NewsContent>
            <NewsDate>
              <FiCalendar style={{ marginRight: '0.5rem' }} />
              {formatDate(stockInfo.metadata?.date)}
            </NewsDate>
          </NewsItem>

          {rawData?.companyProfile?.peerCompanyList && (
            <StockInfoSection>
              <StockInfoTitle>Peer Companies Analysis</StockInfoTitle>
              <FinancialGrid>
                {rawData.companyProfile.peerCompanyList.map((peer, index) => (
                  <FinancialCard key={index}>
                    <StockTitle>{peer.companyName}</StockTitle>
                    <StockDetail>
                      <StockLabel>Current Price:</StockLabel>
                      <StockValue>₹{peer.price}</StockValue>
                    </StockDetail>
                    <StockDetail>
                      <StockLabel>Market Cap:</StockLabel>
                      <StockValue>₹{peer.marketCap}Cr</StockValue>
                    </StockDetail>
                    <StockDetail>
                      <StockLabel>P/E Ratio:</StockLabel>
                      <StockValue>{peer.priceToEarningsValueRatio}</StockValue>
                    </StockDetail>
                    <StockDetail>
                      <StockLabel>Overall Rating:</StockLabel>
                      <StockValue>{peer.overallRating}</StockValue>
                    </StockDetail>
                  </FinancialCard>
                ))}
              </FinancialGrid>

              <ChartSection>
                <StockInfoTitle>Comparative Analysis</StockInfoTitle>
                <ChartControls>
                  <MetricButton
                    active={selectedMetric === 'price'}
                    onClick={() => setSelectedMetric('price')}
                  >
                    Current Price
                  </MetricButton>
                  <MetricButton
                    active={selectedMetric === 'marketCap'}
                    onClick={() => setSelectedMetric('marketCap')}
                  >
                    Market Cap
                  </MetricButton>
                  <MetricButton
                    active={selectedMetric === 'peRatio'}
                    onClick={() => setSelectedMetric('peRatio')}
                  >
                    P/E Ratio
                  </MetricButton>
                </ChartControls>

                <ChartContainer>
                  <Bar
                    data={{
                      labels: rawData.companyProfile.peerCompanyList.map(peer => peer.companyName),
                      datasets: [{
                        label: selectedMetric === 'price' ? 'Current Price (₹)' :
                               selectedMetric === 'marketCap' ? 'Market Cap (Cr)' :
                               'P/E Ratio',
                        data: rawData.companyProfile.peerCompanyList.map(peer => 
                          selectedMetric === 'price' ? peer.price :
                          selectedMetric === 'marketCap' ? (
                            typeof peer.marketCap === 'string' ? 
                              parseFloat(peer.marketCap.replace(/[^\d.]/g, '')) :
                              parseFloat(peer.marketCap)
                          ) :
                          peer.priceToEarningsValueRatio
                        ),
                        backgroundColor: theme.colors.primary
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        title: {
                          display: true,
                          text: `Comparison of ${
                            selectedMetric === 'price' ? 'Current Prices' :
                            selectedMetric === 'marketCap' ? 'Market Capitalization' :
                            'P/E Ratios'
                          }`
                        }
                      }
                    }}
                  />
                </ChartContainer>
              </ChartSection>
            </StockInfoSection>
          )}
        </NewsSection>
      </>
    );
  };

  return (
    <PageContainer>
      <div className="container">
        <PageTitle>Financial News</PageTitle>
        
        <ApiInfoBox>
          <ApiInfoTitle>Stock Information</ApiInfoTitle>
          <StockDescription>
            Enter a stock symbol to fetch detailed information about Indian stocks, including company profile, key officers, and financial metrics.
          </StockDescription>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <StockSymbolInput
                id="symbol"
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g., TATAMOTORS, RELIANCE, NIFTY"
              />
            </FormGroup>
            
            <Button type="submit" leftIcon={<FiRefreshCw />}>
              Fetch Stock Data
            </Button>
          </form>
        </ApiInfoBox>

        <Button 
          onClick={() => navigate('/compare')}
          style={{ marginBottom: '2rem' }}
          leftIcon={<FiExternalLink />}
        >
          Compare Two Stocks
        </Button>
        
        {connectionError ? (
          <ConnectionErrorMessage>
            <FiAlertCircle />
            <h3>Connection Error</h3>
            <p>Unable to connect to the backend server. This could be due to:</p>
            <ul>
              <li>The backend server is not running</li>
              <li>The backend server is running on a different port</li>
              <li>There's a network issue preventing the connection</li>
            </ul>
            <p>Please ensure the backend server is running on port 8000 and try again.</p>
            <RetryButton onClick={fetchNewsData} leftIcon={<FiRefreshCw />}>
              Retry Connection
            </RetryButton>
          </ConnectionErrorMessage>
        ) : error ? (
          <ErrorMessage>
            <FiAlertCircle />
            {error}
          </ErrorMessage>
        ) : null}
        
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner>
              <FiLoader />
            </LoadingSpinner>
            <p>Loading stock data...</p>
          </LoadingContainer>
        ) : !connectionError && !error && renderStockData()}
        
        {!loading && !connectionError && !error && !stockData && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p>No stock information found.</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default News;