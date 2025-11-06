#!/bin/bash

# Quick Start Script for Auto-Sweep Loyalty System
# This script helps you get started quickly with the loyalty system

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Auto-Sweep Loyalty System - Quick Start Script       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. You have $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    if pgrep mongod > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "   Start it with: mongod"
    fi
else
    echo "⚠️  MongoDB not found on this system"
    echo "   Install from: https://www.mongodb.com/try/download/community"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your configuration:"
    echo "   - MongoDB URI"
    echo "   - JWT Secret"
    echo "   - Payment processor API keys"
    echo "   - Facebook credentials"
    echo "   - Alexa credentials"
    echo ""
    read -p "Press Enter to continue after editing .env..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please check your configuration."
    exit 1
fi

echo ""
echo "✅ All tests passed!"

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              Setup Complete!                           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 You can now start the server:"
echo ""
echo "   Development mode:"
echo "   $ npm run dev"
echo ""
echo "   Production mode:"
echo "   $ npm start"
echo ""
echo "📚 Next steps:"
echo "   1. Start MongoDB: mongod"
echo "   2. Start the server: npm run dev"
echo "   3. Visit http://localhost:3000"
echo "   4. Open customer-portal.html in your browser"
echo "   5. Open admin-dashboard.html for admin access"
echo ""
echo "📖 Documentation:"
echo "   - API Docs: DOCUMENTATION.md"
echo "   - Deployment: DEPLOYMENT.md"
echo "   - Architecture: ARCHITECTURE.md"
echo ""
echo "🎉 Happy coding!"
