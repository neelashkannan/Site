import { useState, useCallback } from 'react';

const useFileUpload = (options = {}) => {
  const {
    maxSizeMB = 50,
    acceptedFileTypes = ['stl', 'obj', 'gltf', 'glb'],
  } = options;
  
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Convert size to readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Handle file selection
  const handleFileSelect = useCallback((selectedFile) => {
    setError(null);
    
    if (!selectedFile) {
      resetFileState();
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Check file size
      const sizeInMB = selectedFile.size / 1024 / 1024;
      if (sizeInMB > maxSizeMB) {
        setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
        resetFileState();
        setIsUploading(false);
        return;
      }
      
      // Check file type
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      if (!acceptedFileTypes.includes(fileExtension)) {
        setError(`Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`);
        resetFileState();
        setIsUploading(false);
        return;
      }
      
      // Create a URL for the file
      const objectUrl = URL.createObjectURL(selectedFile);
      
      // Set file data
      setFile(selectedFile);
      setFileUrl(objectUrl);
      setFileType(fileExtension);
      setFileName(selectedFile.name);
      setFileSize(formatFileSize(selectedFile.size));
      
      setIsUploading(false);
    } catch (err) {
      console.error('Error handling file:', err);
      setError('There was an error processing the file.');
      resetFileState();
      setIsUploading(false);
    }
  }, [maxSizeMB, acceptedFileTypes]);
  
  // Handle drag and drop
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);
  
  // Handle file input change
  const handleFileInputChange = useCallback((event) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      handleFileSelect(selectedFile);
    }
  }, [handleFileSelect]);
  
  // Reset the file state
  const resetFileState = useCallback(() => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    
    setFile(null);
    setFileUrl(null);
    setFileType(null);
    setFileName('');
    setFileSize(0);
  }, [fileUrl]);
  
  // Clear the current file
  const clearFile = useCallback(() => {
    resetFileState();
    setError(null);
  }, [resetFileState]);
  
  return {
    file,
    fileUrl,
    fileType,
    fileName,
    fileSize,
    error,
    isUploading,
    handleFileSelect,
    handleDrop,
    handleFileInputChange,
    clearFile,
  };
};

export default useFileUpload; 