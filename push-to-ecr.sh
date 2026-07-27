#!/bin/bash
# Enable exit on error
set -e

REGISTRY="899928294562.dkr.ecr.ap-south-1.amazonaws.com"
REPOSITORY="zario_website"
REGION="ap-south-1"
VITE_API_URL=${VITE_API_URL:-"https://api.yourdomain.com/api/v1"}

echo "============================================="
echo "1. Checking ECR Repository '$REPOSITORY'..."
echo "============================================="
if aws ecr describe-repositories --repository-names "$REPOSITORY" --region "$REGION" >/dev/null 2>&1; then
  echo "✔ Repository '$REPOSITORY' already exists."
else
  echo "→ Creating repository '$REPOSITORY'..."
  aws ecr create-repository --repository-name "$REPOSITORY" --region "$REGION"
fi

echo "============================================="
echo "2. Authenticating Docker to Amazon ECR..."
echo "============================================="
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REGISTRY"

echo "============================================="
echo "3. Building & Pushing Backend as '$REPOSITORY:backend'..."
echo "============================================="
docker build -t zari-co-backend ./backend
docker tag zari-co-backend:latest "$REGISTRY/$REPOSITORY:backend"
docker push "$REGISTRY/$REPOSITORY:backend"

echo "============================================="
echo "4. Building & Pushing Frontend as '$REPOSITORY:frontend'..."
echo "============================================="
echo "→ Building Frontend with VITE_API_URL=$VITE_API_URL"
docker build --build-arg VITE_API_URL="$VITE_API_URL" -t zari-co-frontend ./frontend
docker tag zari-co-frontend:latest "$REGISTRY/$REPOSITORY:frontend"
docker push "$REGISTRY/$REPOSITORY:frontend"

echo "============================================="
echo "5. Building & Pushing Admin as '$REPOSITORY:admin'..."
echo "============================================="
echo "→ Building Admin with VITE_API_URL=$VITE_API_URL"
docker build --build-arg VITE_API_URL="$VITE_API_URL" -t zari-co-admin ./admin
docker tag zari-co-admin:latest "$REGISTRY/$REPOSITORY:admin"
docker push "$REGISTRY/$REPOSITORY:admin"

echo "============================================="
echo "✔ Done! All images successfully pushed to ECR under repository '$REPOSITORY'."
echo "============================================="
