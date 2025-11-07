#!/bin/bash

# GitHub Setup Helper Script
# This script helps you set up your repository on GitHub

set -e

echo "🚀 GitHub Setup Helper for CICD3 Project"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${RED}Error: Not a git repository. Run 'git init' first.${NC}"
    exit 1
fi

# Get GitHub username
echo -e "${YELLOW}Step 1: GitHub Setup${NC}"
read -p "Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo -e "${RED}Error: GitHub username is required.${NC}"
    exit 1
fi

# Get repository name
read -p "Enter repository name [cicd3]: " REPO_NAME
REPO_NAME=${REPO_NAME:-cicd3}

# Confirmation
echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo "  GitHub User: $GITHUB_USER"
echo "  Repository:  $REPO_NAME"
echo "  URL:         https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
read -p "Is this correct? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "Setup cancelled."
    exit 0
fi

# Update README with actual username
echo ""
echo -e "${YELLOW}Step 2: Updating README with your GitHub username...${NC}"
if [ -f README.md ]; then
    sed -i "s/YOUR_USERNAME/$GITHUB_USER/g" README.md
    echo -e "${GREEN}✓ README.md updated${NC}"
fi

# Update GitHub Setup guide
if [ -f GITHUB-SETUP.md ]; then
    sed -i "s/YOUR_USERNAME/$GITHUB_USER/g" GITHUB-SETUP.md
    echo -e "${GREEN}✓ GITHUB-SETUP.md updated${NC}"
fi

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo -e "${YELLOW}Remote 'origin' already exists. Updating...${NC}"
    git remote set-url origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
else
    echo -e "${YELLOW}Step 3: Adding remote repository...${NC}"
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
fi
echo -e "${GREEN}✓ Remote configured${NC}"

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}Step 4: Renaming branch to 'main'...${NC}"
    git branch -M main
    echo -e "${GREEN}✓ Branch renamed to main${NC}"
fi

# Stage all files
echo ""
echo -e "${YELLOW}Step 5: Staging all files...${NC}"
git add .
echo -e "${GREEN}✓ Files staged${NC}"

# Show status
echo ""
echo -e "${YELLOW}Git Status:${NC}"
git status --short | head -20
TOTAL_FILES=$(git status --short | wc -l)
echo "... and $TOTAL_FILES files total"

# Commit
echo ""
read -p "Commit message [Initial commit: Full DevOps suite with CI/CD]: " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Initial commit: Full DevOps suite with CI/CD"}

if git diff --cached --quiet; then
    echo -e "${YELLOW}No changes to commit (already committed)${NC}"
else
    echo -e "${YELLOW}Step 6: Creating commit...${NC}"
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✓ Commit created${NC}"
fi

# Push
echo ""
echo -e "${YELLOW}Step 7: Pushing to GitHub...${NC}"
echo ""
echo -e "${RED}NOTE: You may be asked for your GitHub credentials.${NC}"
echo -e "${RED}If you have 2FA enabled, use a Personal Access Token as password.${NC}"
echo -e "${RED}Get token at: https://github.com/settings/tokens${NC}"
echo ""
read -p "Ready to push? (y/n): " READY

if [ "$READY" = "y" ]; then
    if git push -u origin main; then
        echo ""
        echo -e "${GREEN}✓ Successfully pushed to GitHub!${NC}"
        echo ""
        echo "=========================================="
        echo -e "${GREEN}🎉 SUCCESS! Your repository is on GitHub!${NC}"
        echo "=========================================="
        echo ""
        echo "📍 Repository URL:"
        echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
        echo ""
        echo "📍 Actions Dashboard:"
        echo "   https://github.com/$GITHUB_USER/$REPO_NAME/actions"
        echo ""
        echo "📍 Next Steps:"
        echo "   1. Visit your repository on GitHub"
        echo "   2. Go to Actions tab - workflows should be visible"
        echo "   3. First CI pipeline will run automatically"
        echo "   4. Set up secrets for deployment workflows:"
        echo "      Settings → Secrets and variables → Actions"
        echo ""
        echo "📖 See GITHUB-SETUP.md for detailed instructions"
        echo ""
    else
        echo ""
        echo -e "${RED}✗ Push failed. Common issues:${NC}"
        echo "  1. Repository doesn't exist - create it on GitHub first"
        echo "  2. Wrong credentials - use Personal Access Token"
        echo "  3. No internet connection"
        echo ""
        echo "To retry: git push -u origin main"
    fi
else
    echo ""
    echo "Push cancelled. To push later, run:"
    echo "  git push -u origin main"
fi

echo ""
echo "=========================================="
echo "📋 Summary of GitHub Actions Workflows:"
echo "=========================================="
echo ""
echo "✅ ci.yml              - Build, test, validate (automatic on push)"
echo "🐳 docker-build.yml    - Build and push Docker images (automatic on main)"
echo "☸️  deploy-k8s.yml      - Deploy to Kubernetes (manual)"
echo "📜 deploy-ansible.yml  - Run Ansible playbooks (manual)"
echo "🔒 security.yml        - Security scanning (automatic + weekly)"
echo ""
echo "All workflows are ready to use!"
echo ""
