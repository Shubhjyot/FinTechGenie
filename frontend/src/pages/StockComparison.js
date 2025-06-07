import React, { useState } from 'react';
import styled from 'styled-components';
import { fetchNews } from '../services/api';
import { FiLoader, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Styled components
const PageContainer = styled.div`
  padding: 3rem 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const ComparisonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
`;

// Add this styled component
const ChartSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const ComparisonCard = styled(Card)`
  padding: 1.5rem;
`;

const ComparisonSection = styled.div`
  margin-bottom: 1.5rem;
`;

const StockComparison = () => {
  const [stock1, setStock1] = useState('');
  const [stock2, setStock2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e) => {
    e.preventDefault();
    
    if (!stock1 || !stock2) {
      setError('Please enter both stock symbols');
      return;
    }
    
    setLoading(true);
    setError('');
    setComparisonData(null);
  
    try {
      const [stock1Data, stock2Data] = await Promise.all([
        fetchNews({ stock_name: stock1, index_data: false }),
        fetchNews({ stock_name: stock2, index_data: false })
      ]);
  
      if (!stock1Data?.data?.[0] || !stock2Data?.data?.[0]) {
        throw new Error('Could not fetch data for one or both stocks');
      }
  
      setComparisonData({
        stock1: stock1Data.data[0],
        stock2: stock2Data.data[0]
      });
    } catch (err) {
      console.error('Comparison error:', err);
      setError(err.message || 'Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  };

  const renderComparison = () => {
    if (!comparisonData) return null;

    const { stock1: data1, stock2: data2 } = comparisonData;

    // Helper function to get market cap value
    const getMarketCap = (data) => {
      const marketCap = data.raw_data?.companyProfile?.peerCompanyList?.[0]?.marketCap;
      return typeof marketCap === 'string' ? 
        parseFloat(marketCap.replace(/[^\d.]/g, '')) : 
        parseFloat(marketCap || 0);
    };

    // Helper function to get PE ratio
    const getPERatio = (data) => {
      return parseFloat(data.raw_data?.companyProfile?.peerCompanyList?.[0]?.priceToEarningsValueRatio || 0);
    };

    return (
      <>
        <ComparisonContainer>
          <ComparisonCard>
            <h2>{data1.raw_data?.companyName}</h2>
            <ComparisonSection>
              <h3>Company Overview</h3>
              <p>{data1.raw_data?.companyProfile?.companyDescription}</p>
            </ComparisonSection>
            
            <ComparisonSection>
              <h3>Stock Performance</h3>
              <p>Current Price: ₹{data1.raw_data?.currentPrice?.NSE || data1.raw_data?.currentPrice?.BSE}</p>
              <p>Market Cap: ₹{getMarketCap(data1)}Cr</p>
              <p>P/E Ratio: {getPERatio(data1)}</p>
            </ComparisonSection>

            <ComparisonSection>
              <h3>Financial Metrics</h3>
              {data1.raw_data?.financials?.[0]?.stockFinancialMap && 
                Object.entries(data1.raw_data.financials[0].stockFinancialMap).map(([category, items]) => (
                  <div key={category}>
                    <h4>{category}</h4>
                    {items.slice(0, 3).map((item, idx) => (
                      <p key={idx}>{item.displayName}: {item.value}</p>
                    ))}
                  </div>
                ))
              }
            </ComparisonSection>
          </ComparisonCard>

          <ComparisonCard>
            <h2>{data2.raw_data?.companyName}</h2>
            <ComparisonSection>
              <h3>Company Overview</h3>
              <p>{data2.raw_data?.companyProfile?.companyDescription}</p>
            </ComparisonSection>
            
            <ComparisonSection>
              <h3>Stock Performance</h3>
              <p>Current Price: ₹{data2.raw_data?.currentPrice?.NSE || data2.raw_data?.currentPrice?.BSE}</p>
              <p>Market Cap: ₹{getMarketCap(data2)}Cr</p>
              <p>P/E Ratio: {getPERatio(data2)}</p>
            </ComparisonSection>

            <ComparisonSection>
              <h3>Financial Metrics</h3>
              {data2.raw_data?.financials?.[0]?.stockFinancialMap && 
                Object.entries(data2.raw_data.financials[0].stockFinancialMap).map(([category, items]) => (
                  <div key={category}>
                    <h4>{category}</h4>
                    {items.slice(0, 3).map((item, idx) => (
                      <p key={idx}>{item.displayName}: {item.value}</p>
                    ))}
                  </div>
                ))
              }
            </ComparisonSection>
          </ComparisonCard>
        </ComparisonContainer>

        <ChartSection>
          <h3>Performance Comparison</h3>
          <Bar
            data={{
              labels: ['Current Price', 'Market Cap', 'P/E Ratio'],
              datasets: [
                {
                  label: data1.raw_data?.companyName,
                  data: [
                    data1.raw_data?.currentPrice?.NSE || data1.raw_data?.currentPrice?.BSE,
                    getMarketCap(data1),
                    getPERatio(data1)
                  ],
                  backgroundColor: 'rgba(75, 192, 192, 0.6)'
                },
                {
                  label: data2.raw_data?.companyName,
                  data: [
                    data2.raw_data?.currentPrice?.NSE || data2.raw_data?.currentPrice?.BSE,
                    getMarketCap(data2),
                    getPERatio(data2)
                  ],
                  backgroundColor: 'rgba(153, 102, 255, 0.6)'
                }
              ]
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.dataset.label || '';
                      const value = context.parsed.y;
                      const idx = context.dataIndex;
                      if (idx === 0) return `${label}: ₹${value}`;
                      if (idx === 1) return `${label}: ₹${value}Cr`;
                      return `${label}: ${value}`;
                    }
                  }
                }
              }
            }}
          />
        </ChartSection>
      </>
    );
  };

  const PageTitle = styled.h1`
    color: ${props => props.theme.colors.primary};
    margin-bottom: 2rem;
    font-size: 2.5rem;
  `;
  
  const FormContainer = styled.form`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  `;
  
  const FormGroup = styled.div`
    margin-bottom: 1rem;
  `;
  
  const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
  `;
  
  const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.small};
    font-size: 1rem;
  `;
  
  const LoadingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    color: ${props => props.theme.colors.primary};
  `;
  
  const ErrorContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    color: ${props => props.theme.colors.error};
    background: ${props => props.theme.colors.error}11;
    border-radius: ${props => props.theme.borderRadius.small};
    margin: 1rem 0;
  `;
  
  // Update the return statement in the component
  return (
    <PageContainer>
      <PageTitle>Stock Comparison Analysis</PageTitle>
      
      <FormContainer onSubmit={handleCompare}>
        <FormGroup>
          <Label>First Stock Symbol</Label>
          <Input
            type="text"
            value={stock1}
            onChange={(e) => setStock1(e.target.value.toUpperCase())}
            placeholder="e.g., TATAMOTORS"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Second Stock Symbol</Label>
          <Input
            type="text"
            value={stock2}
            onChange={(e) => setStock2(e.target.value.toUpperCase())}
            placeholder="e.g., RELIANCE"
          />
        </FormGroup>
        
        <Button 
          type="submit" 
          leftIcon={<FiRefreshCw />}
          style={{ gridColumn: '1 / -1' }}
        >
          Compare Stocks
        </Button>
      </FormContainer>
  
      {loading && (
        <LoadingContainer>
          <FiLoader style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading comparison data...</span>
        </LoadingContainer>
      )}
  
      {error && (
        <ErrorContainer>
          <FiAlertCircle />
          <span>{error}</span>
        </ErrorContainer>
      )}
  
      {renderComparison()}
    </PageContainer>
  );
};

export default StockComparison;