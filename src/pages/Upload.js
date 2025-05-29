import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import ModelViewer from '../components/3d/ModelViewer';
import Section from '../components/ui/Section';
import useFileUpload from '../hooks/useFileUpload';
import { submitQuoteRequest, getMaterials, getPrintSettings } from '../services/api';

const UploadContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const UploadCard = styled.div`
  background: rgba(10, 10, 15, 0.7);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    margin-bottom: 1.5rem;
    font-family: 'Orbitron', sans-serif;
  }
`;

const FormContainer = styled.div`
  margin-top: 2rem;
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

const DropZone = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover, &.drag-active {
    border-color: var(--primary-color);
    background-color: rgba(52, 152, 219, 0.05);
  }
  
  p {
    margin: 1rem 0;
    color: var(--text-secondary);
  }
  
  .upload-icon {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    fill: var(--primary-color);
    opacity: 0.8;
  }
`;

const FileInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(20, 20, 30, 0.5);
  border-radius: var(--border-radius-sm);
  border-left: 3px solid var(--primary-color);
  
  p {
    margin: 0.3rem 0;
    font-size: 0.9rem;
    
    strong {
      color: var(--text-color);
      margin-right: 0.5rem;
    }
  }
`;

const ErrorContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(231, 76, 60, 0.1);
  border-radius: var(--border-radius-sm);
  border-left: 3px solid var(--error-color);
  color: var(--error-color);
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

// Validation schema for form
const quoteRequestSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().optional(),
  material: Yup.string().required('Material selection is required'),
  color: Yup.string().required('Color selection is required'),
  quantity: Yup.number()
    .required('Quantity is required')
    .min(1, 'Minimum quantity is 1')
    .integer('Quantity must be a whole number'),
  finish: Yup.string().required('Finish is required'),
  quality: Yup.string().required('Print quality is required'),
  message: Yup.string().optional(),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms of service'),
});

const Upload = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [printSettings, setPrintSettings] = useState({
    colors: [],
    finishes: [],
    quality: [],
  });
  
  const {
    file,
    fileUrl,
    fileType,
    fileName,
    fileSize,
    error: fileError,
    isUploading,
    handleFileSelect,
    handleDrop,
    handleFileInputChange,
    clearFile,
  } = useFileUpload({
    maxSizeMB: 50,
    acceptedFileTypes: ['stl', 'obj', 'gltf', 'glb'],
  });
  
  const fileInputRef = React.useRef(null);
  
  // Load materials and print settings
  useEffect(() => {
    const loadData = async () => {
      const [materialsResponse, settingsResponse] = await Promise.all([
        getMaterials(),
        getPrintSettings(),
      ]);
      
      if (materialsResponse.data) {
        setMaterials(materialsResponse.data);
      }
      
      if (settingsResponse.data) {
        setPrintSettings(settingsResponse.data);
      }
    };
    
    loadData();
  }, []);
  
  // Handle drag events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);
  
  // Handle file selection click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    if (!file && !submitSuccess) {
      toast.error('Please upload a 3D model file before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = {
        ...values,
        file: file,
      };
      
      const response = await submitQuoteRequest(formData);
      
      if (response.success) {
        setSubmitSuccess(true);
        resetForm();
        clearFile();
        toast.success('Your quote request has been submitted successfully!');
      } else {
        toast.error(response.error || 'Failed to submit quote request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setSubmitSuccess(false);
  };
  
  return (
    <>
      <Section 
        title="Upload Your 3D Model"
        subtitle="Get a quote for your 3D printing project by uploading your model and filling out the details."
      >
        {submitSuccess ? (
          <SuccessMessage>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/>
            </svg>
            <h3>Quote Request Submitted!</h3>
            <p>
              Thank you for submitting your quote request. We've received your 3D model and details.
              Our team will review your project and get back to you within 24-48 hours with a quote.
            </p>
            <button className="btn btn-primary" onClick={resetForm}>
              Submit Another Request
            </button>
          </SuccessMessage>
        ) : (
          <UploadContainer>
            <UploadCard>
              <h3>Upload 3D Model</h3>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  handleDragLeave(e);
                  handleDrop(e);
                }}
              >
                <DropZone 
                  className={dragActive ? 'drag-active' : ''}
                  onClick={handleUploadClick}
                >
                  <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                  </svg>
                  <h4>Drag and drop your 3D model here</h4>
                  <p>Or click to browse your files</p>
                  <p className="small">Supported formats: STL, OBJ, GLTF, GLB (Max 50MB)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                    accept=".stl,.obj,.gltf,.glb"
                  />
                </DropZone>
                
                {file && (
                  <FileInfo>
                    <p><strong>File:</strong> {fileName}</p>
                    <p><strong>Size:</strong> {fileSize}</p>
                    <p><strong>Type:</strong> {fileType.toUpperCase()}</p>
                    <button 
                      className="btn btn-secondary" 
                      style={{ marginTop: '1rem' }}
                      onClick={clearFile}
                    >
                      Clear File
                    </button>
                  </FileInfo>
                )}
                
                {fileError && (
                  <ErrorContainer>
                    <p>{fileError}</p>
                  </ErrorContainer>
                )}
              </div>
              
              <ModelViewer 
                file={fileUrl}
                fileType={fileType}
              />
            </UploadCard>
            
            <UploadCard>
              <h3>Request Quote</h3>
              <p>Fill in the details below to get a quote for your 3D printing project.</p>
              
              <FormContainer>
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    phone: '',
                    material: '',
                    color: '',
                    quantity: 1,
                    finish: '',
                    quality: '',
                    message: '',
                    agreeToTerms: false,
                  }}
                  validationSchema={quoteRequestSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <FormGroup>
                        <label htmlFor="name">Name</label>
                        <Field name="name" type="text" className="form-control" />
                        <ErrorMessage name="name" component="div" className="error-message" />
                      </FormGroup>
                      
                      <FormGrid>
                        <FormGroup>
                          <label htmlFor="email">Email</label>
                          <Field name="email" type="email" className="form-control" />
                          <ErrorMessage name="email" component="div" className="error-message" />
                        </FormGroup>
                        
                        <FormGroup>
                          <label htmlFor="phone">Phone (Optional)</label>
                          <Field name="phone" type="tel" className="form-control" />
                          <ErrorMessage name="phone" component="div" className="error-message" />
                        </FormGroup>
                      </FormGrid>
                      
                      <FormGrid>
                        <FormGroup>
                          <label htmlFor="material">Material</label>
                          <Field name="material" as="select" className="form-control">
                            <option value="">Select Material</option>
                            {materials.map(material => (
                              <option key={material.id} value={material.id}>
                                {material.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="material" component="div" className="error-message" />
                        </FormGroup>
                        
                        <FormGroup>
                          <label htmlFor="color">Color</label>
                          <Field name="color" as="select" className="form-control">
                            <option value="">Select Color</option>
                            {printSettings.colors.map(color => (
                              <option key={color.id} value={color.id}>
                                {color.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="color" component="div" className="error-message" />
                        </FormGroup>
                      </FormGrid>
                      
                      <FormGrid>
                        <FormGroup>
                          <label htmlFor="finish">Finish</label>
                          <Field name="finish" as="select" className="form-control">
                            <option value="">Select Finish</option>
                            {printSettings.finishes.map(finish => (
                              <option key={finish.id} value={finish.id}>
                                {finish.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="finish" component="div" className="error-message" />
                        </FormGroup>
                        
                        <FormGroup>
                          <label htmlFor="quality">Print Quality</label>
                          <Field name="quality" as="select" className="form-control">
                            <option value="">Select Quality</option>
                            {printSettings.quality.map(q => (
                              <option key={q.id} value={q.id}>
                                {q.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="quality" component="div" className="error-message" />
                        </FormGroup>
                      </FormGrid>
                      
                      <FormGroup>
                        <label htmlFor="quantity">Quantity</label>
                        <Field name="quantity" type="number" min="1" className="form-control" />
                        <ErrorMessage name="quantity" component="div" className="error-message" />
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="message">Additional Details (Optional)</label>
                        <Field name="message" as="textarea" rows="4" className="form-control" />
                        <ErrorMessage name="message" component="div" className="error-message" />
                      </FormGroup>
                      
                      <FormGroup>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <Field name="agreeToTerms" type="checkbox" id="agreeToTerms" />
                          <label htmlFor="agreeToTerms" style={{ marginBottom: '0' }}>
                            I agree to the terms of service and privacy policy
                          </label>
                        </div>
                        <ErrorMessage name="agreeToTerms" component="div" className="error-message" />
                      </FormGroup>
                      
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={isSubmitting || !file}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </FormContainer>
            </UploadCard>
          </UploadContainer>
        )}
      </Section>
    </>
  );
};

export default Upload; 