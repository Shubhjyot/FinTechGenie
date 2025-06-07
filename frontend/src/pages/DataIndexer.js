import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FiUpload, FiCheck, FiAlertCircle, FiLoader, FiFileText, FiDatabase, FiFile } from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';

const PageContainer = styled.div`
  padding: 3rem 0;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const IndexingOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const OptionCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  cursor: pointer;
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const OptionIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.theme.colors.primary}22;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
`;

const FormCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
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

const FileInput = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 2rem;
  text-align: center;
  transition: ${props => props.theme.transitions.default};
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
  
  input {
    display: none;
  }
`;

const FileInputIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
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

const SuccessMessage = styled.div`
  background-color: ${props => props.theme.colors.success}22;
  color: ${props => props.theme.colors.success};
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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: ${props => props.theme.colors.primary};
  
  svg {
    animation: spin 1.5s linear infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DataIndexer = () => {
  const [indexType, setIndexType] = useState('');
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [source, setSource] = useState('');
  const [docType, setDocType] = useState('financial_report');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // CSV specific fields
  const [textColumn, setTextColumn] = useState('');
  const [sourceColumn, setSourceColumn] = useState('');
  const [dateColumn, setDateColumn] = useState('');
  
  // JSON specific fields
  const [textField, setTextField] = useState('');
  const [sourceField, setSourceField] = useState('');
  const [dateField, setDateField] = useState('');
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let response;
      
      if (indexType === 'text') {
        response = await axios.post('/api/v1/data/index/text', {
          text: textContent,
          source,
          doc_type: docType
        });
      } else if (indexType === 'csv' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text_column', textColumn);
        formData.append('source_column', sourceColumn);
        formData.append('date_column', dateColumn);
        formData.append('doc_type', docType);
        
        response = await axios.post('/api/v1/data/index/csv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (indexType === 'json' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text_field', textField);
        formData.append('source_field', sourceField);
        formData.append('date_field', dateField);
        formData.append('doc_type', docType);
        
        response = await axios.post('/api/v1/data/index/json', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setSuccess(`Successfully indexed ${response.data.length} documents!`);
      
      // Reset form
      setFile(null);
      setTextContent('');
      if (indexType === 'text') {
        setSource('');
      }
    } catch (err) {
      console.error('Error indexing data:', err);
      setError(err.response?.data?.detail || 'Failed to index data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderForm = () => {
    if (!indexType) return null;
    
    return (
      <FormCard>
        {error && (
          <ErrorMessage>
            <FiAlertCircle />
            {error}
          </ErrorMessage>
        )}
        
        {success && (
          <SuccessMessage>
            <FiCheck />
            {success}
          </SuccessMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          {indexType === 'text' && (
            <>
              <FormGroup>
                <Label htmlFor="textContent">Text Content</Label>
                <textarea
                  id="textContent"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter the text content to index"
                  required
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #E5E7EB',
                    resize: 'vertical'
                  }}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Enter the source of this text (e.g., 'Annual Report 2023')"
                  required
                />
              </FormGroup>
            </>
          )}
          
          {indexType === 'csv' && (
            <>
              <FormGroup>
                <Label>Upload CSV File</Label>
                <FileInput onClick={() => document.getElementById('csvFile').click()}>
                  <input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                  <FileInputIcon>
                    <FiUpload />
                  </FileInputIcon>
                  <p>{file ? file.name : 'Click to upload a CSV file'}</p>
                </FileInput>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="textColumn">Text Column</Label>
                <Input
                  id="textColumn"
                  value={textColumn}
                  onChange={(e) => setTextColumn(e.target.value)}
                  placeholder="Column name containing the text to index"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="sourceColumn">Source Column (optional)</Label>
                <Input
                  id="sourceColumn"
                  value={sourceColumn}
                  onChange={(e) => setSourceColumn(e.target.value)}
                  placeholder="Column name containing source information"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="dateColumn">Date Column (optional)</Label>
                <Input
                  id="dateColumn"
                  value={dateColumn}
                  onChange={(e) => setDateColumn(e.target.value)}
                  placeholder="Column name containing date information"
                />
              </FormGroup>
            </>
          )}
          
          {indexType === 'json' && (
            <>
              <FormGroup>
                <Label>Upload JSON File</Label>
                <FileInput onClick={() => document.getElementById('jsonFile').click()}>
                  <input
                    id="jsonFile"
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                  />
                  <FileInputIcon>
                    <FiUpload />
                  </FileInputIcon>
                  <p>{file ? file.name : 'Click to upload a JSON file'}</p>
                </FileInput>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="textField">Text Field</Label>
                <Input
                  id="textField"
                  value={textField}
                  onChange={(e) => setTextField(e.target.value)}
                  placeholder="Field name containing the text to index"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="sourceField">Source Field (optional)</Label>
                <Input
                  id="sourceField"
                  value={sourceField}
                  onChange={(e) => setSourceField(e.target.value)}
                  placeholder="Field name containing source information"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="dateField">Date Field (optional)</Label>
                <Input
                  id="dateField"
                  value={dateField}
                  onChange={(e) => setDateField(e.target.value)}
                  placeholder="Field name containing date information"
                />
              </FormGroup>
            </>
          )}
          
          <FormGroup>
            <Label htmlFor="docType">Document Type</Label>
            <select
              id="docType"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white'
              }}
            >
              <option value="financial_report">Financial Report</option>
              <option value="news_article">News Article</option>
              <option value="market_analysis">Market Analysis</option>
              <option value="company_filing">Company Filing</option>
              <option value="research_paper">Research Paper</option>
            </select>
          </FormGroup>
          
          <ButtonContainer>
            {loading ? (
              <LoadingContainer>
                <FiLoader />
                Indexing data...
              </LoadingContainer>
            ) : (
              <Button type="submit">
                Index Data
              </Button>
            )}
          </ButtonContainer>
        </form>
      </FormCard>
    );
  };
  
  return (
    <PageContainer>
      <div className="container">
        <PageTitle>Index Financial Data</PageTitle>
        
        <IndexingOptions>
          <OptionCard 
            selected={indexType === 'text'} 
            onClick={() => setIndexType('text')}
          >
            <OptionIcon>
              <FiFileText />
            </OptionIcon>
            <h3>Text Document</h3>
            <p>Index a single text document or content directly.</p>
          </OptionCard>
          
          <OptionCard 
            selected={indexType === 'csv'} 
            onClick={() => setIndexType('csv')}
          >
            <OptionIcon>
              <FiDatabase />
            </OptionIcon>
            <h3>CSV File</h3>
            <p>Index structured data from a CSV file with multiple entries.</p>
          </OptionCard>
          
          <OptionCard 
            selected={indexType === 'json'} 
            onClick={() => setIndexType('json')}
          >
            <OptionIcon>
              <FiFile />
            </OptionIcon>
            <h3>JSON File</h3>
            <p>Index data from a JSON file with nested structures.</p>
          </OptionCard>
        </IndexingOptions>
        
        {renderForm()}
      </div>
    </PageContainer>
  );
};

export default DataIndexer;