#!/bin/bash

# Fix all hardcoded localhost URLs in the app directory
echo "🔧 Fixing hardcoded localhost URLs..."

# List of files to fix
files=(
  "app/report-found/page.tsx"
  "app/dashboard/page.tsx"
  "app/browse/page.tsx"
  "app/feedback/page.tsx"
  "app/report/page.tsx"
)

# Replace localhost URLs with environment variable
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    sed -i "s|'http://localhost:5000|\`\${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}\`|g" "$file"
    sed -i 's|"http://localhost:5000|`${process.env.NEXT_PUBLIC_BACKEND_URL || '\''http://localhost:5000'\''}`|g' "$file"
  fi
done

echo "✅ All URLs fixed!"