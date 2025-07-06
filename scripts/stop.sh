#!/bin/bash

echo "🛑 Stopping Alkitu Development Environment..."
docker-compose -f docker-compose.dev.yml down

echo "✅ All services stopped"