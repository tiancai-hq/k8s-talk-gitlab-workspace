#!/bin/bash
SERVICE_NS="$1"
CERT_AUTH="$2"
SERVER_URI="$3"
cat <<EOF | kubectl create -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: $SERVICE_NS
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: tiller-manager
  namespace: $SERVICE_NS
rules:
- apiGroups: ["", "batch", "extensions", "apps"]
  resources: ["*"]
  verbs: ["*"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: tiller-binding
  namespace: $SERVICE_NS
subjects:
- kind: ServiceAccount
  name: tiller
  namespace: $SERVICE_NS
roleRef:
  kind: Role
  name: tiller-manager
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gitlab-app-user
  namespace: $SERVICE_NS
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: gitlab-app-user-role
  namespace: $SERVICE_NS
rules:
- apiGroups: ["", "batch", "extensions", "apps"]
  resources: ["*"]
  verbs: ["*"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: gitlab-app-user-binding
  namespace: $SERVICE_NS
subjects:
- kind: ServiceAccount
  name: gitlab-app-user
  namespace: $SERVICE_NS
roleRef:
  kind: Role
  name: gitlab-app-user-role
  apiGroup: rbac.authorization.k8s.io
---

EOF

helm init --service-account tiller --tiller-namespace $SERVICE_NS
APP_GITLAB_CFG=$(./get_kubecfg.sh $SERVICE_NS gitlab-app-user "$SERVER_URI" "$CERT_AUTH" | base64)
echo "Your KubeConfig is: $APP_GITLAB_CFG"


