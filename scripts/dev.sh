#!/bin/bash

# =============================================================================
# ALKITU DEVELOPMENT SCRIPT
# =============================================================================
# Simplified development environment setup with Docker

set -e

echo "🚀 Starting Alkitu Development Environment..."
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.template..."
    if [ -f ".env.template" ]; then
        cp .env.template .env
        echo "✅ .env created from template"
    else
        echo "❌ .env.template not found. Please create .env file manually."
        exit 1
    fi
fi

# Stop existing containers
echo "🧹 Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true

# Build and start services
echo "🏗️  Building and starting development services..."
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Show status
echo ""
echo "🎉 Development environment is ready!"
echo "=================================="
echo "📱 Frontend:    http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "📖 Storybook:   http://localhost:6006"
echo "📊 API Docs:    http://localhost:3001/api/docs"
echo "🔍 Health:      http://localhost:3001/health"
echo "🗄️  MongoDB:     mongodb://localhost:27017/alkitu"
echo "⚡ Redis:       redis://localhost:6379"
echo ""

# Show running services
echo "📋 Running Services:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "📝 Useful commands:"
echo "   • View logs:      ./scripts/logs.sh [service]"
echo "   • Stop all:       ./scripts/stop.sh"
echo "   • Restart:        ./scripts/restart.sh [service]"
echo "   • Database shell: ./scripts/db-shell.sh"
echo ""
echo "🔄 Services will auto-reload on code changes!"