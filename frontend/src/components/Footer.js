import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.cardBg};
  padding: 3rem 0;
  margin-top: 3rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.text};
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  
  li {
    margin-bottom: 0.75rem;
  }
  
  a {
    color: ${props => props.theme.colors.textLight};
    transition: ${props => props.theme.transitions.default};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: ${props => props.theme.borderRadius.full};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    transition: ${props => props.theme.transitions.default};
    
    &:hover {
      background-color: ${props => props.theme.colors.primary};
      color: white;
      transform: translateY(-3px);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textLight};
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <h3>VittSaar</h3>
            <p>AI-powered financial research assistant for generating comprehensive reports and insights.</p>
            <SocialLinks>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FiGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FiLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FiTwitter />
              </a>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Features</h3>
            <FooterLinks>
              <li><Link to="/generate-report">Report Generation</Link></li>
              <li><Link to="/index-data">Data Indexing</Link></li>
              <li><Link to="/view-reports">View Reports</Link></li>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Resources</h3>
            <FooterLinks>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">Examples</a></li>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Contact</h3>
            <FooterLinks>
              <li><a href="mailto:info@vittsaar.com">info@vittsaar.com</a></li>
              <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
            </FooterLinks>
          </FooterSection>
        </FooterContent>
        
        <Copyright>
          &copy; {new Date().getFullYear()} VittSaar. All rights reserved.
        </Copyright>
      </div>
    </FooterContainer>
  );
};

export default Footer;