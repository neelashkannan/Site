#!/bin/bash

# Start the server with different configurations

# Kill any existing server processes
pkill -f "node send-quote-request.js" || true

# Default settings
PORT=3001
ENABLE_EMAILS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --port=*)
      PORT="${1#*=}"
      shift
      ;;
    --emails)
      ENABLE_EMAILS=true
      shift
      ;;
    --help)
      echo "Usage: ./start-server.sh [options]"
      echo "Options:"
      echo "  --port=NUMBER    Specify port number (default: 3001)"
      echo "  --emails         Enable email sending"
      echo "  --help           Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Display settings
echo "Starting server with:"
echo "- Port: $PORT"
echo "- Email sending: $([ "$ENABLE_EMAILS" = true ] && echo "Enabled" || echo "Disabled")"

# Start the server
PORT=$PORT ENABLE_EMAILS=$ENABLE_EMAILS node send-quote-request.js 