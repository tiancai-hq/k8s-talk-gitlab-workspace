#!/bin/bash

ALIYUN_OSS_ID="$1"
ALIYUN_OSS_ACCESS_KEY="$2"
ALIYUN_OSS_BASE_URL="oss-$3.aliyuncs.com"
ALIYUN_OSS_BUCKET_NAME="$4"
HELM_CHART_NEW_VERSION="$5"
HELM_CHART_DIR="$6"
HELM_RELEASE_NAME="$7"
HELM_DOMAIN_GROUP="$8"
REGION_ID="$3"





HELM_REPO_URL="https://${ALIYUN_OSS_BUCKET_NAME}.${ALIYUN_OSS_BASE_URL}/${HELM_CHART_DIR}"





cd $HELM_RELEASE_NAME
rm -rf ./build
mkdir build

helm repo add $HELM_DOMAIN_GROUP $HELM_REPO_URL
helm package . -d ./build --version $HELM_CHART_NEW_VERSION
HELM_TAR_GZ=$(ls ./build | grep "${HELM_CHART_NEW_VERSION}.tgz")
if [ "$9" == "init" ]; then
  helm repo index --url $HELM_REPO_URL ./build
else
  curl -o ./old_repo.yaml "${HELM_REPO_URL}/index.yaml"
  helm repo index --merge old_repo.yaml --url $HELM_REPO_URL ./build
  rm old_repo.yaml
fi
#wget -O old_repo.yaml ${HELM_REPO_URL}/index.yaml 
cd build
aliyun oss cp "${HELM_TAR_GZ}" "oss://${ALIYUN_OSS_BUCKET_NAME}/${HELM_CHART_DIR}/${HELM_TAR_GZ}" --region "$REGION_ID" --force -p demousr
aliyun oss cp "index.yaml" "oss://${ALIYUN_OSS_BUCKET_NAME}/${HELM_CHART_DIR}/index.yaml" --region "$REGION_ID" --force -p demousr
cd ..
rm -rf ./build

echo "DONE"