#!/bin/bash

echo "Starting BFP Evacuation Simulation Application..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Error: Python is not installed or not in PATH"
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

# Start the frontend server in the background
echo "Starting frontend server..."
npm run dev &

# Start the backend server in the background
echo "Starting backend server..."
cd bfp-simulation-backend && python main.py &

echo
echo "Application started successfully!"
echo
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo
echo "Note: Both servers are running in the background."

# Keep the script running
wait