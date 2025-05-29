import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Contact from './pages/Contact';
import Journey from './pages/Journey';
import NotFound from './pages/NotFound';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 