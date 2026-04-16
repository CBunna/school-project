#!/bin/bash

# Beskydy Tourism Website - Stop Script
# This script stops all running services

echo "🛑 Stopping Beskydy Tourism Website..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Stop Backend
echo -e "${YELLOW}Stopping Backend...${NC}"
if [ -f "logs/backend.pid" ]; then
    kill $(cat logs/backend.pid) 2> /dev/null
    rm logs/backend.pid
fi
lsof -ti:3001 | xargs kill -9 2> /dev/null
echo -e "${GREEN}✓ Backend stopped${NC}"

# Stop Frontend
echo -e "${YELLOW}Stopping Frontend...${NC}"
if [ -f "logs/frontend.pid" ]; then
    kill $(cat logs/frontend.pid) 2> /dev/null
    rm logs/frontend.pid
fi
lsof -ti:8080 | xargs kill -9 2> /dev/null
echo -e "${GREEN}✓ Frontend stopped${NC}"

# Stop Database (optional)
echo ""
read -p "Do you want to stop the database too? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker stop beskydy_postgres &> /dev/null
    echo -e "${GREEN}✓ Database stopped${NC}"
else
    echo -e "${YELLOW}Database left running${NC}"
fi

echo ""
echo -e "${GREEN}✅ All services stopped!${NC}"
echo ""
