import React, { useEffect } from 'react';
import styled from 'styled-components';
import Hero from '../components/ui/Hero';
import Section from '../components/ui/Section';
import ServiceCard from '../components/ui/ServiceCard';
import { Link } from 'react-router-dom';

// Import images
import prototypingImg from '../assets/images/prototyping.jpg';
import productionImg from '../assets/images/production.jpg';
import designServicesImg from '../assets/images/design-services.jpg';
import customProjectsImg from '../assets/images/custom-projects.jpg';

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProcessList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const ProcessItem = styled.div`
  display: flex;
  gap: 2rem;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ProcessNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(52, 152, 219, 0.3);
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

const ProcessContent = styled.div`
  flex: 1;
  
  h3 {
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
`;

const CTASection = styled.div`
  text-align: center;
  padding: 3rem 0;
  
  h2 {
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 1.5rem;
    font-size: 2rem;
    
    @media (max-width: 768px) {
      font-size: 1.6rem;
    }
  }
  
  p {
    color: var(--text-secondary);
    max-width: 700px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }
`;

const Home = () => {
  // Ensure content is visible when the component mounts
  useEffect(() => {
    // Add emergency fix class to body - this is what works on other pages
    document.body.classList.add('emergency-fix');
    document.body.classList.add('mobile-device');
    
    // Check if in portrait mode
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    if (isPortrait) {
      document.body.classList.add('portrait-mode');
    }
    
    // Force content visibility
    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';
    document.body.style.position = 'static';
    document.body.style.overflow = 'auto';
    
    // Force sections to be visible with a slight delay to ensure everything is rendered
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
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = '1';
        mainContent.style.paddingTop = '120px';
        mainContent.style.overflow = 'auto';
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
      
      // Fix background stars
      const stars = document.querySelector('.stars');
      const twinkling = document.querySelector('.twinkling');
      if (stars && twinkling) {
        stars.style.position = 'fixed';
        stars.style.zIndex = '-5';
        twinkling.style.position = 'fixed';
        twinkling.style.zIndex = '-5';
      }
      
      // Portrait-specific fixes
      if (isPortrait) {
        // Fix hero section
        const hero = document.querySelector('.hero');
        if (hero) {
          hero.style.display = 'flex';
          hero.style.visibility = 'visible';
          hero.style.opacity = '1';
          hero.style.height = 'auto';
          hero.style.minHeight = '350px';
          hero.style.padding = '80px 20px 40px';
          hero.style.marginTop = '0';
        }
        
        // Fix service grid
        const serviceGrid = document.querySelector('.ServicesGrid');
        if (serviceGrid) {
          serviceGrid.style.display = 'grid';
          serviceGrid.style.gridTemplateColumns = '1fr';
          serviceGrid.style.gap = '20px';
          serviceGrid.style.visibility = 'visible';
          serviceGrid.style.opacity = '1';
        }
        
        // Fix process list
        const processList = document.querySelector('.ProcessList');
        if (processList) {
          processList.style.display = 'flex';
          processList.style.flexDirection = 'column';
          processList.style.gap = '20px';
          processList.style.visibility = 'visible';
          processList.style.opacity = '1';
        }
        
        // Adjust main content padding
        if (mainContent) {
          mainContent.style.paddingTop = '100px';
        }
      }
    }, 100);
    
    // Handle orientation changes
    const handleOrientationChange = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      
      if (isPortrait) {
        document.body.classList.add('portrait-mode');
        
        // Force all content to be visible after orientation change
        setTimeout(() => {
          // Apply portrait-specific fixes
          const sections = document.querySelectorAll('section');
          sections.forEach(section => {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
          });
          
          const hero = document.querySelector('.hero');
          if (hero) {
            hero.style.display = 'flex';
            hero.style.visibility = 'visible';
            hero.style.opacity = '1';
          }
          
          const serviceGrid = document.querySelector('.ServicesGrid');
          if (serviceGrid) {
            serviceGrid.style.display = 'grid';
            serviceGrid.style.gridTemplateColumns = '1fr';
            serviceGrid.style.visibility = 'visible';
            serviceGrid.style.opacity = '1';
          }
        }, 300);
      } else {
        document.body.classList.remove('portrait-mode');
      }
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
      <Hero />
      
      <Section 
        id="print-services"
        title="Our 3D Printing Services"
        subtitle="We offer a comprehensive range of 3D printing services to bring your ideas to life"
        className="print-services"
      >
        <ServicesGrid className="ServicesGrid">
          <ServiceCard 
            title="Rapid Prototyping"
            description="Turn your ideas into physical prototypes quickly. Perfect for testing concepts, validating designs, and iterating on products before full production."
            imageSrc={prototypingImg}
            linkTo="/#prototyping"
            buttonText="Learn More"
          />
          
          <ServiceCard 
            title="Production Runs"
            description="Scale your project with our production-level 3D printing. Ideal for small-batch manufacturing, custom parts production, and on-demand inventory."
            imageSrc={productionImg}
            linkTo="/#production"
            buttonText="Learn More"
          />
          
          <ServiceCard 
            title="Design Services"
            description="Don't have a 3D model yet? Our designers can help create the perfect 3D model based on your specifications, sketches, or ideas."
            imageSrc={designServicesImg}
            linkTo="/#design-services"
            buttonText="Learn More"
          />
          
          <ServiceCard 
            title="Custom Projects"
            description="Have a unique project that doesn't fit the standard mold? We specialize in custom solutions for special requirements and complex challenges."
            imageSrc={customProjectsImg}
            linkTo="/#custom-projects"
            buttonText="Learn More"
          />
        </ServicesGrid>
      </Section>
      
      <Section 
        id="how-it-works"
        title="How It Works"
        subtitle="Getting your 3D model printed is simple with our streamlined process"
        background="rgba(10, 10, 20, 0.3)"
        className="how-it-works"
      >
        <ProcessList className="ProcessList">
          <ProcessItem className="ProcessItem">
            <ProcessNumber>1</ProcessNumber>
            <ProcessContent>
              <h3>Upload Your 3D Model</h3>
              <p>
                Upload your 3D model file (STL, OBJ, GLTF or GLB) through our easy-to-use upload page.
                Don't have a model? Contact us about our design services to create one for you.
              </p>
            </ProcessContent>
          </ProcessItem>
          
          <ProcessItem className="ProcessItem">
            <ProcessNumber>2</ProcessNumber>
            <ProcessContent>
              <h3>Get a Quote</h3>
              <p>
                Fill in details about your project including material preferences, color options, quantity,
                and any special requirements. We'll review and provide you with a custom quote.
              </p>
            </ProcessContent>
          </ProcessItem>
          
          <ProcessItem className="ProcessItem">
            <ProcessNumber>3</ProcessNumber>
            <ProcessContent>
              <h3>Review and Approve</h3>
              <p>
                Review your quote and make any necessary adjustments. Once you're satisfied,
                approve the project and we'll start the printing process.
              </p>
            </ProcessContent>
          </ProcessItem>
          
          <ProcessItem className="ProcessItem">
            <ProcessNumber>4</ProcessNumber>
            <ProcessContent>
              <h3>Production and Quality Control</h3>
              <p>
                We print your model with precision and care. Every print undergoes thorough quality control
                to ensure it meets our high standards before shipping.
              </p>
            </ProcessContent>
          </ProcessItem>
          
          <ProcessItem className="ProcessItem">
            <ProcessNumber>5</ProcessNumber>
            <ProcessContent>
              <h3>Delivery</h3>
              <p>
                Your finished prints are carefully packaged and shipped to your doorstep.
                Track your order every step of the way with our shipping updates.
              </p>
            </ProcessContent>
          </ProcessItem>
        </ProcessList>
        
        <CTASection>
          <h2>Ready to Start Your Project?</h2>
          <p>
            Upload your 3D model now or contact us to discuss your custom requirements.
            We're here to help bring your ideas to life with precision 3D printing.
          </p>
          <Link to="/upload" className="btn btn-primary">Upload Your Model</Link>
        </CTASection>
      </Section>
    </>
  );
};

export default Home; 