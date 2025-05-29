# Robonium 3D Printing Quote System

A web-based system for handling 3D printing quote requests, allowing users to upload 3D model files and specify print settings.

## Features

- File upload for multiple 3D model formats (STL, OBJ, STEP, STP, 3MF)
- Individual print profiles for each uploaded file
- Preview capabilities for STL and OBJ files
- Email notifications (configurable for admin and customers)
- File attachments included in emails for better reference
- Responsive form design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd robonium-3d-printing
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the sample:
   ```
   cp env.sample .env
   ```

4. Edit the `.env` file to configure your settings:
   - Set `PORT` to your desired port (default: 3001)
   - Set `ENABLE_EMAILS` to `true` or `false`
   - Update `RESEND_API_KEY` with your Resend API key
   - Update `ADMIN_EMAIL` and `FROM_EMAIL` with your email addresses

### Running the Server

#### Using npm scripts:

- Start the server (standard):
  ```
  npm start
  ```

- Start with development settings (no emails):
  ```
  npm run start:dev
  ```

- Start with email sending enabled:
  ```
  npm run start:emails
  ```

- Development mode with auto-restart:
  ```
  npm run dev
  ```

#### Using the shell script:

- Standard start:
  ```
  ./start-server.sh
  ```

- Start with email sending enabled:
  ```
  ./start-server.sh --emails
  ```

- Start on a custom port:
  ```
  ./start-server.sh --port=3002
  ```

## Email Configuration

The system uses Resend for email delivery. To enable email sending:

1. Create an account at [Resend.com](https://resend.com/)
2. Get your API key from the dashboard
3. Add the API key to your `.env` file
4. Set `ENABLE_EMAILS=true` in your `.env` file or use the `--emails` flag

### Email Attachments

When a user submits a quote request with files:
- All uploaded files are automatically attached to both admin and customer emails
- File attachments are converted to Base64 format before sending
- The email includes a list of attached files with their sizes
- Maximum combined attachment size should not exceed 40MB (Resend limit)

### Testing Emails

For testing, Resend requires:
- Use `delivered@resend.dev` as the test recipient
- The system automatically redirects example.com domains to this test email
- For file attachments, they need to be hosted URLs (not implemented in test mode)

## Usage

1. Start the server using one of the methods above
2. Open `form-test.html` in your browser to test the form
3. Upload 3D model files and set your preferences
4. Submit the form to send a quote request

## Project Structure

- `send-quote-request.js`: Main server file
- `upload.js`: Client-side JavaScript for the upload form
- `form-test.html`: Test page for the quote form
- `uploads/`: Directory for storing uploaded files
- `start-server.sh`: Shell script for starting the server with options

## Troubleshooting

- **Port already in use**: Use a different port with `--port=XXXX` or change the PORT in .env
- **Email sending fails**: Check your Resend API key and email configuration
- **File uploads fail**: Make sure the 'uploads' directory exists and is writable

## License

MIT 