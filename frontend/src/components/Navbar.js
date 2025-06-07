import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const Nav = styled.nav`
  background-color: ${props => props.theme.colors.cardBg};
  box-shadow: ${props => props.theme.shadows.small};
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 0;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  
  span {
    color: ${props => props.theme.colors.primary};
    margin-left: 0.25rem;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    position: fixed;
    top: 0;
    right: ${props => (props.isOpen ? '0' : '-100%')};
    width: 70%;
    height: 100vh;
    background-color: ${props => props.theme.colors.cardBg};
    flex-direction: column;
    justify-content: center;
    transition: ${props => props.theme.transitions.default};
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const NavLink = styled(Link)`
  margin: 0 1rem;
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.isActive ? '600' : '400'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${props => (props.isActive ? '100%' : '0')};
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
    transition: ${props => props.theme.transitions.default};
  }
  
  &:hover::after {
    width: 100%;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin: 1rem 0;
    font-size: 1.2rem;
  }
`;

const CloseButton = styled.button`
  display: none;
  background: none;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  position: absolute;
  top: 1rem;
  right: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  return (
    <Nav>
      <div className="container">
        <NavContainer>
          <Logo to="/">
            Vitt<span>Saar</span>
          </Logo>
          
          <MenuButton onClick={toggleMenu}>
            <FiMenu />
          </MenuButton>
          
          <NavLinks isOpen={isOpen}>
            <CloseButton onClick={closeMenu}>
              <FiX />
            </CloseButton>
            
            <NavLink 
              to="/" 
              isActive={location.pathname === '/'} 
              onClick={closeMenu}
            >
              Home
            </NavLink>
            
            <NavLink 
              to="/generate-report" 
              isActive={location.pathname === '/generate-report'} 
              onClick={closeMenu}
            >
              Generate Report
            </NavLink>
            
            <NavLink 
              to="/index-data" 
              isActive={location.pathname === '/index-data'} 
              onClick={closeMenu}
            >
              Index Data
            </NavLink>
            
            <NavLink 
              to="/view-reports" 
              isActive={location.pathname === '/view-reports'} 
              onClick={closeMenu}
            >
              View Reports
            </NavLink>
            
            <NavLink 
              to="/about" 
              isActive={location.pathname === '/about'} 
              onClick={closeMenu}
            >
              About
            </NavLink>
          </NavLinks>
        </NavContainer>
      </div>
    </Nav>
  );
};

export default Navbar;