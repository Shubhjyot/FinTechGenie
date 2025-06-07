import React from 'react';
import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';
import { FiFileText, FiDatabase, FiList, FiInfo, FiRss } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { FiMessageSquare } from 'react-icons/fi';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.small};
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: ${props => props.theme.colors.textLight};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  transition: ${props => props.theme.transitions.default};
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.backgroundAlt};
    text-decoration: none;
  }
  
  &.active {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}22;
    font-weight: 500;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <div className="container">
        <HeaderContent>
          <Logo to="/">VittSaar</Logo>
          
          <Nav>
            <NavItem to="/generate-report">
              <FiFileText />
              Generate Report
            </NavItem>
            <NavItem to="/index-data">
              <FiDatabase />
              Index Data
            </NavItem>
            <NavItem to="/view-reports">
              <FiList />
              News
            </NavItem>
            <NavItem to="/news">
              <FiRss />
              Stock Information
            </NavItem>
            <NavItem to="/about">
              <FiInfo />
              About
            </NavItem>
            <NavItem to="/chat">
              <FiMessageSquare />
              Chat
            </NavItem>
          </Nav>
          
          <RightSection>
            <ThemeToggle />
          </RightSection>
        </HeaderContent>
      </div>
    </HeaderContainer>
  );
};

export default Header;