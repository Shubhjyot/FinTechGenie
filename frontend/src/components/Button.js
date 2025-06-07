import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const ButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'large' ? '0.75rem 1.5rem' : props.size === 'small' ? '0.375rem 0.75rem' : '0.5rem 1rem'};
  font-size: ${props => props.size === 'large' ? '1.125rem' : props.size === 'small' ? '0.875rem' : '1rem'};
  font-weight: 500;
  border-radius: ${props => props.theme.borderRadius.medium};
  transition: ${props => props.theme.transitions.default};
  gap: 0.5rem;
  
  ${props => {
    if (props.variant === 'primary') {
      return css`
        background-color: ${props.theme.colors.primary};
        color: white;
        
        &:hover {
          background-color: ${props.theme.colors.primary}dd;
          transform: translateY(-2px);
          box-shadow: ${props.theme.shadows.medium};
        }
      `;
    } else if (props.variant === 'secondary') {
      return css`
        background-color: ${props.theme.colors.secondary};
        color: white;
        
        &:hover {
          background-color: ${props.theme.colors.secondary}dd;
          transform: translateY(-2px);
          box-shadow: ${props.theme.shadows.medium};
        }
      `;
    } else if (props.variant === 'outline') {
      return css`
        background-color: transparent;
        color: ${props.theme.colors.primary};
        border: 2px solid ${props.theme.colors.primary};
        
        &:hover {
          background-color: ${props.theme.colors.primary}11;
          transform: translateY(-2px);
        }
      `;
    } else if (props.variant === 'ghost') {
      return css`
        background-color: transparent;
        color: ${props.theme.colors.text};
        
        &:hover {
          background-color: ${props.theme.colors.border};
        }
      `;
    }
  }}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

const StyledButton = styled.button`
  ${ButtonStyles}
`;

const StyledLink = styled(Link)`
  ${ButtonStyles}
`;

const StyledAnchor = styled.a`
  ${ButtonStyles}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  to, 
  href, 
  fullWidth = false,
  ...props 
}) => {
  if (to) {
    return (
      <StyledLink 
        to={to} 
        variant={variant} 
        size={size} 
        fullWidth={fullWidth}
        {...props}
      >
        {children}
      </StyledLink>
    );
  }
  
  if (href) {
    return (
      <StyledAnchor 
        href={href} 
        variant={variant} 
        size={size} 
        fullWidth={fullWidth}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </StyledAnchor>
    );
  }
  
  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;