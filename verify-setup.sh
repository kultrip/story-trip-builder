#!/bin/bash

# Script to verify Supabase setup and migrations
# This script helps ensure the database is properly configured

echo "=== Supabase Setup Verification ==="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "   Please create a .env file with your Supabase credentials"
    exit 1
fi

# Check for required environment variables
if ! grep -q "VITE_SUPABASE_URL" .env; then
    echo "❌ Error: VITE_SUPABASE_URL not found in .env"
    exit 1
fi

if ! grep -q "VITE_SUPABASE_PUBLISHABLE_KEY" .env; then
    echo "❌ Error: VITE_SUPABASE_PUBLISHABLE_KEY not found in .env"
    exit 1
fi

echo "✅ Environment variables found"
echo ""

# Check if migrations exist
echo "Checking migrations..."
MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
if [ "$MIGRATION_COUNT" -eq 0 ]; then
    echo "❌ No migrations found"
    exit 1
fi

echo "✅ Found $MIGRATION_COUNT migration files:"
ls -1 supabase/migrations/*.sql | while read file; do
    echo "   - $(basename $file)"
done
echo ""

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI is installed"
    echo ""
    echo "To apply migrations, run:"
    echo "   supabase migration up"
else
    echo "⚠️  Supabase CLI not found"
    echo ""
    echo "To install Supabase CLI:"
    echo "   npm install -g supabase"
    echo ""
    echo "Or apply migrations manually through Supabase Dashboard:"
    echo "   1. Go to your Supabase project"
    echo "   2. Navigate to SQL Editor"
    echo "   3. Copy and paste migration contents"
fi

echo ""
echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Apply database migrations (see above)"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Navigate to http://localhost:8080/results/410 to test"
