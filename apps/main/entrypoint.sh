#!/bin/sh

echo "Starting main application startup process..."

# Function to run database migration
run_migrations() {
    echo "Running database migrations..."
    
    npx typeorm migration:run -d dist/apps/main/apps/main/src/database/data-source.js
    
    echo "Migrations completed successfully!"
}

# Function to start the application
start_app() {
    echo "🌟 Starting the main application..."
    exec node dist/apps/main/apps/main/src/main.js
}

# Main execution
echo "Environment: ${NODE_ENV:-production}"

# Run migration and start app
if run_migrations; then
    start_app
else
    echo "Startup failed due to migration errors"
    exit 1
fi