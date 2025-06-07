import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: ${props => props.theme.colors.cardBg};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: ${props => props.padding || '1.5rem'};
  transition: ${props => props.theme.transitions.default};
  height: ${props => props.height || 'auto'};
  
  &:hover {
    transform: ${props => props.hover ? 'translateY(-5px)' : 'none'};
    box-shadow: ${props => props.hover ? props.theme.shadows.large : props.theme.shadows.medium};
  }
`;

const Card = ({ children, ...props }) => {
  return <CardContainer {...props}>{children}</CardContainer>;
};

export default Card;