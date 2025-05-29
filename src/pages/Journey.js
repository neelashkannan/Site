import React from 'react';
import styled from 'styled-components';
import Section from '../components/ui/Section';
import { Link } from 'react-router-dom';
import showcaseImage from '../assets/images/3d-printing-showcase.jpg';

const TimelineContainer = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 3rem auto;
  padding: 2rem 0;
  
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 4px;
    background: linear-gradient(to bottom, rgba(52, 152, 219, 0.7), rgba(155, 89, 182, 0.7));
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    border-radius: 4px;
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 30px;
  position: relative;
  margin-bottom: 4rem;
  width: 50%;
  
  @media (max-width: 768px) {
    width: 100%;
    padding-left: 70px;
    padding-right: 0;
  }
  
  &:nth-child(even) {
    align-self: flex-end;
    justify-content: flex-start;
    
    .timeline-dot {
      left: -41px;
      
      @media (max-width: 768px) {
        left: 10px;
      }
    }
    
    @media (max-width: 768px) {
      align-self: auto;
    }
  }
  
  &:nth-child(odd) {
    align-self: flex-start;
    
    .timeline-dot {
      right: -41px;
      
      @media (max-width: 768px) {
        right: auto;
        left: 10px;
      }
    }
    
    @media (max-width: 768px) {
      justify-content: flex-start;
    }
  }
`;

const TimelineContent = styled.div`
  background: rgba(10, 10, 15, 0.7);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--box-shadow-default);
  transition: var(--transition-default);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--box-shadow-hover);
    border-color: rgba(52, 152, 219, 0.3);
  }
  
  h3 {
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
  
  h4 {
    font-size: 0.9rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    max-width: none;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  top: 20px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: var(--primary-color);
  box-shadow: 0 0 0 5px rgba(52, 152, 219, 0.2);
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    width: 13px;
    height: 13px;
    background: rgba(10, 10, 15, 0.7);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const ShowcaseSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-top: 4rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ShowcaseImage = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--box-shadow-default);
  }
  
  @media (max-width: 992px) {
    order: 1;
  }
`;

const ShowcaseContent = styled.div`
  @media (max-width: 992px) {
    order: 2;
  }
  
  h3 {
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 1.5rem;
    font-size: 2rem;
    
    @media (max-width: 768px) {
      font-size: 1.6rem;
    }
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
`;

const Journey = () => {
  return (
    <>
      <Section 
        title="Our Journey"
        subtitle="From a small garage operation to a full-fledged 3D printing service, discover how Robonium came to be."
      >
        <TimelineContainer>
          <TimelineItem>
            <TimelineContent>
              <h3>The Beginning</h3>
              <h4>June 2018</h4>
              <p>
                Robonium started as a hobby project in a small garage with a single 3D printer.
                The founder's passion for creating physical objects from digital designs led to
                helping friends and family bring their ideas to life.
              </p>
            </TimelineContent>
            <TimelineDot className="timeline-dot" />
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <h3>First Commercial Project</h3>
              <h4>January 2019</h4>
              <p>
                After gaining experience and upgrading equipment, Robonium took on its first
                commercial project - a series of custom enclosures for an electronics startup.
                This success led to word-of-mouth referrals and a growing client base.
              </p>
            </TimelineContent>
            <TimelineDot className="timeline-dot" />
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <h3>Expanding Capabilities</h3>
              <h4>October 2019</h4>
              <p>
                Investment in additional printers and materials expanded our capabilities.
                We added resin printing for high-detail models and began offering a wider
                range of filament options including flexible TPU and durable nylon.
              </p>
            </TimelineContent>
            <TimelineDot className="timeline-dot" />
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <h3>New Studio Space</h3>
              <h4>March 2020</h4>
              <p>
                Outgrowing the garage, Robonium moved to a dedicated studio space.
                Despite the challenges of the pandemic, we pivoted to create PPE for
                healthcare workers and continued to grow our remote client base.
              </p>
            </TimelineContent>
            <TimelineDot className="timeline-dot" />
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <h3>Design Services Added</h3>
              <h4>August 2021</h4>
              <p>
                Recognizing that many clients had ideas but not 3D models, we added
                design services to our offerings. Our team expanded to include skilled
                3D designers who could translate concepts into printable models.
              </p>
            </TimelineContent>
            <TimelineDot className="timeline-dot" />
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <h3>Industrial Partnerships</h3>
              <h4>January 2022</h4>
              <p>
                Robonium began partnerships with local industrial firms, providing
                rapid prototyping services and small-batch production for specialized
                components. These relationships helped establish our reputation for quality.
              </p>
            </TimelineContent>
            <TimelineDot className="timeline-dot" />
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <h3>Robonium Today</h3>
              <h4>Present</h4>
              <p>
                Today, Robonium operates a fleet of industrial and consumer-grade 3D printers,
                serving clients from hobbyists to Fortune 500 companies. We remain committed to
                quality, innovation, and bringing your ideas to life with cutting-edge technology.
              </p>
            </TimelineContent>
            <TimelineDot className="timeline-dot" />
          </TimelineItem>
        </TimelineContainer>
        
        <ShowcaseSection>
          <ShowcaseContent>
            <h3>Join Us on Our Journey</h3>
            <p>
              From our humble beginnings to our current capabilities, we've maintained our passion
              for turning digital concepts into physical reality. Every project teaches us something
              new and pushes the boundaries of what's possible with 3D printing technology.
            </p>
            <p>
              Whether you're a hobbyist with a creative idea or a business needing production-ready
              parts, we bring the same level of care and attention to detail to every project.
              Our journey continues with each new client and challenge.
            </p>
            <Link to="/upload" className="btn btn-primary">
              Start Your Project
            </Link>
          </ShowcaseContent>
          <ShowcaseImage>
            <img src={showcaseImage} alt="3D Printing Showcase" />
          </ShowcaseImage>
        </ShowcaseSection>
      </Section>
    </>
  );
};

export default Journey; 