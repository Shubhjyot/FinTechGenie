import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { fetchNews } from '../services/api';
import { 
  FiLoader, 
  FiAlertCircle, 
  FiRefreshCw, 
  FiBarChart2, 
  FiDatabase, 
  FiFileText, 
  FiSearch 
} from 'react-icons/fi';
import Button from '../components/Button';
import Card from '../components/Card';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Add these new styled components after the existing imports
const FloatingElement = styled(motion.div)`
  position: absolute;
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(220, 38, 38, 0.1));
  border-radius: 50%;
  pointer-events: none;
`;

const HeroSection = styled.section`
  padding: 10rem 0;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(220, 38, 38, 0.05));
  text-align: center;
  min-height: 80vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

// Update CTASection background
// Keep this first declaration with purple-reddish gradient
const CTASection = styled.section`
  padding: 5rem 0;
  text-align: center;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(220, 38, 38, 0.1));
  border-radius: ${props => props.theme.borderRadius.large};
  margin: 0 1.5rem 5rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

// Add these styled components after the existing HeroTitle
const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  color: ${props => props.theme.colors.textLight};
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.25rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.color}22;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 1rem;
`;

const HowItWorksSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.colors.background};
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
`;

const StepCard = styled(Card)`
  position: relative;
  padding: 2rem;
`;

const StepNumber = styled.div`
  position: absolute;
  top: -20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

// Remove this second declaration
// Remove this entire block (lines 172-179)
// const CTASection = styled.section`
//   padding: 5rem 0;
//   text-align: center;
//   background: linear-gradient(135deg, ${props => props.theme.colors.primary}22, ${props => props.theme.colors.secondary}22);
//   border-radius: ${props => props.theme.borderRadius.large};
//   margin: 0 1.5rem 5rem;
// `;

const CTATitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 2.25rem;
`;

const CTAText = styled.p`
  max-width: 600px;
  margin: 0 auto 2rem;
  font-size: 1.125rem;
`;

const ComparisonSection = styled.div`
  margin-top: 4rem;
  padding: 2rem;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ComparisonForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StockInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
