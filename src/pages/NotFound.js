import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 70vh;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 6rem;
  margin-bottom: 1rem;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  font-family: 'Orbitron', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const SpaceShip = styled.div`
  margin-bottom: 2rem;
  position: relative;
  animation: float 4s ease-in-out infinite;
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  
  svg {
    width: 150px;
    height: 150px;
    
    @media (max-width: 768px) {
      width: 120px;
      height: 120px;
    }
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <SpaceShip>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3498db">
          <path d="M15.224 15.508l-2.213 4.65a.5.5 0 0 1-.897.019l-2.976-5.175a.5.5 0 0 1 .145-.697l.292-.183a.5.5 0 0 1 .572.042l.202.159a.5.5 0 0 0 .598.002l.11-.084a.5.5 0 0 1 .632.019l1.953 1.924a.5.5 0 0 0 .535.072l.133-.054a.5.5 0 0 1 .661.347l.146.495a.5.5 0 0 0 .107.214zm2.425-4.532a.5.5 0 0 1-.276.569L12.596 13.5h-1.192l-4.777-1.955a.5.5 0 0 1-.275-.569C7.331 8.418 9.334 7 12 7c2.666 0 4.669 1.418 5.649 3.976zm-3.649 1.745a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zM12 4a.5.5 0 0 1 .5.5v1.75a.5.5 0 0 1-1 0V4.5a.5.5 0 0 1 .5-.5zm4 1.5a.5.5 0 0 1 .5-.5h1.75a.5.5 0 0 1 0 1H16.5a.5.5 0 0 1-.5-.5zm-8 0a.5.5 0 0 1-.5-.5H5.75a.5.5 0 0 1 0 1H7.5a.5.5 0 0 1-.5-.5z"/>
        </svg>
      </SpaceShip>
      
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <Description>
        Looks like you've ventured into uncharted space. The page you're looking for
        doesn't exist or has been moved to another dimension.
      </Description>
      
      <ButtonGroup>
        <Link to="/" className="btn btn-primary">
          Return Home
        </Link>
        <Link to="/upload" className="btn btn-secondary">
          Upload a Model
        </Link>
      </ButtonGroup>
    </NotFoundContainer>
  );
};

export default NotFound;

 