#!/bin/sh
LOCAL_BUILD_REV="0001"
REGISTRY_DOMAIN="registry.<YOUR_GITLAB_DOMAIN>"
LOCAL_BUILD_TAG="localbuild_$LOCAL_BUILD_REV"
FRONTEND_IMAGE_NAME="k8stest/frontend-ms"
DIGIT_IMAGE_NAME="k8stest/digit-ms"
MATH_IMAGE_NAME="k8stest/math-ms"
docker login $REGISTRY_DOMAIN

cd frontend-ms
docker build --no-cache -t "$REGISTRY_DOMAIN/$FRONTEND_IMAGE_NAME:$LOCAL_BUILD_TAG" .
docker tag "$REGISTRY_DOMAIN/$FRONTEND_IMAGE_NAME:$LOCAL_BUILD_TAG" "$REGISTRY_DOMAIN/$FRONTEND_IMAGE_NAME:latest"
docker push "$REGISTRY_DOMAIN/$FRONTEND_IMAGE_NAME:$LOCAL_BUILD_TAG"
docker push "$REGISTRY_DOMAIN/$FRONTEND_IMAGE_NAME:latest"


cd ../digit-ms
docker build -t "$REGISTRY_DOMAIN/$DIGIT_IMAGE_NAME:$LOCAL_BUILD_TAG" .
docker tag "$REGISTRY_DOMAIN/$DIGIT_IMAGE_NAME:$LOCAL_BUILD_TAG" "$REGISTRY_DOMAIN/$DIGIT_IMAGE_NAME:latest"
docker push "$REGISTRY_DOMAIN/$DIGIT_IMAGE_NAME:$LOCAL_BUILD_TAG"
docker push "$REGISTRY_DOMAIN/$DIGIT_IMAGE_NAME:latest"

cd ../math-ms
docker build -t "$REGISTRY_DOMAIN/$MATH_IMAGE_NAME:$LOCAL_BUILD_TAG" .
docker tag "$REGISTRY_DOMAIN/$MATH_IMAGE_NAME:$LOCAL_BUILD_TAG" "$REGISTRY_DOMAIN/$MATH_IMAGE_NAME:latest"
docker push "$REGISTRY_DOMAIN/$MATH_IMAGE_NAME:$LOCAL_BUILD_TAG"
docker push "$REGISTRY_DOMAIN/$MATH_IMAGE_NAME:latest"



echo "Pushed: $REGISTRY_DOMAIN/$FRONTEND_IMAGE_NAME:$LOCAL_BUILD_TAG"
echo "Pushed: $REGISTRY_DOMAIN/$DIGIT_IMAGE_NAME:$LOCAL_BUILD_TAG"
echo "Pushed: $REGISTRY_DOMAIN/$MATH_IMAGE_NAME:$LOCAL_BUILD_TAG"

