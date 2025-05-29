// Import required modules
const express = require('express');
const multer = require('multer');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Initialize Express app
const app = express();

// Load configuration from environment variables
const CONFIG = {
  PORT: process.env.PORT || 3001,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '50000000'), // 50MB default
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  RESEND_API_KEY: process.env.RESEND_API_KEY || 're_YE2gw426_GhVhzUnYFP85Nqc4Ua7fgSYZ',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'neelashkannan@robonium.tech',
  FROM_EMAIL: process.env.FROM_EMAIL || 'quotes@robonium.tech',
  TEST_EMAIL: 'delivered@resend.dev',
  ENABLE_EMAILS: process.env.ENABLE_EMAILS === 'true',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_FILE_TYPES: ['.stl', '.obj', '.step', '.stp', '.3mf']
};

// Log configuration (but hide sensitive info)
console.log('Starting server with configuration:');
console.log('- Port:', CONFIG.PORT);
console.log('- Environment:', CONFIG.NODE_ENV);
console.log('- Email Sending:', CONFIG.ENABLE_EMAILS ? 'Enabled' : 'Disabled');
console.log('- Max File Size:', CONFIG.MAX_FILE_SIZE / (1024 * 1024), 'MB');
console.log('- Upload Directory:', CONFIG.UPLOAD_DIR);

// Configure Resend with API key
const resend = new Resend(CONFIG.RESEND_API_KEY);

