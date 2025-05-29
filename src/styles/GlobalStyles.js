import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;500;700;900&display=swap');

  :root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    --accent-color: #9b59b6;
    --background-color: #0a0a0a;
    --text-color: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --border-color: rgba(255, 255, 255, 0.1);
    --success-color: #2ecc71;
    --warning-color: #f39c12;
    --error-color: #e74c3c;
    --header-height: 70px;
    --header-height-mobile: 60px;
    --transition-default: all 0.3s ease;
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --box-shadow-default: 0 5px 15px rgba(0, 0, 0, 0.3);
    --box-shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.4);
    --container-padding: 1.5rem;
    --section-spacing: 5rem;
    --section-spacing-mobile: 3rem;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Space Mono', monospace;
    background-color: var(--background-color);
    color: var(--text-color);
    overflow-x: hidden;
    width: 100%;
    min-height: 100vh;
    position: relative;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  h1 {
    font-size: 3.5rem;
    
    @media (max-width: 992px) {
      font-size: 3rem;
    }
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
    
    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }

  h2 {
    font-size: 2.5rem;
    
    @media (max-width: 992px) {
      font-size: 2.2rem;
    }
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }

  h3 {
    font-size: 1.8rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.3rem;
    }
  }

  p {
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: var(--transition-default);
  }

  a:hover {
    color: var(--primary-color);
    opacity: 0.8;
  }

  ul, ol {
    list-style-position: inside;
    margin-bottom: 1rem;
  }

  button, .btn {
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    border: none;
    outline: none;
    border-radius: var(--border-radius-md);
    transition: var(--transition-default);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
    font-size: 0.9rem;
    padding: 0.8rem 1.5rem;
    display: inline-block;
    text-align: center;
    position: relative;
    z-index: 5;
  }

  input, select, textarea {
    font-family: 'Space Mono', monospace;
    background-color: rgba(20, 20, 20, 0.7);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    padding: 0.8rem;
    color: var(--text-color);
    font-size: 0.9rem;
    transition: var(--transition-default);
    width: 100%;
  }

  input:focus, select:focus, textarea:focus {
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
    outline: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
    border: 1px solid rgba(52, 152, 219, 0.5);
  }

  .btn-primary:hover {
    box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: linear-gradient(135deg, #34495e, #2c3e50);
    color: white;
    box-shadow: 0 4px 10px rgba(52, 73, 94, 0.3);
    border: 1px solid rgba(52, 73, 94, 0.5);
  }

  .btn-secondary:hover {
    box-shadow: 0 6px 15px rgba(52, 73, 94, 0.4);
    transform: translateY(-2px);
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--container-padding);
  }

  .stars, .twinkling {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  }

  .stars {
    background: #000 url(${props => props.starsImage}) repeat top center;
  }

  .twinkling {
    background: transparent url(${props => props.twinklingImage}) repeat top center;
    animation: move-twink-back 200s linear infinite;
  }

  @keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
  }

  /* Media queries for responsive design */
  @media (max-width: 1200px) {
    :root {
      --container-padding: 2rem;
    }
  }

  @media (max-width: 992px) {
    :root {
      --section-spacing: 4rem;
    }
  }

  @media (max-width: 768px) {
    :root {
      --container-padding: 1.5rem;
      --section-spacing: var(--section-spacing-mobile);
    }

    button, .btn {
      padding: 0.9rem 1.4rem;
      font-size: 0.9rem;
      font-weight: 600;
    }
  }

  @media (max-width: 480px) {
    :root {
      --container-padding: 1rem;
    }
    
    button, .btn {
      width: 100%;
      padding: 1rem 1.2rem;
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      box-shadow: 0 5px 12px rgba(0, 0, 0, 0.4);
    }
    
    .btn-primary, .btn-secondary {
      border-width: 2px;
    }
    
    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-3px);
    }
  }

  /* iOS specific fixes */
  @supports (-webkit-touch-callout: none) {
    body {
      overscroll-behavior-y: none;
      -webkit-overflow-scrolling: touch;
      -webkit-text-size-adjust: 100%;
    }
  }
`;

export default GlobalStyles; 