`;

// Update the Home component to include state declarations
// Add this to your imports
import { useNavigate } from 'react-router-dom';

// Add this styled component with your other styled components
const ReportsButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem auto;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

// In your Home component
const Home = () => {
  const navigate = useNavigate();
  
  const [stock1, setStock1] = useState('');
  const [stock2, setStock2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState('');

  const handleCompare = async (e) => {
    e.preventDefault();
    
    if (!stock1 || !stock2) {
      setComparisonError('Please enter both stock symbols');
      return;
    }
    
    setComparisonLoading(true);
    setComparisonError('');
    setComparisonData(null);

    try {
      // Simulating API call with the response data
      const mockResponse = {
        status: "success",
        data: [
          {
            raw_data: {
              companyName: stock1,
              currentPrice: {
                NSE: "1218.95",
                BSE: "1219.30"
              },
              companyProfile: {
                marketCap: "1650002.23",
                peRatio: "22.97"
              }
            }
          }
        ]
      };

      setComparisonData({
        stock1: mockResponse.data[0],
        stock2: {
          raw_data: {
            companyName: stock2,
            currentPrice: {
              NSE: "230.35",
              BSE: "230.35"
            },
            companyProfile: {
              marketCap: "289786.73",
              peRatio: "5.39"
            }
          }
        }
      });
    } catch (err) {
      setComparisonError('Failed to fetch comparison data');
    } finally {
      setComparisonLoading(false);
    }
  };

  // In the Home component, add the floating elements inside HeroSection:
  return (
    <>
      <HeroSection>
        <FloatingElement
          size="100px"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: 360
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '20%', left: '15%' }}
        />
        <FloatingElement
          size="70px"
          animate={{
            x: [0, -70, 0],
            y: [0, 100, 0],
            rotate: -360
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '60%', right: '10%' }}
        />
        <FloatingElement
          size="120px"
          animate={{
            x: [0, 50, 0],
            y: [0, 70, 0],
            rotate: 180
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ bottom: '20%', left: '25%' }}
        />
        <div className="container">
          <HeroTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI-Powered Financial Research Assistant
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            VittSaar leverages artificial intelligence to generate comprehensive financial reports, analyze market trends, and provide actionable insights for your investment decisions.
          </HeroSubtitle>
          
          <HeroButtons
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button to="/generate-report" size="large">
              Generate Report
            </Button>
            <Button to="/compare-stocks" variant="outline" size="large">
              Compare Stocks
            </Button>
          </HeroButtons>
        </div>
      </HeroSection>
      
      <FeaturesSection>
        <div className="container">
          <SectionTitle>Key Features</SectionTitle>
          
          <FeaturesGrid>
            <FeatureCard hover>
              <FeatureIcon color={props => props.theme.colors.primary}>
                <FiFileText />
              </FeatureIcon>
              <FeatureTitle>AI Report Generation</FeatureTitle>
              <p>Generate comprehensive financial reports with structured sections including executive summaries, market overviews, and recommendations.</p>
            </FeatureCard>
            
            <FeatureCard hover>
              <FeatureIcon color={props => props.theme.colors.secondary}>
                <FiSearch />
              </FeatureIcon>
              <FeatureTitle>Semantic Search</FeatureTitle>
              <p>Find relevant financial information using natural language queries powered by advanced embedding models.</p>
            </FeatureCard>
            
            <FeatureCard hover>
              <FeatureIcon color={props => props.theme.colors.accent}>
                <FiDatabase />
              </FeatureIcon>
              <FeatureTitle>Data Indexing</FeatureTitle>
              <p>Index and organize your financial data from various sources including CSV, JSON, and text documents.</p>
            </FeatureCard>
            
            <FeatureCard hover>
              <FeatureIcon color={props => props.theme.colors.success}>
                <FiBarChart2 />
              </FeatureIcon>
              <FeatureTitle>Market Analysis</FeatureTitle>
              <p>Get detailed market analysis with key trends, financial metrics, and risk assessments based on your data.</p>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>
      
      <HowItWorksSection>
        <div className="container">
          <SectionTitle>How It Works</SectionTitle>
          
          <StepsContainer>
            <StepCard>
              <StepNumber>1</StepNumber>
              <h3>Index Your Data</h3>
              <p>Upload and index your financial data from various sources like CSV files, JSON documents, or text reports.</p>
            </StepCard>
            
            <StepCard>
              <StepNumber>2</StepNumber>
              <h3>Ask Questions</h3>
              <p>Enter your financial research questions or specify the type of report you need to generate.</p>
            </StepCard>
            
            <StepCard>
              <StepNumber>3</StepNumber>
              <h3>Get AI-Generated Reports</h3>
              <p>Receive comprehensive, structured reports with actionable insights based on your indexed data.</p>
            </StepCard>
          </StepsContainer>
        </div>
      </HowItWorksSection>
      
      <div className="container">
        <CTASection>
          <CTATitle>Ready to Transform Your Financial Research?</CTATitle>
          <CTAText>
            Start generating AI-powered financial reports and insights today with VittSaar.
          </CTAText>
          <Button to="/compare-stocks" size="large">
            Get Started Now
          </Button>
        </CTASection>
    
        {/* Move the ComparisonSection here */}
        <ComparisonSection>
          <h2>Quick Stock Comparison</h2>
          <ComparisonForm onSubmit={handleCompare}>
            <InputGroup>
              <label>First Stock</label>
              <StockInput
                type="text"
                value={stock1}
                onChange={(e) => setStock1(e.target.value.toUpperCase())}
                placeholder="e.g., TATAMOTORS"
              />
            </InputGroup>
            
            <InputGroup>
              <label>Second Stock</label>
              <StockInput
                type="text"
                value={stock2}
                onChange={(e) => setStock2(e.target.value.toUpperCase())}
                placeholder="e.g., RELIANCE"
              />
            </InputGroup>
            
            <Button 
              type="submit" 
              leftIcon={<FiRefreshCw />}
              style={{ gridColumn: '1 / -1' }}
            >
              Compare Stocks
            </Button>
          </ComparisonForm>
    
          {comparisonLoading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <FiLoader style={{ animation: 'spin 1s linear infinite' }} />
              <p>Loading comparison data...</p>
            </div>
          )}
    
          {comparisonError && (
            <div style={{ color: 'red', padding: '1rem' }}>
              <FiAlertCircle />
              <span>{comparisonError}</span>
            </div>
          )}
    
          {comparisonData && (
            <Bar
              data={{
                labels: ['Current Price', 'Market Cap', 'P/E Ratio'],
                datasets: [
                  {
                    label: comparisonData.stock1.raw_data?.companyName,
                    data: [
                      comparisonData.stock1.raw_data?.currentPrice?.NSE || 
                      comparisonData.stock1.raw_data?.currentPrice?.BSE,
                      parseFloat(comparisonData.stock1.raw_data?.companyProfile?.marketCap || 0),
                      parseFloat(comparisonData.stock1.raw_data?.companyProfile?.peRatio || 0)
                    ],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                  },
                  {
                    label: comparisonData.stock2.raw_data?.companyName,
                    data: [
                      comparisonData.stock2.raw_data?.currentPrice?.NSE || 
                      comparisonData.stock2.raw_data?.currentPrice?.BSE,
                      parseFloat(comparisonData.stock2.raw_data?.companyProfile?.marketCap || 0),
                      parseFloat(comparisonData.stock2.raw_data?.companyProfile?.peRatio || 0)
                    ],
                    backgroundColor: 'rgba(153, 102, 255, 0.6)'
                  }
                ]
              }}
              options={{
                responsive: true,
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
          )}
        </ComparisonSection>
      </div>
    </>
  );
};

export default Home;