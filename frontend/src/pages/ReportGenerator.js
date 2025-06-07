import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { generateReport } from '../services/api';
import axios from 'axios';
import { FiFileText, FiLoader, FiAlertCircle } from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';
import ReactMarkdown from 'react-markdown';

const PageContainer = styled.div`
  padding: 3rem 0;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const FormCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  background-color: white;
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
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
  
  svg {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
`;

const ReportCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
`;

const ReportHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ReportTitle = styled.h2`
  margin-bottom: 0.5rem;
`;

const ReportType = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ReportContent = styled.div`
  line-height: 1.7;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
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

const SourcesSection = styled.div`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const SourcesList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SourceItem = styled.li`
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SourceScore = styled.span`
  background-color: ${props => props.theme.colors.primary}22;
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.85rem;
  font-weight: 500;
`;

const ReportGenerator = () => {
  const [query, setQuery] = useState('');
  const [reportType, setReportType] = useState('general');
  const [structured, setStructured] = useState(true);
  const [customSections, setCustomSections] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReport(null);
    
    try {
      // Parse custom sections if provided
      let sections = null;
      if (customSections.trim()) {
        sections = customSections.split(',').map(section => section.trim());
      }
      
      // Make API request with better error handling
      try {
        const reportData = await generateReport({
          query,
          report_type: reportType,
          structured,
          sections,
          use_pinecone: true
        });
        
        setReport(reportData);
      } catch (apiError) {
        // Check for specific error status codes
        if (apiError.response) {
          if (apiError.response.status === 404) {
            throw new Error('Report generation endpoint not found. Please check API configuration.');
          } else if (apiError.response.status === 422) {
            throw new Error('Invalid request parameters. Please check your inputs.');
          } else {
            throw new Error(apiError.response.data.detail || 'Server error occurred.');
          }
        } else {
          throw apiError;
        }
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderReportContent = () => {
    if (!report) return null;
    
    if (structured) {
      return Object.entries(report.content).map(([section, content]) => (
        <div key={section}>
          <h2>{section}</h2>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ));
    } else {
      return <ReactMarkdown>{report.content}</ReactMarkdown>;
    }
  };
  
  return (
    <PageContainer>
      <div className="container">
        <PageTitle>Generate Financial Report</PageTitle>
        
        {!report && (
          <FormCard>
            {error && (
              <ErrorMessage>
                <FiAlertCircle />
                {error}
              </ErrorMessage>
            )}
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="query">Research Query</Label>
                <TextArea
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your financial research question or topic (e.g., 'Analyze the current trends in renewable energy investments')"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="reportType">Report Type</Label>
                <Select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="general">General Financial Analysis</option>
                  <option value="equity">Equity Research</option>
                  <option value="venture_capital">Venture Capital</option>
                  <option value="investment_banking">Investment Banking</option>
                  <option value="market_analysis">Market Analysis</option>
                </Select>
              </FormGroup>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="structured"
                  checked={structured}
                  onChange={(e) => setStructured(e.target.checked)}
                />
                <Label htmlFor="structured" style={{ display: 'inline', marginBottom: 0 }}>
                  Generate structured report with sections
                </Label>
              </CheckboxContainer>
              
              {structured && (
                <FormGroup>
                  <Label htmlFor="customSections">
                    Custom Sections (optional, comma-separated)
                  </Label>
                  <Input
                    id="customSections"
                    value={customSections}
                    onChange={(e) => setCustomSections(e.target.value)}
                    placeholder="E.g., Executive Summary, Market Overview, Recommendations"
                  />
                </FormGroup>
              )}
              
              <ButtonContainer>
                <Button type="submit" disabled={loading}>
                  Generate Report
                </Button>
              </ButtonContainer>
            </form>
          </FormCard>
        )}
        
        {loading && (
          <Card>
            <LoadingContainer>
              <LoadingSpinner>
                <FiLoader />
              </LoadingSpinner>
              <p>Generating your financial report...</p>
            </LoadingContainer>
          </Card>
        )}
        
        {report && (
          <ReportCard>
            <ReportHeader>
              <ReportTitle>{query}</ReportTitle>
              <ReportType>Report Type: {reportType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</ReportType>
              <Button onClick={() => setReport(null)} variant="outline" size="small">
                Generate New Report
              </Button>
            </ReportHeader>
            
            <ReportContent>
              {renderReportContent()}
            </ReportContent>
            
            {report.sources && report.sources.length > 0 && (
              <SourcesSection>
                <h3>Sources</h3>
                <SourcesList>
                  {report.sources.map((source, index) => (
                    <SourceItem key={source.id || index}>
                      <div>
                        <strong>{source.source}</strong>
                        {source.date && <div>{source.date}</div>}
                      </div>
                      <SourceScore>
                        Relevance: {Math.round(source.relevance_score * 100)}%
                      </SourceScore>
                    </SourceItem>
                  ))}
                </SourcesList>
              </SourcesSection>
            )}
          </ReportCard>
        )}
      </div>
    </PageContainer>
  );
};

export default ReportGenerator;