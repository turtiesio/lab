#!/bin/bash

set -e

POSTGRES_CONTAINER_NAME="api-postgres"
POSTGRES_PORT="5432"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="password"
POSTGRES_DB="api"

FORCE_RECREATE=false

while [[ "$#" -gt 0 ]]; do
    case "$1" in
    --force)
        FORCE_RECREATE=true
        shift
        ;;
    *)
        echo "Unknown parameter: $1"
        exit 1
        ;;
    esac
done

if $FORCE_RECREATE; then
    if docker container inspect "$POSTGRES_CONTAINER_NAME" >/dev/null 2>&1; then
        echo "Stopping existing container: $POSTGRES_CONTAINER_NAME"
        docker stop -t 1 "$POSTGRES_CONTAINER_NAME"

        # Wait for container to stop
        while docker container inspect "$POSTGRES_CONTAINER_NAME" >/dev/null 2>&1; do
            sleep 1
        done

        echo "Removing existing container: $POSTGRES_CONTAINER_NAME"
        if docker container inspect "$POSTGRES_CONTAINER_NAME" >/dev/null 2>&1; then
            docker rm "$POSTGRES_CONTAINER_NAME"
        fi
    fi
fi

echo "Starting postgres container..."
docker run --name "$POSTGRES_CONTAINER_NAME" \
    -e POSTGRES_USER="$POSTGRES_USER" \
    -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
    -e POSTGRES_DB="$POSTGRES_DB" \
    -p "$POSTGRES_PORT":5432 \
    --rm \
    -d postgres:latest

echo "Postgres container started successfully."
