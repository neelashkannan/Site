import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeroContainer = styled.section`
  height: auto;
  min-height: 550px;
  max-height: 900px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: visible;
  padding: 2rem 0;
  margin-bottom: 2rem;
  z-index: 1;
  margin-top: 60px;
  
  @media (max-width: 992px) {
    height: auto;
    min-height: 500px;
  }
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 550px;
    padding: 5rem 0 3rem;
    margin-top: 0;
  }
  
  @media (max-width: 480px) {
    min-height: 500px;
    padding: 4.5rem 0 2.5rem;
  }
  
  @media (orientation: portrait) {
    height: auto !important;
    min-height: 400px !important;
    padding: 60px 20px 40px !important;
    margin-top: 0 !important;
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
  width: 100%;
  position: relative;
  z-index: 2;
`;

const HeroText = styled.div`
  max-width: 600px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
  }
`;

const HeroTitle = styled.h1`
  font-size: 4.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(135deg, #ffffff, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 1200px) {
    font-size: 4rem;
  }
  
  @media (max-width: 992px) {
    font-size: 3.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
  
  @media (orientation: portrait) {
    font-size: 2rem !important;
    margin-bottom: 1rem !important;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 1.5rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1.2rem;
    width: 100%;
    max-width: 300px;
    margin: 1.5rem auto 0;
    
    a {
      width: 100%;
      padding: 1.2rem 1rem;
      font-size: 1.1rem;
      text-align: center;
      font-weight: bold;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      letter-spacing: 1px;
      
      &.btn-secondary {
        background: linear-gradient(135deg, #34495e, #2c3e50);
      }
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
      }
    }
  }
`;

const TypingText = styled.span`
  display: inline-block;
  color: #3498db;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 5%;
    height: 90%;
    width: 2px;
    background-color: #3498db;
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    from, to {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  
  @media (max-width: 480px) {
    display: block;
    margin-top: 0.5rem;
  }
`;

const Hero = () => {
  const [typingText, setTypingText] = useState('');
  const fullText = "PROFESSIONAL 3D PRINTING";
  const typingSpeed = 100; // ms per character
  const pauseTime = 1500; // ms to wait at the end
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    let timeout;
    
    if (!isDeleting && typingText === fullText) {
      // Pause at the end of typing
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && typingText === '') {
      // Pause before restarting
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, pauseTime / 2);
    } else {
      // Typing or deleting
      const speed = isDeleting ? typingSpeed / 2 : typingSpeed;
      timeout = setTimeout(() => {
        setTypingText(prev => {
          if (isDeleting) {
            return prev.slice(0, -1);
          } else {
            return fullText.slice(0, prev.length + 1);
          }
        });
      }, speed);
    }
    
    return () => clearTimeout(timeout);
  }, [typingText, isDeleting]);
  
  // Add this effect to ensure visibility in portrait mode
  useEffect(() => {
    const fixPortraitMode = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      
      if (isPortrait) {
        // Force hero container to be visible in portrait mode
        const heroContainer = document.querySelector('.hero');
        if (heroContainer) {
          heroContainer.style.display = 'flex';
          heroContainer.style.visibility = 'visible';
          heroContainer.style.opacity = '1';
          heroContainer.style.height = 'auto';
          heroContainer.style.minHeight = '350px';
          heroContainer.style.padding = '80px 20px 40px';
        }
      }
    };
    
    // Run once on mount
    fixPortraitMode();
    
    // Set up event listener for orientation changes
    window.addEventListener('resize', fixPortraitMode);
    window.addEventListener('orientationchange', fixPortraitMode);
    
    return () => {
      window.removeEventListener('resize', fixPortraitMode);
      window.removeEventListener('orientationchange', fixPortraitMode);
    };
  }, []);
  
  return (
    <HeroContainer className="hero">
      <HeroContent>
        <HeroText>
          <HeroTitle>
            ROBONIUM
            <br />
            <TypingText style={{ visibility: showCursor ? 'visible' : 'hidden' }}>
              {typingText}
            </TypingText>
          </HeroTitle>
          <HeroSubtitle>
            Transform your digital ideas into physical reality with our precision 3D printing services.
            From rapid prototyping to production-ready parts, we bring your vision to life.
          </HeroSubtitle>
          <HeroButtons>
            <Link to="/upload" className="btn btn-primary">
              Upload Your Model
            </Link>
            <Link to="/#print-services" className="btn btn-secondary">
              Explore Services
            </Link>
          </HeroButtons>
        </HeroText>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero; 