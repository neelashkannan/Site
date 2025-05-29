import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: var(--section-spacing) 0;
  position: relative;
  overflow: visible;
  z-index: 5;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: 100px;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    padding: var(--section-spacing-mobile) 0;
  }
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
  position: relative;
  z-index: 5;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;
  
  @media (max-width: 992px) {
    margin-bottom: 3rem;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Orbitron', sans-serif;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const SectionSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 90%;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const Section = ({ id, title, subtitle, children, background, style }) => {
  return (
    <SectionContainer id={id} style={{ background, ...style }}>
      <SectionContent>
        {(title || subtitle) && (
          <SectionHeader>
            {title && <SectionTitle>{title}</SectionTitle>}
            {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
          </SectionHeader>
        )}
        {children}
      </SectionContent>
    </SectionContainer>
  );
};

export default Section; 