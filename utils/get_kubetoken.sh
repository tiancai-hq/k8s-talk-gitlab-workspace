#!/bin/bash
SERVICE_NS="NS"
SERVICE_USER="USER"

while getopts 'hn:u:' flag; do
  case "${flag}" in
    n) SERVICE_NS="${OPTARG}" ;;
    u) SERVICE_USER="${OPTARG}" ;;
    h) echo "Usage: ./get_kubetoken.sh -n <namespace> -u <user-name>"
	   exit 1;;
    *) error "Unexpected option ${flag}" ;;
  esac
done

trim() {
    local var="$*"
    var="${var#"${var%%[![:space:]]*}"}"
    var="${var%"${var##*[![:space:]]}"}"   
    echo -n "$var"
}

GLUSER_APP_SECRET_NAME=$(kubectl -n $SERVICE_NS get secret | grep $SERVICE_USER | awk '{print $1}')
GLUSER_APP_SECRET_TOKEN_TXT=$(kubectl -n $SERVICE_NS describe secret $GLUSER_APP_SECRET_NAME | grep 'token:')
GL_CUT_TMP_CMD=$(echo $GLUSER_APP_SECRET_TOKEN_TXT | cut -d':' -f 2)
GLUSER_APP_SECRET_TOKEN=$(trim $GL_CUT_TMP_CMD)
echo $GLUSER_APP_SECRET_TOKEN