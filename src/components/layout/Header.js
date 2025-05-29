import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transition: var(--transition-default);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.2rem 1.2rem;
    height: auto;
    min-height: 70px;
  }
  
  @media (max-width: 480px) {
    padding: 1.4rem 1rem;
    min-height: 80px;
  }
`;

const LogoAndToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  
  @media (min-width: 769px) {
    width: auto;
  }
`;

const Logo = styled.div`
  h1 {
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 2rem;
    margin: 0;
    letter-spacing: 2px;
    background: linear-gradient(135deg, #ffffff 30%, #a0a0a0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.6rem;
    }
    
    @media (max-width: 400px) {
      font-size: 1.5rem;
    }
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 1rem;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(52, 152, 219, 0.2);
    border-radius: 4px;
    padding: 0.6rem 1rem;
    border: 1px solid rgba(52, 152, 219, 0.3);
    font-size: 1.8rem;
    
    &:hover {
      background-color: rgba(52, 152, 219, 0.3);
    }
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    padding: 0.7rem 1.2rem;
  }
`;

const NavContainer = styled.div`
  @media (max-width: 768px) {
    position: absolute;
    top: ${props => props.isOpen ? '100%' : '-1000px'};
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.95);
    transition: top 0.3s ease-in-out;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    overflow: hidden;
    border-top: 1px solid rgba(52, 152, 219, 0.3);
    border-bottom: 1px solid rgba(52, 152, 219, 0.3);
    z-index: 1000;
  }
`;

const Nav = styled.nav`
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const NavItem = styled.li`
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const NavLink = styled(Link)`
  font-family: 'Orbitron', sans-serif;
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-weight: 500;
  display: block;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-color);
  }
  
  &.active {
    background-color: rgba(52, 152, 219, 0.3);
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    font-size: 1.3rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    border: 1px solid transparent;
    
    &:hover {
      border-color: rgba(52, 152, 219, 0.3);
      background-color: rgba(52, 152, 219, 0.1);
    }
    
    &.active {
      background-color: rgba(52, 152, 219, 0.3);
      border-color: rgba(52, 152, 219, 0.5);
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.4rem;
    font-size: 1.4rem;
    margin-bottom: 0.7rem;
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  // Handle scroll event for header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && 
          !event.target.closest('nav') && 
          !event.target.closest('button')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderContainer style={{ 
      backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.9)',
      boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.6)' : '0 4px 15px rgba(0, 0, 0, 0.4)'
    }}>
      <LogoAndToggle>
        <Logo>
          <Link to="/">
            <h1>ROBONIUM</h1>
          </Link>
        </Logo>
        
        <MenuToggle 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? '✕' : '☰'}
        </MenuToggle>
      </LogoAndToggle>
      
      <NavContainer isOpen={isMenuOpen}>
        <Nav>
          <NavList>
            <NavItem>
              <NavLink to="/" className={isActive('/') ? 'active' : ''}>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/journey" className={isActive('/journey') ? 'active' : ''}>
                Journey
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/#print-services" className={isActive('/#print-services') ? 'active' : ''}>
                Services
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/#how-it-works" className={isActive('/#how-it-works') ? 'active' : ''}>
                Process
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/upload" className={isActive('/upload') ? 'active' : ''}>
                Upload
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/contact" className={isActive('/contact') ? 'active' : ''}>
                Contact
              </NavLink>
            </NavItem>
          </NavList>
        </Nav>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header; 