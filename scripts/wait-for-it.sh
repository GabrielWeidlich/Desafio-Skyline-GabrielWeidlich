#!/bin/sh

# Simple wait-for-it script for Alpine Linux
# Usage: wait-for-it.sh host:port [-- command]

HOST_PORT=$1
shift

# Parse host and port
HOST=$(echo $HOST_PORT | cut -d: -f1)
PORT=$(echo $HOST_PORT | cut -d: -f2)

echo "Waiting for $HOST:$PORT..."

# Wait for the service to be ready
TIMEOUT=60
COUNT=0

while [ $COUNT -lt $TIMEOUT ]; do
    if nc -z $HOST $PORT 2>/dev/null; then
        echo "$HOST:$PORT is ready!"
        if [ $# -gt 0 ]; then
            exec "$@"
        fi
        exit 0
    fi
    sleep 1
    COUNT=$((COUNT + 1))
done

echo "Timeout reached waiting for $HOST:$PORT"
exit 1
