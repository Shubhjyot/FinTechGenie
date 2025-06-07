import React from 'react';
import styled from 'styled-components';
import { FiFileText, FiExternalLink } from 'react-icons/fi';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ReportTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ReportLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;

  &:hover ${ReportTitle} {
    color: ${props => props.theme.colors.secondary};
  }
`;

const ReportDescription = styled.p`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const ViewButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
`;

const Reports = () => {
  const reports = [
    {
      title: 'Bajaj Finance Sector Analysis',
      description: 'Comprehensive analysis of Bajaj Finance with focus on innovation-driven transformation and AI-first strategy.',
      path: '/Bajaj_Finance_Sector_Analysis_Report.html'
    },
    {
      title: 'CDSL Sector Analysis',
      description: 'Detailed report on CDSL\'s market position, growth drivers, and financial infrastructure outlook.',
      path: '/cdsl_report.html'
    },
    {
      title: 'Tata Motors Sector Analysis',
      description: 'In-depth analysis of Tata Motors\' operations, market position, and future prospects.',
      path: '/Tata_Motors_Sector_Analysis_Report.html'
    },
    {
      title: 'Vodafone Idea Analysis',
      description: 'Strategic analysis of Vodafone Idea Ltd., including market challenges and opportunities.',
      path: '/vodafone_idea_report.html'
    }
  ];

  return (
    <PageContainer>
      <PageTitle>Company Analysis Reports</PageTitle>
      <ReportsGrid>
        {reports.map((report, index) => (
          <ReportCard key={index}>
            <ReportLink href={report.path} target="_blank" rel="noopener noreferrer">
              <ReportTitle>
                <FiFileText />
                {report.title}
              </ReportTitle>
              <ReportDescription>{report.description}</ReportDescription>
              <ViewButton>
                View Report <FiExternalLink />
              </ViewButton>
            </ReportLink>
          </ReportCard>
        ))}
      </ReportsGrid>
    </PageContainer>
  );
};

export default Reports;