#!/bin/bash

SERVICE=${1:-""}

if [ -z "$SERVICE" ]; then
    echo "📋 Available services: api, web, mongodb, redis, mongo-setup"
    echo "Usage: ./scripts/logs.sh [service]"
    echo "Or view all logs: ./scripts/logs.sh"
    echo ""
    docker-compose -f docker-compose.dev.yml logs -f
else
    echo "📋 Viewing logs for: $SERVICE"
    docker-compose -f docker-compose.dev.yml logs -f "$SERVICE"
fi