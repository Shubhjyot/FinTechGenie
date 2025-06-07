import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';

const PageContainer = styled.div`
  padding: 3rem 0;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const AboutSection = styled.section`
  margin-bottom: 4rem;
`;

const AboutContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const TechStackSection = styled.section`
  margin-bottom: 4rem;
`;

const TechStackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TechCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const TechLogo = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const TeamSection = styled.section`
  margin-bottom: 4rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TeamMemberCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const TeamMemberPhoto = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: 1.5rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TeamMemberName = styled.h3`
  margin-bottom: 0.5rem;
`;

const TeamMemberRole = styled.div`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
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

const ContactSection = styled.section`
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}22, ${props => props.theme.colors.secondary}22);
  border-radius: ${props => props.theme.borderRadius.large};
`;

const ContactTitle = styled.h2`
  margin-bottom: 1.5rem;
`;

const ContactText = styled.p`
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const About = () => {
  return (
    <PageContainer>
      <div className="container">
        <PageTitle>About VittSaar</PageTitle>
        
        <AboutSection>
          <AboutContent>
            <p>
              VittSaar is an AI-powered financial research assistant designed to help investors, analysts, and financial professionals generate comprehensive reports and gain valuable insights from their data.
            </p>
            <p>
              Our platform leverages advanced natural language processing and machine learning technologies to analyze financial data, identify trends, and provide actionable recommendations. By combining the power of AI with domain-specific financial knowledge, VittSaar enables users to make more informed investment decisions.
            </p>
            <p>
              Whether you're conducting market analysis, equity research, or investment banking due diligence, VittSaar streamlines your workflow and enhances your research capabilities.
            </p>
          </AboutContent>
        </AboutSection>
        
        <TechStackSection>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Our Technology Stack</h2>
          
          <TechStackGrid>
            <TechCard>
              <TechLogo>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" alt="React" />
              </TechLogo>
              <h3>React</h3>
              <p>Modern, responsive frontend user interface built with React and styled-components</p>
            </TechCard>
            
            <TechCard>
              <TechLogo>
                <img src="https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png" alt="FastAPI" />
              </TechLogo>
              <h3>FastAPI</h3>
              <p>High-performance, easy-to-use API framework for our backend services</p>
            </TechCard>
            
            <TechCard>
              <TechLogo>
                <img src="https://cdn.worldvectorlogo.com/logos/google-gemini-1.svg" alt="Gemini AI" />
              </TechLogo>
              <h3>Gemini AI</h3>
              <p>Advanced language model for generating comprehensive financial reports</p>
            </TechCard>
            
            <TechCard>
              <TechLogo>
                <img src="https://cdn.worldvectorlogo.com/logos/pinecone.svg" alt="Pinecone" />
              </TechLogo>
              <h3>Pinecone</h3>
              <p>Vector database for efficient semantic search and retrieval of financial data</p>
            </TechCard>
          </TechStackGrid>
        </TechStackSection>
        
        <TeamSection>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Our Team</h2>
          
          <TeamGrid>
            <TeamMemberCard>
              <TeamMemberPhoto>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team Member" />
              </TeamMemberPhoto>
              <TeamMemberName>Rahul Sharma</TeamMemberName>
              <TeamMemberRole>Founder & CEO</TeamMemberRole>
              <p>Financial analyst with 10+ years of experience in investment banking and AI research.</p>
              <SocialLinks>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FiLinkedin />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FiTwitter />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FiMail />
                </a>
              </SocialLinks>
            </TeamMemberCard>
            
            <TeamMemberCard>
              <TeamMemberPhoto>
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member" />
              </TeamMemberPhoto>
              <TeamMemberName>Priya Patel</TeamMemberName>
              <TeamMemberRole>CTO</TeamMemberRole>
              <p>AI researcher with expertise in natural language processing and financial data analysis.</p>
              <SocialLinks>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FiLinkedin />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FiGithub />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FiMail />
                </a>
              </SocialLinks>
            </TeamMemberCard>
            
            <TeamMemberCard>
              <TeamMemberPhoto>
                <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Team Member" />
              </TeamMemberPhoto>
              <TeamMemberName>Vikram Singh</TeamMemberName>
              <TeamMemberRole>Lead Developer</TeamMemberRole>
              <p>Full-stack developer with experience in building scalable financial applications.</p>
              <SocialLinks>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FiGithub />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FiLinkedin />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FiMail />
                </a>
              </SocialLinks>
            </TeamMemberCard>
          </TeamGrid>
        </TeamSection>
        
        <ContactSection>
          <ContactTitle>Get in Touch</ContactTitle>
          <ContactText>
            Have questions about VittSaar or want to learn more about how our AI-powered financial research assistant can help your organization?
          </ContactText>
          <Button href="mailto:contact@vittsaar.com" size="large">
            Contact Us
          </Button>
        </ContactSection>
      </div>
    </PageContainer>
  );
};

export default About;