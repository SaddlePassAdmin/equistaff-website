#!/bin/bash
# Double-click this file to open the EquiStaff site.
cd "$(dirname "$0")"
PORT=4321
lsof -ti:$PORT 2>/dev/null | xargs kill -9 2>/dev/null
echo "EquiStaff running at http://127.0.0.1:$PORT"
echo "Close this window to stop it."
sleep 1 && open "http://127.0.0.1:$PORT" &
python3 -m http.server $PORT --bind 127.0.0.1
