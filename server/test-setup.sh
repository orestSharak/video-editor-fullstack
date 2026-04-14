#!/bin/bash

echo "🧪 Testing Mock API Server Setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm is installed: $(npm --version)"

# Check if all required files exist
echo ""
echo "📁 Checking file structure..."

required_files=(
    "package.json"
    "README.md"
    "src/server.js"
    "src/db/db.js"
    "src/db/db.json"
    "src/rest/projects.js"
    "src/graphql/schema.js"
    "src/graphql/resolvers.js"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo ""
    echo "❌ Some required files are missing"
    exit 1
fi

echo ""
echo "✅ All files present"
echo ""
echo "📦 Structure verification complete!"
echo ""
echo "To start the server:"
echo "  1. npm install"
echo "  2. npm start"
