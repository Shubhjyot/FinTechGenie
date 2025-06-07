import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 3rem 0;
`;

export const PageTitle = styled.h1`
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.primary};
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const StockSymbolInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  text-transform: uppercase;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`;

export const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.error};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  background: ${props => props.theme.colors.error}11;
  margin: 1rem 0;
`;