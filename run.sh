#!/bin/bash
# NutriSnap — One-click launcher
# Just double-click this file or run: ./run.sh

cd "$(dirname "$0")"

PORT=8080
APP_URL="http://localhost:$PORT"

echo ""
echo "  ╔═══════════════════════════════════════╗"
echo "  ║          🍽  NutriSnap v1.0            ║"
echo "  ║   Food Calorie Estimation from Photos  ║"
echo "  ╚═══════════════════════════════════════╝"
echo ""

# Check Python
if ! command -v python3 &>/dev/null; then
    echo "  [ERROR] python3 not found. Install it: brew install python"
    echo "  Press any key to exit..."
    read -n 1
    exit 1
fi

# Check model exists
if [ ! -f "models/best_model.pth" ]; then
    echo "  [ERROR] Trained model not found at models/best_model.pth"
    echo "  Run 'python3 train.py' first to train the model."
    echo "  Press any key to exit..."
    read -n 1
    exit 1
fi

# Check dependencies
python3 -c "import torch, flask, PIL" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "  [INFO] Installing dependencies..."
    pip3 install -r requirements.txt
    echo ""
fi

# Kill any existing instance on the port
lsof -ti:$PORT 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

# Start Flask server in background
echo "  [1/2] Starting server on port $PORT..."
python3 -c "
from app import app
app.run(host='0.0.0.0', port=$PORT, debug=False)
" &
SERVER_PID=$!

# Wait for server to be ready
echo "  [2/2] Waiting for server..."
for i in {1..15}; do
    if curl -s "$APP_URL" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

if curl -s "$APP_URL" >/dev/null 2>&1; then
    echo ""
    echo "  ✓ Server is running at $APP_URL"
    echo ""
    echo "  Opening browser..."
    open "$APP_URL"
    echo ""
    echo "  ─────────────────────────────────────"
    echo "  Press Ctrl+C to stop the server"
    echo "  ─────────────────────────────────────"
    echo ""
    wait $SERVER_PID
else
    echo "  [ERROR] Server failed to start. Check the logs above."
    kill $SERVER_PID 2>/dev/null
    echo "  Press any key to exit..."
    read -n 1
    exit 1
fi