// Configure cors with specific options
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  exposedHeaders: ['Content-Type'],
  credentials: true
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, CONFIG.UPLOAD_DIR);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: CONFIG.MAX_FILE_SIZE },
  fileFilter: function(req, file, cb) {
    // Check file types
    const ext = path.extname(file.originalname).toLowerCase();
    if (CONFIG.ALLOWED_FILE_TYPES.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type. Please upload ${CONFIG.ALLOWED_FILE_TYPES.join(', ')} files.`));
    }
  }
});

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware to set CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Content-Type');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error in middleware:', err);
  res.status(500).json({
    success: false,
    message: 'An error occurred processing your request',
    error: err.message
  });
});

// Add a debug endpoint
app.get('/debug', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    success: true,
    message: 'Debug endpoint works!',
    headers: req.headers,
    timestamp: new Date().toISOString(),
    config: {
      port: CONFIG.PORT,
      environment: CONFIG.NODE_ENV,
      emailEnabled: CONFIG.ENABLE_EMAILS,
      maxFileSize: CONFIG.MAX_FILE_SIZE,
      uploadDir: CONFIG.UPLOAD_DIR,
      allowedFileTypes: CONFIG.ALLOWED_FILE_TYPES
    }
  });
});

// Pre-flight OPTIONS request handling
app.options('/submit-quote-request', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.sendStatus(204);
});

// Handle form submissions with multer error handling
app.post('/submit-quote-request', (req, res, next) => {
  // Explicitly set content type for the response
  res.setHeader('Content-Type', 'application/json');
  
  upload.array('models', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading files',
        error: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Received form submission request');
    
    const {
      name,
      email,
      phone,
      material,
      quantity,
      color,
      finish,
      timeline,
      notes,
      profiles_summary
    } = req.body;

    // Get uploaded files
    const uploadedFiles = req.files || [];
    console.log(`Received ${uploadedFiles.length} files`);
    
    // Parse profile summary if it exists
    let profilesSummary;
    try {
      profilesSummary = profiles_summary ? JSON.parse(profiles_summary) : null;
    } catch (error) {
      console.error('Error parsing profiles summary:', error);
      profilesSummary = null;
    }

    let adminEmailResult = { id: 'email-disabled' };
    let customerEmailResult = { id: 'email-disabled' };

    // Only try to send emails if enabled
    if (CONFIG.ENABLE_EMAILS) {
      // Create HTML content for the email
      let emailHtml = `
        <h1>New 3D Printing Quote Request</h1>
        <h2>Customer Information</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        
        <h2>Global Print Settings</h2>
        <p><strong>Material:</strong> ${material}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Color:</strong> ${color || 'Not specified'}</p>
        <p><strong>Surface Finish:</strong> ${finish || 'Not specified'}</p>
        <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
        <p><strong>Additional Notes:</strong> ${notes || 'None'}</p>
        
        <h2>Uploaded Files</h2>
        <ul>
          ${uploadedFiles.map(file => `<li>${file.originalname} (${(file.size / (1024 * 1024)).toFixed(2)}MB)</li>`).join('')}
        </ul>
      `;

      // Add profile summary information if available
      if (profilesSummary && profilesSummary.perFile) {
        emailHtml += `
          <h2>File-Specific Print Profiles</h2>
          <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
            <tr>
              <th>File Name</th>
              <th>Material</th>
              <th>Quantity</th>
              <th>Color</th>
              <th>Finish</th>
              <th>Notes</th>
            </tr>
            ${profilesSummary.perFile.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.profile.material}</td>
                <td>${item.profile.quantity}</td>
                <td>${item.profile.color}</td>
                <td>${item.profile.finish}</td>
                <td>${item.profile.notes || 'None'}</td>
              </tr>
            `).join('')}
          </table>
        `;
      }

      // Create file attachments by converting uploaded files to Base64
      const attachments = uploadedFiles.map(file => {
        // Read the file content and convert to Base64
        const fileContent = fs.readFileSync(file.path);
        const base64Content = fileContent.toString('base64');
        
        return {
          filename: file.originalname,
          content: base64Content
        };
      });

      console.log(`Prepared ${attachments.length} file(s) as attachments`);

      try {
        console.log('Sending admin email to:', CONFIG.ADMIN_EMAIL);
        
        // Send email to admin with attachments
        adminEmailResult = await resend.emails.send({
          from: CONFIG.FROM_EMAIL,
          to: CONFIG.ADMIN_EMAIL,
          subject: `New Quote Request from ${name}`,
          html: emailHtml,
          attachments: attachments
        });

        console.log('Admin email sent:', adminEmailResult);
      } catch (emailError) {
        console.error('Error sending admin email:', emailError);
        adminEmailResult = { 
          error: emailError.message || 'Unknown error sending admin email',
          id: 'admin-email-error'
        };
      }

      try {
        // For testing, use Resend's approved test email
        const recipientEmail = email.includes('example.com') ? CONFIG.TEST_EMAIL : email;
        console.log('Sending confirmation email to customer:', recipientEmail);
        
        // Send confirmation email to customer with attachments
        customerEmailResult = await resend.emails.send({
          from: CONFIG.FROM_EMAIL,
          to: recipientEmail,
          subject: 'Your 3D Printing Quote Request - Robonium',
          html: `
            <h1>Thank You for Your Quote Request</h1>
            <p>Dear ${name},</p>
            <p>We have received your 3D printing quote request. Our team will review your files and requirements and get back to you within 24 hours with a detailed quote.</p>
            
            <h2>Request Summary</h2>
            <p><strong>Material:</strong> ${material}</p>
            <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
            <p><strong>Files:</strong> ${uploadedFiles.length} file(s) uploaded</p>
            ${uploadedFiles.length > 0 ? `
            <p><strong>Attached Files:</strong></p>
            <ul>
              ${uploadedFiles.map(file => `<li>${file.originalname} (${(file.size / (1024 * 1024)).toFixed(2)}MB)</li>`).join('')}
            </ul>
            <p>For your reference, we've attached copies of the files you submitted to this email.</p>` : ''}
            
            <p>If you have any questions or need to provide additional information, please reply to this email.</p>
            
            <p>Best regards,</p>
            <p>The Robonium Team</p>
          `,
          attachments: attachments
        });

        console.log('Customer email sent:', customerEmailResult);
      } catch (emailError) {
        console.error('Error sending customer email:', emailError);
        customerEmailResult = { 
          error: emailError.message || 'Unknown error sending customer email',
          id: 'customer-email-error'
        };
      }
    } else {
      console.log('Email sending is disabled. Set ENABLE_EMAILS=true to enable.');
    }

    // Ensure the content type is still set before sending response
    res.setHeader('Content-Type', 'application/json');
    
    // Respond to the client
    res.status(200).json({
      success: true,
      message: 'Your quote request has been submitted successfully!',
      adminEmail: adminEmailResult.id || 'error',
      customerEmail: customerEmailResult.id || 'error',
      emailStatus: CONFIG.ENABLE_EMAILS ? 'enabled' : 'disabled',
      attachments: uploadedFiles.length > 0 ? {
        count: uploadedFiles.length,
        files: uploadedFiles.map(file => file.originalname)
      } : 'none'
    });

  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Ensure the content type is still set before sending error response
    res.setHeader('Content-Type', 'application/json');
    
    // Ensure proper JSON error response
    res.status(500).json({
      success: false,
      message: 'There was an error processing your request. Please try again later.',
      error: error.message
    });
  }
});

// Start the server
app.listen(CONFIG.PORT, () => {
  console.log(`Server running on port ${CONFIG.PORT}`);
  console.log(`Using Resend API with ${process.env.RESEND_API_KEY ? 'environment variable' : 'hardcoded fallback'}`);
});
