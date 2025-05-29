import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Card = styled.div`
  background: rgba(10, 10, 15, 0.7);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: var(--transition-default);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: var(--box-shadow-default);
  z-index: 10;
  margin-bottom: 20px;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--box-shadow-hover);
    border-color: rgba(52, 152, 219, 0.3);
    
    .card-image {
      transform: scale(1.05);
    }
  }
  
  @media (max-width: 480px) {
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const CardImageWrapper = styled.div`
  width: 100%;
  height: 220px;
  overflow: hidden;
  position: relative;
  display: block;
  
  @media (max-width: 992px) {
    height: 200px;
  }
  
  @media (max-width: 768px) {
    height: 180px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  display: block;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    padding: 1.2rem;
  }
`;

const CardTitle = styled.h3`
  font-family: 'Orbitron', sans-serif;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const CardDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex: 1;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }
`;

const CardFooter = styled.div`
  margin-top: auto;
`;

const ServiceCard = ({ title, description, imageSrc, linkTo, buttonText = 'Learn More' }) => {
  return (
    <Card>
      <CardImageWrapper>
        <CardImage src={imageSrc} alt={title} className="card-image" />
      </CardImageWrapper>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardFooter>
          <Link to={linkTo} className="btn btn-primary">
            {buttonText}
          </Link>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default ServiceCard; 