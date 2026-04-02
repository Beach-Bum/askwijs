#!/bin/bash

# askwijs — GitHub Push Script
# Run this from your terminal: bash push.sh

set -e

REPO_URL="https://github.com/Beach-Bum/askwijs.git"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "🚀 askwijs — pushing to GitHub"
echo "──────────────────────────────"

# Check if we're already in a git repo
if [ -d "$SCRIPT_DIR/.git" ]; then
  echo "✓ Git repo found"
else
  echo "Initializing git repo..."
  git init
  git branch -m main
fi

# Set remote
if git remote get-url origin &>/dev/null; then
  echo "✓ Remote origin already set"
else
  echo "Adding remote origin..."
  git remote add origin "$REPO_URL"
fi

# Stage and commit everything
git add -A

if git diff --cached --quiet; then
  echo "✓ Nothing new to commit"
else
  git commit -m "🌍 brand strategy, design system, UX research, landing page"
  echo "✓ Committed"
fi

# Push
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! View your repo at:"
echo "   https://github.com/Beach-Bum/askwijs"
echo ""
