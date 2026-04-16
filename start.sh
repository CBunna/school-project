#!/bin/bash

# Beskydy Tourism Website - Startup Script
# This script starts all services automatically

echo "🏔️  Starting Beskydy Tourism Website..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check Docker
echo -e "${YELLOW}[1/4] Checking Docker...${NC}"
if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Step 2: Start Database
echo -e "${YELLOW}[2/4] Starting PostgreSQL Database...${NC}"
if docker ps -a | grep -q beskydy_postgres; then
    docker start beskydy_postgres &> /dev/null
    echo -e "${GREEN}✓ Database started (beskydy_postgres)${NC}"
else
    echo -e "${YELLOW}Creating new database container...${NC}"
    docker run --name beskydy_postgres \
      -e POSTGRES_USER=beskydy_user \
      -e POSTGRES_PASSWORD=beskydy_password \
      -e POSTGRES_DB=beskydy_db \
      -p 5433:5432 \
      -d postgres:15-alpine &> /dev/null

    echo -e "${GREEN}✓ Database container created${NC}"
    echo -e "${YELLOW}Waiting for database to initialize...${NC}"
    sleep 5

    # Initialize database schema
    if [ -f "backend/database/schema.sql" ]; then
        PGPASSWORD=beskydy_password psql -h localhost -p 5433 -U beskydy_user -d beskydy_db -f backend/database/schema.sql &> /dev/null
        echo -e "${GREEN}✓ Database schema initialized${NC}"
    fi
fi
echo ""

# Step 3: Start Backend
echo -e "${YELLOW}[3/4] Starting Backend Server...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install &> /dev/null
fi

# Kill existing backend processes on port 3001
lsof -ti:3001 | xargs kill -9 2> /dev/null

# Start backend in background
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
cd ..

echo -e "${GREEN}✓ Backend started on http://localhost:3001${NC}"
echo ""

# Step 4: Start Frontend
echo -e "${YELLOW}[4/4] Starting Frontend Server...${NC}"

# Kill existing frontend processes on port 8080
lsof -ti:8080 | xargs kill -9 2> /dev/null

# Start frontend in background
npx http-server -p 8080 > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > logs/frontend.pid

echo -e "${GREEN}✓ Frontend started on http://localhost:8080${NC}"
echo ""

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 3

# Check backend health
if curl -s http://localhost:3001/api/health | grep -q "OK"; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}⚠ Backend might not be ready yet. Check logs/backend.log${NC}"
fi
echo ""

# Success message
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✅ All Services Started Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "📍 Access the application:"
echo -e "   ${YELLOW}Frontend:${NC} http://localhost:8080"
echo -e "   ${YELLOW}Backend:${NC}  http://localhost:3001"
echo ""
echo -e "👤 Test Accounts:"
echo -e "   ${YELLOW}Admin:${NC} admin@beskydy.cz / adminpass123"
echo -e "   ${YELLOW}User:${NC}  user@beskydy.cz / userpass123"
echo ""
echo -e "📝 Logs:"
echo -e "   ${YELLOW}Backend:${NC}  tail -f logs/backend.log"
echo -e "   ${YELLOW}Frontend:${NC} tail -f logs/frontend.log"
echo ""
echo -e "🛑 To stop all services, run: ${YELLOW}./stop.sh${NC}"
echo ""
