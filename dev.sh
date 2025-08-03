#!/bin/bash

# Start the Python AI server in the background
echo "Starting AI server..."
python run_ai_server.py &
AI_PID=$!

# Start the Next.js development server
echo "Starting Next.js server..."
npm run dev

# When Next.js server is stopped, kill the AI server
kill $AI_PID 