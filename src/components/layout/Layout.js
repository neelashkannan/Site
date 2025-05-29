import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import GlobalStyles from '../../styles/GlobalStyles';
import starsImage from '../../assets/images/stars.png';
import twinklingImage from '../../assets/images/twinkling.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/FixStyles.css';

const Main = styled.main`
  min-height: 100vh;
  padding-top: calc(var(--header-height) + 1rem);
  position: relative;
  z-index: 5;
  display: block;
  visibility: visible;
  opacity: 1;
  overflow: visible;
  
  @media (max-width: 768px) {
    padding-top: calc(var(--header-height-mobile) + 1rem);
  }
`;

const Stars = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -5;
  pointer-events: none;
  background: #000 url(${starsImage}) repeat top center;
`;

const Twinkling = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -5;
  pointer-events: none;
  background: transparent url(${twinklingImage}) repeat top center;
  animation: move-twink-back 200s linear infinite;
  
  @keyframes move-twink-back {
    from {background-position: 0 0;}
    to {background-position: -10000px 5000px;}
  }
`;

const Layout = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Fix visibility issues
  useEffect(() => {
    // Always add emergency-fix class
    document.body.classList.add('emergency-fix');
    
    // Force content visibility
    document.body.style.height = 'auto';
    document.body.style.position = 'static';
    document.body.style.overflow = 'auto';
    
    // Add mobile class if needed
    if (window.innerWidth <= 768) {
      document.body.classList.add('mobile-device');
    }
    
    // Check if in portrait mode
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    if (isPortrait) {
      document.body.classList.add('portrait-mode');
    }
    
    // Add a slight delay to ensure everything is rendered
    setTimeout(() => {
      // Force all sections to be visible
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
        section.style.position = 'static';
        section.style.zIndex = '10';
        section.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        section.style.borderRadius = '8px';
        section.style.padding = '20px';
        section.style.marginBottom = '30px';
      });
      
      // Ensure main content is visible
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.style.display = 'block';
        mainElement.style.visibility = 'visible';
        mainElement.style.opacity = '1';
        mainElement.style.zIndex = '5';
        mainElement.style.paddingTop = '120px';
        mainElement.style.overflow = 'auto';
      }
      
      // Fix header position
      const header = document.querySelector('header');
      if (header) {
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.width = '100%';
        header.style.zIndex = '9999';
      }
      
      // Add specific fixes for portrait mode
      if (isPortrait) {
        // Adjust main content for portrait mode
        if (mainElement) {
          mainElement.style.paddingTop = '100px';
        }
        
        // Make sure hero section is visible in portrait
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
          heroSection.style.display = 'flex';
          heroSection.style.visibility = 'visible';
          heroSection.style.opacity = '1';
          heroSection.style.height = 'auto';
          heroSection.style.minHeight = '350px';
          heroSection.style.padding = '80px 20px 40px';
          heroSection.style.marginTop = '0';
        }
        
        // Ensure service cards are properly displayed
        const serviceCards = document.querySelectorAll('.card');
        if (serviceCards.length > 0) {
          serviceCards.forEach(card => {
            card.style.display = 'flex';
            card.style.visibility = 'visible';
            card.style.opacity = '1';
            card.style.marginBottom = '20px';
          });
        }
      }
    }, 100);
    
    // Handle orientation changes
    const handleOrientationChange = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      
      if (isPortrait) {
        document.body.classList.add('portrait-mode');
      } else {
        document.body.classList.remove('portrait-mode');
      }
      
      // Force visibility again after orientation change
      setTimeout(() => {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
          section.style.display = 'block';
          section.style.visibility = 'visible';
          section.style.opacity = '1';
        });
        
        const mainElement = document.querySelector('main');
        if (mainElement) {
          mainElement.style.display = 'block';
          mainElement.style.visibility = 'visible';
          mainElement.style.opacity = '1';
        }
      }, 300);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return (
    <>
      <GlobalStyles starsImage={starsImage} twinklingImage={twinklingImage} />
      <Stars />
      <Twinkling />
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
      <ToastContainer
        position={isMobile ? "bottom-center" : "bottom-right"}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default Layout; 