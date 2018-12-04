#!/bin/bash
NAMESPACE="$1"
USERNAME="$2"
SERVER_URI="$3"
CERT_AUTH="$4"

APP_USER_TOKEN=$(./get_kubetoken.sh -n $NAMESPACE -u $USERNAME)
KUBE_CONFIG_FILE=$(cat <<EOF
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: $CERT_AUTH
    server: $SERVER_URI
  name: gl-app-cluster
contexts:
- context:
    cluster: gl-app-cluster
    user: $USERNAME
  name: gitlab-system
current-context: gitlab-system
kind: Config
preferences: {}
users:
- name: $USERNAME
  user:
    token: $APP_USER_TOKEN
EOF
)
echo "$KUBE_CONFIG_FILE"