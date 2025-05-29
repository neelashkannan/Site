import React, { useState } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Section from '../components/ui/Section';
import { submitContactForm } from '../services/api';

const ContactContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  background: rgba(10, 10, 15, 0.7);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: fit-content;
  
  h3 {
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 1.5rem;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  
  .icon {
    width: 24px;
    height: 24px;
    fill: var(--primary-color);
    flex-shrink: 0;
    margin-top: 0.2rem;
  }
  
  .content {
    h4 {
      font-size: 1.1rem;
      margin-bottom: 0.3rem;
      font-family: 'Orbitron', sans-serif;
    }
    
    p {
      margin: 0;
      font-size: 0.95rem;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      background-color: var(--primary-color);
      transform: translateY(-3px);
    }
    
    svg {
      width: 20px;
      height: 20px;
      fill: var(--text-color);
    }
  }
`;

const ContactFormContainer = styled.div`
  background: rgba(10, 10, 15, 0.7);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    font-family: 'Orbitron', sans-serif;
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .error-message {
    color: var(--error-color);
    font-size: 0.85rem;
    margin-top: 0.3rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
  
  svg {
    width: 80px;
    height: 80px;
    fill: var(--success-color);
    margin-bottom: 1.5rem;
  }
  
  h3 {
    color: var(--success-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
`;

// Validation schema for contact form
const contactFormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Handle contact form submission
  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    
    try {
      const response = await submitContactForm(values);
      
      if (response.success) {
        setSubmitSuccess(true);
        resetForm();
        toast.success('Your message has been sent successfully!');
      } else {
        toast.error(response.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setSubmitSuccess(false);
  };
  
  return (
    <Section 
      title="Contact Us"
      subtitle="Get in touch with our team for any questions or inquiries about our 3D printing services."
    >
      <ContactContainer>
        <ContactInfo>
          <h3>Get In Touch</h3>
          <p>
            Have questions about our 3D printing services or need a custom quote?
            Our team is ready to help you bring your ideas to life.
          </p>
          
          <InfoItem>
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
            </svg>
            <div className="content">
              <h4>Location</h4>
              <p>123 Tech Park Avenue, San Francisco, CA 94103</p>
            </div>
          </InfoItem>
          
          <InfoItem>
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z" />
            </svg>
            <div className="content">
              <h4>Email</h4>
              <p>info@robonium.tech</p>
            </div>
          </InfoItem>
          
          <InfoItem>
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.083-1.026-3.493-6.817-2.106 1.039c-7.202 3.755 4.233 25.982 11.6 22.615.121-.055 2.102-1.029 2.11-1.033z" />
            </svg>
            <div className="content">
              <h4>Phone</h4>
              <p>(555) 123-4567</p>
            </div>
          </InfoItem>
          
          <InfoItem>
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.99 6.98l-5.99 5.992-6-6.002 1.414-1.414 4.586 4.586 4.576-4.576 1.414 1.414z" />
            </svg>
            <div className="content">
              <h4>Hours</h4>
              <p>Monday - Friday: 9am to 5pm<br />Saturday: 10am to 2pm</p>
            </div>
          </InfoItem>
          
          <SocialLinks>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </a>
          </SocialLinks>
        </ContactInfo>
        
        <ContactFormContainer>
          {submitSuccess ? (
            <SuccessMessage>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/>
              </svg>
              <h3>Message Sent!</h3>
              <p>
                Thank you for contacting us. We've received your message and will get back to you
                as soon as possible, usually within 24-48 hours.
              </p>
              <button className="btn btn-primary" onClick={resetForm}>
                Send Another Message
              </button>
            </SuccessMessage>
          ) : (
            <>
              <h3>Send Us a Message</h3>
              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  subject: '',
                  message: '',
                }}
                validationSchema={contactFormSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form>
                    <FormGrid>
                      <FormGroup>
                        <label htmlFor="name">Name</label>
                        <Field name="name" type="text" className="form-control" />
                        <ErrorMessage name="name" component="div" className="error-message" />
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="email">Email</label>
                        <Field name="email" type="email" className="form-control" />
                        <ErrorMessage name="email" component="div" className="error-message" />
                      </FormGroup>
                    </FormGrid>
                    
                    <FormGroup>
                      <label htmlFor="subject">Subject</label>
                      <Field name="subject" type="text" className="form-control" />
                      <ErrorMessage name="subject" component="div" className="error-message" />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="message">Message</label>
                      <Field name="message" as="textarea" rows="6" className="form-control" />
                      <ErrorMessage name="message" component="div" className="error-message" />
                    </FormGroup>
                    
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </ContactFormContainer>
      </ContactContainer>
    </Section>
  );
};

export default Contact; 