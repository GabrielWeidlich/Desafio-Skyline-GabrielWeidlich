#!/bin/sh

echo "🔄 Running database migrations..."

# Wait for database to be ready
./wait-for-it.sh db:5432

# Run migrations
echo "📊 Applying migrations..."
npm run db:migrate

if [ $? -eq 0 ]; then
    echo "✅ Migrations applied successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi
